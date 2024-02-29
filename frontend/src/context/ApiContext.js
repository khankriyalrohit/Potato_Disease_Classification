// ApiContext.js

import React, { createContext, useContext, useState } from 'react';

// Create API context
const ApiContext = createContext();

// Custom hook to use the API context
export const useApi = () => useContext(ApiContext);

// API Provider component
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to make API requests
  const fetchData = async (url, method = 'GET', data = null) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add headers if needed
        },
        body: data ? JSON.stringify(data) : null,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const responseData = await response.json();
      setLoading(false);
      return responseData;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };


  // Function to post file
const postFile = async (url, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }
  
      setLoading(false);
      return response.json();
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error('Error uploading file:', err);
      throw err;
    }
  };
  

  // Clear error
  const clearError = () => setError(null);

  return (
    <ApiContext.Provider value={{ fetchData, postFile, loading, error, clearError }}>
      {children}
    </ApiContext.Provider>
  );
};
