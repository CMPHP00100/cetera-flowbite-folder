// utils/analytics.js - Centralized analytics utility
export const analytics = {
  // Safe dataLayer push that works before GTM is installed
  track: (eventName, eventData = {}) => {
    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      
      // Push event to dataLayer
      window.dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        page_location: window.location.href,
        page_title: document.title,
        ...eventData
      });

      // Optional: Console log for development (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventName, eventData);
      }
    }
  },

  // Specific tracking methods for common events
  trackUpgradeClick: (context = {}) => {
    analytics.track('upgrade_button_click', {
      event_category: 'engagement',
      event_action: 'upgrade_intent',
      event_label: 'premium_upgrade',
      ...context
    });
  },

  trackPageView: (pageName, additionalData = {}) => {
    analytics.track('page_view', {
      page_name: pageName,
      ...additionalData
    });
  },

  trackUserAction: (action, category = 'user_interaction', additionalData = {}) => {
    analytics.track('user_action', {
      event_category: category,
      event_action: action,
      ...additionalData
    });
  },

  trackEngagement: (action, element, additionalData = {}) => {
    analytics.track('user_engagement', {
      event_category: 'engagement',
      event_action: action,
      element_type: element,
      ...additionalData
    });
  },
  trackFunnelStep: (step, stepName, additionalData = {}) => {
    analytics.track('funnel_progression', {
      event_category: 'conversion',
      funnel_step: step,
      step_name: stepName,
      ...additionalData
    });
  },
};