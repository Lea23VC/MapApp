import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {registerUser} from '../../api/users';
// var dayjs = require('dayjs');
// import firestore from '@react-native-firebase/firestore';
// import DatePicker from 'react-native-date-picker';
export default function ModalMap({route, navigation}) {
  console.log('route: ', route.params);
  const [date, setDate] = useState(new Date());
  // const [open, setOpen] = useState(false);
  const [firstName, onChangeFirstName] = React.useState(null);
  // const [lastName, onChangeLastName] = React.useState(null);
  const [email, onChangeEmail] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const [username, onChangeUserName] = React.useState(null);
  // const [birthDate, onChangeBirthDate] = React.useState(null);

  // const dateNow = new Date();
  // const hideModal = () => props.setModalVisible(false);
  async function addUser() {
    const cred = await route.params
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        const uid = user.user.uid;
        console.log('user created: ', uid);
        console.log('User account created & signed in!');
        registerUser(uid, username, firstName, date, email);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
    navigation.goBack();
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
        {/* <Button
          mode="outlined"
          style={[styles.button, styles.buttonClose]}
          onPress={() => setOpen(true)}>
          <Text>Fecha de Nacimiento</Text>
        </Button>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={date}
          locale="en-GB"
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        /> */}

        {/* <View style={styles.row}>
            <Text>
              {date ? `Fecha: ${dayjs(date).format('DD/MM/YYYY')}` : ''}
            </Text>
            <Button title="Fecha" onPress={() => setOpen(true)} />
            <DatePicker
              modal
              mode="date"
              open={open}
              date={dateNow}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View> */}
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
