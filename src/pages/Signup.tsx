
import React from 'react';
import { Navigate } from 'react-router-dom';

const Signup = () => {
  // Redirect to the main auth page since we have that implemented
  return <Navigate to="/auth" replace />;
};

export default Signup;
