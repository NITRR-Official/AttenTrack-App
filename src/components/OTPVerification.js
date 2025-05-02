import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {useAuth} from '../utils/auth';
import {BASE_URL} from '../constants/constants';

const OTPVerification = ({closeDialog, type, id}) => {
  const [otp, setOTP] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(30);
  const [mul, setMul] = useState(1);

  const {handleSendOtp, setTokenVerified} = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter == 0) clearInterval(interval);
      else setCounter(counter - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  const verifyUser = async (type, id, token, otp) => {
    if (!id || !otp || !token) {
      ToastAndroid.show('Fill all the fields', ToastAndroid.LONG);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/${type}/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp: Number.parseInt(otp, 10),
          ...(type === 'student' ? {rollNumber: id} : {email: id}),
          verify: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const data = await response.json();
      console.log('User verified:', data);
      ToastAndroid.show(`User verified ${id}`, ToastAndroid.LONG);
      setTokenVerified(true);
      closeDialog(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Request failed: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
      );
    } finally {
      setLoading(false);
    };
  };

  //OTP generation and sending logic can be added here
  const OTPGeneration = async () => {
    handleSendOtp(type, id)
      .then(result => {
        setToken(result);
        if (result) {
          setMul(mul + 1);
          setCounter(mul * 30);
        }
      })
      .catch(err => {
        console.log('From OTP Verification system: ', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    OTPGeneration();
  }, []);

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.title}>OTP Verification</Text>
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

          {counter > 0 ? (
            <Text className="text-sm text-[#01818C]">
              Resend OTP in{' '}
              {Math.floor(counter / 60)
                .toString()
                .padStart(2, '0')}
              :{(counter % 60).toString().padStart(2, '0')} seconds
            </Text>
          ) : (
            <TouchableOpacity
              disabled={counter > 0}
              onPress={() => {
                // Reset seconds to 30 when resent OTP is clicked
                setLoading(true);
                OTPGeneration();
              }}>
              <Text className="text-sm text-[#01818C] underline">
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                verifyUser(type, id, token, otp);
              }}>
              {loading ? (
                <ActivityIndicator animating={true} color={'white'} />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
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

OTPVerification.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default OTPVerification;

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
