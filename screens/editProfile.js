import React, {useState} from 'react';
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
import {BASE_URL_API} from '@env';
import CookieManager from '@react-native-cookies/cookies';

import {
  Checkbox,
  TextInput,
  Button,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import {updateUser} from '../api/users';
// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.

export default function EditProfile({navigation, route}) {
  const [text, onChangeText] = React.useState('Useless Text');
  const [username, onChangeUsername] = React.useState(null);

  const [imagePoint, setImagePoint] = useState(null);
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

    const formData = new FormData();
    formData.append('image', {
      uri: imagePoint,
      type: 'image/jpeg',
      name: imagePoint,
    });

    formData.append('userId', route.params.userId);
    formData.append('username', username);

    const cookies = await CookieManager.get(BASE_URL_API);
    await updateUser(cookies.authToken.value, route.params.userId, formData);

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
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {/* <View style={styles.viewText}>
          <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={onChangeUsername}
            value={username}
            label="Nombre de usuario"
          />
        </View> */}
        <View style={{height: 400, alignSelf: 'stretch'}}>
          <ScrollView style={styles.scroll}>
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
                onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>
                  {imagePoint ? 'Cambiar imagen' : 'Subir imagen'}
                </Text>
              </Button>
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => addMarker()}>
              <Text style={styles.textStyle}>Actualizar Perfil</Text>
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
});
