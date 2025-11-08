import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CleanupAllDuplicates = () => {
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [duplicates, setDuplicates] = useState({});
  const [selectedToKeep, setSelectedToKeep] = useState({});
  const [activeCollection, setActiveCollection] = useState('institutions');

  const collections = [
    { id: 'institutions', name: 'Institutions', field: 'name' },
    { id: 'courses', name: 'Courses', field: 'name' },
    { id: 'jobs', name: 'Jobs', field: 'title' },
    { id: 'company', name: 'Companies', field: 'name' },
    { id: 'applications', name: 'Applications', field: 'studentId' }
  ];

  const scanCollection = async (collectionName, fieldName) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const items = [];
      
      snapshot.forEach(docSnap => {
        items.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      
      // Group by field value
      const groups = {};
      items.forEach(item => {
        const key = item[fieldName]?.toString().toLowerCase().trim();
        if (key) {
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(item);
        }
      });
      
      // Find duplicates
      const dupes = {};
      Object.keys(groups).forEach(key => {
        if (groups[key].length > 1) {
          dupes[key] = groups[key];
        }
      });
      
      return { total: items.length, duplicates: dupes, items };
      
    } catch (error) {
      console.error(`Error scanning ${collectionName}:`, error);
      throw error;
    }
  };

  const scanAllCollections = async () => {
    try {
      setScanning(true);
      const results = {};
      
      for (const col of collections) {
        toast.loading(`Scanning ${col.name}...`, { id: col.id });
        const result = await scanCollection(col.id, col.field);
        results[col.id] = result;
        
        const dupeCount = Object.keys(result.duplicates).length;
        const totalDupes = Object.values(result.duplicates).reduce((sum, group) => sum + group.length - 1, 0);
        
        if (dupeCount > 0) {
          toast.success(`${col.name}: Found ${dupeCount} duplicate groups (${totalDupes} items to remove)`, { id: col.id });
        } else {
          toast.success(`${col.name}: No duplicates found`, { id: col.id });
        }
      }
      
      setDuplicates(results);
      
      // Auto-select best items
      const autoSelected = {};
      Object.keys(results).forEach(colId => {
        autoSelected[colId] = {};
        Object.keys(results[colId].duplicates).forEach(key => {
          const group = results[colId].duplicates[key];
          // Select the newest one (by createdAt)
          const best = group.reduce((prev, curr) => {
            const prevTime = prev.createdAt?.toDate?.() || new Date(0);
            const currTime = curr.createdAt?.toDate?.() || new Date(0);
            return currTime > prevTime ? curr : prev;
          });
          autoSelected[colId][key] = best.id;
        });
      });
      setSelectedToKeep(autoSelected);
      
    } catch (error) {
      console.error('Error scanning collections:', error);
      toast.error('Failed to scan collections');
    } finally {
      setScanning(false);
    }
  };

  const deleteCollectionDuplicates = async (collectionName) => {
    try {
      const colData = duplicates[collectionName];
      if (!colData || Object.keys(colData.duplicates).length === 0) {
        toast.error('No duplicates to delete in this collection');
        return;
      }
      
      const keepIds = Object.values(selectedToKeep[collectionName] || {});
      const allIds = colData.items.map(item => item.id);
      const deleteIds = allIds.filter(id => !keepIds.includes(id));
      
      if (deleteIds.length === 0) {
        toast.error('No items selected for deletion');
        return;
      }
      
      const confirm = window.confirm(
        `Delete ${deleteIds.length} duplicate items from ${collectionName}?\n\n` +
        `Keeping ${keepIds.length} unique items.`
      );
      
      if (!confirm) return;
      
      setLoading(true);
      let deleted = 0;
      
      for (const id of deleteIds) {
        await deleteDoc(doc(db, collectionName, id));
        deleted++;
        if (deleted % 5 === 0) {
          toast.loading(`Deleted ${deleted}/${deleteIds.length}...`, { id: 'delete-progress' });
        }
      }
      
      toast.success(`✅ Deleted ${deleted} duplicates from ${collectionName}!`, { id: 'delete-progress' });
      
      // Re-scan this collection
      const result = await scanCollection(collectionName, collections.find(c => c.id === collectionName).field);
      setDuplicates(prev => ({ ...prev, [collectionName]: result }));
      
    } catch (error) {
      console.error('Error deleting duplicates:', error);
      toast.error('Failed to delete duplicates');
    } finally {
      setLoading(false);
    }
  };

  const deleteAllDuplicates = async () => {
    try {
      const totalDuplicates = Object.keys(duplicates).reduce((sum, colId) => {
        const colData = duplicates[colId];
        return sum + Object.values(colData.duplicates).reduce((s, group) => s + group.length - 1, 0);
      }, 0);
      
      if (totalDuplicates === 0) {
        toast.error('No duplicates to delete');
        return;
      }
      
      const confirm = window.confirm(
        `🚨 DELETE ALL DUPLICATES ACROSS THE ENTIRE SITE? 🚨\n\n` +
        `This will delete ${totalDuplicates} duplicate items across all collections.\n\n` +
        `This action CANNOT be undone!\n\n` +
        `Are you absolutely sure?`
      );
      
      if (!confirm) return;
      
      // Second confirmation
      const doubleConfirm = window.confirm(
        `FINAL CONFIRMATION\n\n` +
        `You are about to permanently delete ${totalDuplicates} items.\n\n` +
        `Click OK to proceed.`
      );
      
      if (!doubleConfirm) return;
      
      setLoading(true);
      let totalDeleted = 0;
      
      for (const colId of Object.keys(duplicates)) {
        const colData = duplicates[colId];
        const keepIds = Object.values(selectedToKeep[colId] || {});
        const allIds = colData.items.map(item => item.id);
        const deleteIds = allIds.filter(id => !keepIds.includes(id));
        
        if (deleteIds.length === 0) continue;
        
        toast.loading(`Cleaning ${colId}...`, { id: colId });
        
        for (const id of deleteIds) {
          await deleteDoc(doc(db, colId, id));
          totalDeleted++;
          
          if (totalDeleted % 10 === 0) {
            toast.loading(`Deleted ${totalDeleted}/${totalDuplicates}...`, { id: 'total-progress' });
          }
        }
        
        toast.success(`✅ ${colId}: Deleted ${deleteIds.length} duplicates`, { id: colId });
      }
      
      toast.success(
        `🎉 Successfully deleted ${totalDeleted} duplicates across all collections!`,
        { id: 'total-progress', duration: 5000 }
      );
      
      // Re-scan all
      await scanAllCollections();
      
    } catch (error) {
      console.error('Error deleting all duplicates:', error);
      toast.error('Failed to delete all duplicates');
    } finally {
      setLoading(false);
    }
  };

  const currentDuplicates = duplicates[activeCollection]?.duplicates || {};
  const currentTotal = duplicates[activeCollection]?.total || 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cleanup All Duplicates</h1>
        <p className="text-gray-600">
          Scan and remove duplicate entries across all collections in the database
        </p>
      </div>

      {/* Scan Button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          onClick={scanAllCollections}
          disabled={scanning || loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {scanning ? 'Scanning All Collections...' : 'Scan All Collections for Duplicates'}
        </button>
      </div>

      {/* Summary Cards */}
      {Object.keys(duplicates).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {collections.map(col => {
            const colData = duplicates[col.id];
            if (!colData) return null;
            
            const dupeCount = Object.keys(colData.duplicates).length;
            const totalDupes = Object.values(colData.duplicates).reduce((sum, group) => sum + group.length - 1, 0);
            
            return (
              <div
                key={col.id}
                onClick={() => setActiveCollection(col.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  activeCollection === col.id
                    ? 'border-blue-500 bg-blue-50'
                    : dupeCount > 0
                    ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
                    : 'border-green-300 bg-green-50 hover:border-green-400'
                }`}
              >
                <h3 className="font-bold text-gray-900">{col.name}</h3>
                <p className="text-sm text-gray-600">Total: {colData.total}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {dupeCount > 0 ? `${dupeCount} groups (${totalDupes} dupes)` : '✓ Clean'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Collection Details */}
      {Object.keys(currentDuplicates).length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {collections.find(c => c.id === activeCollection)?.name} Duplicates
                </h2>
                <p className="text-gray-600">
                  {Object.keys(currentDuplicates).length} duplicate groups found
                </p>
              </div>
              <button
                onClick={() => deleteCollectionDuplicates(activeCollection)}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
              >
                Delete This Collection's Duplicates
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {Object.keys(currentDuplicates).map(key => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3 capitalize">
                    {key} ({currentDuplicates[key].length} copies)
                  </h3>
                  
                  <div className="space-y-2">
                    {currentDuplicates[key].map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-3 cursor-pointer transition ${
                          selectedToKeep[activeCollection]?.[key] === item.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedToKeep(prev => ({
                            ...prev,
                            [activeCollection]: {
                              ...prev[activeCollection],
                              [key]: item.id
                            }
                          }));
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="radio"
                                checked={selectedToKeep[activeCollection]?.[key] === item.id}
                                onChange={() => {}}
                                className="text-green-600"
                              />
                              <span className="text-sm font-medium text-gray-900">Keep This</span>
                              {selectedToKeep[activeCollection]?.[key] === item.id && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  ✓ Selected
                                </span>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>
                                <span className="font-medium">ID:</span>
                                <span className="ml-2 font-mono">{item.id.substring(0, 12)}...</span>
                              </div>
                              {item.createdAt && (
                                <div>
                                  <span className="font-medium">Created:</span>
                                  <span className="ml-2">
                                    {item.createdAt.toDate?.().toLocaleDateString() || 'N/A'}
                                  </span>
                                </div>
                              )}
                              {item.status && (
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <span className="ml-2">{item.status}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Delete All Button */}
      {Object.keys(duplicates).length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-900 mb-2">🚨 Danger Zone</h3>
          <p className="text-red-700 mb-4">
            Delete ALL duplicates across ALL collections in one action. This cannot be undone!
          </p>
          <button
            onClick={deleteAllDuplicates}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Deleting...' : '🗑️ Delete ALL Duplicates Across Entire Site'}
          </button>
        </div>
      )}

      {Object.keys(duplicates).length === 0 && !scanning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            Click "Scan All Collections" to search for duplicates across the entire database.
          </p>
        </div>
      )}
    </div>
  );
};

export default CleanupAllDuplicates;
