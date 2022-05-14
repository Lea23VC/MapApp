import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, {retries: 3});
import CookieManager from '@react-native-cookies/cookies';

const baseUrl = 'https://5049-190-114-57-42.ngrok.io';

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
        // birthDate: birthDate,
        firebaseUID: firebaseUID,
        email: email,
      },
    }).then(response => {
      console.log('data: ', response.data);
      console.log('created???');
      CookieManager.set(baseUrl, {
        name: 'authToken',
        value: response.data.data.token,
      }).then(done => {
        console.log('CookieManager.set =>', done);
      });
    });
  } catch (error) {
    console.log(error.response); // this is the main part. Use the response property from the error object

    return error.response;
  }
}

export async function loginUserBackend(token) {
  console.log('inside Login function');
  try {
    let req = await axios({
      method: 'post',
      url: `${baseUrl}/api/login`,
      data: {
        Firebasetoken: token,
      },
    }).then(response => {
      console.log('data: ', response.data);
      console.log('created???');
      CookieManager.set(baseUrl, {
        name: 'authToken',
        value: response.data.data.token,
      }).then(done => {
        console.log('CookieManager.set =>', done);
      });
    });
  } catch (error) {
    console.log(error.response); // this is the main part. Use the response property from the error object

    return error.response;
  }
}
