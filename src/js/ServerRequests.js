/* eslint-disable no-console */
export default class ServerRequests {
  constructor(API_URL) {
    this.url = API_URL;
  }

  list() {
    return fetch(`${this.url}?method=getList`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  }

  pin() {
    return fetch(`${this.url}?method=getPin`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  }

  get(type) {
    return fetch(`${this.url}?method=messageType&type=${type}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  }

  create(data) {
    fetch(`${this.url}?method=createMessage`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => console.log(response.status, response.statusText))
      .catch((err) => console.error(err));
  }

  createPin(data) {
    fetch(`${this.url}?method=createPin`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => console.log(response.status, response.statusText))
      .catch((err) => console.error(err));
  }

  delete(id) {
    fetch(`${this.url}?method=deleteById&id=${id}`, {
      method: 'GET',
    })
      .then((response) => console.log(response.status, response.statusText))
      .catch((err) => console.error(err));
  }

  deletePin(id) {
    fetch(`${this.url}?method=deletePin&id=${id}`, {
      method: 'GET',
    })
      .then((response) => console.log(response.status, response.statusText))
      .catch((err) => console.error(err));
  }
}
