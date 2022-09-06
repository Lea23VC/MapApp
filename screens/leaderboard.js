import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  Checkbox,
  Modal,
  Portal,
  Button,
  ActivityIndicator,
  Colors,
  Provider,
} from 'react-native-paper';
// import FormButton from '../components/FormButton';
// import {AuthContext} from '../navigation/AuthProvider';
import CookieManager from '@react-native-cookies/cookies';
import {BASE_URL_API} from '@env';
import ImageView from 'react-native-image-viewing';

import firestore from '@react-native-firebase/firestore';
// import PostCard from '../components/PostCard';
import {useFocusEffect} from '@react-navigation/native';

import {getUsers} from '../api/users';

import auth from '@react-native-firebase/auth';

export default function leaderboardScreen({navigation, route}) {
  console.log('route: ', route);
  async function goToProfile(user) {
    // setModalVisible(false);
    navigation.navigate('Profile', {
      userId: user.id,
      userAuth: route.params.userId,
    });
  }

  const [users, setUsers] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchUserData() {
        const data = await getUsers();
        if (isActive) {
          setUsers(data);
        }
      }
      fetchUserData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return users ? (
    <View>
      {users.map((user, index) => (
        <View style={[styles.fixToText, {padding: 10}]} key={index}>
          <View>
            <Text style={{fontWeight: 'bold', fontSize: 30, paddingRight: 20}}>
              {' '}
              {index + 1}{' '}
            </Text>
          </View>

          <Pressable onPress={() => goToProfile(user)}>
            <Image
              style={styles.userImg}
              source={{
                uri: user.imgURL,
              }}
            />
          </Pressable>
          <Text onPress={() => goToProfile()} style={styles.username}>
            {user.username}
          </Text>

          <View style={{paddingLeft: 10}}>
            <Text>Puntos: {user.likes} </Text>
          </View>
        </View>
      ))}
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
  fixToText: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  username: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey',
    paddingLeft: 10,
  },

  userImg: {
    height: 50,
    width: 50,
    borderRadius: 75,
  },
});
