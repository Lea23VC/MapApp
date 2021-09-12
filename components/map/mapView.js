import React, {Component, useState, setState, useEffect} from 'react';

import MapView, {Marker, Callout, Geojson} from 'react-native-maps';

import ModalMap from './modalMap.js';
import {
  StyleSheet,
  Text,
  Dimensions,
  Button,
  View,
  StatusBar,
  Modal,
  Pressable,
  TextInput,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
var b = [];
var aux = 0;
firestore()
  .collection('Maps')
  .orderBy('createdAt')
  .onSnapshot(querySnapshot => {
    console.log(querySnapshot.docs);
    b = querySnapshot.docs.map(doc => doc.data());
    console.log('B: ', b);
    querySnapshot.forEach(snapshot => {
      // console.log('item: ', i);
      // let data = snapshot.data();
      // console.log('XD ', data);
      // if (i >= aux) {
      //   aux = i;
      //   b.push(data);
      // }
      // i++;
    });
  });

// You want to get the list of documents in the student collection

// firestore()
//   .ref('/Maps')
//   .child('map')
//   .once('value')
//   .then(data => {
//     let fetchedData = data.val();
//     console.log('Fetched Data', fetchedData);
//   })
//   .catch(error => {
//     console.log('Fetching Error', error);
//   });

// var a = [];
// firestore()
//   .collection('Maps')
//   .get()
//   .then(querySnapshot => {
//     querySnapshot.forEach(snapshot => {
//       let data = snapshot.data();
//       console.log(data);
//       a = [...a, data];
//     });

//     return querySnapshot;
//   });

const initialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0.000922,
  longitudeDelta: 0.000421,
};

export default function mapView() {
  const [modalVisible, setModalVisible] = useState(false);

  const [markers, setMarkers] = useState([]);
  const [modalMarkers, setModalMarkers] = useState(null);

  const [currentPosition, setCurrentPosition] = useState(initialState);

  //console.log(usersCollection);

  Geolocation.getCurrentPosition(
    position => {
      const {longitude, latitude} = position.coords;
      setCurrentPosition({
        ...currentPosition,
        latitude,
        longitude,
      });
    },

    error => alert(error.message),
    {
      timeout: 20000,
      maximumAge: 5000,
      enableHighAccuracy: true,
    },
  );

  return currentPosition.latitude ? (
    <View style={styles.container}>
      <ModalMap
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setModalMarkers={setModalMarkers}
        currentPosition={currentPosition}
        modalMarkers={modalMarkers}
        setMarkers={setMarkers}
        markers={markers}
      />
      <MapView
        onPress={e =>
          setMarkers([...markers, {latlng: e.nativeEvent.coordinate}])
        }
        showsUserLocation
        followsUserLocation
        style={styles.map}
        // customMapStyle={MapStyle}
        // region={currentPosition}>
        initialRegion={currentPosition}>
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

        {b.map((marker, i) => (
          <Marker
            key={i}
            coordinate={marker.latlng}
            title={marker.title ? marker.title : 'placeholder'}
          />
        ))}

        {/* {modalMarkers ? (
          <Marker
            pinColor="blue"
            title={'test'}
            coordinate={{
              latitude: modalMarkers.latitude,
              longitude: modalMarkers.longitude,
            }}></Marker>
        ) : null} */}
        <Marker
          draggable={true}
          pinColor="yellow"
          coordinate={currentPosition}
          title={'XD'}
          description="This is where the magic happens!"></Marker>
      </MapView>

      <Text>Probando 1 2 3</Text>

      <Text>
        {currentPosition.latitude !== 0
          ? `Latitud: ${currentPosition.latitude}`
          : 'Latitud: ...'}
      </Text>

      <Text>
        {currentPosition.longitude !== 0
          ? `Longitud: ${currentPosition.longitude}`
          : 'Longitud: ...'}
      </Text>

      <Button
        onPress={() => setModalVisible(true)}
        title="Agregar sitio"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  ) : (
    <ActivityIndicator style={{flex: 1}} />
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
