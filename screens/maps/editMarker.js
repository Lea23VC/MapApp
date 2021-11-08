import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {
  Checkbox,
  TextInput,
  Button,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';

import Geocode from 'react-geocode';

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey('AIzaSyBCvtHhm7gF4jLVoNQtXuCWKL5-JrdtyUg');

// set response language. Defaults to english.
Geocode.setLanguage('es');

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion('cl');

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType('ROOFTOP');

// Enable or disable logs. Its optional.
Geocode.enableDebug();

export default function EditMarker({navigation, route}) {
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
  const [imagePoint, setImagePoint] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [addingMarker, setAddingMarker] = useState(false);

  console.log(route.params);
  async function addMarker() {
    setAddingMarker(true);
    let imgUrl = await uploadImage();
    if (!imgUrl) {
      alert('Porfavor, suba una foto');
      setAddingMarker(false);
      return;
    }

    var address = await Geocode.fromLatLng(
      route.params.currentPosition.latitude,
      route.params.currentPosition.longitude,
    ).then(
      response => {
        // const address = response.results[0].formatted_address;
        let city, grandCity, state, country, address_street, address_number;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case 'street_number':
                address_number =
                  response.results[0].address_components[i].long_name;
                break;
              case 'route':
                address_street =
                  response.results[0].address_components[i].long_name;
                break;
              case 'locality':
                city = response.results[0].address_components[i].long_name;
                break;
              case 'administrative_area_level_2':
                grandCity = response.results[0].address_components[i].long_name;
                break;
              case 'administrative_area_level_1':
                state = response.results[0].address_components[i].long_name;
                break;
              case 'country':
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        console.log(response.results[0].address_components);
        var address_data = {
          address_street: address_street,
          address_number: address_number,
          commune: city,
          city: grandCity,
          state: state,
          country: country,
        };
        console.log('aaaa 56: ', address_data);
        // setAddress(address_data);
        return address_data;
      },
      error => {
        console.error(error);
        return null;
      },
    );

    // if (imgUrl == null && userData.userImg) {
    //   imgUrl = userData.userImg;
    // }
    route.params.setMarkers([
      ...route.params.markers,
      {latlng: route.params.currentPosition, title: name},
    ]);

    console.log(route.params.currentPosition);
    // console.log('modal console log: ', route.params.currentPosition);

    // console.log(address);
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
        address: address,
        title: name,
        createdAt: firestore.FieldValue.serverTimestamp(),
        recyclableMaterials: recyclableMaterials,
        user: {
          uid: route.params.user.data().uid,
          username: route.params.user.data().username,
        },
        imgUrl: imgUrl,
        votes: 0,
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

    setAddingMarker(false);

    navigation.goBack();
  }

  const uploadImage = async () => {
    if (imagePoint == null) {
      return null;
    }
    const uploadUri = imagePoint;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      setImagePoint(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 600,
      cropping: true,
      compressImageQuality: 0.8,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImagePoint(imageUri);
      // this.bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImagePoint(imageUri);
      console.log(imageUri);
      // this.bs.current.snapTo(1);
    });
  };

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

        <View style={{paddingTop: 20}}>
          <Button
            mode="outlined"
            style={styles.panelButton}
            onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>
              {imagePoint ? 'Cambiar imagen' : 'Subir imagen'}
            </Text>
          </Button>
        </View>

        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => addMarker()}>
          <Text style={styles.textStyle}>Agregar sitio</Text>
        </Pressable>

        {addingMarker && (
          <ActivityIndicator animating={true} color={Colors.red800} />
        )}
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

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'blue',
  },
});
