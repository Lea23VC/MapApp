import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button, TextInput, HelperText} from 'react-native-paper';
import ModalCreateUser from '../components/sign_login/modalCreateUser';
import firestore from '@react-native-firebase/firestore';
import {loginUserBackend} from '../api/users';

export default function App({navigation}) {
  // Set an initializing state whilst Firebase connects

  const [modalVisible, setModalVisible] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
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
  async function onAuthStateChanged(user) {
    console.log('user in oath: ', user);

    if (user) {
      token = await user.getIdToken();
      console.log('token: ', token);
      loginUserBackend(token);
    }

    setUser(user);
    if (initializing) setInitializing(false);
  }

  const hasErrors = () => {
    if (email.length >= 5) {
      return !email.includes('@');
    }
    return false;
  };

  async function loginUser(email, password) {
    //Check for the Email TextInput
    if (!email.trim()) {
      alert('Please Enter Email');
      return;
    }
    if (!password.trim()) {
      alert('Please Enter Password');
      return;
    }
    //Checked Successfully
    //Do whatever you want

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        console.log('users: ', userCredential.user);
        console.log('User account created & signed in!');
        token = await userCredential.user.getIdToken();
        console.log('token auth: ', token);
        console.log('user uid: ', userCredential.user.uid);
        loginUserBackend(token);
        navigation.navigate('Map', {name: 'Jane', user: userCredential.user});
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

  async function goToMap() {
    const user_data = await firestore().collection('Users').doc(user.uid).get();
    console.log('user data: ', user_data);
    navigation.navigate('Map', {name: 'Jane', user: user_data});
  }

  async function goToProfile() {
    navigation.navigate('Profile', {userId: user.uid});
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <View style={styles.container}>
          <ModalCreateUser
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            auth={auth}
          />

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

          <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            label="Ingrese contraseña"
          />

          <View style={styles.buttonPadding}>
            <Button
              style={styles.button}
              icon="login"
              mode="outlined"
              onPress={() => {
                loginUser(email, password);
              }}>
              Iniciar sesión
            </Button>
          </View>
          <View style={styles.buttonPadding}>
            <Button
              style={styles.button}
              icon="login"
              mode="outlined"
              onPress={() =>
                navigation.navigate('SignUp', {name: 'Jane', auth: auth})
              }>
              Registrarse
            </Button>
          </View>

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
        style={styles.button}
        icon="login"
        mode="outlined"
        onPress={() => {
          signOut();
        }}>
        Cerrar Sesión
      </Button>

      <Button
        style={styles.button}
        icon="login"
        mode="outlined"
        onPress={() => {
          goToMap();
        }}>
        Ver Mapa
      </Button>

      <Button
        style={styles.button}
        icon="login"
        mode="outlined"
        onPress={() => {
          goToProfile();
        }}>
        Ver Perfil
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    alignSelf: 'center',
  },
  button: {
    alignSelf: 'center',
  },
  buttonPadding: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
