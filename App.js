import React, {Component, useState, setState} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  Button,
  View,
  StatusBar,
} from 'react-native';
import MapView, {Marker, Callout, Geojson} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const myPlace = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [33.7872131, 48.844287],
      },
    },
  ],
};

export default function App() {
  const initalState = {
    latitude: 3.43343,
    longitude: 44.5,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const [currentPosition, setCurrentPosition] = useState(initalState);

  console.log(currentPosition, ' XD');
  Geolocation.getCurrentPosition(info => console.log(info), {
    enableHighAccuracy: false,
    timeout: 2000,
    maximumAge: 3600000,
  });

  onMarkerDragEnd = evt => {
    // console.log(evt);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView
        followsUserLocation={true}
        showsUserLocation={true}
        style={styles.map}
        // customMapStyle={MapStyle}
        initialRegion={{
          latitude: -33.48570804015753,
          longitude: -70.63525836493673,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0,
        }}>
        {[
          {
            coordinate: {latitude: -33, longitude: 70},
            title: 'Flatiron School Atlanta XD',
            description: 'This is where the magic happens!',
          },
          {
            coordinate: {latitude: 32.7872131, longitude: -81.381931},
            title: 'Flatiron School Atlanta XD 2',
            description: 'This is where the magic happens! 2',
          },
        ].map((map, index) => (
          <Marker
            key={index}
            draggable={true}
            pinColor="blue"
            coordinate={map.coordinate}
            title={map.title}
            description="This is where the magic happens!"></Marker>
        ))}
        <Callout />

        <Marker
          draggable={true}
          pinColor="yellow"
          coordinate={currentPosition}
          title="XD"
          description="This is where the magic happens!"></Marker>
      </MapView>
      <Text>Probando 1 2 3</Text>

      <Button
        onPress={onMarkerDragEnd}
        title="Click"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginTop: -200,
  },
});
