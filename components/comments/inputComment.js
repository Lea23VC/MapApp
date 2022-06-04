import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, setState, useEffect, useCallback} from 'react';
import {setComment as setCommentAPI} from '../../api/comments';
export default function inputComment({marker_id, user_id}) {
  async function setCommentInMarker() {
    const data = {
      user_id: user_id,
      marker_id: parseInt(marker_id),
      message: comment,
      votes: 0,
    };

    await setCommentAPI(data);
  }

  const [comment, setComment] = useState('');
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.container}>
        {/* Comment input field */}
        <TextInput
          placeholder="Add a comment..."
          keyboardType="twitter" // keyboard with no return button
          autoFocus={true} // focus and show the keyboard
          style={styles.input}
          value={comment}
          onChangeText={setComment} // handle input changes
          //   onSubmitEditing={this.onSubmitEditing} // handle submit event
        />
        {/* Post button */}
        <TouchableOpacity
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
