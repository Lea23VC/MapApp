import React, {useState, useEffect, useCallback} from 'react';

import {Text, Button} from 'react-native-paper';
import {View, Image, ScrollView, StyleSheet} from 'react-native';
import {updateMarker} from '../../api/markers';
import {useFocusEffect} from '@react-navigation/native';

// import {useFocusEffect} from '@react-navigation/native';
export default function MarkerModalContent({
  marker,
  navigation,
  user,
  setModalVisible,
}) {
  const [like, setLike] = useState(marker.voted_marker == 1 ? true : false);

  const [dislike, setDislike] = useState(
    marker.voted_marker == -1 ? true : false,
  );
  const [likes, setLikes] = useState(marker.likes);
  const [dislikes, setDislikes] = useState(marker.dislikes);
  async function goToProfile() {
    setModalVisible(false);
    navigation.navigate('Profile', {
      userId: marker.user[0].id,
      userAuth: user.uid,
    });
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

  useEffect(() => {
    let isActive = true;

    const updateVotes = async () => {
      const data = {
        likes: likes,
        dislikes: dislikes,
        user_voted: user.uid,
        vote_action: like ? 1 : dislike ? -1 : 0,
      };
      const data_makers = await updateMarker(marker.id, data);
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

    console.log('Marker inside modal: ', marker);
  return (
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
      </View>
    </View>
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
