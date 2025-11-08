# TODO: Fix "Failed to load jobs" Issue

## Current Status
- Job routes only have test endpoint, not using job controller
- Client API service lacks job-related methods
- Public jobs endpoint in index.js fetches directly from Firebase
- Client components use direct Firebase calls
- Potential Firebase permission issues

## Tasks
- [ ] Update server/routes/job.routes.js to use job controller with all CRUD routes
- [ ] Add job API methods to client/src/services/api.js
- [ ] Remove direct Firebase call from server/index.js and use controller
- [ ] Check and fix Firebase permissions in firestore.rules if needed
- [ ] Update client components to use API instead of direct Firebase calls
- [ ] Test job loading functionality
- [ ] Verify API endpoints work correctly

## Files to Edit
- server/routes/job.routes.js
- client/src/services/api.js
- server/index.js
- firestore.rules (if needed)
- client/src/pages/student/JobBrowser.js
- client/src/services/crudService.js
- client/src/pages/student/StudentDashboard.js
- client/src/pages/company/CompanyDashboardWorking.js
