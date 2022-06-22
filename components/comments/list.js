import {RefreshControl, ScrollView, StyleSheet, View, Text} from 'react-native';
import Comment from './comment';
import Input from './inputComment';
import React, {useState, setState, useEffect, useCallback} from 'react';
import {
  Checkbox,
  Modal,
  Portal,
  Button,
  ActivityIndicator,
  Colors,
  Provider,
} from 'react-native-paper';

export default function listComponent({
  marker_id,
  user,
  comments,
  setComments,
  updateComments,
  navigation,
}) {
  // console.log('marker inside list.js: ', marker);
  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [updatingComments, setUpdatingComments] = useState(false);
  async function goToProfile(user_comment) {
    // setModalVisible(false);
    navigation.navigate('Profile', {
      userId: user_comment,
      userAuth: user,
    });
  }
  return (
    <View style={styles.container}>
      {/* Scrollable list */}

      {/* Comment input box */}
      <Input
        updateComments={updateComments}
        marker_id={marker_id}
        user_id={user}
        setUpdatingComments={setUpdatingComments}
      />
      {!updatingComments ? (
        <View>
          <View>
            {comments.map((comment, index) => (
              <Comment
                comment={comment}
                key={index}
                goToProfile={goToProfile}
                userId={user}
              />
            ))}
          </View>
        </View>
      ) : (
        <ActivityIndicator
          style={{flex: 1}}
          animating={true}
          color={Colors.red800}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    marginTop: 10,
    borderRadius: 10,
  },
});
