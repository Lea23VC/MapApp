import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import ModalCreateUser from '../components/sign_login/modalCreateUser';

export default function App({navigation}) {
  // Set an initializing state whilst Firebase connects

  const [modalVisible, setModalVisible] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, onChangeEmail] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const checkTextInput = () => {
    //Check for the Name TextInput
    if (!textInputName.trim()) {
      alert('Please Enter Name');
      return;
    }
    //Check for the Email TextInput
    if (!textInputEmail.trim()) {
      alert('Please Enter Email');
      return;
    }
    //Checked Successfully
    //Do whatever you want
    alert('Success');
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log('user in oath: ', user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  function createUser(email, password) {
    auth()
      .createUserWithEmailAndPassword(
        'jane.doe@example.com',
        'SuperSecretPassword!',
      )
      .then(users => {
        console.log(users);
        console.log('User account created & signed in!');
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
  }

  function loginUser(email, password) {
    console.log('Print test: ', email);
    if (!email.trim()) {
      alert('Please Enter Name');
      return;
    }
    //Check for the Email TextInput
    if (!password.trim()) {
      alert('Please Enter Email');
      return;
    }
    //Checked Successfully
    //Do whatever you want

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(users => {
        console.log(user);
        console.log('User account created & signed in!');
        navigation.navigate('Map', {name: 'Jane', user: user});
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
  }

  function signOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <View>
          <ModalCreateUser
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />

          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Ingrese email"
          />

          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            placeholder="Ingrese contraseña"
          />

          <Button
            title="Iniciar sesión"
            onPress={() => {
              loginUser(email, password);
            }}
          />

          <Button title="Crear usuario" onPress={() => setModalVisible(true)} />

          {/* <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              createUser();
            }}>
            <Text style={styles.textStyle}>Crear usuario</Text>
          </Pressable> */}
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button
        title="Cerrar Sesión"
        onPress={() => {
          signOut();
        }}
      />

      <Button
        title="Ver Mapa"
        onPress={() => {
          navigation.navigate('Map', {name: 'Jane', user: user});
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  viewButtons: {
    borderRadius: 20,
    width: '70%',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    backgroundColor: 'white',
    padding: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
