import Geolocation from 'react-native-geolocation-service';

export async function getCoords() {
  return new Promise(async (resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },

      error => reject(error),
      {
        timeout: 20000,
        maximumAge: 5000,
        enableHighAccuracy: true,
      },
    );
  });
}
