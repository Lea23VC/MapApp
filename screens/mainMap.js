import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Pressable,
  PermissionsAndroid,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useFocusEffect} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Button, ActivityIndicator, Colors} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

import {getCoords} from '../api/geolocation';

import {getMarkers, getMarker} from '../api/markers';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MARKER_HEIGHT = 220;
const MARKER_WIDTH = width * 0.5;
var b = [];

export default function mainMap({route, navigation}) {
  // console.log('route inside mainMap: ', route.params);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const initialState = {
    latitude: null,
    longitude: null,
  };

  const askForPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    setPermissionGranted(granted);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const askPermissions = askForPermission;

      askPermissions();
      return () => {
        isActive = false;
      };
    }, []),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     const subscriber = permission();
  //     return subscriber; // unsubscribe on unmount
  //   }, []),
  // );

  // console.log('actual user: ', props.user.data().username);
  let mapAnimation = new Animated.Value(0);

  // console.log('params: ', props.user);

  const [markers, setMarkers] = useState([]);

  // console.log('markers from backend: ', markers);

  const [currentPosition, setCurrentPosition] = useState(initialState);

  const [markerPosition, setMarkerPosition] = useState(null);

  const [address, setAddress] = useState(null);

  const [editMarkerButton, setEditMarkerButton] = useState(false);
  const [params, setParams] = useState({items_per_page: 99});

  const [PET, setPET] = useState(null);
  const [PE, setPE] = useState(null);
  const [PVC, setPVC] = useState(null);
  const [aluminium, setAluminium] = useState(null);
  const [cardboard, setCardboard] = React.useState(null);
  const [glass, setGlass] = React.useState(null);
  const [paper, setPaper] = React.useState(null);
  const [otherPapers, setOtherPapers] = React.useState(null);
  const [otherPlastics, setOtherPlastics] = React.useState(null);
  const [tetra, setTetra] = React.useState(null);
  const [cellphones, setCellphones] = React.useState(null);
  const [batteries, setBatteries] = React.useState(null);
  const [oil, setOil] = React.useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUsers = async () => {
        if (permissionGranted == PermissionsAndroid.RESULTS.GRANTED) {
          const {coords} = await getCoords();
          const data_makers = await getMarkers({
            ...params,
            distanceFromCoords: `[${coords.latitude}, ${coords.longitude}]`,
          });

          if (isActive) {
            setMarkers(data_makers);
          }
        }
      };

      fetchUsers();
      return () => {
        isActive = false;
      };
    }, [params, permissionGranted]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getPosition = () => {
        if (permissionGranted == PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(
                'inide geolocation get current before adding marker XDDD',
              );
              const {longitude, latitude} = position.coords;

              console.log(longitude);
              if (isActive) {
                setCurrentPosition({
                  latitude,
                  longitude,
                });
              }
            },

            error => alert(error.message),
            {
              timeout: 20000,
              maximumAge: 5000,
              enableHighAccuracy: true,
            },
          );
        }
      };
      getPosition();
      return () => {
        isActive = false;
      };
    }, [permissionGranted]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUser = async () => {
        try {
          if (isActive) {
            console.log('current position??: ', currentPosition);
            setQuery();
            console.log('set markers i guesss');
          }
        } catch (e) {
          console.log('Handle error WIP');
        }
      };

      fetchUser();

      return () => {
        isActive = false;
      };
    }, [
      PET,
      PVC,
      PE,
      aluminium,
      cardboard,
      glass,
      paper,
      otherPapers,
      otherPlastics,
      tetra,
      cellphones,
      batteries,
      oil,
    ]),
  );

  async function getMarkersWithMaterial(value, valueChange) {
    console.log('Material: ', value);
    console.log('Params??: ', params);
    if (value === null) {
      valueChange(1);
    } else {
      valueChange(null);
    }
  }

  const categories = [
    {
      name: 'PET',
      filter_name: 'PET',
      value: PET,
      valueChange: setPET,
      icon: (
        <MaterialCommunityIcons
          style={styles.chipsIcon}
          name="food-fork-drink"
          size={18}
        />
      ),
    },
    {
      name: 'PE',
      filter_name: 'PET',
      value: PE,
      valueChange: setPE,
      icon: (
        <Ionicons name="ios-restaurant" style={styles.chipsIcon} size={18} />
      ),
    },
    {
      name: 'Aluminio',
      filter_name: 'aluminium',
      value: aluminium,
      valueChange: setAluminium,
      icon: (
        <Ionicons name="md-restaurant" style={styles.chipsIcon} size={18} />
      ),
    },
    {
      name: 'Carton',
      filter_name: 'cardboard',
      value: cardboard,
      valueChange: setCardboard,
      icon: (
        <MaterialCommunityIcons
          name="food"
          style={styles.chipsIcon}
          size={18}
        />
      ),
    },
    {
      name: 'Vidrio',
      filter_name: 'glass',
      value: glass,
      valueChange: setGlass,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Papel',
      filter_name: 'paper',
      value: paper,
      valueChange: setPaper,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Otros Papeles',
      filter_name: 'otherPapers',
      value: otherPapers,
      valueChange: setOtherPapers,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Otros Plasticos',
      filter_name: 'otherPlastics',
      value: otherPlastics,
      valueChange: setOtherPlastics,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Cajas Tetras',
      filter_name: 'tetra',
      value: tetra,
      valueChange: setTetra,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Celulares',
      filter_name: 'cellphones',
      value: cellphones,
      valueChange: setCellphones,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Pilas y Baterias',
      filter_name: 'batteries',
      value: batteries,
      valueChange: setBatteries,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
    {
      name: 'Aceite',
      filter_name: 'oil',
      value: oil,
      valueChange: setOil,
      icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    },
  ];

  //console.log(usersCollection);

  async function setQuery() {
    const query = {
      items_per_page: 99,
      PET: PET,
      PE: PE,
      PVC: PVC,
      aluminium: aluminium,
      batteries: batteries,
      cardboard: cardboard,
      cellphones: cellphones,
      glass: glass,
      oil: oil,
      otherPlastics: otherPlastics,
      otherPapers: otherPapers,
      paper: paper,
      tetra: tetra,
    };

    setParams(query);
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     const unsubscribe = getAddressFromCoords;
  //     return () => unsubscribe();
  //   }, [currentPosition]),
  // );

  function getCurrentPositionService() {
    // console.log('estoy chato 2');

    Geolocation.getCurrentPosition(
      position => {
        console.log('inide geolocation get current');
        const {longitude, latitude} = position.coords;
        setCurrentPosition({
          latitude,
          longitude,
        });
        // console.log(
        //   'current position inide geolocation get current??: ',
        //   currentPosition,
        // );
      },

      error => alert(error.message),
      {
        timeout: 20000,
        maximumAge: 5000,
        enableHighAccuracy: true,
      },
    );
  }
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('estoy chato');
  //     const unsubscribe2 = getCurrentPositionService;
  //     return () => unsubscribe2();
  //   }, [currentPosition]),
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     getCurrentPositionService();
  //   }, []),
  // );
  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  function addMarkerPosition(cords) {
    setMarkerPosition(cords);

    setMarkerPosition(null);
  }

  async function addMarker(marker) {
    await Geolocation.getCurrentPosition(
      position => {
        console.log('inide geolocation get current before adding marker');
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

    console.log(route.params.user);

    navigation.navigate('AddMarker', {
      currentPosition: currentPosition,
      user: route.params.user,
      marker: marker ? marker : [],
      edit: false,
    });
  }

  function editMarker(marker) {
    if (route.params.user.uid == marker.user.uid) {
      console.log(route.params.user);
      console.log('address data: ', address);
      navigation.navigate('AddMarker', {
        currentPosition: currentPosition,
        user: route.params.user,
        marker: marker,
      });
    }
  }

  return markers.length >= 0 &&
    currentPosition.latitude != null &&
    permissionGranted == PermissionsAndroid.RESULTS.GRANTED ? (
    <View>
      <MapView
        ref={mapView => {
          this.map = mapView;
        }}
        showsMyLocationButton={true}
        showsUserLocation
        followsUserLocation
        style={styles.map}
        region={markerPosition}
        initialRegion={{
          latitudeDelta: 0.000922,
          longitudeDelta: 0.000421,
          ...currentPosition,
        }}>
        {markers.map((marker, i) => (
          <Marker
            onPress={() =>
              navigation.navigate('Marker Info', {
                marker_id: marker.id,
                user: route.params.user,
              })
            }
            key={i}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title ? marker.title : 'placeholder'}></Marker>
        ))}

        {/* <Marker
          draggable={true}
          pinColor="yellow"
          coordinate={currentPosition}
          title={'XD'}
          description="This is where the magic happens!"></Marker> */}
      </MapView>

      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={styles.searchBox}>
        <TextInput
          placeholder="Busca tu punto de reciclaje"
          placeholderTextColor="#000"
          autoCapitalize="none"
          style={{flex: 1, padding: 0}}
        />
        <Ionicons name="ios-search" size={20} />
      </KeyboardAvoidingView> */}
      {/* 
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modalStyle}>
              {modalMarker ? (
                <MarkerModalContent
                  marker={modalMarker}
                  navigation={navigation}
                  user={route.params.user}
                  setModalVisible={setModalVisible}
                />
              ) : (
                <ActivityIndicator
                  style={{flex: 1}}
                  animating={true}
                  color={Colors.red800}
                />
              )}
            </Modal>
          </Portal>
        </View>
      </View> */}
      <View style={styles.addMarker}>
        <Button
          mode="outlined"
          style={[styles.button, styles.buttonClose]}
          onPress={() => addMarker()}>
          <Text>Agregar sitio</Text>
        </Button>
      </View>

      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        height={50}
        style={styles.chipsScrollView}
        contentInset={{
          // iOS only
          top: 0,
          left: 0,
          bottom: 0,
          right: 20,
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? 20 : 0,
        }}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chipsItem, category.value ? styles.selected : {}]}
            onPress={() =>
              getMarkersWithMaterial(category.value, category.valueChange)
            }>
            {/* {category.icon} */}
            <Text style={[category.value && styles.selectedText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}>
        {markers.map(
          (marker, index) =>
            marker.address && (
              <Pressable
                key={index}
                onPress={() =>
                  this.map.animateCamera({
                    center: {
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    },
                    heading: 0,
                  })
                }
                style={styles.button}
                accessibilityLabel="Learn more about this purple button">
                <View style={styles.card}>
                  <Text style={styles.textStyle}>Agregar sitio</Text>

                  <Image
                    source={{uri: marker.imgURL}}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>
                      {marker.title}
                    </Text>

                    <Text numberOfLines={1} style={styles.cardtitle}>
                      A {marker.distance} metros
                    </Text>
                  </View>
                </View>
              </Pressable>
            ),
        )}
      </Animated.ScrollView>

      {editMarkerButton && (
        <View style={styles.editMarker}>
          <Button
            mode="outlined"
            style={[styles.button, styles.buttonClose]}
            onPress={() => addMarker()}>
            <Text>Agregar sitio</Text>
          </Button>
        </View>
      )}
    </View>
  ) : (
    <ActivityIndicator
      style={{flex: 1}}
      animating={true}
      color={Colors.red800}
    />
  );
}
const styles = StyleSheet.create({
  selected: {
    backgroundColor: 'black',
  },
  selectedText: {
    color: 'white',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
    // marginBottom: -15
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#841584',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  viewButtons: {
    borderRadius: 20,
    width: '70%',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    backgroundColor: 'white',
    padding: 20,
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: '100%',
    height: 80,
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },

  addMarker: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 120,
    color: '#0000',
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },

  editMarker: {
    position: 'absolute',
    bottom: '32%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 120,
    color: '#0000',
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },

  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },

  markerCallout: {
    // padding: 10,
    elevation: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: MARKER_HEIGHT,
    width: MARKER_WIDTH,
    overflow: 'hidden',
  },

  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#fff',
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalStyle: {
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    borderRadius: 15,
  },
});
