import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  CreditCard, 
  Activity, 
  Calendar, 
  FileText, 
  LogOut, 
  Edit2, 
  Save, 
  X,
  Home,
  Mail,
  Shield,
  Eye,
  Clock,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

const Dashboard = ({ user = null, onLogout, onUserUpdate }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Welcome to your dashboard!', time: '2 minutes ago' },
    { id: 2, type: 'success', message: 'Profile updated successfully', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'Password expires in 30 days', time: '2 hours ago' }
  ]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Refs for cleanup
  const intervalRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Early return if essential props are missing
  if (!onLogout || !onUserUpdate) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h2>
          <p className="text-gray-300">Dashboard is missing required props.</p>
        </div>
      </div>
    );
  }

  const fetchUserStats = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const token = localStorage?.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://sandbox_flowbite.raspy-math-fdba.workers.dev/user/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          throw new Error('Session expired. Please log in again.');
        }

        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format received');
      }

      console.log('User stats received:', data);
      setUserStats(data);
      setLastUpdated(new Date());
      setIsOnline(true);

    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to fetch stats');
      setIsOnline(false);
      // ❌ Remove fallback data entirely
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };


  // Auto-refresh functionality
  /*useEffect(() => {
    fetchUserStats();
    
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchUserStats(false); // Don't show loading on auto-refresh
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);*/
  useEffect(() => {
    fetchUserStats(); // Fetch once on mount
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchUserStats(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update editedUser when user prop changes
  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleManualRefresh = () => {
    fetchUserStats(true);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    try {
      const now = new Date();
      const dateObj = new Date(date);
      
      // Convert both dates to local time
      const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
      
      const diffInSeconds = Math.floor((localNow - localDate) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (error) {
      console.error('Error formatting time ago:', error);
      return 'Unknown';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    
    try {
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Convert to local time
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'America/Los_Angeles' // Force PST/PDT timezone
      };
      
      // For current user's timezone (instead of forcing PST):
      /*return localDate.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });*/
      
      return localDate.toLocaleString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  /*useEffect(() => {
    setEditedUser(user || {});
  }, [user]);*/

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!editedUser.name || !editedUser.email) {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'warning', message: 'Name and Email are required', time: 'Just now' }
      ]);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');

      const response = await fetch('https://sandbox_flowbite.raspy-math-fdba.workers.dev/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          phone: editedUser.phone,
          role: editedUser.role
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Profile update failed');
      }

      // Create the updated user object
      const updatedUser = {
        ...(user || {}),
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        role: editedUser.role
      };

      setEditedUser(updatedUser);

      setIsEditing(false);

      // Inform parent about the updated user
      onUserUpdate(updatedUser);

      await fetchUserStats(false);

      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'success', message: 'Profile updated successfully!', time: 'Just now' }
      ]);
    } catch (err) {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'warning', message: 'Failed to update profile', time: 'Just now' }
      ]);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user || {});
  };

  // Show loading state if user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading user data...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        {/* Status Bar */}
        <div className="bg-gray-800 rounded-lg p-4 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-gray-300">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
              
              {lastUpdated && (
                <div className="text-sm text-gray-400">
                  Last updated: {formatTimeAgo(lastUpdated)}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/*<button
                onClick={toggleAutoRefresh}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  autoRefresh 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>*/}
              
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                className="flex items-center space-x-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && !loading && (
          <div className="bg-red-800/50 border border-red-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-red-200">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 text-orange-500 animate-spin" />
              <span className="text-gray-400">Loading user stats...</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Logins</p>
                  <p className="text-2xl font-bold text-white">{userStats.loginCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Last Login</p>
                  <p className="text-lg font-bold text-white">
                    {userStats?.lastLogin ? formatDate(userStats.lastLogin) : 'Unknown'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-lg font-bold text-white">
                    {userStats?.memberSince ? formatDate(userStats.memberSince) : 'Unknown'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Profile Views</p>
                  <p className="text-2xl font-bold text-white">{userStats.profileViews}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 text-orange-500 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-300">Dashboard accessed</span>
                <span className="text-gray-500 ml-auto">Now</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-300">Stats refreshed</span>
                <span className="text-gray-500 ml-auto">{lastUpdated ? formatTimeAgo(lastUpdated) : 'Unknown'}</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-300">Last login</span>
                <span className="text-gray-500 ml-auto">
                  {userStats?.lastLogin ? formatDate(userStats.lastLogin) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Connection</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isOnline ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {/*<div className="flex items-center justify-between">
                <span className="text-gray-300">Auto Refresh</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {autoRefresh ? 'Enabled' : 'Disabled'}
                </span>
              </div>*/}
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Data Freshness</span>
                <span className="text-gray-400 text-xs">
                  {lastUpdated ? formatTimeAgo(lastUpdated) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSaveProfile}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedUser(user);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="text-white">{user?.name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="text-white">{user?.role || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedUser.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="text-white">{user?.email || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            ) : (
              <p className="text-white">{user?.phone || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
              notification.type === 'info' ? 'border-blue-500' :
              notification.type === 'success' ? 'border-green-500' :
              'border-yellow-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white">{notification.message}</p>
                <p className="text-gray-400 text-sm mt-1">{notification.time}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-gray-400 hover:text-white ml-4"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Billing & Subscription</h2>
      <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
        <p className="text-gray-300">Billing features coming soon...</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>
      <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
        <p className="text-gray-300">Settings panel coming soon...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'profile':
        return renderProfile();
      case 'notifications':
        return renderNotifications();
      case 'billing':
        return renderBilling();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white border-t border-orange-500/30">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-orange-500/20 min-h-screen">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className="w-10 h-[2.5rem] bg-orange-600 rounded-full flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-gray-400">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-3 rounded-lg text-left text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;