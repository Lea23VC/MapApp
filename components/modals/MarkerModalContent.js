import React from 'react';

import {Text} from 'react-native-paper';
import {View, Image, ScrollView, StyleSheet} from 'react-native';

export default function MarkerModalContent({marker, navigation, user}) {
  async function goToProfile() {
    navigation.navigate('Profile', {
      userId: marker.user[0].id,
      userAuth: user.uid,
    });
  }

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
        Usuario:
        <Text onPress={() => goToProfile()}>{marker.user[0].username}</Text>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
  },
});
