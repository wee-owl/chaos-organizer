/* eslint-disable quote-props */
/* eslint-disable no-console */
import { GEO_API_KEY } from './const';

export default class Geolocation {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.coordsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';
    this.ipUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=';
    this.container = container;
    this.btnLocation = this.container.querySelector('.button-location');
    this.locationIcon = this.container.querySelector('.location__city');
  }

  init() {
    this.getCoords();
    this.getIP();
  }

  getCoords() {
    if (!navigator.geolocation) {
      console.error('Разрешите доступ к службам геолокации.');
    } else {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          const { latitude, longitude } = data.coords;
          const coords = { lat: `${latitude}`, lon: `${longitude}` };
          this.getCityCoords(coords);
        },
        (err) => {
          console.error(`${err}: Невозможно определить геолокацию по координатам. Геолокация определена по IP`);
        },
        { enableHighAccuracy: true },
      );
    }
  }

  getCityCoords(coords) {
    fetch(
      this.coordsUrl,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${GEO_API_KEY}`,
        },
        body: JSON.stringify(coords),
      },
    )
      .then((response) => response.text())
      .then((result) => this.getCity(JSON.parse(result).suggestions[0].data.city))
      .catch((error) => console.error(error));
  }

  getIP() {
    fetch('https://ipapi.co/json/')
      .then((d) => d.json())
      .then((d) => this.getCityIP(d.ip));
  }

  getCityIP(ip) {
    fetch(
      `${this.ipUrl}${ip}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${GEO_API_KEY}`,
        },
      },
    )
      .then((response) => response.text())
      .then((result) => this.getCity(JSON.parse(result).location.data.city))
      .catch((error) => console.error(error));
  }

  getCity(value) {
    if (!this.locationIcon.textContent) {
      this.locationIcon.textContent = value;
      this.btnLocation.classList.toggle('button-location-active');
    }
  }
}
