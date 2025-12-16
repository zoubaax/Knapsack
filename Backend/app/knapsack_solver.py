"""
Unified Knapsack Solver

This module provides a unified interface for solving knapsack problems
with input validation, error handling, and standardized response format.
"""

from app.knapsack_algorithms import (
    solve_01_knapsack_dp,
    solve_greedy_knapsack,
    solve_fractional_knapsack
)


# Algorithm type constants
ALGORITHM_DP_01 = 'dp_01'
ALGORITHM_GREEDY = 'greedy'
ALGORITHM_FRACTIONAL = 'fractional'

# Limits for safe execution
MAX_ITEMS = 1000
MAX_CAPACITY = 1000000
MAX_ITEM_WEIGHT = 1000000
MAX_ITEM_VALUE = 1000000


def validate_input(items, capacity, algorithm_type):
    """
    Validate knapsack problem input
    
    Args:
        items: List of item dicts
        capacity: Maximum capacity
        algorithm_type: Type of algorithm to use
    
    Returns:
        tuple: (is_valid, error_message)
    """
    # Check items
    if not items:
        return False, 'Items list cannot be empty'
    
    if len(items) > MAX_ITEMS:
        return False, f'Too many items. Maximum allowed: {MAX_ITEMS}'
    
    # Check capacity
    if capacity <= 0:
        return False, 'Capacity must be greater than 0'
    
    if capacity > MAX_CAPACITY:
        return False, f'Capacity too large. Maximum allowed: {MAX_CAPACITY}'
    
    # Validate each item
    item_ids = set()
    for i, item in enumerate(items):
        # Check required fields
        if 'id' not in item:
            return False, f'Item at index {i} missing required field: id'
        if 'weight' not in item:
            return False, f'Item at index {i} missing required field: weight'
        if 'value' not in item:
            return False, f'Item at index {i} missing required field: value'
        
        # Check data types
        try:
            weight = float(item['weight'])
            value = float(item['value'])
        except (ValueError, TypeError):
            return False, f'Item {item.get("id", i)} has invalid weight or value (must be numeric)'
        
        # Check values
        if weight <= 0:
            return False, f'Item {item["id"]} has invalid weight (must be > 0)'
        if weight > MAX_ITEM_WEIGHT:
            return False, f'Item {item["id"]} weight too large (max: {MAX_ITEM_WEIGHT})'
        
        if value < 0:
            return False, f'Item {item["id"]} has invalid value (must be >= 0)'
        if value > MAX_ITEM_VALUE:
            return False, f'Item {item["id"]} value too large (max: {MAX_ITEM_VALUE})'
        
        # Check for duplicate IDs
        item_id = item['id']
        if item_id in item_ids:
            return False, f'Duplicate item ID: {item_id}'
        item_ids.add(item_id)
    
    # Check algorithm type
    valid_algorithms = [ALGORITHM_DP_01, ALGORITHM_GREEDY, ALGORITHM_FRACTIONAL]
    if algorithm_type not in valid_algorithms:
        return False, f'Invalid algorithm type. Must be one of: {", ".join(valid_algorithms)}'
    
    # Check algorithm-capacity compatibility
    if algorithm_type == ALGORITHM_DP_01:
        # DP algorithm can be slow for very large capacities
        if capacity > 10000:
            return False, f'DP algorithm not recommended for capacity > 10000. Use greedy or fractional instead.'
    
    return True, None


def solve_knapsack(items, capacity, algorithm_type):
    """
    Unified knapsack solver function
    
    Validates input, selects appropriate algorithm, and returns standardized response.
    
    Args:
        items: List of dicts with 'id', 'weight', 'value'
        capacity: Maximum weight capacity
        algorithm_type: 'dp_01', 'greedy', or 'fractional'
    
    Returns:
        dict with:
            - success: bool
            - selected_items: list
            - total_weight: float
            - total_value: float
            - steps: list
            - error: str (if failed)
            - algorithm_used: str
            - complexity_info: dict
    """
    # Validate input
    is_valid, error_msg = validate_input(items, capacity, algorithm_type)
    if not is_valid:
        return {
            'success': False,
            'error': error_msg,
            'selected_items': [],
            'total_weight': 0,
            'total_value': 0,
            'steps': []
        }
    
    # Select and execute algorithm
    try:
        if algorithm_type == ALGORITHM_DP_01:
            result = solve_01_knapsack_dp(items, capacity)
            complexity_info = {
                'time_complexity': 'O(n * capacity)',
                'space_complexity': 'O(n * capacity)',
                'optimal': True,
                'note': 'Optimal solution for 0/1 knapsack'
            }
        elif algorithm_type == ALGORITHM_GREEDY:
            result = solve_greedy_knapsack(items, capacity)
            complexity_info = {
                'time_complexity': 'O(n log n)',
                'space_complexity': 'O(n)',
                'optimal': False,
                'note': 'Heuristic solution - may not be optimal for 0/1 knapsack'
            }
        elif algorithm_type == ALGORITHM_FRACTIONAL:
            result = solve_fractional_knapsack(items, capacity)
            complexity_info = {
                'time_complexity': 'O(n log n)',
                'space_complexity': 'O(n)',
                'optimal': True,
                'note': 'Optimal solution for fractional knapsack'
            }
        else:
            return {
                'success': False,
                'error': f'Unknown algorithm type: {algorithm_type}',
                'selected_items': [],
                'total_weight': 0,
                'total_value': 0,
                'steps': []
            }
        
        return {
            'success': True,
            'selected_items': result['selected_items'],
            'total_weight': result['total_weight'],
            'total_value': result['total_value'],
            'steps': result['steps'],
            'algorithm_used': algorithm_type,
            'complexity_info': complexity_info,
            'error': None
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': f'Error solving knapsack: {str(e)}',
            'selected_items': [],
            'total_weight': 0,
            'total_value': 0,
            'steps': []
        }

