# Login Fix Plan

## Problem Analysis
- Client uses Firebase Auth SDK directly (AuthContext.js)
- Server has auth routes but index.js loads wrong file (auth.routes.js instead of auth_routes.js)
- auth.routes.js only has test route, auth_routes.js has actual login/register routes
- API service expects /api/auth/login but server doesn't route it properly

## Solution
- Update server/index.js to use auth_routes.js instead of auth.routes.js
- Verify Firebase config and environment variables
- Test login flow

## Files to Edit
- server/index.js: Change require('./routes/auth.routes') to require('./routes/auth_routes')
- Verify server/config/firebase.config.js has correct env vars
- Test with existing user credentials
