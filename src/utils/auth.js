import * as React from "react";
import { createContext, useContext, useState } from 'react';
import { studentsData } from "../screens/teacher/studentsData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [classes, setClasses] = useState([]);
    const [index, setIndex] = useState(0);
    const [jsonGlobalData, setJsonGlobalData] = useState(studentsData);
    const [teacherid, setTeacherid] = useState('');
    const [departmentG, setDepartmentG] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <AuthContext.Provider
            value={{
                classes,
                setClasses,
                index,
                setIndex,
                jsonGlobalData,
                setJsonGlobalData,
                teacherid,
                setTeacherid,
                departmentG,
                setDepartmentG,
                loading,
                setLoading
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
