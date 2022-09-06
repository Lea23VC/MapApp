import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
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
import React, {useState, setState, useEffect, useCallback} from 'react';
import {setComment as setCommentAPI} from '../../api/comments';
export default function inputComment({
  marker_id,
  user_id,
  setUpdatingComments,
  updateComments,
}) {
  async function setCommentInMarker() {
    setUpdatingComments(true);
    const data = {
      user_id: user_id,
      marker_id: parseInt(marker_id),
      message: comment,
      votes: 0,
    };

    const data_comments = await setCommentAPI(data);
    setComment('');
    updateComments(data_comments);
    setUpdatingComments(false);
  }

  const [comment, setComment] = useState('');
  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={styles.container}>
        {/* Comment input field */}
        <TextInput
          placeholder="Escribe un comentario"
          keyboardType="twitter" // keyboard with no return button
          autoFocus={true} // focus and show the keyboard
          style={styles.input}
          value={comment}
          onChangeText={setComment} // handle input changes
          //   onSubmitEditing={this.onSubmitEditing} // handle submit event
        />
        {/* Post button */}
        <TouchableOpacity
          accessible={comment != '' ? true : false}
          style={styles.button}
          onPress={() => setCommentInMarker()}>
          {/* Apply inactive style if no input */}
          <Text style={[styles.text, comment == '' ? styles.inactive : []]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 15,
  },
});
