import React, { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const BulkAddInstitutions = () => {
  const [institutions, setInstitutions] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [duplicates, setDuplicates] = useState([]);

  // Comprehensive list of Lesotho institutions
  const lesothoInstitutions = [
    {
      name: 'National University of Lesotho',
      abbreviation: 'NUL',
      type: 'University',
      location: 'Roma, Maseru',
      email: 'info@nul.ls',
      phone: '+266 2234 0601',
      website: 'https://www.nul.ls',
      description: 'The National University of Lesotho is the oldest university in Lesotho, established in 1945.',
      established: 1945,
      faculties: ['Agriculture', 'Education', 'Health Sciences', 'Humanities', 'Law', 'Science and Technology', 'Social Sciences'],
      programs: ['Bachelor of Science', 'Bachelor of Arts', 'Bachelor of Education', 'Master\'s Programs', 'PhD Programs'],
      facilities: ['Library', 'Computer Labs', 'Sports Facilities', 'Student Residences', 'Research Centers']
    },
    {
      name: 'Limkokwing University of Creative Technology',
      abbreviation: 'LUCT',
      type: 'University',
      location: 'Maseru',
      email: 'admissions@limkokwing.ls',
      phone: '+266 2231 2324',
      website: 'https://www.limkokwing.net/lesotho',
      description: 'International university offering creative arts, business, and ICT programs.',
      established: 2007,
      faculties: ['Design Innovation', 'Information Communication Technology', 'Business and Globalization'],
      programs: ['Fashion Design', 'Multimedia Design', 'Business Management', 'Software Engineering'],
      facilities: ['Design Studios', 'Computer Labs', 'Exhibition Spaces', 'Library']
    },
    {
      name: 'Lerotholi Polytechnic',
      abbreviation: 'LP',
      type: 'Polytechnic',
      location: 'Maseru',
      email: 'info@lerotholi.ac.ls',
      phone: '+266 2231 7024',
      website: 'https://www.lerotholi.ac.ls',
      description: 'Leading technical and vocational institution in Lesotho.',
      established: 1906,
      faculties: ['Business Studies', 'Engineering', 'Science', 'Agriculture'],
      programs: ['Diploma in Civil Engineering', 'Diploma in Electrical Engineering', 'Diploma in Business Management'],
      facilities: ['Workshops', 'Laboratories', 'Computer Labs', 'Library']
    },
    {
      name: 'Botho University Lesotho',
      abbreviation: 'BU',
      type: 'University',
      location: 'Maseru',
      email: 'info@bothouniversity.ac.ls',
      phone: '+266 2231 2750',
      website: 'https://www.bothouniversity.ac.ls',
      description: 'Private university offering quality education in business, computing, and education.',
      established: 2014,
      faculties: ['Computing and Information Systems', 'Business and Accounting', 'Education'],
      programs: ['BSc Computer Science', 'Bachelor of Accounting', 'Bachelor of Education'],
      facilities: ['Modern Classrooms', 'Computer Labs', 'Library', 'Student Support Center']
    },
    {
      name: 'St. Paul\'s College',
      abbreviation: 'SPC',
      type: 'College',
      location: 'Roma, Maseru',
      email: 'info@stpauls.ac.ls',
      phone: '+266 2234 0234',
      website: '',
      description: 'Catholic teacher training college.',
      established: 1959,
      faculties: ['Education'],
      programs: ['Diploma in Education', 'Certificate in Education'],
      facilities: ['Classrooms', 'Library', 'Chapel', 'Hostels']
    },
    {
      name: 'Lesotho College of Education',
      abbreviation: 'LCE',
      type: 'College',
      location: 'Maseru',
      email: 'info@lce.ac.ls',
      phone: '+266 2231 2445',
      website: 'https://www.lce.ac.ls',
      description: 'Premier teacher training institution in Lesotho.',
      established: 1975,
      faculties: ['Education'],
      programs: ['Diploma in Primary Education', 'Diploma in Secondary Education', 'Bachelor of Education'],
      facilities: ['Teaching Practice Schools', 'Library', 'Computer Labs', 'Student Residences']
    },
    {
      name: 'Lesotho Agricultural College',
      abbreviation: 'LAC',
      type: 'College',
      location: 'Maseru',
      email: 'info@lac.ac.ls',
      phone: '+266 2231 7156',
      website: 'https://www.lac.ac.ls',
      description: 'Specialized agricultural training institution.',
      established: 1955,
      faculties: ['Agriculture', 'Animal Science'],
      programs: ['Diploma in Agriculture', 'Certificate in Animal Production', 'Diploma in Agricultural Extension'],
      facilities: ['Farm', 'Laboratories', 'Demonstration Plots', 'Library']
    },
    {
      name: 'Institute of Development Management',
      abbreviation: 'IDM',
      type: 'Institute',
      location: 'Maseru',
      email: 'info@idm.ac.ls',
      phone: '+266 2231 3052',
      website: 'https://www.idm.ac.ls',
      description: 'Management training and development institute.',
      established: 1974,
      faculties: ['Management', 'Public Administration'],
      programs: ['Diploma in Business Management', 'Certificate in Public Administration', 'Short Courses'],
      facilities: ['Training Rooms', 'Computer Labs', 'Conference Facilities', 'Library']
    },
    {
      name: 'Institute of Extra-Mural Studies',
      abbreviation: 'IEMS',
      type: 'Institute',
      location: 'Maseru',
      email: 'info@iems.ac.ls',
      phone: '+266 2231 6540',
      website: '',
      description: 'Distance and continuing education institute.',
      established: 1980,
      faculties: ['General Education'],
      programs: ['Adult Education Programs', 'Distance Learning Courses', 'Professional Development'],
      facilities: ['Regional Centers', 'Library', 'Study Materials Center']
    },
    {
      name: 'National Health Training College',
      abbreviation: 'NHTC',
      type: 'College',
      location: 'Maseru',
      email: 'info@nhtc.ls',
      phone: '+266 2232 2446',
      website: 'https://www.nhtc.ls',
      description: 'Premier nursing and health sciences training institution.',
      established: 1974,
      faculties: ['Nursing', 'Medical Laboratory Sciences', 'Pharmacy'],
      programs: ['Diploma in Nursing', 'Certificate in Nursing', 'Diploma in Medical Laboratory Sciences'],
      facilities: ['Clinical Training Wards', 'Laboratories', 'Library', 'Simulation Labs']
    }
  ];

  const checkDuplicates = async (institutionsToAdd) => {
    try {
      const snapshot = await getDocs(collection(db, 'institutions'));
      const existing = [];
      
      snapshot.forEach(doc => {
        existing.push(doc.data().name.toLowerCase().trim());
      });
      
      const dupes = [];
      const clean = [];
      
      institutionsToAdd.forEach(inst => {
        const nameLower = inst.name.toLowerCase().trim();
        if (existing.includes(nameLower)) {
          dupes.push(inst.name);
        } else {
          clean.push(inst);
        }
      });
      
      setDuplicates(dupes);
      return clean;
      
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return institutionsToAdd;
    }
  };

  const handleLoadDefault = () => {
    setPreview(lesothoInstitutions);
    toast.success(`Loaded ${lesothoInstitutions.length} Lesotho institutions`);
  };

  const handleCheckDuplicates = async () => {
    if (preview.length === 0) {
      toast.error('No institutions to check');
      return;
    }
    
    setLoading(true);
    const clean = await checkDuplicates(preview);
    
    if (duplicates.length > 0) {
      toast.error(`Found ${duplicates.length} duplicates`, { duration: 5000 });
    } else {
      toast.success(`All ${clean.length} institutions are unique!`);
    }
    
    setPreview(clean);
    setLoading(false);
  };

  const handleBulkAdd = async () => {
    if (preview.length === 0) {
      toast.error('No institutions to add');
      return;
    }
    
    const confirm = window.confirm(
      `Add ${preview.length} institutions to the database?\n\n` +
      `This will create new institution records.`
    );
    
    if (!confirm) return;
    
    try {
      setLoading(true);
      
      // Check for duplicates first
      const clean = await checkDuplicates(preview);
      
      if (clean.length === 0) {
        toast.error('All institutions already exist!');
        setLoading(false);
        return;
      }
      
      let added = 0;
      
      for (const inst of clean) {
        await addDoc(collection(db, 'institutions'), {
          ...inst,
          isActive: true,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        added++;
        toast.success(`Added ${added}/${clean.length}: ${inst.name}`, { duration: 1000 });
      }
      
      toast.success(`✅ Successfully added ${added} institutions!`, { duration: 5000 });
      
      if (duplicates.length > 0) {
        toast.error(`⚠️ Skipped ${duplicates.length} duplicates`, { duration: 5000 });
      }
      
      setPreview([]);
      setDuplicates([]);
      
    } catch (error) {
      console.error('Error adding institutions:', error);
      toast.error('Failed to add institutions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Add Institutions</h1>
        <p className="text-gray-600">Add multiple institutions with automatic duplicate detection</p>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <button
            onClick={handleLoadDefault}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            Load Lesotho Institutions ({lesothoInstitutions.length})
          </button>
          
          <button
            onClick={handleCheckDuplicates}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition"
            disabled={loading || preview.length === 0}
          >
            Check for Duplicates
          </button>
          
          <button
            onClick={handleBulkAdd}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={loading || preview.length === 0}
          >
            Add All ({preview.length})
          </button>
        </div>
      </div>

      {/* Duplicates Warning */}
      {duplicates.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ {duplicates.length} Duplicate(s) Found
          </h3>
          <p className="text-yellow-800 mb-2">These institutions already exist and will be skipped:</p>
          <ul className="list-disc list-inside text-yellow-700">
            {duplicates.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Preview ({preview.length} institutions)
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {preview.map((inst, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{inst.name}</h3>
                    <p className="text-sm text-gray-600">{inst.abbreviation} • {inst.type}</p>
                    <p className="text-sm text-gray-600">{inst.location}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Ready to add
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default BulkAddInstitutions;
