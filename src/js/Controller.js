import { API_URL, FIRST_MESSAGE } from './const';
import ServerRequests from './ServerRequests';
import Geolocation from './Geolocation';
import MessageForm from './MessageForm';
import MessageView from './MessageView';
import Sidebar from './Sidebar';

export default class Controller {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.server = new ServerRequests(API_URL);
    this.messageContainer = this.container.querySelector('.message__container');
    this.messageWrapper = this.container.querySelector('.message__wrapper');
    this.pinnedMessage = this.container.querySelector('.message__pinned');
    this.messageControl = this.container.querySelector('.message__control');
    this.sidebarControlBtn = this.container.querySelector('.button-sidebar');
    this.sidebar = this.container.querySelector('.sidebar__container');
    this.sidebarWrapper = this.container.querySelector('.sidebar__wrapper');
  }

  init() {
    this.preload();
    this.viewList();
    this.sidebarView();
    this.sidebarControl();
    this.messageFormControl();
    this.viewLocation();
  }

  sidebarView() {
    this.sidebarControlBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.sidebar.classList.toggle('sidebar__container-active');
      this.sidebarControlBtn.classList.toggle('button-sidebar-active');
    });
  }

  sidebarControl() {
    const sidebarBtns = this.sidebar.querySelectorAll('.sidebar__button');
    sidebarBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        this.server.get(btn.dataset.id)
          .then((value) => {
            const content = new Sidebar(this.sidebar, btn.dataset.id, value);
            content.init();
            this.sidebarWrapper.classList.toggle('sidebar__wrapper-inactive');
          });
      });
    });
  }

  messageFormControl() {
    const message = new MessageForm(this.messageContainer);
    message.init();
  }

  viewList() {
    this.preload.classList.add('message__preload-active');
    this.messageControl.style.pointerEvents = 'none';
    this.server.list()
      .then((value) => {
        if (!value) {
          this.preload.classList.remove('message__preload-active');
          this.messageWrapper.innerHTML = `
            <p class="message__info">503 Service Unavailable</p>
          `;
          return;
        }
        if (value && value.length === 0) {
          this.preload.classList.remove('message__preload-active');
          this.messageWrapper.innerHTML = '';
          this.messageControl.style.pointerEvents = '';
          FIRST_MESSAGE.time = Controller.getDate();
          const messageView = new MessageView(
            this.messageWrapper,
            FIRST_MESSAGE,
            FIRST_MESSAGE.time,
          );
          messageView.init();
          this.server.create(FIRST_MESSAGE);
          return;
        }
        this.preload.classList.remove('message__preload-active');
        this.messageControl.style.pointerEvents = '';
        value.map((item) => {
          const messageView = new MessageView(this.messageWrapper, item, item.time);
          return messageView.init();
        });
      });
    setTimeout(() => this.getPin(), 500);
  }

  getPin() {
    this.server.pin()
      .then((value) => {
        if (!value) return;
        value.map((item) => this.viewPin(item));
      });
  }

  viewPin(obj) {
    this.pinnedMessage.classList.add('message__pinned-active');
    this.pinnedMessage.querySelector('.pinned__content').textContent = obj.text;
    this.pinnedMessage.dataset.pin = obj.id;
    this.scrollPin();
  }

  scrollPin() {
    this.pinnedMessage.querySelector('.message__pinned-container').addEventListener('click', (e) => {
      e.preventDefault();
      const id = this.pinnedMessage.dataset.pin;
      const cloud = [...this.messageWrapper.children].filter((el) => el.dataset.id === id)[0];
      cloud.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      cloud.classList.add('message__cloud-shadow');
      setTimeout(() => cloud.classList.remove('message__cloud-shadow'), 2100);
    });
  }

  preload() {
    const preload = document.createElement('div');
    preload.classList.add('message__preload');
    preload.innerHTML = `
      <div class="message__info-icon"></div>
      <p class="message__info">История сообщений загружается.</p>
      <p class="message__info">Пожалуйста, дождитесь ответ от сервера.</p>
    `;
    this.messageContainer.append(preload);
    this.preload = preload;
  }

  viewLocation() {
    const geo = new Geolocation(this.container);
    geo.init();
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
