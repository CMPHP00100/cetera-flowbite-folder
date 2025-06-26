// create-event.js - Fixed version
import { useState } from 'react';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: ''
  });
  
  // Add this missing state variable
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!data.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!data.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!data.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!data.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm(formData)) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    setResponse(null);
    
    try {
      const apiUrl = getApiUrl();
      
      console.log('Posting to:', `${apiUrl}/api/events`);
      
      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (result.success) {
        console.log('Event created successfully:', result.event);
        // Reset form
        setFormData({
          title: '',
          description: '',
          location: '',
          startTime: '',
          endTime: ''
        });
        setErrors({});
        setResponse({
          success: true,
          message: 'Event created successfully!'
        });
      } else {
        console.error('Failed to create event:', result.error);
        setResponse({
          success: false,
          error: result.error || 'Failed to create event'
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setResponse({
        success: false,
        error: 'Error creating event. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApiUrl = () => {
    return process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_PROD_API_URL 
      : process.env.NEXT_PUBLIC_DEV_API_URL;
  };

  return (
    <div className="h-full relative bg-white p-4 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Create Event</h1>

      {/* Environment Info */}
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}<br/>
        <strong>API URL:</strong> {getApiUrl()}
      </div>

      {/* Entering Events */}
      <div className="mb-4 mt-16">
        <form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
          {/* Form Fields */}
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Event title..."
            value={formData.title}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`mb-2 w-full rounded-lg border p-3 disabled:opacity-50 ${
              errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100'
            }`}
            required
          />
          {errors.title && <p className="mb-2 text-sm text-red-600">{errors.title}</p>}
          
          <textarea
            id="description"
            name="description"
            placeholder="Event description..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
            rows={3}
            className={`mb-2 w-full rounded-lg border p-3 disabled:opacity-50 resize-vertical ${
              errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100'
            }`}
            required
          />
          {errors.description && <p className="mb-2 text-sm text-red-600">{errors.description}</p>}
          
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Event location..."
            value={formData.location}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`mb-2 w-full rounded-lg border p-3 disabled:opacity-50 ${
              errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100'
            }`}
            required
          />
          {errors.location && <p className="mb-2 text-sm text-red-600">{errors.location}</p>}
          
          <div className="mx-auto mb-2 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Start time:
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="start-time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`mb-2 block w-full rounded-lg border p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 disabled:opacity-50 ${
                    errors.startTime ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100'
                  }`}
                  required
                />
              </div>
              {errors.startTime && <p className="text-sm text-red-600">{errors.startTime}</p>}
            </div>
            <div>
              <label
                htmlFor="end-time"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                End time:
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="end-time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`mb-2 block w-full rounded-lg border p-3 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 disabled:opacity-50 ${
                    errors.endTime ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100'
                  }`}
                  required
                />
              </div>
              {errors.endTime && <p className="text-sm text-red-600">{errors.endTime}</p>}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Event..." : "Add Event"}
          </button>
        </form>

        {/* Response Message */}
        {response && (
          <div className="mt-4 mx-auto max-w-sm">
            <div
              className={`p-3 rounded-lg text-sm ${
                response.success 
                  ? "bg-green-100 text-green-800 border border-green-300" 
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {response.success ? (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {response.message}
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {response.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validation Error Summary */}
        {(errors && Object.keys(errors).length > 0) && (
          <div className="mt-4 mx-auto max-w-sm">
            <div className="p-3 rounded-lg text-sm bg-red-100 text-red-800 border border-red-300">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please correct the errors above
              </div>
            </div>
          </div>
        )}
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 mx-auto max-w-sm p-2 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Debug Info:</strong><br/>
            Submitting: {isSubmitting.toString()}<br/>
            Response: {JSON.stringify(response, null, 2)}<br/>
            Form Data: {JSON.stringify(formData, null, 2)}<br/>
            Errors: {JSON.stringify(errors, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}