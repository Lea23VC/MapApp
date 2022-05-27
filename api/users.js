import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, {retries: 3});
import CookieManager from '@react-native-cookies/cookies';
import {BASE_URL_API} from '@env';
const baseUrl = BASE_URL_API;
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

export async function loginUserBackend(token, id) {
  console.log('inside Login function');
  try {
    let req = await axios({
      method: 'post',
      url: `${baseUrl}/api/login`,
      data: {
        Firebasetoken: token,
      },
    }).then(async response => {
      console.log('data: ', response.data);
      console.log('created???');

      CookieManager.set(baseUrl, {
        name: 'userId',
        value: id,
      });
      CookieManager.set(baseUrl, {
        name: 'authToken',
        value: response.data.access_token,
      }).then(done => {
        console.log('CookieManager.set =>', done);
      });
    });
  } catch (error) {
    console.log(error.response); // this is the main part. Use the response property from the error object

    return error.response;
  }
}

export async function getUser(token, id, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      let req = await axios({
        method: 'get',
        url: `${baseUrl}/api/users/${id}`,
        params: params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }).then(response => {
        console.log('data from api markers: ', response);
        resolve(response.data.data);
      });
    } catch (error) {
      console.log(error.response); // this is the main part. Use the response property from the error object

      reject(error.response);
    }
  });
}

export async function updateUser(token, id, data) {
  return new Promise(async (resolve, reject) => {
    try {
      let req = await axios({
        method: 'post',
        url: `${baseUrl}/api/users/${id}?_method=PUT`,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token,
        },
      }).then(response => {
        console.log('data from api markers: ', response);
        resolve(response.data.data);
      });
    } catch (error) {
      console.log(error.response); // this is the main part. Use the response property from the error object

      reject(error.response);
    }
  });
}
