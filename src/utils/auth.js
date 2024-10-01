import * as React from "react";

// Navigators
import {createContext, useContext, useState} from 'react';
import {ToastAndroid, Linking} from 'react-native';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [student, setStudent] = useState(false);
    const [index, setIndex] = useState(0);

    return (
        <AuthContext.Provider
          value={{
            student,
            setStudent,
            index,
            setIndex
          }}>
          {children}
        </AuthContext.Provider>
      );
    
}


export const useAuth = () => {
    return useContext(AuthContext);
  };