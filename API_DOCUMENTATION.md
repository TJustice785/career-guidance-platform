# Career Guidance Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Public Endpoints (No Authentication Required)

### Get All Institutions
```http
GET /api/institutions
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for filtering
- `status` (optional): Filter by status ('active', 'inactive', 'all')

**Response:**
```json
{
  "success": true,
  "status": "success",
  "data": [
    {
      "id": "institution_id",
      "name": "National University of Lesotho",
      "description": "Premier institution of higher learning",
      "address": "Roma, Lesotho",
      "phone": "+266 2234 0601",
      "website": "https://www.nul.ls",
      "email": "info@nul.ls",
      "logoUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Get Institution Courses
```http
GET /api/institutions/:id
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "course_id",
      "name": "Computer Science",
      "description": "Bachelor of Science in Computer Science",
      "duration": "4 years",
      "requirements": {},
      "isActive": true
    }
  ]
}
```

---

## Admin Endpoints

### Create Institution
```http
POST /api/admin/institutions
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Institution Name",
  "description": "Description",
  "address": "Address",
  "phone": "+266 1234 5678",
  "website": "https://example.com",
  "email": "info@example.com",
  "logoUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Institution added successfully",
  "data": {
    "id": "institution_id",
    ...
  }
}
```

### Update Institution
```http
PUT /api/admin/institutions/:id
```

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  ...
}
```

### Get All Institutions (Admin)
```http
GET /api/admin/institutions
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search term
- `status` (optional): Filter by status

### Get Institution by ID
```http
GET /api/admin/institutions/:id
```

### Toggle Institution Status
```http
PATCH /api/admin/institutions/:id/toggle-status
```

---

## Student Endpoints

### Get Institutions (Student)
```http
GET /api/student/institutions
```

**Headers:**
- `Authorization: Bearer <student_token>`

### Get Institution Courses
```http
GET /api/student/institutions/:institutionId/courses
```

### Apply for Course
```http
POST /api/student/apply
```

**Request Body:**
```json
{
  "institutionId": "institution_id",
  "courseId": "course_id",
  "qualifications": {
    "grade": "A",
    "subjects": ["Math", "Science"]
  }
}
```

### Get My Applications
```http
GET /api/student/applications
```

### Get My Admissions
```http
GET /api/student/admissions
```

### Accept Admission
```http
POST /api/student/admissions/:admissionId/accept
```

### Upload Document
```http
POST /api/student/documents/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `document`: File (PDF, JPEG, PNG - max 5MB)
- `documentType`: string
- `description`: string (optional)

### Get My Documents
```http
GET /api/student/documents
```

### Delete Document
```http
DELETE /api/student/documents/:documentId
```

### Upload Transcript
```http
POST /api/student/transcript/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `transcript`: File (PDF, JPEG, PNG - max 5MB)

### Upload Certificate
```http
POST /api/student/certificates/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `certificate`: File
- `certificateName`: string
- `issuer`: string
- `issueDate`: string

### Get Available Jobs
```http
GET /api/student/jobs
```

### Apply for Job
```http
POST /api/student/jobs/:jobId/apply
```

**Request Body:**
```json
{
  "coverLetter": "Cover letter text",
  "additionalInfo": "Additional information"
}
```

### Get My Job Applications
```http
GET /api/student/job-applications
```

### Get Notifications
```http
GET /api/student/notifications
```

### Mark Notification as Read
```http
PUT /api/student/notifications/:notificationId/read
```

---

## Company Endpoints

### Create Job
```http
POST /api/company/jobs
```

**Headers:**
- `Authorization: Bearer <company_token>`

**Request Body:**
```json
{
  "title": "Software Developer",
  "description": "Job description",
  "requirements": {},
  "location": "Maseru, Lesotho",
  "employmentType": "full-time",
  "salaryRange": "M10,000 - M15,000",
  "deadline": "2024-12-31",
  "qualifications": {
    "degreeLevel": "Bachelor's",
    "fieldOfStudy": "Computer Science"
  },
  "skillsRequired": ["JavaScript", "React", "Node.js"]
}
```

### Get My Jobs
```http
GET /api/company/jobs
```

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')

### Update Job
```http
PUT /api/company/jobs/:jobId
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  ...
}
```

### Delete Job
```http
DELETE /api/company/jobs/:jobId
```

### Get Job Applications
```http
GET /api/company/jobs/:jobId/applications
```

**Query Parameters:**
- `status` (optional): Filter by application status
- `search` (optional): Search term
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sortBy` (optional): Sort field
- `sortOrder` (optional): 'asc' or 'desc'

### Update Application Status
```http
PUT /api/company/applications/:applicationId
```

**Request Body:**
```json
{
  "status": "shortlisted",
  "feedback": "Optional feedback message"
}
```

**Status Options:**
- `pending`
- `reviewed`
- `shortlisted`
- `interview`
- `hired`
- `rejected`

### Get Dashboard Stats
```http
GET /api/company/dashboard/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalJobs": 10,
    "activeJobs": 5,
    "totalApplications": 50,
    "newApplications": 10,
    "shortlisted": 15,
    "hired": 5
  }
}
```

---

## Institute Endpoints

### Get My Courses
```http
GET /api/institute/courses
```

### Create Course
```http
POST /api/institute/courses
```

**Request Body:**
```json
{
  "name": "Computer Science",
  "description": "Bachelor of Science in Computer Science",
  "duration": "4 years",
  "requirements": {
    "minimumGrade": "C",
    "subjects": ["Math", "Science"]
  },
  "isActive": true
}
```

### Update Course
```http
PUT /api/institute/courses/:courseId
```

### Delete Course
```http
DELETE /api/institute/courses/:courseId
```

### Get Course Applications
```http
GET /api/institute/courses/:courseId/applications
```

### Update Application Status
```http
PUT /api/institute/applications/:applicationId
```

**Request Body:**
```json
{
  "status": "admitted"
}
```

**Status Options:**
- `pending`
- `under_review`
- `admitted`
- `rejected`
- `waiting_list`

### Create Admission
```http
POST /api/institute/admissions
```

### Get Admitted Students
```http
GET /api/institute/admissions
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Limit:** 100 requests per 15 minutes per IP address
- **Response when limit exceeded:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## File Uploads

File upload endpoints accept the following:

**Supported Formats:**
- PDF
- JPEG
- PNG

**Maximum File Size:** 5MB

**Content-Type:** `multipart/form-data`

---

## Testing

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Endpoints
Each module has a test endpoint:
- `GET /api/auth/test`
- `GET /api/admin/test`
- `GET /api/student/test`
- `GET /api/company/test`
- `GET /api/institute/test`

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All endpoints return JSON responses
3. Authentication tokens expire after 24 hours
4. File uploads are stored in Firebase Storage
5. Database operations use Firebase Firestore

---

## Support

For API support or questions, contact: support@careerpath.com
