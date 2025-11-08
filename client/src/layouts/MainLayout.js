import React from 'react';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;