import { db } from '../config/firebase.config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

/**
 * Utility to find and remove duplicate institutions
 * Run this in browser console to clean up duplicates
 */

export const findDuplicateInstitutions = async () => {
  try {
    console.log('🔍 Searching for duplicate institutions...');
    
    const snapshot = await getDocs(collection(db, 'institutions'));
    const institutions = [];
    
    snapshot.forEach(docSnap => {
      institutions.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    
    console.log(`📊 Total institutions found: ${institutions.length}`);
    
    // Group by name to find duplicates
    const nameGroups = {};
    
    institutions.forEach(inst => {
      const name = inst.name?.toLowerCase().trim();
      if (name) {
        if (!nameGroups[name]) {
          nameGroups[name] = [];
        }
        nameGroups[name].push(inst);
      }
    });
    
    // Find duplicates
    const duplicates = {};
    Object.keys(nameGroups).forEach(name => {
      if (nameGroups[name].length > 1) {
        duplicates[name] = nameGroups[name];
      }
    });
    
    console.log(`🔄 Found ${Object.keys(duplicates).length} duplicate institution names:`);
    
    Object.keys(duplicates).forEach(name => {
      console.log(`\n📌 "${name}" (${duplicates[name].length} copies):`);
      duplicates[name].forEach((inst, idx) => {
        console.log(`  ${idx + 1}. ID: ${inst.id}`);
        console.log(`     Address: ${inst.address || 'N/A'}`);
        console.log(`     Status: ${inst.status || 'N/A'}`);
        console.log(`     Created: ${inst.createdAt || 'N/A'}`);
      });
    });
    
    return duplicates;
  } catch (error) {
    console.error('❌ Error finding duplicates:', error);
    return null;
  }
};

export const removeDuplicateInstitutions = async (keepIds = []) => {
  try {
    console.log('🗑️ Starting duplicate removal...');
    
    const snapshot = await getDocs(collection(db, 'institutions'));
    const allIds = [];
    
    snapshot.forEach(docSnap => {
      allIds.push(docSnap.id);
    });
    
    // Delete all except the ones to keep
    const toDelete = allIds.filter(id => !keepIds.includes(id));
    
    console.log(`📋 Total institutions: ${allIds.length}`);
    console.log(`✅ Keeping: ${keepIds.length}`);
    console.log(`🗑️ Deleting: ${toDelete.length}`);
    
    if (toDelete.length === 0) {
      console.log('⚠️ No institutions to delete!');
      return;
    }
    
    // Confirm before deleting
    const confirm = window.confirm(
      `Are you sure you want to delete ${toDelete.length} institutions?\n\n` +
      `Keeping ${keepIds.length} institutions.`
    );
    
    if (!confirm) {
      console.log('❌ Deletion cancelled');
      return;
    }
    
    // Delete duplicates
    let deleted = 0;
    for (const id of toDelete) {
      await deleteDoc(doc(db, 'institutions', id));
      deleted++;
      console.log(`✓ Deleted ${deleted}/${toDelete.length}: ${id}`);
    }
    
    console.log(`✅ Successfully deleted ${deleted} duplicate institutions!`);
    console.log(`📊 Remaining institutions: ${keepIds.length}`);
    
    return deleted;
  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    return 0;
  }
};

// Quick cleanup - keeps only institutions with valid data
export const quickCleanup = async () => {
  try {
    console.log('🧹 Starting quick cleanup...');
    
    const snapshot = await getDocs(collection(db, 'institutions'));
    const institutions = [];
    
    snapshot.forEach(docSnap => {
      institutions.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    
    // Group by name and keep the best one from each group
    const nameGroups = {};
    
    institutions.forEach(inst => {
      const name = inst.name?.toLowerCase().trim();
      if (name) {
        if (!nameGroups[name]) {
          nameGroups[name] = [];
        }
        nameGroups[name].push(inst);
      }
    });
    
    // Select the best institution from each duplicate group
    const keepIds = [];
    
    Object.keys(nameGroups).forEach(name => {
      const group = nameGroups[name];
      
      // Sort by quality (has more complete data)
      const sorted = group.sort((a, b) => {
        const scoreA = (
          (a.address ? 1 : 0) +
          (a.phone ? 1 : 0) +
          (a.website ? 1 : 0) +
          (a.description ? 1 : 0) +
          (a.email ? 1 : 0)
        );
        const scoreB = (
          (b.address ? 1 : 0) +
          (b.phone ? 1 : 0) +
          (b.website ? 1 : 0) +
          (b.description ? 1 : 0) +
          (b.email ? 1 : 0)
        );
        return scoreB - scoreA;
      });
      
      // Keep the best one
      keepIds.push(sorted[0].id);
    });
    
    console.log(`📊 Found ${institutions.length} total institutions`);
    console.log(`📌 Found ${Object.keys(nameGroups).length} unique names`);
    console.log(`✅ Will keep ${keepIds.length} best institutions`);
    console.log(`🗑️ Will delete ${institutions.length - keepIds.length} duplicates`);
    
    const confirm = window.confirm(
      `Quick Cleanup Summary:\n\n` +
      `Total: ${institutions.length} institutions\n` +
      `Unique: ${Object.keys(nameGroups).length} names\n` +
      `Keep: ${keepIds.length} institutions\n` +
      `Delete: ${institutions.length - keepIds.length} duplicates\n\n` +
      `Continue?`
    );
    
    if (!confirm) {
      console.log('❌ Cleanup cancelled');
      return;
    }
    
    return await removeDuplicateInstitutions(keepIds);
  } catch (error) {
    console.error('❌ Error in quick cleanup:', error);
    return 0;
  }
};

// Make functions available in console
if (typeof window !== 'undefined') {
  window.findDuplicateInstitutions = findDuplicateInstitutions;
  window.removeDuplicateInstitutions = removeDuplicateInstitutions;
  window.quickCleanup = quickCleanup;
}

export default {
  findDuplicateInstitutions,
  removeDuplicateInstitutions,
  quickCleanup
};
