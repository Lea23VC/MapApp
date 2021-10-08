import React, {Component, useState, setState, useEffect} from 'react';
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
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import ModalMap from '../components/map/modalMap.js';
import MapView from '../components/map/mapView.js';
import firestore from '@react-native-firebase/firestore';

var b = [];
var aux = 0;
firestore()
  .collection('Maps')
  .orderBy('createdAt')
  .onSnapshot(querySnapshot => {
    var i = 0;
    console.log('i: ', i);
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

    console.log('total: ', aux);
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

export default function App() {
  const permission = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
  };
  useEffect(() => {
    permission();

    return () => {
      isMounted = false;
    };
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [modalMarkers, setModalMarkers] = useState(null);

  // firestore()
  //   .collection('Maps')
  //   .(querySnapshot => {
  //     querySnapshot.forEach(snapshot => {
  //       console.log('test0: ', markers);
  //       setMarkers([...markers, snapshot._data]);
  //       console.log('test: ', snapshot._data);

  //       // let data = snapshot.data();
  //       // console.log('XD ', data);
  //     });
  //   });
  // add your code for get and update makers every second

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView />

      {/* <ModalMap
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
        <Marker
          draggable={true}
          pinColor="yellow"
          coordinate={currentPosition}
          title={'XD'}
          description="This is where the magic happens!"></Marker>
      </MapView> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
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
