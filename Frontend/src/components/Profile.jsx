function Profile({ user }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-lg">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1">{user?.full_name || 'User'}</h2>
              <p className="text-blue-100">{user?.email || ''}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="text-lg font-semibold text-gray-800">{user?.full_name || 'N/A'}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="text-lg font-semibold text-gray-800">{user?.email || 'N/A'}</div>
            </div>
            
            {user?.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                <div className="text-lg font-semibold text-gray-800">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Account Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-gray-800">#{user?.id || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Problems Solved</div>
          <div className="text-3xl font-bold">-</div>
          <div className="text-xs opacity-75 mt-2">Check History for details</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">DP Solutions</div>
          <div className="text-3xl font-bold">-</div>
          <div className="text-xs opacity-75 mt-2">Optimal solutions</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Greedy Solutions</div>
          <div className="text-3xl font-bold">-</div>
          <div className="text-xs opacity-75 mt-2">Fast solutions</div>
        </div>
      </div>
    </div>
  )
}

export default Profile

