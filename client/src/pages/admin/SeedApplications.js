import React, { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Embedded application data (works in production build)
const applicationsData = {
  "applications": [
    {
      "id": "APP_001",
      "applicationNumber": "NUL-2024-0001",
      "studentId": "student001",
      "studentName": "Thabo Molefe",
      "studentEmail": "thabo.molefe@student.ls",
      "studentPhone": "+266 5888 1001",
      "institutionId": "NUL_001",
      "institutionName": "National University of Lesotho",
      "courseId": "CS_001",
      "courseName": "Bachelor of Science in Computer Science",
      "applicationType": "undergraduate",
      "status": "pending",
      "applicationDate": "2024-10-15T08:30:00.000Z",
      "lastUpdated": "2024-10-15T08:30:00.000Z",
      "academicYear": "2024/2025",
      "semester": "First Semester",
      "qualifications": {
        "lgcseResults": {
          "English": "B",
          "Mathematics": "B",
          "Biology": "C",
          "Geography": "B",
          "Sesotho": "A",
          "Physics": "B",
          "Chemistry": "C"
        },
        "overallGrade": "B",
        "schoolName": "Maseru High School",
        "yearCompleted": 2024
      },
      "documents": {
        "transcript": "https://example.com/docs/thabo_transcript.pdf",
        "idCopy": "https://example.com/docs/thabo_id.pdf",
        "birthCertificate": "https://example.com/docs/thabo_birth_cert.pdf",
        "medicalCertificate": "https://example.com/docs/thabo_medical.pdf",
        "passport_photo": "https://example.com/docs/thabo_photo.jpg"
      },
      "personalStatement": "I am passionate about technology and innovation. I believe pursuing Computer Science will enable me to contribute to Lesotho's digital transformation...",
      "guardianInfo": {
        "name": "Lerato Molefe",
        "relationship": "Mother",
        "phone": "+266 5888 1000",
        "email": "lerato.molefe@email.ls"
      },
      "applicationFee": {
        "amount": 500,
        "currency": "LSL",
        "paid": true,
        "paymentDate": "2024-10-14T14:20:00.000Z",
        "referenceNumber": "PAY-NUL-20241014-001"
      },
      "reviewStatus": {
        "documentsVerified": false,
        "academicReview": "pending",
        "interviewRequired": true,
        "interviewDate": null
      },
      "notes": [],
      "priority": "normal",
      "createdAt": "2024-10-15T08:30:00.000Z",
      "updatedAt": "2024-10-15T08:30:00.000Z"
    },
    {
      "id": "APP_002",
      "applicationNumber": "LCE-2024-0023",
      "studentId": "student002",
      "studentName": "Palesa Nteso",
      "studentEmail": "palesa.nteso@student.ls",
      "studentPhone": "+266 5888 2002",
      "institutionId": "LCE_001",
      "institutionName": "Lesotho College of Education",
      "courseId": "EDU_001",
      "courseName": "Bachelor of Education - Primary",
      "applicationType": "undergraduate",
      "status": "under_review",
      "applicationDate": "2024-09-20T10:15:00.000Z",
      "lastUpdated": "2024-10-10T14:30:00.000Z",
      "academicYear": "2024/2025",
      "semester": "First Semester",
      "qualifications": {
        "lgcseResults": {
          "English": "A",
          "Mathematics": "B",
          "Biology": "B",
          "Geography": "A",
          "Sesotho": "A",
          "History": "B",
          "Agriculture": "C"
        },
        "overallGrade": "A-",
        "schoolName": "St. Mary's High School",
        "yearCompleted": 2024
      },
      "documents": {
        "transcript": "https://example.com/docs/palesa_transcript.pdf",
        "idCopy": "https://example.com/docs/palesa_id.pdf",
        "birthCertificate": "https://example.com/docs/palesa_birth_cert.pdf",
        "medicalCertificate": "https://example.com/docs/palesa_medical.pdf",
        "passport_photo": "https://example.com/docs/palesa_photo.jpg"
      },
      "personalStatement": "Teaching has always been my calling. I want to shape young minds and contribute to improving education standards in Lesotho...",
      "guardianInfo": {
        "name": "Thabiso Nteso",
        "relationship": "Father",
        "phone": "+266 5888 2000",
        "email": "thabiso.nteso@email.ls"
      },
      "applicationFee": {
        "amount": 450,
        "currency": "LSL",
        "paid": true,
        "paymentDate": "2024-09-19T16:45:00.000Z",
        "referenceNumber": "PAY-LCE-20240919-023"
      },
      "reviewStatus": {
        "documentsVerified": true,
        "academicReview": "approved",
        "interviewRequired": true,
        "interviewDate": "2024-10-25T09:00:00.000Z"
      },
      "notes": [
        {
          "author": "Admissions Officer",
          "note": "Excellent academic record. Strong candidate.",
          "date": "2024-10-10T14:30:00.000Z"
        }
      ],
      "priority": "high",
      "createdAt": "2024-09-20T10:15:00.000Z",
      "updatedAt": "2024-10-10T14:30:00.000Z"
    },
    {
      "id": "APP_003",
      "applicationNumber": "IDM-2024-0045",
      "studentId": "student003",
      "studentName": "Mpho Sekhonyana",
      "studentEmail": "mpho.sekhonyana@student.ls",
      "studentPhone": "+266 5888 3003",
      "institutionId": "IDM_001",
      "institutionName": "Institute of Development Management",
      "courseId": "BUS_001",
      "courseName": "Bachelor of Business Administration",
      "applicationType": "undergraduate",
      "status": "accepted",
      "applicationDate": "2024-08-10T11:00:00.000Z",
      "lastUpdated": "2024-09-15T10:00:00.000Z",
      "academicYear": "2024/2025",
      "semester": "First Semester",
      "qualifications": {
        "lgcseResults": {
          "English": "B",
          "Mathematics": "A",
          "Biology": "C",
          "Geography": "B",
          "Sesotho": "B",
          "Business Studies": "A",
          "Economics": "B"
        },
        "overallGrade": "B+",
        "schoolName": "Leribe High School",
        "yearCompleted": 2024
      },
      "documents": {
        "transcript": "https://example.com/docs/mpho_transcript.pdf",
        "idCopy": "https://example.com/docs/mpho_id.pdf",
        "birthCertificate": "https://example.com/docs/mpho_birth_cert.pdf",
        "medicalCertificate": "https://example.com/docs/mpho_medical.pdf",
        "passport_photo": "https://example.com/docs/mpho_photo.jpg"
      },
      "personalStatement": "I aspire to become an entrepreneur and contribute to economic development in Lesotho...",
      "guardianInfo": {
        "name": "Mamello Sekhonyana",
        "relationship": "Mother",
        "phone": "+266 5888 3000",
        "email": "mamello.sekhonyana@email.ls"
      },
      "applicationFee": {
        "amount": 600,
        "currency": "LSL",
        "paid": true,
        "paymentDate": "2024-08-09T12:30:00.000Z",
        "referenceNumber": "PAY-IDM-20240809-045"
      },
      "reviewStatus": {
        "documentsVerified": true,
        "academicReview": "approved",
        "interviewRequired": true,
        "interviewDate": "2024-08-30T14:00:00.000Z",
        "interviewCompleted": true,
        "interviewScore": 85
      },
      "notes": [
        {
          "author": "Admissions Committee",
          "note": "Strong business acumen. Recommended for acceptance.",
          "date": "2024-09-10T11:00:00.000Z"
        }
      ],
      "acceptanceDetails": {
        "acceptedDate": "2024-09-15T10:00:00.000Z",
        "registrationDeadline": "2024-10-30T23:59:59.000Z",
        "studentNumber": "IDM-2024-BBA-045",
        "tuitionFee": 18000,
        "scholarshipAwarded": false
      },
      "priority": "high",
      "createdAt": "2024-08-10T11:00:00.000Z",
      "updatedAt": "2024-09-15T10:00:00.000Z"
    },
    {
      "id": "APP_004",
      "applicationNumber": "NUL-2024-0112",
      "studentId": "student004",
      "studentName": "Lineo Mokhele",
      "studentEmail": "lineo.mokhele@student.ls",
      "studentPhone": "+266 5888 4004",
      "institutionId": "NUL_001",
      "institutionName": "National University of Lesotho",
      "courseId": "LAW_001",
      "courseName": "Bachelor of Laws (LLB)",
      "applicationType": "undergraduate",
      "status": "rejected",
      "applicationDate": "2024-09-01T09:30:00.000Z",
      "lastUpdated": "2024-10-05T15:20:00.000Z",
      "academicYear": "2024/2025",
      "semester": "First Semester",
      "qualifications": {
        "lgcseResults": {
          "English": "C",
          "Mathematics": "D",
          "Biology": "C",
          "Geography": "C",
          "Sesotho": "B",
          "History": "C",
          "Religious Studies": "B"
        },
        "overallGrade": "C",
        "schoolName": "Quthing High School",
        "yearCompleted": 2024
      },
      "documents": {
        "transcript": "https://example.com/docs/lineo_transcript.pdf",
        "idCopy": "https://example.com/docs/lineo_id.pdf",
        "birthCertificate": "https://example.com/docs/lineo_birth_cert.pdf"
      },
      "personalStatement": "I have always been interested in law and justice...",
      "guardianInfo": {
        "name": "Thabo Mokhele",
        "relationship": "Father",
        "phone": "+266 5888 4000",
        "email": "thabo.mokhele@email.ls"
      },
      "applicationFee": {
        "amount": 500,
        "currency": "LSL",
        "paid": true,
        "paymentDate": "2024-08-31T13:15:00.000Z",
        "referenceNumber": "PAY-NUL-20240831-112"
      },
      "reviewStatus": {
        "documentsVerified": true,
        "academicReview": "rejected",
        "interviewRequired": false
      },
      "rejectionDetails": {
        "rejectedDate": "2024-10-05T15:20:00.000Z",
        "reason": "Does not meet minimum academic requirements for LLB program.",
        "appealDeadline": "2024-10-20T23:59:59.000Z",
        "alternativeCourses": ["Bachelor of Arts in Law", "Diploma in Legal Studies"]
      },
      "notes": [
        {
          "author": "Admissions Officer",
          "note": "Academic qualifications below requirements.",
          "date": "2024-10-05T15:20:00.000Z"
        }
      ],
      "priority": "normal",
      "createdAt": "2024-09-01T09:30:00.000Z",
      "updatedAt": "2024-10-05T15:20:00.000Z"
    }
  ]
};

const SeedApplications = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [seeded, setSeeded] = useState(false);
  const [results, setResults] = useState([]);

  const seedApplications = async () => {
    setLoading(true);
    setSeeded(false);
    setResults([]);
    
    const applications = applicationsData.applications;
    setProgress({ current: 0, total: applications.length });

    const seedResults = [];

    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      
      try {
        // Convert date strings to Firestore timestamps
        const appData = {
          ...app,
          applicationDate: new Date(app.applicationDate),
          lastUpdated: new Date(app.lastUpdated),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        // Convert payment date if exists
        if (app.applicationFee?.paymentDate) {
          appData.applicationFee.paymentDate = new Date(app.applicationFee.paymentDate);
        }

        // Convert interview date if exists
        if (app.reviewStatus?.interviewDate) {
          appData.reviewStatus.interviewDate = new Date(app.reviewStatus.interviewDate);
        }

        // Convert acceptance date if exists
        if (app.acceptanceDetails?.acceptedDate) {
          appData.acceptanceDetails.acceptedDate = new Date(app.acceptanceDetails.acceptedDate);
          appData.acceptanceDetails.registrationDeadline = new Date(app.acceptanceDetails.registrationDeadline);
        }

        // Convert rejection date if exists
        if (app.rejectionDetails?.rejectedDate) {
          appData.rejectionDetails.rejectedDate = new Date(app.rejectionDetails.rejectedDate);
          appData.rejectionDetails.appealDeadline = new Date(app.rejectionDetails.appealDeadline);
        }

        // Convert waitlist date if exists
        if (app.waitlistDetails?.waitlistedDate) {
          appData.waitlistDetails.waitlistedDate = new Date(app.waitlistDetails.waitlistedDate);
          appData.waitlistDetails.notificationDeadline = new Date(app.waitlistDetails.notificationDeadline);
        }

        // Convert notes dates
        if (app.notes && app.notes.length > 0) {
          appData.notes = app.notes.map(note => ({
            ...note,
            date: new Date(note.date)
          }));
        }

        await setDoc(doc(db, 'applications', app.id), appData);

        seedResults.push({
          id: app.id,
          name: app.studentName,
          status: 'success',
          message: 'Seeded successfully'
        });

        setProgress({ current: i + 1, total: applications.length });
        
      } catch (error) {
        console.error(`Error seeding application ${app.id}:`, error);
        seedResults.push({
          id: app.id,
          name: app.studentName,
          status: 'error',
          message: error.message
        });
      }
    }

    setResults(seedResults);
    setLoading(false);
    setSeeded(true);

    const successCount = seedResults.filter(r => r.status === 'success').length;
    if (successCount === applications.length) {
      toast.success(`All ${successCount} applications seeded successfully!`);
    } else {
      toast.warning(`${successCount}/${applications.length} applications seeded. Check results.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seed Application Data
          </h1>
          <p className="text-gray-600 mb-6">
            Add sample student applications to Firebase Firestore for testing
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What will be seeded:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✅ 4 Sample student applications</li>
              <li>✅ Different statuses: Pending, Under Review, Accepted, Rejected</li>
              <li>✅ Complete application details (documents, qualifications, fees)</li>
              <li>✅ Guardian info, personal statements, notes</li>
              <li>✅ Status-specific details (acceptance letters, rejection reasons, waitlist positions)</li>
            </ul>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-xs text-gray-600">Total Applications</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-xs text-gray-600">Accepted</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-xs text-gray-600">Under Review</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Seeding applications...</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Seed Button */}
          {!seeded && (
            <button
              onClick={seedApplications}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
            >
              {loading ? 'Seeding Applications...' : 'Seed Applications Data'}
            </button>
          )}

          {/* Results */}
          {seeded && results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seeding Results:</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{result.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({result.id})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.status === 'success' ? (
                          <span className="text-green-600 text-sm">✓ Success</span>
                        ) : (
                          <span className="text-red-600 text-sm">✗ Failed</span>
                        )}
                      </div>
                    </div>
                    {result.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{result.message}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => window.location.href = '/admin/applications'}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  View Applications
                </button>
                <button
                  onClick={() => {
                    setSeeded(false);
                    setResults([]);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Seed Again
                </button>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This will add new application documents to your Firestore database.
              If applications with these IDs already exist, they will be overwritten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedApplications;
