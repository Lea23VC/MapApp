import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {registerUser} from '../../api/users';
// var dayjs = require('dayjs');
// import firestore from '@react-native-firebase/firestore';
// import DatePicker from 'react-native-date-picker';
export default function ModalMap({route, navigation}) {
  console.log('route: ', route.params);
  const [date, setDate] = useState(new Date());
  // const [open, setOpen] = useState(false);
  const [firstName, onChangeFirstName] = React.useState('');
  // const [lastName, onChangeLastName] = React.useState(null);
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState(null);
  const [username, onChangeUserName] = React.useState(null);
  // const [birthDate, onChangeBirthDate] = React.useState(null);

  // const dateNow = new Date();
  // const hideModal = () => props.setModalVisible(false);
  const hasErrors = () => {
    if (email.length >= 5) {
      return !email.includes('@');
    }
    return false;
  };

  async function addUser() {
    if (!firstName || firstName == '' || !hasErrors) {
      alert('Please Enter Email');
    } else {
      const cred = await route.params
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async user => {
          const uid = user.user.uid;
          console.log('user created: ', uid);
          console.log('User account created & signed in!');
          await registerUser(uid, username, firstName, date, email)
            .then(navigation.goBack())
            .catch(function (error) {
              alert('Error: ', error);
            });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            alert('That email address is already in use!');
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            alert('That email address is invalid!');
            console.log('That email address is invalid!');
          }

          console.error(error);
          return;
        });
    }
  }

  return (
    <View>
      <View style={styles.modalView}>
        <View style={styles.viewText}>
          <TextInput
            mode="outlined"
            onChangeText={onChangeFirstName}
            value={firstName}
            label="Ingrese nombre"
          />
        </View>

        <View style={styles.viewText}>
          <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={onChangeUserName}
            value={username}
            label="Ingrese nombre de usuario"
          />
        </View>
        <View style={styles.viewText}>
          <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            label="Ingrese email"
          />
          <HelperText type="error" visible={hasErrors()}>
            Correo no valido
          </HelperText>
        </View>
        <View style={styles.viewText}>
          <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            label="Ingrese contraseña"
          />
        </View>
        <View style={{paddingTop: 20}}>
          <Button
            mode="outlined"
            style={[styles.button, styles.buttonClose]}
            onPress={() => addUser()}>
            <Text>Crear Usuario</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {},
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 55,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {},

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
