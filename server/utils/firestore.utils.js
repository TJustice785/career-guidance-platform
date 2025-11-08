const { db } = require('../config/firebase');

/**
 * Add a document to a collection
 * @param {string} collection - Collection name
 * @param {Object} data - Document data
 * @param {string} [id] - Optional document ID
 * @returns {Promise<Object>} - The created document reference
 */
const addDocument = async (collection, data, id) => {
  try {
    const docRef = id 
      ? await db.collection(collection).doc(id).set(data)
      : await db.collection(collection).add(data);
    
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error adding document to ${collection}:`, error);
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

/**
 * Get a document by ID
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<Object|null>} - The document data or null if not found
 */
const getDocument = async (collection, id) => {
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error(`Error getting document ${id} from ${collection}:`, error);
    throw new Error(`Failed to get document: ${error.message}`);
  }
};

/**
 * Update a document
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} - The updated document
 */
const updateDocument = async (collection, id, data) => {
  try {
    const docRef = db.collection(collection).doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error(`Error updating document ${id} in ${collection}:`, error);
    throw new Error(`Failed to update document: ${error.message}`);
  }
};

/**
 * Delete a document
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} - True if successful
 */
const deleteDocument = async (collection, id) => {
  try {
    await db.collection(collection).doc(id).delete();
    return true;
  } catch (error) {
    console.error(`Error deleting document ${id} from ${collection}:`, error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};

/**
 * Query documents with filters
 * @param {string} collection - Collection name
 * @param {Array} queryParams - Array of query parameters [field, operator, value]
 * @param {Object} options - Query options (limit, orderBy, etc.)
 * @returns {Promise<Array>} - Array of matching documents
 */
const queryDocuments = async (collection, queryParams = [], options = {}) => {
  try {
    let query = db.collection(collection);

    // Apply filters
    queryParams.forEach(([field, operator, value]) => {
      query = query.where(field, operator, value);
    });

    // Apply sorting
    if (options.orderBy) {
      query = query.orderBy(
        options.orderBy.field,
        options.orderBy.direction || 'asc'
      );
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying ${collection}:`, error);
    throw new Error(`Failed to query documents: ${error.message}`);
  }
};

/**
 * Get all documents in a collection
 * @param {string} collection - Collection name
 * @returns {Promise<Array>} - Array of all documents
 */
const getAllDocuments = async (collection) => {
  try {
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting all documents from ${collection}:`, error);
    throw new Error(`Failed to get all documents: ${error.message}`);
  }
};

module.exports = {
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  getAllDocuments
};
