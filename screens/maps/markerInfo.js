import React, {useState, useEffect, useCallback} from 'react';

import {
  Text,
  Button,
  ActivityIndicator,
  Colors,
  Modal,
  Portal,
  Provider,
  Switch,
} from 'react-native-paper';
import {View, Image, ScrollView, StyleSheet, Pressable} from 'react-native';
import {updateMarker} from '../../api/markers';
import {useFocusEffect} from '@react-navigation/native';
import Comments from '../../components/comments/list';
import StatusDropdown from '../../components/dropdowns/statusDropdown';
import CookieManager from '@react-native-cookies/cookies';
import {BASE_URL_API} from '@env';
import ImageView from 'react-native-image-viewing';

import {getMarker} from '../../api/markers';
import {getCoords} from '../../api/geolocation';
// import {useFocusEffect} from '@react-navigation/native';
export default function MarkerModalContent({navigation, route}) {
  const [visibleStatusModal, setVisibleStatusModal] = useState(false);
  const [visible, setIsVisible] = useState(false);

  const showModal = () => setVisibleStatusModal(true);
  const hideModal = () => setVisibleStatusModal(false);

  console.log('route params: ', route.params);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const [changingData, setChangingData] = useState(false);
  //   const [like, setLike] = useState(
  //     route.params.marker.voted_marker == 1 ? true : false,
  //   );

  //   const [dislike, setDislike] = useState(
  //     route.params.marker.voted_marker == -1 ? true : false,
  //   );
  const [currentPosition, setCurrentPosition] = useState(null);
  const [permissions, setPermissions] = useState([]);

  console.log('Permissions: ', permissions);

  const [marker, setMarker] = useState(null);
  const [fetched, setFetched] = useState(false);

  const [comments, setComments] = useState(null);

  const [dropdownValue, setDropdownValue] = useState(null);

  const [isSwitchOn, setIsSwitchOn] = useState(null);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  //   const [likes, setLikes] = useState(route.params.marker.likes);
  //   const [dislikes, setDislikes] = useState(route.params.marker.dislikes);

  async function goToProfile() {
    // setModalVisible(false);
    navigation.navigate('Profile', {
      userId: marker.user[0].id,
      userAuth: route.params.user.uid,
    });
  }

  // async function updateCurrentPosition() {
  //   await Geolocation.getCurrentPosition(
  //     position => {
  //       console.log('inide geolocation get current before adding marker');
  //       const {longitude, latitude} = position.coords;
  //       setCurrentPosition({
  //         latitude,
  //         longitude,
  //       });
  //     },

  //     error => alert(error.message),
  //     {
  //       timeout: 20000,
  //       maximumAge: 5000,
  //       enableHighAccuracy: true,
  //     },
  //   );
  // }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMarker = async () => {
        console.log('Test if get markers');

        const {coords} = await getCoords();
        const params = {
          distanceFromCoords: `[${coords.latitude}, ${coords.longitude}]`,
        };

        const data_maker = await getMarker(route.params.marker_id, params);
        const cookies = await CookieManager.get(BASE_URL_API);

        if (isActive) {
          setMarker(data_maker);
          setComments(data_maker.comments);
          setLikes(data_maker.likes);
          setDislikes(data_maker.dislikes);
          setFetched(true);
          setLike(data_maker.voted_marker == 1 ? true : false);
          setDislike(data_maker.voted_marker == -1 ? true : false);
          setDropdownValue(data_maker.status);
          setPermissions(JSON.parse(cookies.permissions.value));
          setIsSwitchOn(data_maker.availability ? true : false);
        }
      };

      fetchMarker();
      return () => {
        isActive = false;
      };
    }, []),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     let isActive = true;

  //     const fetchMarker = async () => {
  //       if (isActive) {
  //         updateCurrentPosition();
  //       }
  //     };

  //     fetchMarker();
  //     return () => {
  //       isActive = false;
  //     };
  //   }, []),
  // );
  async function updateComments(data) {
    console.log("THIS DOESN'T WORK'");
    console.log(data);

    setComments(data);
  }

  async function changeStatus() {
    const data = {
      status: dropdownValue.value,
    };
    setChangingData(true);
    await updateMarker(route.params.marker_id, data);
    setChangingData(false);
    hideModal();
  }

  async function changeAvailability() {
    const data = {
      availability: !isSwitchOn ? 1 : 0,
    };
    setIsSwitchOn(!isSwitchOn);
    setChangingData(true);
    await updateMarker(route.params.marker_id, data);
    setChangingData(false);
  }

  async function likeMarker(value) {
    console.log('LIKE: ', like);
    console.log('DISLIKE: ', dislike);
    var sumLike = 0;
    var sumDislike = 0;
    switch (value) {
      case 1:
        if (like) {
          sumLike = -1;
        } else {
          sumLike = 1;
        }

        if (dislike == true) {
          sumDislike = -1;
          setDislike(!dislike);
        }
        setLike(!like);
        break;
      case -1:
        if (dislike) {
          sumDislike = -1;
        } else {
          sumDislike = 1;
        }

        if (like) {
          sumLike = -1;

          setLike(!like);
        }
        setDislike(!dislike);
        break;
    }

    setLikes(likes + sumLike);
    setDislikes(dislikes + sumDislike);
  }

  async function editMarker() {
    navigation.navigate('AddMarker', {
      user: route.params.user,
      marker: marker ? marker : [],
      edit: true,
    });
  }

  useEffect(() => {
    let isActive = true;

    if (fetched) {
      const updateVotes = async () => {
        const data = {
          likes: likes,
          dislikes: dislikes,
          user_voted: route.params.user.uid,
          vote_action: like ? 1 : dislike ? -1 : 0,
        };
        const data_makers = await updateMarker(route.params.marker_id, data);
        if (isActive) {
        }
      };

      updateVotes();
    }

    return () => {
      isActive = false;
    };
  }, [likes, dislikes]),
    // useEffect(() => {
    //   const subscriber = () => {
    //     console.log(like);
    //     setLikes(likes + 1);
    //   };
    //   return subscriber; // unsubscribe on unmount
    // }, [like]);

    console.log('Marker inside modal: ', route.params.marker);
  return marker ? (
    <ScrollView>
      <View style={[styles.fixToText, {padding: 10}]}>
        <Pressable onPress={() => goToProfile()}>
          <Image
            style={styles.userImg}
            source={{
              uri: marker.user[0].imgURL,
            }}
          />
        </Pressable>
        <Text onPress={() => goToProfile()} style={styles.username}>
          {marker.user[0].username}
        </Text>
        {marker.user[0].id == route.params.user.uid && (
          <Button
            mode="contained"
            color="white"
            labelStyle={styles.buttonEditFont}
            style={[styles.button, {marginLeft: 10}]}
            onPress={() => editMarker()}>
            Cambiar info punto
          </Button>
        )}
      </View>

      <View style={styles.centerView}>
        <Text style={styles.title}>{marker.title} </Text>
        <Pressable onPress={() => setIsVisible(true)}>
          <Image
            style={styles.logo}
            source={{
              uri: marker.imgURL,
            }}
          />
        </Pressable>

        <ImageView
          images={[{uri: marker.imgURL}]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <Text> {marker.created_at} </Text>

        {permissions.some(item => item.id === 3) ? (
          <View>
            <View style={styles.buttonOuterLayout}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 20}}>
                  {isSwitchOn ? 'Disponible' : 'No disponible'}{' '}
                </Text>

                <Switch
                  value={isSwitchOn}
                  onValueChange={() => {
                    changeAvailability();
                  }}
                />
              </View>
            </View>
          </View>
        ) : (
          <Text style={{fontWeight: 'bold'}}>
            {isSwitchOn ? 'Disponible' : 'No disponible'}{' '}
          </Text>
        )}

        {permissions.some(item => item.id === 1) && (
          <View>
            <Portal>
              <Modal
                visible={visibleStatusModal}
                onDismiss={hideModal}
                contentContainerStyle={styles.containerStyle}>
                {!changingData ? (
                  <>
                    <StatusDropdown
                      value={dropdownValue}
                      setValue={setDropdownValue}
                    />
                    <View style={styles.buttonOuterLayout}>
                      <Button
                        mode="contained"
                        color="white"
                        style={styles.button}
                        onPress={() => changeStatus()}>
                        Confirmar
                      </Button>
                    </View>
                  </>
                ) : (
                  <ActivityIndicator
                    style={{flex: 1}}
                    animating={true}
                    color={Colors.red800}
                  />
                )}
              </Modal>
            </Portal>
            <View style={styles.buttonOuterLayout}>
              <Button
                mode="contained"
                color="white"
                style={styles.button}
                onPress={showModal}>
                Cambiar Estado
              </Button>
            </View>
          </View>
        )}
      </View>
      <View style={styles.viewData}>
        <Text>A {marker.distance} </Text>

        <Text style={styles.bold}>Materiales que recibe: </Text>
        <View style={styles.materialItems}>
          {marker.materials.map((material, index) => (
            <Text key={index}> {material.name} </Text>
          ))}
        </View>
        {dropdownValue && (
          <View>
            <Text>
              <Text style={styles.bold}>Estado: </Text>
              {dropdownValue.label}
            </Text>
          </View>
        )}

        <View>
          <View style={styles.fixToText}>
            <Button
              mode="contained"
              onPress={() => likeMarker(1)}
              icon="thumb-up-outline"
              color={like ? 'blue' : 'white'}
              style={{width: '50%'}}
              contentStyle={[like ? styles.selected : null]}>
              {likes}
            </Button>
            <Button
              mode="contained"
              onPress={() => likeMarker(-1)}
              icon="thumb-down-outline"
              style={{width: '50%'}}
              color={dislike ? 'blue' : 'white'}
              contentStyle={dislike ? styles.selected : null}>
              {dislikes}
            </Button>
          </View>
        </View>

        {comments && (
          <Comments
            navigation={navigation}
            updateComments={updateComments}
            comments={comments}
            setComments={setComments}
            marker_id={marker.id}
            user={route.params.user.uid}
          />
        )}
      </View>
    </ScrollView>
  ) : (
    <ActivityIndicator
      style={{flex: 1}}
      animating={true}
      color={Colors.red800}
    />
  );
}
const styles = StyleSheet.create({
  viewData: {
    padding: 20,
  },

  logo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },

  selected: {
    backgroundColor: 'black',
  },
  selectedText: {
    color: 'white',
  },
  materialItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  containerStyle: {
    padding: 10,
    backgroundColor: 'white',
    margin: 20,
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonOuterLayout: {
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {},
  fixToText: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 0,
    paddingBottom: 10,
  },

  username: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey',
    paddingLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  },

  userImg: {
    height: 50,
    width: 50,
    borderRadius: 75,
  },
  buttonEdit: {},
  buttonEditFont: {
    fontSize: 12,
  },
});
