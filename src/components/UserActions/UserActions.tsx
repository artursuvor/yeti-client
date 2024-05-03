import React, { useState, useEffect, ReactNode } from 'react';

const UserActions: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUser, setIsUser] = useState<boolean>(false);

  useEffect(() => {
    const userToken = localStorage.getItem('isUser');
    setIsUser(userToken === 'true');
  }, []);

  return (
    <div>
      {isUser && children}
    </div>
  );
};

export default UserActions;
