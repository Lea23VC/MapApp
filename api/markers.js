import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, {retries: 3});
import CookieManager from '@react-native-cookies/cookies';
import {BASE_URL_API} from '@env';
import {useState} from 'react';
const baseUrl = BASE_URL_API;

export async function getMarkers(token, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      let req = await axios({
        method: 'get',
        url: `${baseUrl}/api/markers`,
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

export async function getMarker(token, id, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      let req = await axios({
        method: 'get',
        url: `${baseUrl}/api/markers/${id}`,
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

export async function setMarker(data) {
  return new Promise((resolve, reject) => {
    CookieManager.get(BASE_URL_API).then(async cookies => {
      console.log('CookieManager.get => ', +cookies);
      console.log('No cookies??: ', cookies.authToken.value);
      try {
        let req = await axios({
          method: 'post',
          url: `${baseUrl}/api/markers`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + cookies.authToken.value,
          },
          data: data,
        }).then(response => {
          console.log('data: ', response.data);
          console.log('created???');
          resolve(response.ata);
        });
      } catch (error) {
        console.log(error.response); // this is the main part. Use the response property from the error object

        reject(error.response);
      }
      // console.log('a after get Markers: ', a);
    });
  });
}
