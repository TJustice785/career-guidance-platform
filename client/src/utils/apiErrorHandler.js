/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from the API call
 * @param {string} defaultMessage - Default error message if none is provided
 * @returns {Object} - Object containing error message and status code
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  // Handle network errors
  if (!error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      status: 0,
      isNetworkError: true
    };
  }

  const { status, data } = error.response;
  let message = defaultMessage;

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      message = data.message || 'Bad request. Please check your input.';
      break;
    case 401:
      message = 'Your session has expired. Please log in again.';
      // Optionally handle logout here
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      break;
    case 403:
      message = 'You do not have permission to perform this action.';
      break;
    case 404:
      message = 'The requested resource was not found.';
      break;
    case 409:
      message = data.message || 'A conflict occurred with the current state of the resource.';
      break;
    case 422:
      // Handle validation errors
      if (data.errors) {
        return {
          message: 'Validation failed',
          errors: data.errors,
          status,
          isValidationError: true
        };
      }
      message = data.message || 'Validation failed';
      break;
    case 500:
      message = 'An internal server error occurred. Please try again later.';
      break;
    default:
      message = data.message || defaultMessage;
  }

  return {
    message,
    status,
    data: data || {}
  };
};

/**
 * Handles form validation errors from the API
 * @param {Object} error - The error object from the API
 * @param {Function} setFieldError - Formik's setFieldError function
 */
export const handleFormErrors = (error, setFieldError) => {
  if (error.isValidationError && error.errors) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        setFieldError(field, messages.join(' '));
      } else {
        setFieldError(field, messages);
      }
    });
  }
};

/**
 * Shows a toast notification for API errors
 * @param {Object} error - The error object from handleApiError
 * @param {Function} toast - Toast notification function (e.g., from react-toastify)
 */
export const showErrorNotification = (error, toast) => {
  if (error.isNetworkError) {
    toast.error(error.message);
  } else if (error.isValidationError) {
    toast.error('Please fix the form errors');
  } else {
    toast.error(error.message);
  }
};
