import React, {Component, useState, setState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  Button,
  View,
  StatusBar,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import MapView, {Marker, Callout, Geojson} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNLocation from 'react-native-location';
import * as Location from 'expo-location';

import firestore from '@react-native-firebase/firestore';

export default function ModalMap(props) {
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState(null);

  function addMarker() {
    props.setMarkers([
      ...props.markers,
      {latlng: props.currentPosition, title: number},
    ]);

    // console.log(props.modalMarkers);
    onChangeNumber(null);

    firestore()
      .collection('Maps')
      .add({
        latlng: props.currentPosition,
        title: number,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('Map added!');
      });
    props.setModalVisible(!props.modalVisible);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        props.setModalVisible(props.modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="Ingrese titulo"
          />

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => addMarker()}>
            <Text style={styles.textStyle}>Agregar sitio</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
