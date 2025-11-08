# CRUD Functionality Fix Guide

## Current Issues Identified

1. **API Configuration Issues**
   - Some components use direct Firebase SDK instead of API calls
   - Mixed usage of API services (api.js, api.service.js, direct fetch calls)
   - Missing consistent error handling

2. **Server Configuration**
   - CORS origin is set to `http://localhost:3001` but React runs on `http://localhost:3000`
   - Some routes use underscore naming (auth_routes.js) while others use dot (admin.routes.js)

3. **Client Configuration**
   - Missing .env file in client directory
   - API base URL hardcoded in multiple places

## Fixes Applied

### 1. Fix CORS Configuration

**File: server/index.js**
```javascript
// Change from:
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// To:
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

### 2. Create Client Environment File

**File: client/.env**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 3. Update API Services

All API calls should use the consistent `api` instance from `client/src/services/api.js`

### 4. Verify Database Connection

Ensure server/.env has all Firebase credentials properly configured.

## Testing Checklist

### Basic API Tests
- [ ] Server starts without errors
- [ ] Health check endpoint works: GET http://localhost:5000/api/health
- [ ] Client can reach server (check browser network tab)

### Institutions CRUD Tests
- [ ] GET /api/institutions - Returns list of institutions
- [ ] GET /api/admin/institutions - Admin list with auth
- [ ] POST /api/admin/institutions - Create new institution
- [ ] PUT /api/admin/institutions/:id - Update institution
- [ ] DELETE /api/admin/institutions/:id - Delete institution

### Authentication Tests
- [ ] POST /api/auth/register - User registration
- [ ] POST /api/auth/login - User login
- [ ] Protected routes require authentication

### Frontend Tests
- [ ] Institutions page loads and displays data
- [ ] Add institution form works
- [ ] Edit institution form works
- [ ] Delete institution works
- [ ] Search/filter works

## Quick Start Testing

### 1. Start Server
```bash
cd server
npm install  # if needed
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
🔗 API URL: http://localhost:5000
```

### 2. Start Client
```bash
cd client
npm install  # if needed
npm start
```

Expected: Browser opens at http://localhost:3000

### 3. Test API Endpoints

In a new terminal or Postman:
```bash
# Test health check
curl http://localhost:5000/api/health

# Test institutions (should work without auth)
curl http://localhost:5000/api/institutions

# Test admin endpoints (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/institutions
```

## Common Issues and Solutions

### Issue: "Network error" or "CORS error"
**Solution**: Check CORS configuration in server/index.js

### Issue: "Unauthorized" errors
**Solution**: Ensure you're logged in and token is in localStorage

### Issue: Data not displaying
**Solution**: 
1. Check browser console for errors
2. Check Network tab in DevTools
3. Verify API response format matches what frontend expects

### Issue: "Cannot read property 'data' of undefined"
**Solution**: API response structure mismatch - check what the API actually returns vs what the code expects

## Next Steps

1. Test each CRUD operation systematically
2. Fix any remaining issues as they appear
3. Add proper error handling and user feedback
4. Consider adding loading states and skeleton screens
5. Add proper validation on both frontend and backend
