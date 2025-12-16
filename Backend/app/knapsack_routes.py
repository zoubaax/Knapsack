"""
Knapsack API Routes

JWT-protected endpoints for solving and managing knapsack problems.
"""

from flask import Blueprint, request, jsonify
from app import db
from app.models import KnapsackProblem
from app.jwt_utils import token_required
from app.knapsack_solver import solve_knapsack
from datetime import datetime

knapsack_bp = Blueprint('knapsack', __name__, url_prefix='/api/knapsack')


# Explicit OPTIONS handlers for CORS preflight - MUST be before @token_required routes
@knapsack_bp.route('/solve', methods=['OPTIONS'])
@knapsack_bp.route('/save', methods=['OPTIONS'])
@knapsack_bp.route('/history', methods=['OPTIONS'])
@knapsack_bp.route('/history/<int:problem_id>', methods=['OPTIONS'])
def handle_cors_preflight():
    """Handle CORS preflight OPTIONS requests - no authentication required"""
    from flask import Response
    response = Response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Max-Age'] = '3600'
    return response, 200


@knapsack_bp.route('/solve', methods=['POST'])
@token_required
def solve_knapsack_problem(current_user, user_id):
    """
    Solve a knapsack problem without saving
    
    Request Body:
    {
        "items": [
            {"id": 1, "weight": 10, "value": 60},
            {"id": 2, "weight": 20, "value": 100},
            ...
        ],
        "capacity": 50,
        "algorithm_type": "dp_01" | "greedy" | "fractional"
    }
    
    Returns:
    {
        "success": true,
        "selected_items": [...],
        "total_weight": 30,
        "total_value": 160,
        "steps": [...],
        "algorithm_used": "dp_01",
        "complexity_info": {...}
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        items = data.get('items', [])
        capacity = data.get('capacity')
        algorithm_type = data.get('algorithm_type', 'dp_01')
        
        # Validate required fields
        if not items:
            return jsonify({'error': 'Items list is required'}), 400
        
        if capacity is None:
            return jsonify({'error': 'Capacity is required'}), 400
        
        # Convert capacity to float/int
        try:
            capacity = float(capacity)
            if capacity <= 0:
                return jsonify({'error': 'Capacity must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Capacity must be a valid number'}), 400
        
        # Solve the problem
        result = solve_knapsack(items, capacity, algorithm_type)
        
        if not result['success']:
            return jsonify({
                'error': result['error'],
                'success': False
            }), 400
        
        return jsonify(result), 200
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error solving knapsack: {error_trace}")  # Log for debugging
        return jsonify({
            'error': f'Failed to solve knapsack problem: {str(e)}',
            'success': False,
            'details': str(e) if str(e) else 'Unknown error occurred'
        }), 500


@knapsack_bp.route('/save', methods=['POST'])
@token_required
def save_knapsack_problem(current_user, user_id):
    """
    Solve and save a knapsack problem
    
    Request Body: Same as /solve endpoint
    
    Returns:
    {
        "success": true,
        "problem_id": 123,
        "selected_items": [...],
        "total_weight": 30,
        "total_value": 160,
        "steps": [...],
        "message": "Problem solved and saved successfully"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        items = data.get('items', [])
        capacity = data.get('capacity')
        algorithm_type = data.get('algorithm_type', 'dp_01')
        
        # Validate required fields
        if not items:
            return jsonify({'error': 'Items list is required'}), 400
        
        if capacity is None:
            return jsonify({'error': 'Capacity is required'}), 400
        
        # Convert capacity to float/int
        try:
            capacity = float(capacity)
            if capacity <= 0:
                return jsonify({'error': 'Capacity must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Capacity must be a valid number'}), 400
        
        # Solve the problem
        result = solve_knapsack(items, capacity, algorithm_type)
        
        if not result['success']:
            return jsonify({
                'error': result['error'],
                'success': False
            }), 400
        
        # Create and save problem record
        problem = KnapsackProblem(
            user_id=user_id,
            capacity=capacity,
            algorithm_type=algorithm_type
        )
        problem.set_items(items)
        
        # Save solution
        solution_data = {
            'selected_items': result['selected_items'],
            'total_weight': result['total_weight'],
            'total_value': result['total_value'],
            'steps': result['steps'],
            'algorithm_used': result['algorithm_used'],
            'complexity_info': result['complexity_info'],
            'solved_at': datetime.utcnow().isoformat()
        }
        problem.set_solution(solution_data)
        
        db.session.add(problem)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'problem_id': problem.id,
            'selected_items': result['selected_items'],
            'total_weight': result['total_weight'],
            'total_value': result['total_value'],
            'steps': result['steps'],
            'algorithm_used': result['algorithm_used'],
            'complexity_info': result['complexity_info'],
            'message': 'Problem solved and saved successfully'
        }), 201
    
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error saving knapsack: {error_trace}")  # Log for debugging
        return jsonify({
            'error': f'Failed to save knapsack problem: {str(e)}',
            'success': False,
            'details': str(e) if str(e) else 'Unknown error occurred'
        }), 500


@knapsack_bp.route('/history', methods=['GET'])
@token_required
def get_knapsack_history(current_user, user_id):
    """
    Get user's knapsack problem history
    
    Query Parameters:
    - limit: Maximum number of results (default: 50, max: 100)
    - offset: Pagination offset (default: 0)
    
    Returns:
    {
        "success": true,
        "problems": [
            {
                "id": 123,
                "items": [...],
                "capacity": 50,
                "algorithm_type": "dp_01",
                "solution": {...},
                "created_at": "2024-01-01T00:00:00"
            },
            ...
        ],
        "total": 10,
        "limit": 50,
        "offset": 0
    }
    """
    try:
        # Get query parameters
        limit = min(int(request.args.get('limit', 50)), 100)  # Max 100
        offset = max(int(request.args.get('offset', 0)), 0)
        
        # Query user's problems
        query = KnapsackProblem.query.filter_by(user_id=user_id)
        total = query.count()
        
        problems = query.order_by(KnapsackProblem.created_at.desc()).limit(limit).offset(offset).all()
        
        return jsonify({
            'success': True,
            'problems': [problem.to_dict() for problem in problems],
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to fetch history: {str(e)}',
            'success': False
        }), 500


@knapsack_bp.route('/history/<int:problem_id>', methods=['GET'])
@token_required
def get_knapsack_problem(current_user, user_id, problem_id):
    """
    Get a specific knapsack problem by ID
    
    Returns:
    {
        "success": true,
        "problem": {...}
    }
    """
    try:
        problem = KnapsackProblem.query.filter_by(id=problem_id, user_id=user_id).first()
        
        if not problem:
            return jsonify({
                'error': 'Problem not found',
                'success': False
            }), 404
        
        return jsonify({
            'success': True,
            'problem': problem.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to fetch problem: {str(e)}',
            'success': False
        }), 500

