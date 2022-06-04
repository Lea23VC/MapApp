import React, {useState, useEffect, useCallback} from 'react';

import {Text, Button, ActivityIndicator, Colors} from 'react-native-paper';
import {View, Image, ScrollView, StyleSheet} from 'react-native';
import {updateMarker} from '../../api/markers';
import {useFocusEffect} from '@react-navigation/native';
import Comments from '../../components/comments/list';
import Geolocation from 'react-native-geolocation-service';
import {getMarker} from '../../api/markers';
// import {useFocusEffect} from '@react-navigation/native';
export default function MarkerModalContent({navigation, route}) {
  console.log('route params: ', route.params);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  //   const [like, setLike] = useState(
  //     route.params.marker.voted_marker == 1 ? true : false,
  //   );

  //   const [dislike, setDislike] = useState(
  //     route.params.marker.voted_marker == -1 ? true : false,
  //   );
  const [currentPosition, setCurrentPosition] = useState(null);

  const [marker, setMarker] = useState(null);

  //   const [likes, setLikes] = useState(route.params.marker.likes);
  //   const [dislikes, setDislikes] = useState(route.params.marker.dislikes);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  async function goToProfile() {
    // setModalVisible(false);
    navigation.navigate('Profile', {
      userId: marker.user[0].id,
      userAuth: route.params.user.uid,
    });
  }

  async function updateCurrentPosition() {
    await Geolocation.getCurrentPosition(
      position => {
        console.log('inide geolocation get current before adding marker');
        const {longitude, latitude} = position.coords;
        setCurrentPosition({
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
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMarker = async () => {
        console.log('Test if get markers');
        if (currentPosition) {
          const params = {
            currentPosition: [
              currentPosition.latitude,
              currentPosition.longitude,
            ],
          };
          const data_maker = await getMarker(route.params.marker_id, params);
          if (isActive) {
            setMarker(data_maker);
          }
        }
      };

      fetchMarker();
      return () => {
        isActive = false;
      };
    }, [currentPosition]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMarker = async () => {
        if (isActive) {
          updateCurrentPosition();
        }
      };

      fetchMarker();
      return () => {
        isActive = false;
      };
    }, []),
  );

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

  useEffect(() => {
    let isActive = true;

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
    return () => {
      isActive = false;
    };
  }, [likes]),
    // useEffect(() => {
    //   const subscriber = () => {
    //     console.log(like);
    //     setLikes(likes + 1);
    //   };
    //   return subscriber; // unsubscribe on unmount
    // }, [like]);

    console.log('Marker inside modal: ', route.params.marker);
  return marker ? (
    <View>
      <Text>{marker.title} </Text>

      <Image
        style={styles.logo}
        source={{
          uri: marker.imgURL,
        }}
      />

      <Text>A {marker.distance} </Text>

      <Text>
        Usuario:{' '}
        <Text onPress={() => goToProfile()}>{marker.user[0].username}</Text>
      </Text>

      <View>
        <Text>Likes: {likes} </Text>
        <Text>Dislikes: {dislikes} </Text>
        <View>
          <Button
            mode="contained"
            onPress={() => likeMarker(1)}
            icon="pistol"
            color={like ? 'blue' : 'white'}
            contentStyle={like ? styles.selected : null}>
            +1
          </Button>
          <Button
            mode="contained"
            onPress={() => likeMarker(-1)}
            icon="pistol"
            color={dislike ? 'blue' : 'white'}
            contentStyle={dislike ? styles.selected : null}>
            -1
          </Button>
        </View>
        <Comments marker={marker} user={route.params.user.uid} />
      </View>
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
  logo: {
    width: 200,
    height: 200,
  },

  selected: {
    backgroundColor: 'black',
  },
  selectedText: {
    color: 'white',
  },
});
