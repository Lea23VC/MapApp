import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Svg, Image as ImageSvg} from 'react-native-svg';
import firestore from '@react-native-firebase/firestore';
import StatusDropdown from '../../components/dropdowns/statusDropdown';
import {Dropdown} from 'react-native-element-dropdown';

import {
  Checkbox,
  TextInput,
  Button,
  ActivityIndicator,
  Colors,
  Switch,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';

import {setMarker, updateMarker} from '../../api/markers';
import Geolocation from 'react-native-geolocation-service';

import Geocode from 'react-geocode';
import {getCoords} from '../../api/geolocation';

import {getStatuses} from '../../api/markers';
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

export default function ModalMap({navigation, route}) {
  const [statuses, setStatuses] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchStatuses = async () => {
        const data_status = await getStatuses();

        if (isActive) {
          setStatuses(data_status);
        }
      };

      fetchStatuses();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const [value, setValue] = useState(
    route.params.marker.status ? route.params.marker.status : null,
  );
  console.log('params in Addmarker: ', route.params);
  const [name, onChangeName] = React.useState(
    route.params.marker?.title ? route.params.marker.title : null,
  );

  const [PET, setPET] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'PET')
      ? true
      : false,
  );
  const [PE, setPE] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'PE')
      ? true
      : false,
  );
  const [PVC, setPVC] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'PVC')
      ? true
      : false,
  );
  const [aluminium, setAluminium] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'aluminium')
      ? true
      : false,
  );
  const [cardboard, setCardboard] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'cardboard')
      ? true
      : false,
  );
  const [glass, setGlass] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'glass')
      ? true
      : false,
  );
  const [paper, setPaper] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'paper')
      ? true
      : false,
  );
  const [otherPapers, setOtherPapers] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'otherPapers')
      ? true
      : false,
  );
  const [otherPlastics, setOtherPlastics] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'otherPlastics')
      ? true
      : false,
  );
  const [tetra, setTetra] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'tetra')
      ? true
      : false,
  );
  const [cellphones, setCellphones] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'cellphones')
      ? true
      : false,
  );
  const [batteries, setBatteries] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'batteries')
      ? true
      : false,
  );
  const [oil, setOil] = React.useState(
    route.params.marker.materials?.some(item => item.code === 'oil')
      ? true
      : false,
  );
  const [imagePoint, setImagePoint] = useState(
    route.params.marker.imgURL ? route.params.marker.imgURL : null,
  );

  const [isSwitchOn, setIsSwitchOn] = useState(
    route.params.marker.availability ? true : false,
  );

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [addingMarker, setAddingMarker] = useState(false);

  console.log(route.params);
  async function addMarker() {
    setAddingMarker(true);

    console.log('image point: ', imagePoint);
    if (!imagePoint) {
      alert('Porfavor, suba una foto');
      setAddingMarker(false);
      return;
    }
    const {coords} = await getCoords();
    console.log('Coords inside addMarker: ', coords);
    const formData = new FormData();
    if (transferred) {
      formData.append('image', {
        uri: imagePoint,
        type: 'image/jpeg',
        name: imagePoint,
      });
    }

    var recyclableMaterials = [
      {code: 'PET', value: PET},
      {code: 'PE', value: PE},
      {code: 'PVC', value: PVC},
      {code: 'aluminium', value: aluminium},
      {code: 'cardboard', value: cardboard},
      {code: 'glass', value: glass},
      {code: 'paper', value: paper},
      {code: 'otherPapers', value: otherPapers},
      {code: 'otherPlastics', value: otherPlastics},
      {code: 'tetra', value: tetra},
      {code: 'cellphones', value: cellphones},
      {code: 'batteries', value: batteries},
      {code: 'oil', value: oil},
    ];

    formData.append('userId', route.params.user.uid);
    formData.append('title', name);
    if (!route.params.marker.latitude) {
      formData.append('latitude', coords.latitude);
      formData.append('longitude', coords.longitude);
    }

    formData.append('PE', PE ? 1 : 0);
    formData.append('PET', PET ? 1 : 0);
    formData.append('PVC', PVC ? 1 : 0);
    formData.append('aluminium', aluminium ? 1 : 0);
    formData.append('batteries', batteries ? 1 : 0);
    formData.append('cellphones', cellphones ? 1 : 0);
    formData.append('glass', glass ? 1 : 0);
    formData.append('oil', oil ? 1 : 0);
    formData.append('otherPapers', otherPapers ? 1 : 0);
    formData.append('otherPlastics', otherPlastics ? 1 : 0);
    formData.append('paper', paper ? 1 : 0);
    formData.append('tetra', tetra ? 1 : 0);
    formData.append('status', value.value);
    formData.append('recyclableMaterials', JSON.stringify(recyclableMaterials));

    formData.append('availability', isSwitchOn ? 1 : 0);

    if (route.params.edit) {
      await updateMarker(route.params.marker.id, formData);
    } else {
      await setMarker(formData);
    }

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
    setTransferred(true);
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
      console.log(imagePoint);
      setTransferred(true);
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
      console.log('console image log: ', image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImagePoint(imageUri);
      console.log(imagePoint);
      // this.bs.current.snapTo(1);
    });
  };

  return (
    <View style={{paddingHorizontal: 20}}>
      <View>
        <View style={{paddingBottom: 20}}>
          <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
            label="Nombre del punto"
          />
        </View>
        <View style={{height: 500, alignSelf: 'stretch'}}>
          <ScrollView>
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

            <View style={{paddingLeft: 10}}>
              <View style={{paddingVertical: 20}}>
                <StatusDropdown value={value} setValue={setValue} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 20}}>
                  {isSwitchOn ? 'Disponible' : 'No disponible'}{' '}
                </Text>

                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
              </View>
            </View>

            <View style={{paddingTop: 20}}>
              {imagePoint && (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.tinyLogo}
                    source={{
                      uri: imagePoint,
                    }}
                  />
                </View>
              )}
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
          </ScrollView>
        </View>
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
  imageContainer: {
    justifycontent: 'center',
  },
  tinyLogo: {
    alignSelf: 'center',
    width: 300,
    height: 300,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
