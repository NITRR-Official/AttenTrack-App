import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import {BASE_URL} from '../constants/constants';
import {useAuth} from '../utils/auth';
import OTPVerification from './OTPVerification';

const ChangePassword = ({closeDialog, type, id}) => {
  const {
    branch,
    semester,
    enroll,
    phone,
    eduQualification,
    telephone,
    interest,
    setInterest,
    setEduQualification,
    setTelephone,
    setBranch,
    setSemester,
    setEnroll,
    setPhone,
    tokenVerified,
  } = useAuth();
  const [selectedTab, setSelectedTab] = useState('info');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [_eduQualification, _setEduQualification] = useState(eduQualification);
  const [_telephone, _setTelephone] = useState(telephone);
  const [_interest, _setInterest] = useState(interest);

  const [_branch, _setBranch] = useState(branch);
  const [_semester, _setSemester] = useState(semester);
  const [_enroll, _setEnroll] = useState(enroll);
  const [_phone, _setPhone] = useState(phone);
  const [tokenDialog, setTokenDialog] = useState(false);

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/${type}/change`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...(type === 'student' ? {rollNumber: id} : {email: id}),
          oldPassword,
          newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }
      ToastAndroid.show(`Password changed for ${id}`, ToastAndroid.LONG);
      closeDialog(false);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/${type}/update`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...(type === 'student' ? {rollNumber: id} : {email: id}),
          ...(type === 'student'
            ? {branch: _branch}
            : {eduQualification: _eduQualification}),
          ...(type === 'student'
            ? {semester: _semester}
            : {telephone: _telephone}),
          ...(type === 'student' ? {enroll: _enroll} : {interest: _interest}),
          ...(type === 'student' ? {phone: _phone} : {dummy: null}),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }
      // Update the auth context with new values
      if (type === 'student') {
        setBranch(_branch === '' ? 'Not Set' : _branch);
        setSemester(_semester === '' ? 'Not Set' : _semester);
        setEnroll(_enroll === '' ? 'Not Set' : _enroll);
        setPhone(_phone === '' ? 'Not Set' : _phone);
      } else {
        setEduQualification(
          _eduQualification === '' ? 'Not Set' : _eduQualification,
        );
        setTelephone(_telephone === '' ? 'Not Set' : _telephone);
        setInterest(_interest === '' ? 'Not Set' : _interest);
      }
      ToastAndroid.show(`Updated the details for ${id}`, ToastAndroid.LONG);
      closeDialog(false);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible animationType="slide">
      {tokenDialog && (
        <OTPVerification closeDialog={setTokenDialog} id={id} type={type} />
      )}
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
              onPress={() => setSelectedTab('info')}>
              <Text style={styles.tabText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'password' && styles.activeTab,
              ]}
              onPress={() => setSelectedTab('password')}>
              <Text style={styles.tabText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'info' ? (
            <>
              {type === 'student' ? (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>Branch / Department</Text>
                  <TextInput
                    style={styles.input}
                    value={_branch === 'Not Set' ? '' : _branch}
                    placeholderTextColor={'#999'}
                    placeholder="Branch"
                    onChangeText={_setBranch}
                  />
                </View>
              ) : (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>
                    Educational Qualification
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={'#999'}
                    value={
                      _eduQualification === 'Not Set' ? '' : _eduQualification
                    }
                    placeholder="Educational Qualification"
                    onChangeText={_setEduQualification}
                  />
                </View>
              )}

              {type === 'student' ? (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>Current Semester</Text>
                  <TextInput
                    style={styles.input}
                    value={_semester === 'Not Set' ? '' : _semester}
                    placeholder="Semester"
                    keyboardType="numeric"
                    placeholderTextColor={'#999'}
                    onChangeText={_setSemester}
                  />
                </View>
              ) : (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>Contact Number</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholderTextColor={'#999'}
                    value={_telephone === 'Not Set' ? '' : _telephone}
                    placeholder="Contact Number"
                    onChangeText={_setTelephone}
                  />
                </View>
              )}

              {type === 'student' ? (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>Enrollment Number</Text>
                  <TextInput
                    style={styles.input}
                    value={_enroll === 'Not Set' ? '' : _enroll}
                    placeholder="Enrollment Number"
                    keyboardType="numeric"
                    placeholderTextColor={'#999'}
                    onChangeText={_setEnroll}
                  />
                </View>
              ) : (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>Areas of Interest</Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={'#999'}
                    value={_interest === 'Not Set' ? '' : _interest}
                    placeholder="Areas of Interest"
                    onChangeText={_setInterest}
                  />
                </View>
              )}
              {type === 'student' && (
                <View style={styles.container}>
                  <Text style={styles.smallTabText}>Contact Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    value={_phone == 'Not Set' ? '' : _phone}
                    placeholderTextColor={'#999'}
                    keyboardType="numeric"
                    onChangeText={_setPhone}
                  />
                </View>
              )}
            </>
          ) : (
            <>
              <View style={styles.container}>
                <Text style={styles.smallTabText}>Old Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Old Password"
                  secureTextEntry
                  value={oldPassword}
                  placeholderTextColor={'#999'}
                  onChangeText={setOldPassword}
                />
              </View>

              <View style={styles.container}>
                <Text style={styles.smallTabText}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  placeholderTextColor={'#999'}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={styles.container}>
                <Text style={styles.smallTabText}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPassword}
                  placeholderTextColor={'#999'}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            {selectedTab === 'password' ? (
              <TouchableOpacity
                style={styles.button}
                onPress={handleSavePassword}>
                {loading ? (
                  <ActivityIndicator animating={true} color={'white'} />
                ) : (
                  <Text style={styles.buttonText}>Change</Text>
                )}
              </TouchableOpacity>
            ) : !tokenVerified ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setTokenDialog(true);
                }}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleUpdate} style={styles.button}>
                {loading ? (
                  <ActivityIndicator animating={true} color={'white'} />
                ) : (
                  <Text style={styles.buttonText}>Update</Text>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => closeDialog(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ChangePassword.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ChangePassword;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingBottom: 0,
    paddingTop: 3,
    paddingLeft: 4,
    paddingRight: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {borderBottomColor: '#007bff'},
  tabText: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  input: {
    width: '95%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {backgroundColor: '#dc3545'},
  buttonText: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
  smallTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
});
