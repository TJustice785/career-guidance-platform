const { db } = require('./config/firebase.config');

console.log('Testing Firebase connection...');

db.collection('jobs').limit(1).get()
  .then(snapshot => {
    console.log('Firebase connection successful, docs found:', snapshot.size);
    process.exit(0);
  })
  .catch(err => {
    console.error('Firebase connection failed:', err.message);
    process.exit(1);
  });
