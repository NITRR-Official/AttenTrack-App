import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import {BASE_URL} from '../constants/constants';

const ForgotPassword = ({closeDialog, type, id, otpToken}) => {
  const [otp, setOTP] = useState('');

  const forgotPassword = async (type, id) => {
    if (!id) {
      ToastAndroid.show(
        'Roll Number or Email Should Not Be Empty',
        ToastAndroid.LONG,
      );
      return;
    }
    try {
      console.log('Forgot password request:', type, id);
      const response = await fetch(`${BASE_URL}/api/${type}/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${otpToken}`,
        },
        body: JSON.stringify({
            otp: Number.parseInt(otp, 10),
            ...(type === 'student'
              ? { rollNumber: id }
              : { email: id }),
          })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const data = await response.json();
      console.log('Password resetted:', data);
      ToastAndroid.show(
        `Password reset please register again using your registered ${id}`,
        ToastAndroid.LONG,
      );
      closeDialog(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Request failed: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
      );
    }
  };

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            style={styles.input}
            value={id}
            editable={false}
            placeholder="User ID"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter received OTP"
            secureTextEntry
            placeholderTextColor={'#999'}
            value={otp}
            onChangeText={setOTP}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={()=>{forgotPassword(type, id)}}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
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

ForgotPassword.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  otpToken: PropTypes.string.isRequired,
};

export default ForgotPassword;

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
  title: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
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
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
