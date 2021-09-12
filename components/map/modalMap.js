import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';

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

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
