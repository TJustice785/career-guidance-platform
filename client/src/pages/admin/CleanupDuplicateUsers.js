import React, { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CleanupDuplicateUsers = () => {
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [duplicates, setDuplicates] = useState({});
  const [selectedToKeep, setSelectedToKeep] = useState({});
  const [users, setUsers] = useState([]);

  const scanUsers = async () => {
    try {
      setScanning(true);
      toast.loading('Scanning users...', { id: 'scan' });
      
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = [];
      
      snapshot.forEach(docSnap => {
        allUsers.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      
      setUsers(allUsers);
      console.log(`Found ${allUsers.length} total users`);
      
      // Group by email (case-insensitive)
      const emailGroups = {};
      allUsers.forEach(user => {
        const email = user.email?.toLowerCase().trim();
        if (email) {
          if (!emailGroups[email]) {
            emailGroups[email] = [];
          }
          emailGroups[email].push(user);
        }
      });
      
      // Find duplicates
      const dupes = {};
      Object.keys(emailGroups).forEach(email => {
        if (emailGroups[email].length > 1) {
          dupes[email] = emailGroups[email];
        }
      });
      
      setDuplicates(dupes);
      
      const dupeCount = Object.keys(dupes).length;
      const totalDupes = Object.values(dupes).reduce((sum, group) => sum + group.length - 1, 0);
      
      if (dupeCount > 0) {
        toast.success(
          `Found ${dupeCount} duplicate email(s) (${totalDupes} users to remove)`,
          { id: 'scan', duration: 5000 }
        );
      } else {
        toast.success('No duplicate users found! Database is clean.', { id: 'scan' });
      }
      
      // Auto-select newest user from each duplicate group
      const autoSelected = {};
      Object.keys(dupes).forEach(email => {
        const group = dupes[email];
        // Select the newest one by createdAt
        const newest = group.reduce((prev, curr) => {
          const prevTime = prev.createdAt?.toDate?.() || new Date(0);
          const currTime = curr.createdAt?.toDate?.() || new Date(0);
          return currTime > prevTime ? curr : prev;
        });
        autoSelected[email] = newest.id;
      });
      setSelectedToKeep(autoSelected);
      
    } catch (error) {
      console.error('Error scanning users:', error);
      toast.error('Failed to scan users: ' + error.message, { id: 'scan' });
    } finally {
      setScanning(false);
    }
  };

  const deleteDuplicates = async () => {
    try {
      const keepIds = Object.values(selectedToKeep);
      const allUserIds = users.map(u => u.id);
      const deleteIds = allUserIds.filter(id => !keepIds.includes(id));
      
      if (deleteIds.length === 0) {
        toast.error('No duplicates to delete');
        return;
      }
      
      const confirm = window.confirm(
        `⚠️ DELETE ${deleteIds.length} DUPLICATE USERS?\n\n` +
        `This will permanently delete ${deleteIds.length} user accounts.\n\n` +
        `Keeping ${keepIds.length} unique users.\n\n` +
        `This action CANNOT be undone!\n\n` +
        `Are you sure?`
      );
      
      if (!confirm) return;
      
      // Double confirmation
      const doubleConfirm = window.confirm(
        `FINAL CONFIRMATION\n\n` +
        `You are about to delete ${deleteIds.length} users.\n\n` +
        `Click OK to proceed.`
      );
      
      if (!doubleConfirm) return;
      
      setLoading(true);
      let deleted = 0;
      
      for (const id of deleteIds) {
        await deleteDoc(doc(db, 'users', id));
        deleted++;
        
        if (deleted % 5 === 0) {
          toast.loading(`Deleted ${deleted}/${deleteIds.length}...`, { id: 'delete-progress' });
        }
      }
      
      toast.success(`✅ Successfully deleted ${deleted} duplicate users!`, { id: 'delete-progress', duration: 5000 });
      
      // Re-scan
      await scanUsers();
      
    } catch (error) {
      console.error('Error deleting duplicates:', error);
      toast.error('Failed to delete duplicates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const duplicateCount = Object.keys(duplicates).length;
  const totalDuplicates = Object.values(duplicates).reduce((sum, group) => sum + group.length - 1, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cleanup Duplicate Users</h1>
        <p className="text-gray-600">
          Find and remove duplicate user accounts based on email address
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900">Duplicate Emails</h3>
          <p className="text-3xl font-bold text-yellow-600">{duplicateCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-900">Users to Remove</h3>
          <p className="text-3xl font-bold text-red-600">{totalDuplicates}</p>
        </div>
      </div>

      {/* Scan Button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          onClick={scanUsers}
          disabled={scanning || loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {scanning ? 'Scanning Users...' : '🔍 Scan for Duplicate Users'}
        </button>
      </div>

      {/* Duplicates List */}
      {duplicateCount > 0 && (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Found {duplicateCount} duplicate email(s).</strong> Select which user to keep from each group.
              The newest user is automatically selected.
            </p>
          </div>

          <div className="space-y-6 mb-6">
            {Object.keys(duplicates).map(email => (
              <div key={email} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {email} ({duplicates[email].length} accounts)
                </h3>
                
                <div className="space-y-3">
                  {duplicates[email].map((user) => (
                    <div
                      key={user.id}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedToKeep[email] === user.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedToKeep(prev => ({ ...prev, [email]: user.id }))}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="radio"
                              checked={selectedToKeep[email] === user.id}
                              onChange={() => {}}
                              className="text-green-600"
                            />
                            <span className="font-medium text-gray-900">Keep This User</span>
                            {selectedToKeep[email] === user.id && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✓ Selected
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">ID:</span>
                              <span className="ml-2 text-gray-900 font-mono text-xs">{user.id.substring(0, 12)}...</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Role:</span>
                              <span className="ml-2 text-gray-900 capitalize">{user.role || 'N/A'}</span>
                            </div>
                            {user.firstName && (
                              <div>
                                <span className="text-gray-600">Name:</span>
                                <span className="ml-2 text-gray-900">{user.firstName} {user.lastName}</span>
                              </div>
                            )}
                            {user.companyName && (
                              <div>
                                <span className="text-gray-600">Company:</span>
                                <span className="ml-2 text-gray-900">{user.companyName}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 text-gray-900">{user.phone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Created:</span>
                              <span className="ml-2 text-gray-900">
                                {user.createdAt?.toDate?.().toLocaleDateString() || 'Unknown'}
                              </span>
                            </div>
                            {user.currentGrade && (
                              <div>
                                <span className="text-gray-600">Grade:</span>
                                <span className="ml-2 text-gray-900">{user.currentGrade}</span>
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

          {/* Delete Button */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">🚨 Danger Zone</h3>
            <p className="text-red-700 mb-4">
              Delete {totalDuplicates} duplicate user account(s). This action cannot be undone!
            </p>
            <button
              onClick={deleteDuplicates}
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Deleting...' : `🗑️ Delete ${totalDuplicates} Duplicate User(s)`}
            </button>
          </div>
        </>
      )}

      {duplicateCount === 0 && users.length > 0 && !scanning && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✅ No Duplicates Found!</h3>
          <p className="text-green-700">All user accounts have unique email addresses.</p>
        </div>
      )}

      {users.length === 0 && !scanning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            Click "Scan for Duplicate Users" to check for duplicate email addresses.
          </p>
        </div>
      )}
    </div>
  );
};

export default CleanupDuplicateUsers;
