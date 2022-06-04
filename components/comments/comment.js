import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

export default function comment({comment}) {
  console.log('Comment??: ', comment);
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {comment.user.imgURL && (
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={{uri: comment.user.imgURL}}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text>
          sssss
          <Text style={[styles.text, styles.name]}>
            {comment.user.username}
          </Text>{' '}
          <Text style={styles.text}>{comment.message}</Text>
        </Text>
        <Text style={[styles.text, styles.created]}>{comment.created_at}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 5,
    paddingTop: 10,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    padding: 5,
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 13,
    width: 26,
    height: 26,
  },
  text: {
    color: '#000',
    fontFamily: 'Avenir',
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
  },
  created: {
    color: '#BBB',
  },
});
