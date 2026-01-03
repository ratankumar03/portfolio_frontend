import React, { createContext, useState, useEffect, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const adminStatus = localStorage.getItem('isAdmin');

    if (token && adminStatus === 'true') {
      setIsAdmin(true);
      setAdminToken(token);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('isAdmin', 'true');
    setAdminToken(token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    setAdminToken(null);
    setIsAdmin(false);
    setIsEditMode(false);
    window.location.reload();
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminToken,
        isEditMode,
        login,
        logout,
        toggleEditMode,
        setIsEditMode,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
