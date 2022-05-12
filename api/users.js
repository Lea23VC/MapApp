import axios from 'axios';

const baseUrl = 'https://5f18-190-114-57-42.ngrok.io';

export async function registerUser(
  firebaseUID,
  username,
  name,
  birthDate,
  email,
) {
  try {
    let req = await axios({
      method: 'post',
      url: `${baseUrl}/api/register`,
      data: {
        username: username,
        name: name,
        birthDate: birthDate,
        firebaseUID: firebaseUID,
        email: email,
      },
    }).then(response => {
      console.log(response.data);
      console.log('created???');
    });
  } catch (error) {
    console.log(error.response); // this is the main part. Use the response property from the error object

    return error.response;
  }
}
