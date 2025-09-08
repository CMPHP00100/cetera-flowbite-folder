//components/user-sections/dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from "next-auth/react";
//import { useNavigate } from "react-router-dom"; // or next/router if Next.js routing
import { useRouter } from 'next/router';
import { analytics } from '@/utils/analytics';
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
  WifiOff,
  Crown,
  Star,
  Zap,
  Copy,
  EyeOff,
  Key,
  Users
} from 'lucide-react';

const useSafeRouter = () => {
  const [routerReady, setRouterReady] = useState(false);
  let router;

  try {
    router = useRouter();
    useEffect(() => {
      if (router.isReady) {
        setRouterReady(true);
      }
    }, [router.isReady]);
  } catch (error) {
    router = null;
  }

  const navigate = (url) => {
    if (router && routerReady) {
      router.push(url);
    } else {
      window.location.href = url;
    }
  };

  return { navigate };
};


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
  
  // Premium Access Code states
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeLoading, setAccessCodeLoading] = useState(false);
  const [accessCodeMessage, setAccessCodeMessage] = useState(null);
  const [showAccessCode, setShowAccessCode] = useState(false);
  
  const { data: session, update: updateSession } = useSession();
  const { navigate } = useSafeRouter();
  //const { trackUpgrade, trackPageView } = useAnalytics();
  
  // Refs for cleanup
  const intervalRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Helper function to check if user is premium
  const isPremiumUser = () => {
    return user?.role === 'PREMIUM' || user?.role === 'PREMIUM_USER' || session?.user?.role === 'PREMIUM_USER';
  };

  // Helper function to get premium badge component
  const PremiumBadge = ({ size = 'sm', showText = true }) => {
    if (!isPremiumUser()) return null;
    
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    return (
      <div className="flex items-center space-x-1">
        <Crown className={`${sizeClasses[size]} text-yellow-400`} />
        {showText && (
          <span className="text-yellow-400 font-medium text-sm">PREMIUM</span>
        )}
      </div>
    );
  };

  // Premium Access Code Functions
  const handleSubmitAccessCode = async (e) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setAccessCodeLoading(true);
    setAccessCodeMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode: accessCode.trim().toUpperCase() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAccessCodeMessage(data.message);
        setAccessCode("");
        // Refresh session to get updated access
        await updateSession();
        // Add success notification
        setNotifications(prev => [
          ...prev,
          { id: Date.now(), type: 'success', message: 'Premium access granted successfully!', time: 'Just now' }
        ]);
        // Refresh user stats
        await fetchUserStats(false);
      } else {
        setAccessCodeMessage(data.error || "Invalid access code");
        setNotifications(prev => [
          ...prev,
          { id: Date.now(), type: 'warning', message: 'Invalid access code provided', time: 'Just now' }
        ]);
      }
    } catch (err) {
      console.error("Access code error:", err);
      setAccessCodeMessage("Failed to process access code");
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'warning', message: 'Failed to process access code', time: 'Just now' }
      ]);
    } finally {
      setAccessCodeLoading(false);
    }
  };

  const copyAccessCode = () => {
    if (session?.user?.accessCode) {
      navigator.clipboard.writeText(session.user.accessCode);
      setAccessCodeMessage("Access code copied to clipboard!");
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'success', message: 'Access code copied to clipboard!', time: 'Just now' }
      ]);
      setTimeout(() => setAccessCodeMessage(null), 3000);
    }
  };

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

      // Use NextAuth session token instead of localStorage
      const token = session?.user?.token;
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

      // Rest remains the same...
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to fetch stats');
      setIsOnline(false);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

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

  const handleUpgradeClick = () => {
    if (!session) {
      // Use the same route your subscription page uses for unauthenticated users
      navigate('/account?callbackUrl=/subscription');
      return;
    }

    analytics.trackFunnelStep(1, 'upgrade_button_click', {
      source: 'dashboard_overview',
      user_type: 'standard',
      login_count: userStats?.loginCount
    });

    navigate('/subscription');
  };


  const handleManualRefresh = async () => {
    fetchUserStats(true);
    const startTime = performance.now();
    
    try {
      analytics.trackFeatureUsage('manual_refresh', 'initiated', {
        source: 'dashboard_status_bar'
      });
      
      // Your existing refresh logic
      await refreshUserData();
      
      const endTime = performance.now();
      analytics.trackPerformance('refresh_duration', endTime - startTime, {
        success: true
      });
      
    } catch (error) {
      analytics.trackError('refresh_failed', error.message, {
        source: 'manual_refresh',
        user_id: user?.id
      });
    }
  };

  // Track stats card clicks with enhanced data
  const handleStatsCardClick = (cardType, cardValue) => {
    analytics.trackEngagement('click', 'stats_card', {
      card_type: cardType,
      card_value: cardValue,
      user_type: isPremiumUser() ? 'premium' : 'standard',
      position: getCardPosition(cardType) // helper function to get card position
    });
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    try {
      const now = new Date();
      const dateObj = new Date(date);
      
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
      
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'America/Los_Angeles'
      };
      
      return localDate.toLocaleString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'access', label: 'Premium Access', icon: Key }, // New section
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

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

      const updatedUser = {
        ...(user || {}),
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        role: editedUser.role
      };

      setEditedUser(updatedUser);
      setIsEditing(false);
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

   // Track time spent on dashboard
  useEffect(() => {
    const startTime = Date.now();
    
    const trackTimeSpent = () => {
      const timeSpent = Date.now() - startTime;
      if (timeSpent > 5000) { // Only track if user spent more than 5 seconds
        analytics.trackEngagement('time_spent', 'dashboard_overview', {
          duration_ms: timeSpent,
          duration_seconds: Math.round(timeSpent / 1000),
          user_type: isPremiumUser() ? 'premium' : 'standard'
        });
      }
    };

    // Track when user leaves the page
    const handleBeforeUnload = () => trackTimeSpent();
    const handleVisibilityChange = () => {
      if (document.hidden) trackTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      trackTimeSpent();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


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

  useEffect(() => {
      analytics.track('page_view', {
        page_name: 'dashboard_overview',
        user_type: isPremiumUser() ? 'premium' : 'standard'
      });
    }, []);

  // Track initial page load and user context
  useEffect(() => {
    analytics.trackPageView('dashboard_overview', {
      user_type: isPremiumUser() ? 'premium' : 'standard',
      user_id: user?.id,
      login_count: userStats?.loginCount,
      member_since: userStats?.memberSince,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      connection_status: isOnline ? 'online' : 'offline'
    });
  }, []);

  // New Premium Access section render function
  const renderPremiumAccess = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold text-white">Premium Access Management</h2>
        <PremiumBadge size="md" />
      </div>

      <div className={`rounded-lg p-6 ${isPremiumUser() 
        ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
        : 'bg-gray-800 border border-orange-500/20'
      }`}>
        
        {/* If user is premium, show their access code */}
        {isPremiumUser() && session?.user?.accessCode && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Your Premium Access Code</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Share this code with others to grant them access to your premium content.
            </p>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type={showAccessCode ? "text" : "password"}
                  value={session.user.accessCode}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white font-mono text-center text-lg tracking-wider focus:outline-none focus:border-yellow-500"
                />
              </div>
              <button
                onClick={() => setShowAccessCode(!showAccessCode)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showAccessCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showAccessCode ? "Hide" : "Show"}</span>
              </button>
              <button
                onClick={copyAccessCode}
                className="flex items-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        )}

        {/* Access code input for all users */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">
              {isPremiumUser() ? "Add Additional Access" : "Enter Premium Access Code"}
            </h3>
          </div>
          <p className="text-gray-300 mb-4">
            {isPremiumUser() 
              ? "Enter another premium user's access code to gain access to their content." 
              : "Have a premium access code? Enter it here to access premium content."}
          </p>

          <form onSubmit={handleSubmitAccessCode} className="space-y-4">
            <div>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character access code"
                maxLength={8}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-orange-500 font-mono text-center text-lg tracking-wider"
              />
            </div>
            
            <button
              type="submit"
              disabled={accessCodeLoading || accessCode.length !== 8}
              className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {accessCodeLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>{accessCodeLoading ? "Processing..." : "Grant Access"}</span>
            </button>
          </form>
        </div>

        {/* Message display */}
        {accessCodeMessage && (
          <div className={`mt-4 p-4 rounded-lg text-sm ${
            accessCodeMessage.includes('granted') || accessCodeMessage.includes('copied')
              ? 'bg-green-800/50 border border-green-500 text-green-200'
              : 'bg-red-800/50 border border-red-500 text-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {accessCodeMessage.includes('granted') || accessCodeMessage.includes('copied') ? (
                <Star className="h-4 w-4 text-green-400" />
              ) : (
                <X className="h-4 w-4 text-red-400" />
              )}
              <span>{accessCodeMessage}</span>
            </div>
          </div>
        )}

        {/* Current access status */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="h-5 w-5 text-orange-500 mr-2" />
            Access Status
          </h4>
          <div className="space-y-3">
            <div className={`text-sm px-4 py-2 rounded-lg inline-flex items-center space-x-2 ${
              isPremiumUser() 
                ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-yellow-200' 
                : 'bg-gray-700 border border-gray-600 text-gray-300'
            }`}>
              {isPremiumUser() ? (
                <>
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span>Premium User</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Standard User</span>
                </>
              )}
            </div>
            
            {isPremiumUser() && (
              <div className="text-sm text-gray-300 bg-gray-700/50 rounded-lg p-3">
                <p className="font-medium text-yellow-400 mb-2">Premium Benefits Active:</p>
                <ul className="space-y-1 text-gray-300">
                  <li>• Advanced Analytics & Insights</li>
                  <li>• Priority Customer Support</li>
                  <li>• Exclusive Premium Content</li>
                  <li>• Access Code Sharing</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Header with Premium Badge */}
        <div className={`rounded-lg p-6 ${isPremiumUser() 
          ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30' 
          : 'bg-gray-800 border border-orange-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <PremiumBadge size="md" />
              </div>
              <p className="text-gray-300">
                {isPremiumUser() 
                  ? 'Enjoy your premium dashboard experience with advanced features.'
                  : 'You\'re using the standard version. Consider upgrading for more features!'
                }
              </p>
            </div>
            {!isPremiumUser() && (
              <button 
                onClick={handleUpgradeClick}
                data-gtm-event="upgrade_click"
                data-gtm-source="dashboard_overview"
                data-gtm-user-type="standard"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Upgrade to Premium</span>
              </button>
            )}
          </div>
        </div>

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

        {/* Stats Grid with Premium Enhancement */}
        {!loading && userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`rounded-lg p-6 transform hover:scale-105 transition-transform ${
              isPremiumUser() 
                ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
                : 'bg-gray-800 border border-orange-500/20'
              }`}
              onClick={() => handleStatsCardClick('login_count', userStats.loginCount)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Logins</p>
                  <p className="text-2xl font-bold text-white">{userStats.loginCount}</p>
                  {isPremiumUser() && (
                    <p className="text-yellow-400 text-xs mt-1">+Premium Analytics</p>
                  )}
                </div>
                <div className="relative">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg p-6 transform hover:scale-105 transition-transform ${
              isPremiumUser() 
                ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
                : 'bg-gray-800 border border-orange-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Last Login</p>
                  <p className="text-lg font-bold text-white">
                    {userStats?.lastLogin ? formatDate(userStats.lastLogin) : 'Unknown'}
                  </p>
                  {isPremiumUser() && (
                    <p className="text-yellow-400 text-xs mt-1">+Detailed History</p>
                  )}
                </div>
                <div className="relative">
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg p-6 transform hover:scale-105 transition-transform ${
              isPremiumUser() 
                ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
                : 'bg-gray-800 border border-orange-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-lg font-bold text-white">
                    {userStats?.memberSince ? formatDate(userStats.memberSince) : 'Unknown'}
                  </p>
                  {isPremiumUser() && (
                    <p className="text-yellow-400 text-xs mt-1">+Premium Member</p>
                  )}
                </div>
                <div className="relative">
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg p-6 transform hover:scale-105 transition-transform ${
              isPremiumUser() 
                ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
                : 'bg-gray-800 border border-orange-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Profile Views</p>
                  <p className="text-2xl font-bold text-white">{userStats.profileViews}</p>
                  {isPremiumUser() && (
                    <p className="text-yellow-400 text-xs mt-1">+Advanced Insights</p>
                  )}
                </div>
                <div className="relative">
                  <Eye className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Features Section (only show for premium users) */}
        {isPremiumUser() && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Crown className="h-5 w-5 text-yellow-500 mr-2" />
              Premium Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="text-center cursor-pointer p-2 rounded hover:bg-yellow-900/20 transition-colors"
                onClick={() => analytics.trackFeatureUsage('premium_analytics', 'viewed')}
              >
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-medium">Advanced Analytics</p>
                <p className="text-gray-300 text-sm">Detailed insights and reports</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-medium">Priority Support</p>
                <p className="text-gray-300 text-sm">24/7 premium assistance</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-medium">Exclusive Content</p>
                <p className="text-gray-300 text-sm">Access to premium features</p>
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
              {isPremiumUser() && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Premium features enabled</span>
                  <span className="text-yellow-400 ml-auto text-xs">ACTIVE</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-orange-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Account Type</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    isPremiumUser() 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {isPremiumUser() ? 'PREMIUM' : 'STANDARD'}
                  </span>
                  <PremiumBadge size="sm" showText={false} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Connection</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isOnline ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>
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
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          <PremiumBadge size="md" />
        </div>
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
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className={`rounded-lg p-6 ${isPremiumUser() 
        ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
        : 'bg-gray-800 border border-orange-500/20'
      }`}>
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
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
              <span>Account Role</span>
            </label>
            {isEditing ? (
              <select
                value={editedUser.role || ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="USER">Standard User</option>
                <option value="PREMIUM">Premium User</option>
                <option value="PREMIUM_USER">Premium User</option>
              </select>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="text-white">{user.role
                  ? user.role
                      .replace(/_/g, " ")              // replace underscores with spaces
                      .toLowerCase()                   // lowercase all
                      .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize words
                  : "Not set"}</p>
                  
                {isPremiumUser() && (
                  <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                    PREMIUM
                  </span>
                )}
              </div>
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

        {/* Premium-only profile features */}
        {isPremiumUser() && (
          <div className="mt-6 pt-6 border-t border-yellow-500/30">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Crown className="h-5 w-5 text-yellow-400 mr-2" />
              Premium Profile Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/20">
                <h5 className="text-white font-medium mb-2">Advanced Security</h5>
                <p className="text-gray-300 text-sm">Two-factor authentication and enhanced security options</p>
              </div>
              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/20">
                <h5 className="text-white font-medium mb-2">Custom Themes</h5>
                <p className="text-gray-300 text-sm">Personalize your dashboard with premium themes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <PremiumBadge size="md" />
        </div>
        {isPremiumUser() && (
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
            Premium Alerts
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg p-4 border-l-4 ${
              notification.type === 'info' ? 'bg-gray-800 border-blue-500' :
              notification.type === 'success' ? 'bg-gray-800 border-green-500' :
              'bg-gray-800 border-yellow-500'
            } ${isPremiumUser() ? 'bg-gradient-to-r from-gray-800 to-yellow-900/10' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-white">{notification.message}</p>
                  {isPremiumUser() && notification.type === 'success' && (
                    <Crown className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
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
        
        {isPremiumUser() && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <h4 className="text-white font-medium">Premium Notification Center</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Get advanced notifications, real-time alerts, and priority updates as a premium member.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Billing & Subscription</h2>
          <PremiumBadge size="md" />
        </div>
      </div>
      
      <div className={`rounded-lg p-6 ${isPremiumUser() 
        ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
        : 'bg-gray-800 border border-orange-500/20'
      }`}>
        {isPremiumUser() ? (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Premium Subscription Active</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-300 mb-2">Plan: <span className="text-yellow-400 font-medium">Premium</span></p>
                <p className="text-gray-300 mb-2">Status: <span className="text-green-400 font-medium">Active</span></p>
                <p className="text-gray-300">Next billing: <span className="text-white">Next month</span></p>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg">
                  Manage Subscription
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                  Download Invoices
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Upgrade to Premium</h3>
            <p className="text-gray-300 mb-6">
              Unlock advanced features, priority support, and exclusive content with our Premium plan.
            </p>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4">
                <h4 className="text-white font-bold text-lg">Premium Features</h4>
                <ul className="text-white text-sm mt-2 space-y-1">
                  <li>• Advanced Analytics & Insights</li>
                  <li>• Priority Customer Support</li>
                  <li>• Exclusive Premium Content</li>
                  <li>• Custom Dashboard Themes</li>
                  <li>• Advanced Security Features</li>
                  <li>• Access Code Sharing</li>
                </ul>
              </div>
              <button 
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 px-8 rounded-lg font-medium transition-all transform hover:scale-105">
                Upgrade Now - $9.99/month
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        <PremiumBadge size="md" />
      </div>
      
      <div className={`rounded-lg p-6 ${isPremiumUser() 
        ? 'bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30' 
        : 'bg-gray-800 border border-orange-500/20'
      }`}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Notifications</span>
                <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm">
                  Enabled
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Two-Factor Authentication</span>
                <button className={`px-3 py-1 rounded text-sm ${
                  isPremiumUser() 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {isPremiumUser() ? 'Available' : 'Premium Only'}
                </button>
              </div>
            </div>
          </div>

          {isPremiumUser() && (
            <div className="pt-6 border-t border-yellow-500/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Crown className="h-5 w-5 text-yellow-400 mr-2" />
                Premium Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Advanced Analytics</span>
                  <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                    Enabled
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Custom Theme</span>
                  <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                    Dark Premium
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Priority Support</span>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Active
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Access Code Sharing</span>
                  <button 
                    onClick={() => setActiveSection('access')}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'profile':
        return renderProfile();
      case 'access':
        return renderPremiumAccess();
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
        <div className={`w-64 min-h-screen border-r ${isPremiumUser() 
          ? 'bg-gradient-to-b from-gray-800 to-yellow-900/10 border-yellow-500/20' 
          : 'bg-gray-800 border-orange-500/20'
        }`}>
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                isPremiumUser() 
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
                  : 'bg-orange-600'
              }`}>
                {isPremiumUser() ? (
                  <Crown className="h-6 w-6 text-white" />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white truncate">
                    {user?.name || 'User'}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                {isPremiumUser() && (
                  <p className="text-xs text-yellow-400">Premium Member</p>
                )}
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
                        ? isPremiumUser() 
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                          : 'bg-orange-600 text-white'
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