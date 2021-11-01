import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {Checkbox, TextInput, Button} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function ModalMap(props) {
  const [text, onChangeText] = React.useState('Useless Text');
  const [name, onChangeName] = React.useState(null);

  const [PET, setPET] = React.useState(false);
  const [PE, setPE] = React.useState(false);
  const [PVC, setPVC] = React.useState(false);
  const [aluminium, setAluminium] = React.useState(false);
  const [cardboard, setCardboard] = React.useState(false);
  const [glass, setGlass] = React.useState(false);
  const [paper, setPaper] = React.useState(false);
  const [otherPapers, setOtherPapers] = React.useState(false);
  const [otherPlastics, setOtherPlastics] = React.useState(false);
  const [tetra, setTetra] = React.useState(false);
  const [cellphones, setCellphones] = React.useState(false);
  const [batteries, setBatteries] = React.useState(false);
  const [oil, setOil] = React.useState(false);

  // console.log(props.user.data().uid);
  function addMarker() {
    props.setMarkers([
      ...props.markers,
      {latlng: props.currentPosition, title: name},
    ]);

    // console.log(props.modalMarkers);
    console.log('modal console log: ', props.currentPosition);

    var recyclableMaterials = {
      PET: PET,
      PE: PE,
      PVC: PVC,
      aluminium: aluminium,
      cardboard: cardboard,
      glass: glass,
      paper: paper,
      otherPapers: otherPapers,
      otherPlastics: otherPlastics,
      tetra: tetra,
      cellphones: cellphones,
      batteries: batteries,
      oil: oil,
    };

    onChangeName(null);

    firestore()
      .collection('Maps')
      .add({
        latlng: props.currentPosition,
        title: name,
        createdAt: firestore.FieldValue.serverTimestamp(),
        recyclableMaterials: recyclableMaterials,
        user: {
          uid: props.user.data().uid,
          username: props.user.data().username,
        },
      })
      .then(() => {
        console.log('Map added!');
      });
    props.setModalVisible(!props.modalVisible);
    setPET(false);
    setPE(false);
    setPVC(false);
    setAluminium(false);
    setCardboard(false);
    setGlass(false);
    setPaper(false);
    setOtherPapers(false);
    setOtherPlastics(false);
    setTetra(false);
    setCellphones(false);
    setBatteries(false);
    setOil(false);
  }

  const onTakePhoto = () => launchCamera({mediaType: 'image'}, onMediaSelect);
  const onSelectImagePress = () =>
    launchImageLibrary({mediaType: 'image'}, onMediaSelect);

  const onMediaSelect = async media => {
    if (!media.didCancel) {
      // Upload Process
    }
  };

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
          <View style={styles.viewText}>
            <TextInput
              mode="outlined"
              style={styles.input}
              onChangeText={onChangeName}
              value={name}
              label="Nombre del punto"
            />
          </View>
          <View style={{height: 400, alignSelf: 'stretch'}}>
            <ScrollView style={styles.scroll}>
              <Checkbox.Item
                label="PE"
                status={PE ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPE(!PE);
                }}
              />
              <Checkbox.Item
                label="PET"
                status={PET ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPET(!PET);
                }}
              />
              <Checkbox.Item
                label="PVC"
                status={PVC ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPVC(!PVC);
                }}
              />
              <Checkbox.Item
                label="Cartón"
                status={cardboard ? 'checked' : 'unchecked'}
                onPress={() => {
                  setCardboard(!cardboard);
                }}
              />
              <Checkbox.Item
                label="Vidrio"
                status={glass ? 'checked' : 'unchecked'}
                onPress={() => {
                  setGlass(!glass);
                }}
              />
              <Checkbox.Item
                label="Papel"
                status={paper ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPaper(!paper);
                }}
              />
              <Checkbox.Item
                label="Otros Papeles"
                status={otherPapers ? 'checked' : 'unchecked'}
                onPress={() => {
                  setOtherPapers(!otherPapers);
                }}
              />
              <Checkbox.Item
                label="Otros Plasticos"
                status={otherPlastics ? 'checked' : 'unchecked'}
                onPress={() => {
                  setOtherPlastics(!otherPlastics);
                }}
              />
              <Checkbox.Item
                label="Cajas Tetra"
                status={tetra ? 'checked' : 'unchecked'}
                onPress={() => {
                  setTetra(!tetra);
                }}
              />
              <Checkbox.Item
                label="Celulares"
                status={cellphones ? 'checked' : 'unchecked'}
                onPress={() => {
                  setCellphones(!cellphones);
                }}
              />
              <Checkbox.Item
                label="Baterías"
                status={batteries ? 'checked' : 'unchecked'}
                onPress={() => {
                  setBatteries(!batteries);
                }}
              />
              <Checkbox.Item
                label="Aceite"
                status={oil ? 'checked' : 'unchecked'}
                onPress={() => {
                  setOil(!oil);
                }}
              />
            </ScrollView>
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => addMarker()}>
            <Text style={styles.textStyle}>Agregar sitio</Text>
          </Pressable>

          <Button
            mode="outlined"
            style={[styles.button, styles.buttonClose]}
            onPress={() => addMarker()}>
            <Text>Crear Usuario</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    height: 400,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {width: 200},
  viewText: {},
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

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
