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
import {Checkbox, TextInput} from 'react-native-paper';

export default function ModalMap({navigation, route}) {
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
    route.params.setMarkers([
      ...route.params.markers,
      {latlng: route.params.currentPosition, title: name},
    ]);

    // console.log(props.modalMarkers);
    console.log('modal console log: ', route.params.currentPosition);

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
        latlng: route.params.currentPosition,
        title: name,
        createdAt: firestore.FieldValue.serverTimestamp(),
        recyclableMaterials: recyclableMaterials,
        user: {
          uid: route.params.user.data().uid,
          username: route.params.user.data().username,
        },
      })
      .then(() => {
        console.log('Map added!');
      });
    // props.setModalVisible(!props.modalVisible);
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

    navigation.goBack();
  }

  return (
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //   centeredView: {
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   },

  viewText: {},

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
