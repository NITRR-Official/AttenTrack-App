import * as React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import SInfo from 'react-native-encrypted-storage';

export const AuthContext = createContext();

import PropTypes from 'prop-types';
import {BASE_URL} from '../constants/constants';

export const AuthProvider = ({children}) => {
  const [index, setIndex] = useState(null);
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

  const directLogin = async () => {
    try {
      const token = JSON.parse(await SInfo.getItem('token'));
      const response = await fetch(
        `${BASE_URL}/api/${token.type}/token-login`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.data}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (token.type === 'student') {
        setRollNumberG(data.rollNumber);
        setStudentidG(data.id);
        setStudentNameG(data.fullName);
        setStudentEmailG(data.email);
        setIndex('2'); // Set index for student
      } else {
        setClasses(
          data.coursesId.map(classItem => ({
            id: classItem._id,
          })),
        );
        setTeacheridG(data.id);
        setDepartmentG(data.department);
        setTeacherNameG(data.fullName);
        setTeacherEmailG(data.email);
        setIndex('1'); // Set index for teacher
      }
    } catch (error) {
      setIndex('0');
      console.log('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    directLogin();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      studentidG,
      setStudentidG,
      studentNameG,
      setStudentNameG,
      studentEmailG,
      setStudentEmailG,
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
    }),
    [
      studentidG,
      setStudentidG,
      studentNameG,
      setStudentNameG,
      studentEmailG,
      setStudentEmailG,
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
    ],
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
