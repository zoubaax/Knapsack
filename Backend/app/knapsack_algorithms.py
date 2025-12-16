"""
Knapsack Problem Algorithms Implementation

This module contains three knapsack solving algorithms:
1. 0/1 Knapsack (Dynamic Programming) - Optimal solution
2. Greedy Knapsack - Heuristic solution
3. Fractional Knapsack - Optimal for fractional items

Each algorithm returns:
- selected_items: List of items included in solution
- total_weight: Total weight of selected items
- total_value: Total value of selected items
- steps: Step-by-step execution data for visualization
"""


def solve_01_knapsack_dp(items, capacity):
    """
    Solve 0/1 Knapsack using Dynamic Programming
    
    Time Complexity: O(n * capacity)
    Space Complexity: O(n * capacity)
    
    Args:
        items: List of dicts with 'id', 'weight', 'value'
        capacity: Maximum weight capacity
    
    Returns:
        dict with selected_items, total_weight, total_value, steps
    """
    if not items or capacity <= 0:
        return {
            'selected_items': [],
            'total_weight': 0,
            'total_value': 0,
            'steps': []
        }
    
    n = len(items)
    steps = []
    
    # Convert capacity to int for array indexing
    capacity_int = int(capacity)
    if capacity_int <= 0:
        return {
            'selected_items': [],
            'total_weight': 0,
            'total_value': 0,
            'steps': []
        }
    
    # Initialize DP table: dp[i][w] = max value with first i items and weight w
    # Use 1D array for space optimization
    dp = [0] * (capacity_int + 1)
    
    # Track which items were selected (use 2D array for backtracking)
    item_selection = [[False] * (capacity_int + 1) for _ in range(n + 1)]
    
    step_index = 0
    
    # Add initial state
    steps.append({
        'step_index': step_index,
        'description': f'Initializing DP table with {n} items and capacity {capacity}',
        'current_decision': None,
        'selected_items': [],
        'total_weight': 0,
        'total_value': 0,
        'dp_state': 'Initial state'
    })
    step_index += 1
    
    # Fill DP table
    for i in range(1, n + 1):
        item = items[i - 1]
        weight = int(item['weight'])
        value = float(item['value'])
        
        # Process each possible weight
        for w in range(capacity_int, weight - 1, -1):
            # Option 1: Don't take item i
            option1 = dp[w]
            
            # Option 2: Take item i
            option2 = dp[w - weight] + value if w >= weight else 0
            
            # Choose better option
            if option2 > option1:
                dp[w] = option2
                item_selection[i][w] = True
                
                steps.append({
                    'step_index': step_index,
                    'description': f'Considering item {item["id"]} (weight={weight}, value={value}) at capacity {w}',
                    'current_decision': f'Include item {item["id"]} (value gain: {value})',
                    'selected_items': [],
                    'total_weight': w,
                    'total_value': dp[w],
                    'dp_state': f'DP[{i}][{w}] = {dp[w]}'
                })
            else:
                steps.append({
                    'step_index': step_index,
                    'description': f'Considering item {item["id"]} (weight={weight}, value={value}) at capacity {w}',
                    'current_decision': f'Skip item {item["id"]} (better without it)',
                    'selected_items': [],
                    'total_weight': w,
                    'total_value': dp[w],
                    'dp_state': f'DP[{i}][{w}] = {dp[w]}'
                })
            
            step_index += 1
    
    # Backtrack to find selected items
    selected_items = []
    w = capacity_int
    
    for i in range(n, 0, -1):
        if item_selection[i][w]:
            item = items[i - 1]
            selected_items.append({
                'id': item['id'],
                'weight': item['weight'],
                'value': item['value']
            })
            w -= int(item['weight'])
    
    selected_items.reverse()
    
    total_weight = sum(float(item['weight']) for item in selected_items)
    total_value = float(dp[capacity_int])
    
    # Add final solution step
    steps.append({
        'step_index': step_index,
        'description': 'Backtracking complete - Final solution found',
        'current_decision': f'Selected {len(selected_items)} items',
        'selected_items': selected_items,
        'total_weight': float(total_weight),
        'total_value': float(total_value),
        'dp_state': 'Solution complete'
    })
    
    return {
        'selected_items': selected_items,
        'total_weight': float(total_weight),
        'total_value': float(total_value),
        'steps': steps
    }


def solve_greedy_knapsack(items, capacity):
    """
    Solve Knapsack using Greedy approach (value-to-weight ratio)
    
    Time Complexity: O(n log n) - due to sorting
    Space Complexity: O(n)
    
    Note: This is a heuristic and may not give optimal solution for 0/1 knapsack
    
    Args:
        items: List of dicts with 'id', 'weight', 'value'
        capacity: Maximum weight capacity
    
    Returns:
        dict with selected_items, total_weight, total_value, steps
    """
    if not items or capacity <= 0:
        return {
            'selected_items': [],
            'total_weight': 0,
            'total_value': 0,
            'steps': []
        }
    
    steps = []
    step_index = 0
    
    # Calculate value-to-weight ratio for each item
    items_with_ratio = []
    for item in items:
        ratio = item['value'] / item['weight'] if item['weight'] > 0 else 0
        items_with_ratio.append({
            **item,
            'ratio': ratio
        })
    
    steps.append({
        'step_index': step_index,
        'description': 'Calculating value-to-weight ratios for all items',
        'current_decision': None,
        'selected_items': [],
        'total_weight': 0,
        'total_value': 0,
        'ratios': {item['id']: item['ratio'] for item in items_with_ratio}
    })
    step_index += 1
    
    # Sort by ratio (descending)
    sorted_items = sorted(items_with_ratio, key=lambda x: x['ratio'], reverse=True)
    
    steps.append({
        'step_index': step_index,
        'description': 'Sorting items by value-to-weight ratio (descending)',
        'current_decision': None,
        'selected_items': [],
        'total_weight': 0,
        'total_value': 0,
        'sorted_order': [item['id'] for item in sorted_items]
    })
    step_index += 1
    
    # Greedily select items
    selected_items = []
    current_weight = 0
    current_value = 0
    
    for item in sorted_items:
        weight = item['weight']
        
        if current_weight + weight <= capacity:
            selected_items.append({
                'id': item['id'],
                'weight': item['weight'],
                'value': item['value']
            })
            current_weight += weight
            current_value += item['value']
            
            steps.append({
                'step_index': step_index,
                'description': f'Item {item["id"]} fits (ratio={item["ratio"]:.2f}, weight={weight}, value={item["value"]})',
                'current_decision': f'Include item {item["id"]}',
                'selected_items': selected_items.copy(),
                'total_weight': current_weight,
                'total_value': current_value,
                'remaining_capacity': capacity - current_weight
            })
        else:
            steps.append({
                'step_index': step_index,
                'description': f'Item {item["id"]} does not fit (would exceed capacity)',
                'current_decision': f'Skip item {item["id"]}',
                'selected_items': selected_items.copy(),
                'total_weight': current_weight,
                'total_value': current_value,
                'remaining_capacity': capacity - current_weight
            })
        
        step_index += 1
    
    steps.append({
        'step_index': step_index,
        'description': 'Greedy selection complete',
        'current_decision': f'Final solution: {len(selected_items)} items selected',
        'selected_items': selected_items,
        'total_weight': current_weight,
        'total_value': current_value,
        'remaining_capacity': capacity - current_weight
    })
    
    return {
        'selected_items': selected_items,
        'total_weight': current_weight,
        'total_value': current_value,
        'steps': steps
    }


def solve_fractional_knapsack(items, capacity):
    """
    Solve Fractional Knapsack (items can be split)
    
    Time Complexity: O(n log n) - due to sorting
    Space Complexity: O(n)
    
    This is optimal for fractional knapsack problem
    
    Args:
        items: List of dicts with 'id', 'weight', 'value'
        capacity: Maximum weight capacity
    
    Returns:
        dict with selected_items, total_weight, total_value, steps
    """
    if not items or capacity <= 0:
        return {
            'selected_items': [],
            'total_weight': 0,
            'total_value': 0,
            'steps': []
        }
    
    steps = []
    step_index = 0
    
    # Calculate value-to-weight ratio
    items_with_ratio = []
    for item in items:
        ratio = item['value'] / item['weight'] if item['weight'] > 0 else 0
        items_with_ratio.append({
            **item,
            'ratio': ratio
        })
    
    steps.append({
        'step_index': step_index,
        'description': 'Calculating value-to-weight ratios for fractional selection',
        'current_decision': None,
        'selected_items': [],
        'total_weight': 0,
        'total_value': 0
    })
    step_index += 1
    
    # Sort by ratio (descending)
    sorted_items = sorted(items_with_ratio, key=lambda x: x['ratio'], reverse=True)
    
    steps.append({
        'step_index': step_index,
        'description': 'Sorting items by value-to-weight ratio',
        'current_decision': None,
        'selected_items': [],
        'total_weight': 0,
        'total_value': 0
    })
    step_index += 1
    
    # Select items (can take fractions)
    selected_items = []
    remaining_capacity = capacity
    total_value = 0
    
    for item in sorted_items:
        weight = item['weight']
        
        if remaining_capacity <= 0:
            break
        
        if weight <= remaining_capacity:
            # Take whole item
            fraction = 1.0
            taken_weight = weight
            taken_value = item['value']
            
            selected_items.append({
                'id': item['id'],
                'weight': weight,
                'value': item['value'],
                'fraction': fraction
            })
            
            remaining_capacity -= weight
            total_value += item['value']
            
            steps.append({
                'step_index': step_index,
                'description': f'Taking full item {item["id"]} (weight={weight}, value={item["value"]})',
                'current_decision': f'Include 100% of item {item["id"]}',
                'selected_items': selected_items.copy(),
                'total_weight': capacity - remaining_capacity,
                'total_value': total_value,
                'remaining_capacity': remaining_capacity
            })
        else:
            # Take fraction of item
            fraction = remaining_capacity / weight
            taken_weight = remaining_capacity
            taken_value = item['value'] * fraction
            
            selected_items.append({
                'id': item['id'],
                'weight': taken_weight,
                'value': taken_value,
                'fraction': fraction
            })
            
            total_value += taken_value
            remaining_capacity = 0
            
            steps.append({
                'step_index': step_index,
                'description': f'Taking {fraction*100:.1f}% of item {item["id"]} (weight={taken_weight:.2f}, value={taken_value:.2f})',
                'current_decision': f'Include {fraction*100:.1f}% of item {item["id"]}',
                'selected_items': selected_items.copy(),
                'total_weight': capacity,
                'total_value': total_value,
                'remaining_capacity': 0
            })
        
        step_index += 1
    
    steps.append({
        'step_index': step_index,
        'description': 'Fractional selection complete - Optimal solution found',
        'current_decision': f'Final solution: {len(selected_items)} items (some fractional)',
        'selected_items': selected_items,
        'total_weight': capacity - remaining_capacity,
        'total_value': total_value,
        'remaining_capacity': remaining_capacity
    })
    
    return {
        'selected_items': selected_items,
        'total_weight': capacity - remaining_capacity,
        'total_value': total_value,
        'steps': steps
    }

