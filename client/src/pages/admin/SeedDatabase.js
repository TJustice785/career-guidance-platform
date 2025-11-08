import React, { useState } from 'react';
import { seedAllData, seedInstitutions, seedCourses, seedJobs, seedCareerTips, seedCompanies } from '../../utils/seedDatabase';

const SeedDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeedAll = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await seedAllData();
      setMessage('✅ All data seeded successfully!');
    } catch (err) {
      setError('❌ Error seeding data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedSpecific = async (seedFunction, name) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await seedFunction();
      setMessage(`✅ ${name} seeded successfully!`);
    } catch (err) {
      setError(`❌ Error seeding ${name}: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D2D6D8] via-[#A4A8A5] to-[#747877] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#252525] mb-2">🌱 Database Seeder</h1>
          <p className="text-[#4E4F4B] mb-8">Populate your Firestore database with sample data</p>

          {/* Messages */}
          {message && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-lg mb-6">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-rose-100 border border-rose-400 text-rose-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Seed All Button */}
          <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl border-2 border-indigo-200">
            <h2 className="text-xl font-bold text-[#252525] mb-3">Seed All Data</h2>
            <p className="text-[#4E4F4B] mb-4">
              This will populate your database with sample institutions, courses, jobs, career tips, and companies.
            </p>
            <button
              onClick={handleSeedAll}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Seeding...' : '🚀 Seed All Data'}
            </button>
          </div>

          {/* Individual Seed Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#252525] mb-4">Or Seed Individual Collections</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institutions */}
              <div className="p-4 bg-[#D2D6D8]/50 rounded-lg">
                <h3 className="font-bold text-[#252525] mb-2">🏛️ Institutions</h3>
                <p className="text-sm text-[#4E4F4B] mb-3">Add 3 sample institutions</p>
                <button
                  onClick={() => handleSeedSpecific(seedInstitutions, 'Institutions')}
                  disabled={loading}
                  className="bg-[#A4A8A5] text-[#252525] px-4 py-2 rounded-lg font-medium hover:bg-[#747877] transition disabled:opacity-50 w-full"
                >
                  Seed Institutions
                </button>
              </div>

              {/* Courses */}
              <div className="p-4 bg-[#D2D6D8]/50 rounded-lg">
                <h3 className="font-bold text-[#252525] mb-2">📚 Courses</h3>
                <p className="text-sm text-[#4E4F4B] mb-3">Add 3 sample courses</p>
                <button
                  onClick={() => handleSeedSpecific(seedCourses, 'Courses')}
                  disabled={loading}
                  className="bg-[#A4A8A5] text-[#252525] px-4 py-2 rounded-lg font-medium hover:bg-[#747877] transition disabled:opacity-50 w-full"
                >
                  Seed Courses
                </button>
              </div>

              {/* Jobs */}
              <div className="p-4 bg-[#D2D6D8]/50 rounded-lg">
                <h3 className="font-bold text-[#252525] mb-2">💼 Jobs</h3>
                <p className="text-sm text-[#4E4F4B] mb-3">Add 3 sample job listings</p>
                <button
                  onClick={() => handleSeedSpecific(seedJobs, 'Jobs')}
                  disabled={loading}
                  className="bg-[#A4A8A5] text-[#252525] px-4 py-2 rounded-lg font-medium hover:bg-[#747877] transition disabled:opacity-50 w-full"
                >
                  Seed Jobs
                </button>
              </div>

              {/* Career Tips */}
              <div className="p-4 bg-[#D2D6D8]/50 rounded-lg">
                <h3 className="font-bold text-[#252525] mb-2">💡 Career Tips</h3>
                <p className="text-sm text-[#4E4F4B] mb-3">Add 3 career tips</p>
                <button
                  onClick={() => handleSeedSpecific(seedCareerTips, 'Career Tips')}
                  disabled={loading}
                  className="bg-[#A4A8A5] text-[#252525] px-4 py-2 rounded-lg font-medium hover:bg-[#747877] transition disabled:opacity-50 w-full"
                >
                  Seed Career Tips
                </button>
              </div>

              {/* Companies */}
              <div className="p-4 bg-[#D2D6D8]/50 rounded-lg">
                <h3 className="font-bold text-[#252525] mb-2">🏢 Companies</h3>
                <p className="text-sm text-[#4E4F4B] mb-3">Add 3 sample companies</p>
                <button
                  onClick={() => handleSeedSpecific(seedCompanies, 'Companies')}
                  disabled={loading}
                  className="bg-[#A4A8A5] text-[#252525] px-4 py-2 rounded-lg font-medium hover:bg-[#747877] transition disabled:opacity-50 w-full"
                >
                  Seed Companies
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Important Notes</h3>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
              <li>Make sure Firestore is enabled in Firebase Console</li>
              <li>You must be authenticated to seed data</li>
              <li>Seeding will create new documents (won't delete existing ones)</li>
              <li>Check browser console for detailed logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedDatabase;
