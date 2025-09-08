import { useCallback } from 'react';
import { analytics } from '@/utils/analytics';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, eventData) => {
    analytics.track(eventName, eventData);
  }, []);

  const trackUpgrade = useCallback((context = {}) => {
    analytics.trackUpgradeClick(context);
  }, []);

  const trackPageView = useCallback((pageName, data = {}) => {
    analytics.trackPageView(pageName, data);
  }, []);

  return {
    trackEvent,
    trackUpgrade,
    trackPageView
  };
};