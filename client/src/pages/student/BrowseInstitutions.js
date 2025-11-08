import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BrowseInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      console.log('Fetching institutions from Firestore...');
      
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      const institutionsData = institutionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter active institutions
      const activeInstitutions = institutionsData.filter(inst => 
        inst.status === 'active' || !inst.status
      );
      
      console.log('Active institutions found:', activeInstitutions.length);
      setInstitutions(activeInstitutions);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to load institutions: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Filter institutions based on search term and location
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = !searchTerm || 
      institution.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      institution.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Institutions</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Institutions</label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
            <input
              type="text"
              placeholder="Enter location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((institution) => (
          <div key={institution.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{institution.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{institution.description}</p>
            
            <div className="space-y-2 mb-4">
              {institution.address && (
                <div className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-2" />
                  {institution.address}
                </div>
              )}
              {institution.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <FaPhone className="mr-2" />
                  {institution.phone}
                </div>
              )}
              {institution.website && (
                <div className="flex items-center text-sm text-gray-500">
                  <FaGlobe className="mr-2" />
                  <a href={institution.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
            
            <Link
              to="/student/courses"
              state={{ institutionId: institution.id }}
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              View Courses <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ))}
      </div>

      {institutions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No institutions available</p>
        </div>
      )}
    </div>
  );
};

export default BrowseInstitutions;
