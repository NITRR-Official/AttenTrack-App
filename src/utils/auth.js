import * as React from "react";

// Navigators
import React, {createContext, useContext, useState} from 'react';
import {ToastAndroid, Linking} from 'react-native';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [student, setStudent] = useState(false);

    return (
        <AuthContext.Provider
          value={{
            student,
            setStudent
          }}>
          {children}
        </AuthContext.Provider>
      );
    
}


export const useAuth = () => {
    return useContext(AuthContext);
  };