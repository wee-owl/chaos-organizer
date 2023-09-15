import ServerRequests from './ServerRequests';
import { API_URL, FILE_ICON } from './const';

export default class MessageView {
  constructor(container, obj, time) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.server = new ServerRequests(API_URL);
    this.obj = obj;
    this.time = time === null ? MessageView.getDate() : time;
    this.pin = document.querySelector('.message__pinned');
  }

  init() {
    this.createMessage();
  }

  createMessage() {
    const messageCloud = document.createElement('div');
    messageCloud.classList.add('message__cloud');
    messageCloud.classList.add(`message__cloud-${this.obj.author}`);
    messageCloud.dataset.id = this.obj.id;
    messageCloud.innerHTML = `
      <p class="message message__${this.obj.author}"></p>
      <time class="message__time" datetime="${this.getDateTime()}">${this.time}</time>
      <button class="message__cloud-pin" type="button" name="button" aria-label="Click to pinned the message"></button>
      <button class="message__cloud-delete" type="button" name="button" aria-label="Click to delete the message"></button>
    `;
    this.container.append(messageCloud);
    this.messageCloud = messageCloud;
    this.pinnedBtn = this.messageCloud.querySelector('.message__cloud-pin');
    this.deleteBtn = this.messageCloud.querySelector('.message__cloud-delete');

    if (this.obj.fileName) {
      switch (this.obj.type) {
        case 'image':
          this.createImage(this.obj.url);
          break;
        case 'audio':
          this.createAudio(this.obj.url);
          break;
        case 'video':
          this.createVideo(this.obj.url);
          break;
        default:
          this.createDefault(this.obj.url);
          break;
      }
    } else if (this.obj.text && this.obj.text.includes('http')) {
      this.messageCloud.querySelector('.message').innerHTML = this.findLink();
    } else {
      this.messageCloud.querySelector('.message').innerText = this.obj.text;
    }
    setTimeout(() => this.scrollBottom(), 500);
    this.pinnedMessage();
    this.deleteMessage();
  }

  createImage(url) {
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noopener';
    link.download = this.obj.fileName;
    link.innerHTML = `<img class="message__preview" src="${url}" alt="${this.obj.fileName}">`;
    this.messageCloud.prepend(link);
  }

  createAudio(url) {
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noopener';
    link.download = this.obj.fileName;
    link.innerHTML = `<audio class="message__audio" src="${url}" controls></audio>`;
    this.messageCloud.prepend(link);
    this.messageCloud.querySelector('.message').innerText = this.obj.fileName;
  }

  createVideo(url) {
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noopener';
    link.download = this.obj.fileName;
    link.innerHTML = `
      <video controls>
        <source src="${url}" type="video/mp4">
        <source src="${url}" type="video/webm">
        <source src="${url}" type="video/ogg">
        <object data="${url}" type="application/x-shockwave-flash">
          <param name="video" value="${url}">
        </object>
      </video>
    `;
    this.messageCloud.prepend(link);
    this.messageCloud.querySelector('.message').innerText = this.obj.fileName;
  }

  createDefault(url) {
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noopener';
    link.download = this.obj.fileName;
    link.innerHTML = `<div class="message__preview-default">${FILE_ICON}</div>`;
    this.messageCloud.prepend(link);
    this.messageCloud.querySelector('.message').innerText = this.obj.fileName;
  }

  findLink() {
    const arr = this.obj.text.split(/\s/);
    for (let i = 0; i < arr.length; i += 1) {
      const link = arr[i].match(/^(http|https):\/\/[\w.-]+\b/);
      if (link) {
        arr[i] = `<a class="message__link" href="${link.input}" target=_blank">${link.input}</a>`;
      }
    }
    return arr.join(' ');
  }

  pinnedMessage() {
    this.pinnedBtn.addEventListener('click', (e) => this.selectPin(e));
    this.pin.addEventListener('click', (e) => this.deletePin(e));
    this.scrollPin();
  }

  selectPin(e) {
    e.preventDefault();
    this.pin.classList.add('message__pinned-active');
    this.pin.dataset.pin = e.target.parentElement.dataset.id;
    if (e.target.parentElement.children[0].href) {
      this.pin.querySelector('.pinned__content').textContent = e.target.parentElement.children[0].download;
    } else {
      this.pin.querySelector('.pinned__content').textContent = e.target.parentElement.children[0].textContent;
    }
    const obj = {};
    obj.id = this.pin.dataset.pin;
    obj.text = this.pin.querySelector('.pinned__content').textContent;
    this.server.createPin(obj);
  }

  scrollPin() {
    document.querySelector('.message__pinned-container').addEventListener('click', () => {
      const id = document.querySelector('.message__pinned-container').parentElement.dataset.pin;
      const cloud = [...this.container.children].filter((el) => el.dataset.id === id)[0];
      cloud.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      cloud.classList.add('message__cloud-shadow');
      setTimeout(() => cloud.classList.remove('message__cloud-shadow'), 2100);
    });
  }

  deletePin(e) {
    e.preventDefault();
    if (e.target.closest('.message__pinned-delete')) {
      this.server.deletePin(e.target.parentElement.dataset.pin);
      this.pin.classList.remove('message__pinned-active');
    }
  }

  deleteMessage() {
    this.deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const messageId = e.target.parentElement.dataset.id;
      let pinId;
      if (document.querySelector('.message__pinned-active')) {
        pinId = document.querySelector('.message__pinned-active').dataset.pin;
      }
      if (messageId === pinId) {
        this.server.deletePin(pinId);
        document.querySelector('.message__pinned-active').classList.remove('message__pinned-active');
      }
      this.server.delete(this.messageCloud.dataset.id);
      this.messageCloud.remove();
    });
  }

  scrollBottom() {
    const bottomList = this.container.querySelectorAll('.bottom');
    if (bottomList) bottomList.forEach((el) => el.remove());
    const bottom = document.createElement('div');
    bottom.classList.add('bottom');
    this.container.append(bottom);
    bottom.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  getDateTime() {
    let time;
    if (this.time) {
      const dateTime = `
      20${this.time.substring(6, 8)}
      -${this.time.substring(3, 5)}
      -${this.time.substring(0, 2)}
      T${this.time.substring(9)}
    `;
      time = dateTime.replace(/\n/g, '').split(' ').join('');
    }
    return time || null;
  }

  static getDate() {
    const date = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit', month: '2-digit', year: '2-digit',
    }).format(Date.now());
    const time = new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit', minute: '2-digit',
    }).format(Date.now());
    return `${date} ${time}`;
  }
}
