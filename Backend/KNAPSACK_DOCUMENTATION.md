# Knapsack Solver - Complete Documentation

## Table of Contents
1. [Data Structures](#data-structures)
2. [API Endpoints](#api-endpoints)
3. [JSON Schemas](#json-schemas)
4. [Algorithm Complexity Analysis](#algorithm-complexity-analysis)
5. [Edge Cases & Validation](#edge-cases--validation)
6. [Example Requests/Responses](#example-requestsresponses)

---

## Data Structures

### Knapsack Problem Structure

```python
{
    "user_id": int,           # From JWT token
    "items": [
        {
            "id": int,        # Unique identifier
            "weight": float,  # Item weight (> 0)
            "value": float    # Item value (>= 0)
        }
    ],
    "capacity": float,        # Maximum weight capacity (> 0)
    "algorithm_type": str,    # "dp_01" | "greedy" | "fractional"
    "created_at": datetime    # Timestamp
}
```

---

## API Endpoints

### 1. POST /api/knapsack/solve
Solve a knapsack problem without saving.

**Authentication:** Required (JWT Bearer token)

**Request Body:**
```json
{
    "items": [
        {"id": 1, "weight": 10, "value": 60},
        {"id": 2, "weight": 20, "value": 100},
        {"id": 3, "weight": 30, "value": 120}
    ],
    "capacity": 50,
    "algorithm_type": "dp_01"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "selected_items": [
        {"id": 1, "weight": 10, "value": 60},
        {"id": 2, "weight": 20, "value": 100}
    ],
    "total_weight": 30,
    "total_value": 160,
    "steps": [...],
    "algorithm_used": "dp_01",
    "complexity_info": {
        "time_complexity": "O(n * capacity)",
        "space_complexity": "O(n * capacity)",
        "optimal": true,
        "note": "Optimal solution for 0/1 knapsack"
    }
}
```

### 2. POST /api/knapsack/save
Solve and save a knapsack problem.

**Authentication:** Required (JWT Bearer token)

**Request Body:** Same as `/solve`

**Response (201 Created):**
```json
{
    "success": true,
    "problem_id": 123,
    "selected_items": [...],
    "total_weight": 30,
    "total_value": 160,
    "steps": [...],
    "algorithm_used": "dp_01",
    "complexity_info": {...},
    "message": "Problem solved and saved successfully"
}
```

### 3. GET /api/knapsack/history
Get user's knapsack problem history.

**Authentication:** Required (JWT Bearer token)

**Query Parameters:**
- `limit` (optional): Maximum results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
{
    "success": true,
    "problems": [
        {
            "id": 123,
            "user_id": 1,
            "items": [...],
            "capacity": 50,
            "algorithm_type": "dp_01",
            "solution": {...},
            "created_at": "2024-01-01T00:00:00"
        }
    ],
    "total": 10,
    "limit": 50,
    "offset": 0
}
```

### 4. GET /api/knapsack/history/<problem_id>
Get a specific problem by ID.

**Authentication:** Required (JWT Bearer token)

**Response (200 OK):**
```json
{
    "success": true,
    "problem": {...}
}
```

---

## JSON Schemas

### Step-by-Step Execution Data

Each step in the `steps` array contains:

```json
{
    "step_index": 0,
    "description": "Description of what happens in this step",
    "current_decision": "Decision made (e.g., 'Include item 1' or 'Skip item 2')",
    "selected_items": [
        {"id": 1, "weight": 10, "value": 60}
    ],
    "total_weight": 10,
    "total_value": 60,
    "remaining_capacity": 40,  // Optional, for greedy/fractional
    "dp_state": "DP[1][10] = 60",  // Optional, for DP algorithm
    "ratios": {"1": 6.0},  // Optional, for greedy/fractional
    "fraction": 0.5  // Optional, for fractional knapsack
}
```

### Solution Structure

```json
{
    "selected_items": [
        {
            "id": 1,
            "weight": 10,
            "value": 60,
            "fraction": 1.0  // Only for fractional knapsack
        }
    ],
    "total_weight": 30,
    "total_value": 160,
    "steps": [...],
    "algorithm_used": "dp_01",
    "complexity_info": {
        "time_complexity": "O(n * capacity)",
        "space_complexity": "O(n * capacity)",
        "optimal": true,
        "note": "Algorithm description"
    },
    "solved_at": "2024-01-01T00:00:00"  // Only in saved problems
}
```

---

## Algorithm Complexity Analysis

### 1. 0/1 Knapsack (Dynamic Programming)

**Time Complexity:** O(n × capacity)
- Where n = number of items, capacity = maximum weight
- Fills a 2D table of size n × capacity
- Each cell computation is O(1)

**Space Complexity:** O(n × capacity)
- Stores the DP table
- Can be optimized to O(capacity) using 1D array

**Optimality:** ✅ Yes - Guarantees optimal solution

**Best For:**
- Small to medium capacity values (< 10,000)
- When optimal solution is required
- When step-by-step visualization is needed

**Limitations:**
- Becomes slow for very large capacities
- Memory intensive for large problems

---

### 2. Greedy Knapsack

**Time Complexity:** O(n log n)
- Sorting items by value-to-weight ratio: O(n log n)
- Greedy selection: O(n)

**Space Complexity:** O(n)
- Stores sorted items array

**Optimality:** ❌ No - Heuristic solution
- May not give optimal solution for 0/1 knapsack
- Works well when items have similar value-to-weight ratios

**Best For:**
- Large problems where speed matters
- When approximate solution is acceptable
- Real-time applications

**Limitations:**
- Not guaranteed to be optimal
- Can perform poorly when value-to-weight ratios vary significantly

---

### 3. Fractional Knapsack

**Time Complexity:** O(n log n)
- Sorting items by value-to-weight ratio: O(n log n)
- Greedy selection: O(n)

**Space Complexity:** O(n)
- Stores sorted items array

**Optimality:** ✅ Yes - Optimal for fractional knapsack
- Guarantees optimal solution when items can be split

**Best For:**
- Problems where items can be divided
- Resource allocation problems
- When optimal solution is needed for fractional case

**Limitations:**
- Only applicable when fractional items are allowed
- May not be suitable for discrete items

---

## Edge Cases & Validation

### Input Validation

1. **Empty Items List**
   - Error: "Items list cannot be empty"
   - Status: 400

2. **Too Many Items**
   - Limit: 1,000 items
   - Error: "Too many items. Maximum allowed: 1000"
   - Status: 400

3. **Invalid Capacity**
   - Must be > 0
   - Maximum: 1,000,000
   - Error: "Capacity must be greater than 0" or "Capacity too large"
   - Status: 400

4. **Invalid Item Data**
   - Missing required fields (id, weight, value)
   - Invalid data types (non-numeric)
   - Weight <= 0
   - Value < 0
   - Duplicate item IDs
   - Status: 400

5. **Invalid Algorithm Type**
   - Must be: "dp_01", "greedy", or "fractional"
   - Error: "Invalid algorithm type"
   - Status: 400

6. **Large Capacity for DP**
   - Warning for capacity > 10,000
   - Error: "DP algorithm not recommended for capacity > 10000"
   - Status: 400

### Safety Limits

- **Max Items:** 1,000
- **Max Capacity:** 1,000,000
- **Max Item Weight:** 1,000,000
- **Max Item Value:** 1,000,000
- **DP Capacity Warning:** 10,000

### Error Handling

All endpoints return standardized error responses:

```json
{
    "error": "Error message here",
    "success": false
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created (for save endpoint)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (problem not found)
- `500` - Internal Server Error

---

## Example Requests/Responses

### Example 1: Solve 0/1 Knapsack

**Request:**
```bash
POST /api/knapsack/solve
Authorization: Bearer <token>
Content-Type: application/json

{
    "items": [
        {"id": 1, "weight": 10, "value": 60},
        {"id": 2, "weight": 20, "value": 100},
        {"id": 3, "weight": 30, "value": 120}
    ],
    "capacity": 50,
    "algorithm_type": "dp_01"
}
```

**Response:**
```json
{
    "success": true,
    "selected_items": [
        {"id": 2, "weight": 20, "value": 100},
        {"id": 3, "weight": 30, "value": 120}
    ],
    "total_weight": 50,
    "total_value": 220,
    "steps": [
        {
            "step_index": 0,
            "description": "Initializing DP table with 3 items and capacity 50",
            "current_decision": null,
            "selected_items": [],
            "total_weight": 0,
            "total_value": 0
        },
        ...
    ],
    "algorithm_used": "dp_01",
    "complexity_info": {
        "time_complexity": "O(n * capacity)",
        "space_complexity": "O(n * capacity)",
        "optimal": true,
        "note": "Optimal solution for 0/1 knapsack"
    }
}
```

### Example 2: Solve Fractional Knapsack

**Request:**
```json
{
    "items": [
        {"id": 1, "weight": 10, "value": 60},
        {"id": 2, "weight": 20, "value": 100},
        {"id": 3, "weight": 30, "value": 120}
    ],
    "capacity": 50,
    "algorithm_type": "fractional"
}
```

**Response:**
```json
{
    "success": true,
    "selected_items": [
        {"id": 1, "weight": 10, "value": 60, "fraction": 1.0},
        {"id": 2, "weight": 20, "value": 100, "fraction": 1.0},
        {"id": 3, "weight": 20, "value": 80, "fraction": 0.667}
    ],
    "total_weight": 50,
    "total_value": 240,
    "steps": [...],
    "algorithm_used": "fractional",
    "complexity_info": {
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)",
        "optimal": true,
        "note": "Optimal solution for fractional knapsack"
    }
}
```

### Example 3: Error Response

**Request:**
```json
{
    "items": [],
    "capacity": 50,
    "algorithm_type": "dp_01"
}
```

**Response (400 Bad Request):**
```json
{
    "error": "Items list cannot be empty",
    "success": false
}
```

---

## Performance Recommendations

1. **For Small Problems (n < 50, capacity < 1000):**
   - Use DP algorithm for optimal solution

2. **For Medium Problems (n < 200, capacity < 10000):**
   - Use DP if optimal solution needed
   - Use Greedy if speed is priority

3. **For Large Problems (n > 200 or capacity > 10000):**
   - Use Greedy or Fractional algorithms
   - Avoid DP due to memory/time constraints

4. **For Real-time Applications:**
   - Always use Greedy algorithm
   - Accept approximate solutions

5. **For Educational/Debugging:**
   - Use DP algorithm with step-by-step visualization
   - Analyze the execution steps

---

## Frontend Integration

### State Management Flow

1. **Input State:**
   - `items`: Array of items
   - `capacity`: Number
   - `algorithmType`: String

2. **API Call Sequence:**
   ```
   User Input → Validate → API Call → Loading State → Success/Error
   ```

3. **Solution State:**
   - `solution`: Complete solution object
   - `steps`: Array of step objects
   - `currentStepIndex`: Current step for visualization

4. **Visualization Control:**
   - Previous/Next step navigation
   - Auto-play with interval
   - Step-by-step progress bar
   - Step navigation dots

5. **History Management:**
   - Load history on demand
   - Load problem from history
   - Save current problem

---

## Database Schema

### knapsack_problems Table

```sql
CREATE TABLE knapsack_problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    items TEXT NOT NULL,  -- JSON array
    capacity FLOAT NOT NULL,
    algorithm_type VARCHAR(50) NOT NULL,
    solution TEXT,  -- JSON object
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Security Considerations

1. **JWT Authentication:**
   - All endpoints require valid JWT token
   - Token expires after 7 days
   - User can only access their own problems

2. **Input Validation:**
   - All inputs validated server-side
   - Limits prevent DoS attacks
   - SQL injection prevented by SQLAlchemy ORM

3. **Data Isolation:**
   - Users can only see their own problems
   - Foreign key constraints ensure data integrity

---

## Testing Recommendations

### Unit Tests
- Test each algorithm with known inputs/outputs
- Test edge cases (empty items, zero capacity, etc.)
- Test validation functions

### Integration Tests
- Test API endpoints with valid/invalid tokens
- Test database operations
- Test error handling

### Performance Tests
- Test with maximum allowed inputs
- Measure execution time for each algorithm
- Test memory usage

---

## Future Enhancements

1. **Additional Algorithms:**
   - Branch and Bound
   - Genetic Algorithm
   - Simulated Annealing

2. **Features:**
   - Export results to CSV/JSON
   - Compare multiple algorithms
   - Batch processing

3. **Optimization:**
   - Caching for repeated problems
   - Parallel processing for large problems
   - Database indexing optimization

