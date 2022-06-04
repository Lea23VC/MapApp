import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

import signUp from './screens/auth/signup';
import MainMap from './screens/mainMap';
import addMarker from './screens/maps/addMarker';
import Home from './screens/home';
import editMarker from './screens/maps/editMarker';
import Profile from './screens/profile';
import EditProfile from './screens/editProfile';

import MarkerInfo from './screens/maps/markerInfo';

import {LogBox} from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
export default function App() {
  return (
    // <MainMap/>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Map"
          component={MainMap}
          options={{title: 'Mapa'}}
        />
        <Stack.Screen
          name="SignUp"
          component={signUp}
          options={{title: 'Registrarse'}}
        />
        <Stack.Screen
          name="AddMarker"
          component={addMarker}
          options={{title: 'Añadir marcador'}}
        />
        <Stack.Screen
          name="EditMarker"
          component={editMarker}
          options={{title: 'Editar marcador'}}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{title: 'Perfil'}}
        />
        <Stack.Screen
          name="Edit Profile"
          component={EditProfile}
          options={{title: 'Editar Perfil'}}
        />
        <Stack.Screen
          name="Marker Info"
          component={MarkerInfo}
          options={{title: 'Punto de reciclaje'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
