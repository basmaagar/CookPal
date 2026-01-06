import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = (email, password) => {
    setIsLoading(true);
    setTimeout(() => {
      const fakeUser = {
        name: 'Allo',
        email: email,
        handle: '@alex_cooking'
      };
      setUser(fakeUser);
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsLoading(false);
    }, 500);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};