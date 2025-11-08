import { db } from '../config/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const basicAdminSeeder = async () => {
  console.log('Creating basic admin user...');

  try {
    // Create the admin user first
    const adminUser = await addDoc(collection(db, 'users'), {
      email: 'thabotsehla31@gmail.com',
      firstName: 'Thabo',
      lastName: 'Tsehla',
      role: 'admin',
      phone: '+266 1234 5678',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Admin user created successfully!');
    console.log('Admin ID:', adminUser.id);
    console.log('Email: thabotsehla31@gmail.com');
    console.log('Role: admin');
    
    return adminUser.id;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

export default basicAdminSeeder;
