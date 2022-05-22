import React from 'react';

import {Text} from 'react-native-paper';
import {View, Image, ScrollView, StyleSheet} from 'react-native';
export default function MarkerModalContent({marker}) {
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
    </View>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
  },
});
