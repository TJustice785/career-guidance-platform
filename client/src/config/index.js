const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  
  // Authentication
  TOKEN_KEY: 'career_portal_token',
  REFRESH_TOKEN_KEY: 'career_portal_refresh_token',
  TOKEN_EXPIRY_BUFFER: 300, // 5 minutes in seconds
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  
  // UI Configuration
  APP_NAME: 'Career Portal',
  DEFAULT_THEME: 'light',
  
  // Notifications
  NOTIFICATION_TIMEOUT: 5000, // 5 seconds
  
  // Form Validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Date & Time
  DATE_FORMAT: 'DD/MM/YYYY',
  DATE_TIME_FORMAT: 'DD/MM/YYYY HH:mm',
  
  // Feature Flags
  FEATURES: {
    REGISTRATION: process.env.REACT_APP_FEATURE_REGISTRATION !== 'false',
    PASSWORD_RESET: process.env.REACT_APP_FEATURE_PASSWORD_RESET !== 'false',
    EMAIL_VERIFICATION: process.env.REACT_APP_FEATURE_EMAIL_VERIFICATION !== 'false',
    SOCIAL_LOGIN: process.env.REACT_APP_FEATURE_SOCIAL_LOGIN === 'true',
    FILE_UPLOAD: process.env.REACT_APP_FEATURE_FILE_UPLOAD !== 'false',
  },
  
  // External Services
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID || '',
  LINKEDIN_CLIENT_ID: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
  
  // Analytics
  GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID || '',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
};

// Export individual constants for easier imports
export const {
  API_BASE_URL,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_EXPIRY_BUFFER,
  DEFAULT_PAGE_SIZE,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  APP_NAME,
  DEFAULT_THEME,
  NOTIFICATION_TIMEOUT,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  FEATURES,
  GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID,
  LINKEDIN_CLIENT_ID,
  GA_TRACKING_ID,
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TEST,
} = config;

export default config;
