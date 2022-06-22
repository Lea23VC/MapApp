import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, IconButton, Colors} from 'react-native-paper';
import {updateComment} from '../../api/comments';
export default function comment({comment, goToProfile, userId}) {
  const [like, setLike] = useState(comment.voted_marker == 1 ? true : false);
  const [dislike, setDislike] = useState(
    comment.voted_marker == -1 ? true : false,
  );
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const [fetched, setFetched] = useState(false);

  async function likeMarker(value) {
    console.log('LIKE: ', like);
    console.log('DISLIKE: ', dislike);
    console.log('LIKEs: ', likes);
    console.log('DISLIKEs: ', dislikes);
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

    if (fetched) {
      const updateVotes = async () => {
        const data = {
          likes: likes,
          dislikes: dislikes,
          user_voted: userId,
          vote_action: like ? 1 : dislike ? -1 : 0,
        };
        const data_makers = await updateComment(comment.id, data);
        if (isActive) {
        }
      };

      updateVotes();
    }
    setFetched(true);
    return () => {
      isActive = false;
    };
  }, [likes, dislikes]);

  return (
    <View opacity={dislikes < 10 ? 1 : 0.5} style={[styles.container]}>
      <View style={styles.avatarContainer}>
        {comment.user[0].imgURL && (
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={{uri: comment.user[0].imgURL}}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text>
          <Text
            onPress={() => goToProfile(comment.user[0].id)}
            style={[styles.text, styles.name]}>
            {comment.user[0].username}
          </Text>{' '}
          <Text style={styles.text}>{comment.message}</Text>
        </Text>
        <View style={styles.container}>
          <Text style={[styles.text, styles.created, styles.dataContainer]}>
            {comment.created_at}
          </Text>
          <View style={styles.dataContainer}>
            <View style={[styles.dataContainer, styles.negativeMargin]}>
              <View>
                <IconButton
                  icon="thumb-up-outline"
                  color={like ? Colors.green500 : Colors.black}
                  size={15}
                  onPress={() => likeMarker(1)}
                />
                <Text style={styles.centerText}> {likes} </Text>
              </View>
              <View>
                <IconButton
                  icon="thumb-down-outline"
                  color={dislike ? Colors.green500 : Colors.black}
                  size={15}
                  onPress={() => likeMarker(-1)}
                />
                <Text style={styles.centerText}> {dislikes}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  negativeMargin: {
    marginTop: -10,
  },
  dataContainer: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },

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
  centerText: {
    textAlign: 'center',
  },
  iconActive: {
    color: 'green',
  },
});
