import * as React from 'react';
import {createContext, useContext, useState, useEffect, useMemo} from 'react';
import SInfo from 'react-native-encrypted-storage';

export const AuthContext = createContext();

import PropTypes from 'prop-types';
import {BASE_URL} from '../constants/constants';
import {ToastAndroid, PermissionsAndroid, Linking} from 'react-native';

export const AuthProvider = ({children}) => {
  const [index, setIndex] = useState(null);
  const [classes, setClasses] = useState([]);

  const [refreshing, setRefreshing] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(true);

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
      setTokenVerified(data.auth);
    } catch (error) {
      if (
        token != null &&
        (token.type === 'student' || token.type === 'teacher')
      ) {
        ToastAndroid.show('Error fetching data', ToastAndroid.SHORT);
      }
      if (token == null) {
        setIndex('0');
      } else if (token.type === 'student') {
        //Fallback for student
        setRollNumberG(token.roll);
        setStudentEmailG(token.email);
        setStudentNameG(token.name);
        setStudentidG(token.id);
        setTokenVerified(token.auth);
        setIndex('2');
      } else {
        //Fallback for teacher
        setTeacherNameG(token.name);
        setTeacherEmailG(token.email);
        setDepartmentG(token.department);
        setTeacheridG(token.id);
        setTokenVerified(token.auth)
        setIndex('1');
      }
      console.log('Error fetching student data:', error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('Location permission denied !', ToastAndroid.LONG);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const turnONGPS = async () => {
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
      .then(() => {
        console.log('Settings opened');
      })
      .catch(err => {
        console.error('Failed to open settings:', err);
      });
  };

  useEffect(() => {
    directLogin();
    requestLocationPermission();
  }, []);

  const handleSendOtp = async (type, id) => {
    console.log('Sending OTP:', type, id);
    try {
      if (!id) {
        ToastAndroid.show('Email or Rollnumber is required', ToastAndroid.LONG);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/${type}/otp-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          type == 'student'
            ? JSON.stringify({
                rollNumber: id,
              })
            : JSON.stringify({
                email: id,
              }),
      });

      const data = await response.json();

      if (response.ok) {
        ToastAndroid.show('OTP sent to your email', ToastAndroid.LONG);
        if (data.otpToken) {
          return data.otpToken;
        }
      } else {
        ToastAndroid.show(
          data.error || 'Failed to send OTP',
          ToastAndroid.LONG,
        );
        return null;
      }
    } catch (error) {
      console.log(error);
      if (
        error.name === 'TypeError' &&
        error.message.includes('Network request failed')
      ) {
        ToastAndroid.show(
          'Network error. Please check your connection.',
          ToastAndroid.LONG,
        );
      } else {
        ToastAndroid.show(
          'Failed to send OTP. Please try again.',
          ToastAndroid.LONG,
        );
      }

      return null;
    }
  };

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
      setStudentClass,
      directLogin,
      turnONGPS,
      tokenVerified,
      setTokenVerified,
      handleSendOtp,
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
      setStudentClass,
      directLogin,
      turnONGPS,
      tokenVerified,
      setTokenVerified,
      handleSendOtp,
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
