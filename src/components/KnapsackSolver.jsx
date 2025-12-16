import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

/**
 * Knapsack Solver Component
 * 
 * State Management:
 * - items: Array of {id, weight, value}
 * - capacity: Maximum weight capacity
 * - algorithmType: 'dp_01' | 'greedy' | 'fractional'
 * - solution: Result from API
 * - steps: Step-by-step execution data
 * - currentStepIndex: Index of currently displayed step
 * - loading: Loading state
 * - error: Error message
 * - history: Saved problems history
 */
function KnapsackSolver() {
  // Problem input state
  const [items, setItems] = useState([
    { id: 1, weight: 10, value: 60 },
    { id: 2, weight: 20, value: 100 },
    { id: 3, weight: 30, value: 120 }
  ])
  const [capacity, setCapacity] = useState(50)
  const [algorithmType, setAlgorithmType] = useState('dp_01')

  // Solution state
  const [solution, setSolution] = useState(null)
  const [steps, setSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playInterval, setPlayInterval] = useState(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Item input helpers
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: newId, weight: 1, value: 1 }])
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: parseFloat(value) || 0 } : item
    ))
  }

  // Solve knapsack problem
  const handleSolve = async () => {
    setLoading(true)
    setError(null)
    setSolution(null)
    setSteps([])
    setCurrentStepIndex(-1)

    try {
      const response = await apiService.solveKnapsack({
        items,
        capacity: parseFloat(capacity),
        algorithm_type: algorithmType
      })

      if (response.data.success) {
        setSolution(response.data)
        setSteps(response.data.steps || [])
        setCurrentStepIndex(-1) // Start before first step
      } else {
        setError(response.data.error || 'Failed to solve problem')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to solve knapsack problem'
      console.error('Error solving knapsack:', err.response?.data || err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Save problem and solution
  const handleSave = async () => {
    if (!solution) {
      setError('Please solve the problem first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.saveKnapsack({
        items,
        capacity: parseFloat(capacity),
        algorithm_type: algorithmType
      })

      if (response.data.success) {
        alert('Problem saved successfully!')
        // Refresh history
        loadHistory()
      } else {
        setError(response.data.error || 'Failed to save problem')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save problem')
    } finally {
      setLoading(false)
    }
  }


  // Step visualization controls
  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const previousStep = () => {
    if (currentStepIndex >= 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const goToStep = (index) => {
    if (index >= -1 && index < steps.length) {
      setCurrentStepIndex(index)
    }
  }

  const startAutoPlay = () => {
    if (isPlaying) {
      // Stop
      if (playInterval) {
        clearInterval(playInterval)
        setPlayInterval(null)
      }
      setIsPlaying(false)
    } else {
      // Start
      if (currentStepIndex >= steps.length - 1) {
        setCurrentStepIndex(-1)
      }
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval)
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 1000) // 1 second per step
      setPlayInterval(interval)
      setIsPlaying(true)
    }
  }

  const resetSteps = () => {
    setCurrentStepIndex(-1)
    if (playInterval) {
      clearInterval(playInterval)
      setPlayInterval(null)
    }
    setIsPlaying(false)
  }

  // Get current step data
  const getCurrentStep = () => {
    if (currentStepIndex === -1) {
      return {
        description: 'Initial state - Ready to solve',
        selected_items: [],
        total_weight: 0,
        total_value: 0
      }
    }
    return steps[currentStepIndex] || null
  }


  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (playInterval) {
        clearInterval(playInterval)
      }
    }
  }, [playInterval])

  const currentStep = getCurrentStep()

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="space-y-4">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              <h2 className="text-xl font-semibold text-gray-800">Problem Input</h2>
            </div>

            {/* Capacity Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Capacity: <span className="text-blue-600 font-bold text-lg">{capacity}</span>
              </label>
              <input
                type="range"
                min="1"
                max="200"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min="1"
              />
            </div>

            {/* Algorithm Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
              <select
                value={algorithmType}
                onChange={(e) => setAlgorithmType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="dp_01">0/1 Knapsack (Dynamic Programming) - Optimal</option>
                <option value="greedy">Greedy Knapsack - Fast Heuristic</option>
                <option value="fractional">Fractional Knapsack - Optimal for Fractions</option>
              </select>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Items ({items.length})</label>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <span className="text-sm font-semibold text-gray-600 w-8">#{item.id}</span>
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                      placeholder="Weight"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0.1"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.1"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSolve}
                disabled={loading || items.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Solving...
                  </span>
                ) : 'Solve'}
              </button>
              <button
                onClick={handleSave}
                disabled={!solution || loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Solution & Steps */}
        <div className="space-y-4">
          {/* Solution Summary */}
          {solution && (
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-green-600 rounded"></div>
                <h2 className="text-xl font-semibold text-gray-800">Solution</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="text-xs text-green-700 mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-green-700">{solution.total_value.toFixed(2)}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-700 mb-1">Total Weight</div>
                  <div className="text-2xl font-bold text-blue-700">{solution.total_weight.toFixed(2)}</div>
                  <div className="text-xs text-blue-600 mt-1">/ {capacity}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-700 mb-1">Items Selected</div>
                  <div className="text-2xl font-bold text-purple-700">{solution.selected_items.length}</div>
                </div>
              </div>
              
              {solution.complexity_info && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Algorithm Complexity</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div><span className="font-medium">Time:</span> {solution.complexity_info.time_complexity}</div>
                    <div><span className="font-medium">Space:</span> {solution.complexity_info.space_complexity}</div>
                    <div><span className="font-medium">Optimal:</span> <span className={solution.complexity_info.optimal ? 'text-green-600' : 'text-orange-600'}>{solution.complexity_info.optimal ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>
              )}

              {/* Selected Items List */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Selected Items:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {solution.selected_items.map((item, idx) => (
                    <div key={idx} className="text-sm p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-800">Item {item.id}</div>
                      <div className="text-gray-600 mt-1">
                        Weight: {item.weight} | Value: {item.value}
                        {item.fraction && <span className="text-blue-600"> ({((item.fraction * 100).toFixed(1))}%)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step Visualization */}
          {steps.length > 0 && (
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-purple-600 rounded"></div>
                <h2 className="text-xl font-semibold text-gray-800">Step-by-Step Execution</h2>
              </div>

              {/* Step Controls */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={previousStep}
                  disabled={currentStepIndex === -1}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  ← Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStepIndex >= steps.length - 1}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Next →
                </button>
                <button
                  onClick={startAutoPlay}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  onClick={resetSteps}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Reset
                </button>
              </div>

              {/* Step Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStepIndex + 1} of {steps.length + 1}</span>
                  <span>{Math.round(((currentStepIndex + 1) / (steps.length + 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / (steps.length + 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Step Display */}
              {currentStep && (
                <div className="border-2 border-blue-200 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white">
                  <div className="font-semibold text-gray-800 mb-3 text-lg">{currentStep.description}</div>
                  {currentStep.current_decision && (
                    <div className="text-sm text-blue-700 mb-3 p-2 bg-blue-100 rounded-lg font-medium">
                      💡 Decision: {currentStep.current_decision}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Weight</div>
                      <div className="text-lg font-bold text-gray-800">{currentStep.total_weight?.toFixed(2) || 0}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Value</div>
                      <div className="text-lg font-bold text-green-600">{currentStep.total_value?.toFixed(2) || 0}</div>
                    </div>
                  </div>
                  {currentStep.selected_items && currentStep.selected_items.length > 0 && (
                    <div className="mt-3">
                      <div className="font-medium text-gray-700 mb-2">Selected Items:</div>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.selected_items.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-medium">
                            #{item.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step Navigation Dots */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => goToStep(-1)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentStepIndex === -1 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Start
                </button>
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToStep(idx)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentStepIndex === idx 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnapsackSolver
