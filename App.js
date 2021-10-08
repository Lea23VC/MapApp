import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};
import MainMap from './screens/mainMap';
import Home from './screens/home';
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
