import * as React from "react";
import { createContext, useContext, useState } from 'react';
import { studentsData } from "../screens/teacher/studentsData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [classes, setClasses] = useState(['VLSI (2025 BATCH)','Analog Communication (2026 BATCH)','Operating System (2026 BATCH)']);
    const [index, setIndex] = useState(0);
    const [jsonGlobalData, setJsonGlobalData] = useState(studentsData);

    return (
        <AuthContext.Provider
            value={{
                classes,
                setClasses,
                index,
                setIndex,
                jsonGlobalData,
                setJsonGlobalData
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
