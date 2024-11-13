import * as React from "react";
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [index, setIndex] = useState(0);
    const [classes, setClasses] = useState([]);
    const [jsonGlobalData, setJsonGlobalData] = useState();

    const [teacheridG, setTeacheridG] = useState('');
    const [teacherNameG, setTeacherNameG] = useState('');
    const [teacherEmailG, setTeacherEmailG] = useState('');
    const [departmentG, setDepartmentG] = useState('');

    const [classId, setClassId] = useState('');

    const [loading, setLoading] = useState(false);
    
    const [rollNumberG, setRollNumberG] = useState(false);
    
    return (
        <AuthContext.Provider
            value={{
                classes,
                setClasses,
                index,
                setIndex,
                jsonGlobalData,
                setJsonGlobalData,
                teacheridG,
                setTeacheridG,
                teacherNameG,
                setTeacherNameG,
                teacherEmailG,
                setTeacherEmailG,
                departmentG,
                setDepartmentG,
                loading,
                setLoading,
                rollNumberG,
                setRollNumberG,
                classId,
                setClassId
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
