import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import Comment from './comment';
import Input from './inputComment';
import React, {useState, setState, useEffect, useCallback} from 'react';

export default function listComponent({marker, user}) {
  console.log('marker inside list.js: ', marker);
  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Scrollable list */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></ScrollView>
      {/* Comment input box */}
      <Input marker_id={marker.id} user_id={user} />
      {marker.comments.map((comment, index) => (
        <Comment comment={comment} key={index} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 30,
  },
});
