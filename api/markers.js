import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, {retries: 3});
import CookieManager from '@react-native-cookies/cookies';
import {BASE_URL_API} from '@env';

const baseUrl = BASE_URL_API;

export async function getMarkers(token) {
  try {
    let req = await axios({
      method: 'get',
      url: `${baseUrl}/api/markers`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('data: ', data);
      });
  } catch (error) {
    console.log(error.response); // this is the main part. Use the response property from the error object

    return error.response;
  }
}
