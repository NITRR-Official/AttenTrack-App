import * as React from 'react';
import {createContext, useContext, useState, useEffect, useMemo} from 'react';
import SInfo from 'react-native-encrypted-storage';

export const AuthContext = createContext();

import PropTypes from 'prop-types';
import {BASE_URL} from '../constants/constants';
import { ToastAndroid } from 'react-native';

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
  const [studentidG, setStudentidG] = useState(null);
  const [studentNameG, setStudentNameG] = useState('');
  const [studentEmailG, setStudentEmailG] = useState('');
  const [studentClass, setStudentClass] = useState([]);

  const [eduQualification, setEduQualification] = useState('Not Set');
  const [telephone, setTelephone] = useState('Not Set');
  const [interest, setInterest] = useState('Not Set');

  const [branch, setBranch] = useState('Not Set');
  const [semester, setSemester] = useState('Not Set');
  const [pass, setPass] = useState('Not Set');
  const [enroll, setEnroll] = useState('Not Set');
  const [phone, setPhone] = useState('Not Set');

  const directLogin = async () => {
    let token = null;
    try {
      token = JSON.parse(await SInfo.getItem('token'));
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
        setPass(data.batch);
        setBranch(data.branch);
        setSemester(data.semester);
        setEnroll(data.enroll);
        setPhone(data.phone);
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
        setInterest(data.interest);
        setEduQualification(data.eduQualification);
        setTelephone(data.telephone);
        setRefreshing(true);
        setIndex('1'); // Set index for teacher
      }
    } catch (error) {
      if(token != null && (token.type === 'student' || token.type === 'teacher')){
        ToastAndroid.show("Error fetching data", ToastAndroid.SHORT);
      }
      if (token == null) {
        setIndex('0');
      } else if (token.type === 'student') {
        setIndex('2');
      } else {
        setIndex('1');
      }
      console.log('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    directLogin();
  }, []);

  const contextValue = useMemo(
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
      eduQualification,
      setEduQualification,
      interest,
      setInterest,
      telephone,
      setTelephone,
      branch,
      setBranch,
      semester,
      setSemester,
      pass,
      setPass,
      enroll,
      setEnroll,
      phone,
      setPhone,
      studentClass,
      setStudentClass
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
      eduQualification,
      setEduQualification,
      interest,
      setInterest,
      telephone,
      setTelephone,
      branch,
      setBranch,
      semester,
      setSemester,
      pass,
      setPass,
      enroll,
      setEnroll,
      phone,
      setPhone,
      studentClass, 
      setStudentClass
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
