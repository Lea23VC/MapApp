export default function inputComment() {
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.container}>
        {/* Comment input field */}
        <TextInput
          placeholder="Add a comment..."
          keyboardType="twitter" // keyboard with no return button
          autoFocus={true} // focus and show the keyboard
          style={styles.input}
          value={this.state.text}
          onChangeText={this.onChangeText} // handle input changes
          onSubmitEditing={this.onSubmitEditing} // handle submit event
        />
        {/* Post button */}
        <TouchableOpacity style={styles.button} onPress={this.submit}>
          {/* Apply inactive style if no input */}
          <Text style={[styles.text, !this.state.text ? styles.inactive : []]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
