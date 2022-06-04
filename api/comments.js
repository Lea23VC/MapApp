import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, {retries: 3});
import CookieManager from '@react-native-cookies/cookies';
import {BASE_URL_API} from '@env';
import {useState} from 'react';
const baseUrl = BASE_URL_API;

// export async function getMarkers(params = null) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const cookies = await CookieManager.get(BASE_URL_API);
//       console.log('cookies aaaa inside API: ', cookies);
//       let req = await axios({
//         method: 'get',
//         url: `${baseUrl}/api/markers`,
//         params: params,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + cookies.authToken.value,
//         },
//       }).then(response => {
//         console.log('data from api markers: ', response);
//         resolve(response.data.data);
//       });
//     } catch (error) {
//       console.log(error.response); // this is the main part. Use the response property from the error object

//       reject(error.response);
//     }
//   });
// }

// export async function getMarker(token, id, params = null) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let req = await axios({
//         method: 'get',
//         url: `${baseUrl}/api/markers/${id}`,
//         params: params,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token,
//         },
//       }).then(response => {
//         console.log('data from api markers: ', response);
//         resolve(response.data.data);
//       });
//     } catch (error) {
//       console.log(error.response); // this is the main part. Use the response property from the error object

//       reject(error.response);
//     }
//   });
// }

export async function setComment(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const cookies = await CookieManager.get(BASE_URL_API);
      let req = await axios({
        method: 'post',
        url: `${baseUrl}/api/comments`,
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
}

// export async function updateMarker(id, data) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const cookies = await CookieManager.get(BASE_URL_API);
//       let req = await axios({
//         method: 'post',
//         url: `${baseUrl}/api/markers/${id}?_method=PUT`,
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer ' + cookies.authToken.value,
//         },
//         data: data,
//       }).then(response => {
//         console.log('data: ', response.data);
//         console.log('created???');
//         resolve(response.data);
//       });
//     } catch (error) {
//       console.log(error.response); // this is the main part. Use the response property from the error object

//       reject(error.response);
//     }
//     // console.log('a after get Markers: ', a);
//   });
// }
