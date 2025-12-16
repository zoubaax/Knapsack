import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getKnapsackHistory()
      if (response.data.success) {
        setHistory(response.data.problems || [])
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getAlgorithmBadge = (algorithm) => {
    const badges = {
      'dp_01': 'bg-purple-100 text-purple-800',
      'greedy': 'bg-blue-100 text-blue-800',
      'fractional': 'bg-green-100 text-green-800'
    }
    return badges[algorithm] || 'bg-gray-100 text-gray-800'
  }

  const getAlgorithmLabel = (algorithm) => {
    const labels = {
      'dp_01': '0/1 DP',
      'greedy': 'Greedy',
      'fractional': 'Fractional'
    }
    return labels[algorithm] || algorithm
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Total Problems</div>
          <div className="text-3xl font-bold text-gray-800">{history.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">DP Solutions</div>
          <div className="text-3xl font-bold text-purple-600">
            {history.filter(p => p.algorithm_type === 'dp_01').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Greedy Solutions</div>
          <div className="text-3xl font-bold text-blue-600">
            {history.filter(p => p.algorithm_type === 'greedy').length}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Saved Problems</h3>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No problems saved</h3>
            <p className="mt-1 text-sm text-gray-500">Start solving problems to see them here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {history.map((problem) => {
              const solution = problem.solution
              return (
                <div
                  key={problem.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedProblem?.id === problem.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={() => setSelectedProblem(problem)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-gray-900">Problem #{problem.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlgorithmBadge(problem.algorithm_type)}`}>
                          {getAlgorithmLabel(problem.algorithm_type)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-500">Items</div>
                          <div className="text-sm font-medium">{problem.items.length}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Capacity</div>
                          <div className="text-sm font-medium">{problem.capacity}</div>
                        </div>
                        {solution && (
                          <>
                            <div>
                              <div className="text-xs text-gray-500">Total Value</div>
                              <div className="text-sm font-medium text-green-600">{solution.total_value?.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Total Weight</div>
                              <div className="text-sm font-medium">{solution.total_weight?.toFixed(2)}</div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400">{formatDate(problem.created_at)}</div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProblem(problem)
                      }}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Problem Details Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProblem(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-semibold">Problem #{selectedProblem.id} Details</h3>
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Problem Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Algorithm</div>
                  <div className="font-semibold">{getAlgorithmLabel(selectedProblem.algorithm_type)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Capacity</div>
                  <div className="font-semibold">{selectedProblem.capacity}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedProblem.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium">Item {item.id}</div>
                      <div className="text-sm text-gray-600">Weight: {item.weight}</div>
                      <div className="text-sm text-gray-600">Value: {item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution */}
              {selectedProblem.solution && (
                <div>
                  <h4 className="font-semibold mb-3">Solution</h4>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-bold text-green-600">{selectedProblem.solution.total_value?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className="font-bold">{selectedProblem.solution.total_weight?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Items:</span>
                      <span className="font-bold">{selectedProblem.solution.selected_items?.length || 0}</span>
                    </div>
                  </div>
                  
                  {selectedProblem.solution.selected_items && selectedProblem.solution.selected_items.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Selected Items:</h5>
                      <div className="space-y-2">
                        {selectedProblem.solution.selected_items.map((item, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border border-green-200">
                            <div className="font-medium">Item {item.id}</div>
                            <div className="text-sm text-gray-600">
                              Weight: {item.weight} | Value: {item.value}
                              {item.fraction && ` (${(item.fraction * 100).toFixed(1)}%)`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History

