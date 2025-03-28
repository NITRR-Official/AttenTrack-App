import * as React from "react";
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

import PropTypes from 'prop-types';

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const AuthProvider = ({ children }) => {

    const [index, setIndex] = useState('0');
    const [classes, setClasses] = useState([]);

    const [refreshing, setRefreshing] = useState(true);

    const [teacheridG, setTeacheridG] = useState('');
    const [teacherNameG, setTeacherNameG] = useState('');
    const [teacherEmailG, setTeacherEmailG] = useState('');
    const [departmentG, setDepartmentG] = useState('');

    const [classId, setClassId] = useState('');

    const [loading, setLoading] = useState(false);
    
    const [rollNumberG, setRollNumberG] = useState('');
    const [studentidG, setStudentidG] = useState('');
    const [studentNameG, setStudentNameG] = useState('');
    const [studentEmailG, setStudentEmailG] = useState('');
    
    const contextValue = React.useMemo(() => ({
        studentidG, setStudentidG, studentNameG, setStudentNameG, studentEmailG, setStudentEmailG,
        refreshing,
        setRefreshing,
        classes,
        setClasses,
        index,
        setIndex,
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
        setClassId,
    }), [
        studentidG, setStudentidG, studentNameG, setStudentNameG, studentEmailG, setStudentEmailG,
        refreshing,
        setRefreshing,
        classes,
        setClasses,
        index,
        setIndex,
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
        setClassId,
    ]);
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
