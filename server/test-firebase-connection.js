const { db } = require('./config/firebase.config');
console.log('Testing Firebase connection...');
db.collection('jobs').get().then(snapshot => {
  console.log('Jobs found:', snapshot.size);
  snapshot.forEach(doc => {
    console.log('Job:', doc.id, doc.data().title);
  });
}).catch(error => {
  console.error('Firebase error:', error);
});
