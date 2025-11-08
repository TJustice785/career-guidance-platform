import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import InstitutionList from '../pages/admin/institutions/InstitutionList';
import InstitutionForm from '../pages/admin/institutions/InstitutionForm';
import InstitutionDetail from '../pages/admin/institutions/InstitutionDetail';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="institutions" replace />} />
        
        {/* Institutions */}
        <Route path="institutions">
          <Route index element={<InstitutionList />} />
          <Route path="new" element={<InstitutionForm />} />
          <Route path=":id" element={<InstitutionDetail />} />
          <Route path=":id/edit" element={<InstitutionForm isEdit />} />
        </Route>
        
        {/* Add more admin routes here */}
        
        <Route path="*" element={<Navigate to="/admin/institutions" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
