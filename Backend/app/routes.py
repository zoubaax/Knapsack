from flask import Blueprint, jsonify, request

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Flask backend is running!'
    }), 200


@bp.route('/data', methods=['GET'])
def get_data():
    """Example GET endpoint returning sample data"""
    sample_data = {
        'items': [
            {'id': 1, 'name': 'Item 1', 'value': 100},
            {'id': 2, 'name': 'Item 2', 'value': 200},
            {'id': 3, 'name': 'Item 3', 'value': 300}
        ],
        'total': 3
    }
    return jsonify(sample_data), 200


@bp.route('/cors-test', methods=['GET', 'OPTIONS', 'POST'])
def cors_test():
    """Test endpoint to verify CORS is working"""
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight successful'}), 200
    return jsonify({
        'message': 'CORS is working!',
        'method': request.method,
        'origin': request.headers.get('Origin', 'Not provided')
    }), 200

