import React, { useState, useEffect, ReactNode } from 'react';

const AdminActions: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('isAdmin');
    setIsAdmin(adminToken === 'true');
  }, []);

  return (
    <div>
      {isAdmin && children}
    </div>
  );
};

export default AdminActions;
