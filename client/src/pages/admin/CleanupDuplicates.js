import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CleanupDuplicates = () => {
  const [institutions, setInstitutions] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedToKeep, setSelectedToKeep] = useState({});

  useEffect(() => {
    findDuplicates();
  }, []);

  const findDuplicates = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'institutions'));
      const allInstitutions = [];
      
      snapshot.forEach(docSnap => {
        allInstitutions.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      
      setInstitutions(allInstitutions);
      
      // Group by name
      const nameGroups = {};
      allInstitutions.forEach(inst => {
        const name = inst.name?.toLowerCase().trim();
        if (name) {
          if (!nameGroups[name]) {
            nameGroups[name] = [];
          }
          nameGroups[name].push(inst);
        }
      });
      
      // Find duplicates
      const dupes = {};
      Object.keys(nameGroups).forEach(name => {
        if (nameGroups[name].length > 1) {
          dupes[name] = nameGroups[name];
        }
      });
      
      setDuplicates(dupes);
      
      // Auto-select the best one from each group
      const autoSelected = {};
      Object.keys(dupes).forEach(name => {
        const group = dupes[name];
        // Select the one with most complete data
        const best = group.reduce((prev, curr) => {
          const prevScore = (
            (prev.address ? 1 : 0) +
            (prev.phone ? 1 : 0) +
            (prev.website ? 1 : 0) +
            (prev.description ? 1 : 0)
          );
          const currScore = (
            (curr.address ? 1 : 0) +
            (curr.phone ? 1 : 0) +
            (curr.website ? 1 : 0) +
            (curr.description ? 1 : 0)
          );
          return currScore > prevScore ? curr : prev;
        });
        autoSelected[name] = best.id;
      });
      setSelectedToKeep(autoSelected);
      
    } catch (error) {
      console.error('Error finding duplicates:', error);
      toast.error('Failed to find duplicates');
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicates = async () => {
    try {
      const allIds = institutions.map(i => i.id);
      const keepIds = Object.values(selectedToKeep);
      const deleteIds = allIds.filter(id => !keepIds.includes(id));
      
      if (deleteIds.length === 0) {
        toast.error('No duplicates to delete');
        return;
      }
      
      const confirm = window.confirm(
        `Delete ${deleteIds.length} duplicate institutions?\n\n` +
        `Keeping ${keepIds.length} unique institutions.`
      );
      
      if (!confirm) return;
      
      setLoading(true);
      
      for (const id of deleteIds) {
        await deleteDoc(doc(db, 'institutions', id));
      }
      
      toast.success(`Deleted ${deleteIds.length} duplicates!`);
      findDuplicates(); // Refresh
      
    } catch (error) {
      console.error('Error removing duplicates:', error);
      toast.error('Failed to remove duplicates');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const duplicateCount = Object.keys(duplicates).length;
  const totalDuplicates = Object.values(duplicates).reduce((sum, group) => sum + group.length - 1, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cleanup Duplicate Institutions</h1>
        <p className="text-gray-600">
          Found {institutions.length} total institutions, {duplicateCount} have duplicates ({totalDuplicates} to remove)
        </p>
      </div>

      {duplicateCount === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✅ No Duplicates Found!</h3>
          <p className="text-green-700">All institutions are unique.</p>
        </div>
      ) : (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Instructions:</strong> Select one institution to keep from each duplicate group. 
              The best option is pre-selected based on completeness of data.
            </p>
          </div>

          <div className="space-y-6 mb-6">
            {Object.keys(duplicates).map(name => (
              <div key={name} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                  {name} ({duplicates[name].length} copies)
                </h3>
                
                <div className="space-y-3">
                  {duplicates[name].map((inst) => (
                    <div
                      key={inst.id}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedToKeep[name] === inst.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedToKeep(prev => ({ ...prev, [name]: inst.id }))}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="radio"
                              checked={selectedToKeep[name] === inst.id}
                              onChange={() => setSelectedToKeep(prev => ({ ...prev, [name]: inst.id }))}
                              className="text-green-600"
                            />
                            <span className="font-medium text-gray-900">Keep This One</span>
                            {selectedToKeep[name] === inst.id && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✓ Selected
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">ID:</span>
                              <span className="ml-2 text-gray-900 font-mono text-xs">{inst.id}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <span className="ml-2 text-gray-900">{inst.status || 'N/A'}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">Address:</span>
                              <span className="ml-2 text-gray-900">{inst.address || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 text-gray-900">{inst.phone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Website:</span>
                              <span className="ml-2 text-gray-900">{inst.website || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={removeDuplicates}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Delete {totalDuplicates} Duplicate{totalDuplicates !== 1 ? 's' : ''}
            </button>
            <button
              onClick={findDuplicates}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CleanupDuplicates;
