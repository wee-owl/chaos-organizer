/* eslint-disable no-console */
import { API_URL, FILE_SIZE_LIMIT, EMOJI } from './const';
import ServerRequests from './ServerRequests';
import MessageView from './MessageView';
import Bot from './Bot';

export default class MessageForm {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.server = new ServerRequests(API_URL);
    this.wrapper = this.container.querySelector('.message__wrapper');
    this.textArea = this.container.querySelector('.message__form-textarea');
    this.sendBtn = this.container.querySelector('.button-send');
    this.addBtn = this.container.querySelector('.button-add');
    this.emojiBtn = this.container.querySelector('.button-emoji');
    this.cancelBtn = this.container.querySelector('.message__cancel-button');
    this.overlay = this.container.querySelector('.message__overlay');
    this.overlayBtn = this.container.querySelector('.message__overlay-button');
    this.btnInput = this.container.querySelector('.button__input');
    this.btnInputOverlap = this.container.querySelector('.button__input-overlap');
  }

  init() {
    this.viewMessage();
    this.btnAddClick();
    this.btnCloseClick();
    this.addFile();
    this.viewEmoji();
  }

  viewMessage() {
    this.viewSendBtn();
    const sendMessage = () => {
      if (this.sendBtn.className.includes('button-send-active')) {
        const obj = {};
        obj.author = 'user';
        obj.text = this.textArea.innerText.trim();
        obj.time = MessageForm.getDate();
        const messageView = new MessageView(this.wrapper, obj, obj.time);
        messageView.init();
        this.server.create(obj);
        this.sendBtn.classList.remove('button-send-active');
        this.botAnswer(obj.text);
        this.textArea.textContent = '';
        this.textArea.blur();
      }
    };

    this.sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage();
    });

    this.textArea.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.code === 'Enter' && !e.shiftKey) {
        sendMessage();
      }
    });
  }

  botAnswer(text) {
    if (text.includes('@chaos')) {
      const bot = new Bot(text);
      const obj = {};
      obj.author = 'bot';
      obj.text = bot.init();
      obj.time = MessageForm.getDate();
      const messageView = new MessageView(this.wrapper, obj, obj.time);
      messageView.init();
      this.server.create(obj);
    }
  }

  viewEmoji() {
    this.emojiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emojiArr = this.container.querySelector('.message__emoji-wrapper');
      emojiArr.classList.toggle('message__emoji-wrapper-active');
      if (emojiArr.className.includes('message__emoji-wrapper-active')) {
        EMOJI.forEach((item) => {
          const div = document.createElement('div');
          div.innerHTML = `${item}`;
          emojiArr.append(div);
        });
      } else {
        emojiArr.classList.remove('message__emoji-wrapper-active');
        [...emojiArr.children].forEach((item) => {
          item.remove();
        });
      }
    });
  }

  viewSendBtn() {
    this.textArea.addEventListener('input', (e) => {
      if (e.target && e.target.textContent.trim().length) {
        this.sendBtn.classList.add('button-send-active');
      } else {
        this.sendBtn.classList.remove('button-send-active');
      }
    });
  }

  btnAddClick() {
    this.addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.basicOverlay();
      this.overlay.classList.add('message__overlay-active');
    });
  }

  btnCloseClick() {
    this.cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.overlay.classList.remove('message__overlay-active');
    });
  }

  addFile() {
    this.overlayBtn.addEventListener('click', () => {
      this.btnInput.dispatchEvent(new MouseEvent('input'));
    });
    this.btnInput.addEventListener('change', () => {
      const file = this.btnInput.files[0];
      if (!file) return;
      this.viewFile(file);
    });

    const dragenter = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.basicOverlay();
      this.overlay.classList.add('message__overlay-active');
    };
    const dragover = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.overlayBtn.classList.add('message__overlay-button-active');
      this.btnInputOverlap.classList.add('button__input-overlap-active');
    };
    const drop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.overlayBtn.classList.remove('message__overlay-button-active');
      this.btnInputOverlap.classList.remove('button__input-overlap-active');
      this.viewFile(e.dataTransfer.files[0]);
    };

    this.container.addEventListener('dragenter', dragenter, false);
    this.container.addEventListener('dragover', dragover, false);
    this.container.addEventListener('drop', drop, false);
  }

  viewFile(file) {
    const getFileUrl = (uploadFile) => {
      const fr = new FileReader();
      return new Promise((resolve, reject) => {
        fr.onerror = () => {
          fr.abort();
          reject(new DOMException('Problem parsing input file.'));
        };
        fr.onload = () => {
          resolve(fr.result);
        };
        fr.readAsDataURL(uploadFile);
      });
    };

    const handleUpload = async () => {
      try {
        this.addPreload();
        const fileContents = await getFileUrl(file);
        let type = file.type.replace(/\/.+/, '');
        if (type !== 'image' && type !== 'audio' && type !== 'video') {
          type = 'file';
        }
        const obj = {};
        obj.author = 'user';
        obj.text = file.name;
        obj.fileName = file.name;
        obj.type = type;
        obj.url = fileContents;
        obj.time = MessageForm.getDate();
        const messageView = new MessageView(this.wrapper, obj, obj.time);
        messageView.init();
        this.server.create(obj);
        setTimeout(() => this.overlay.classList.remove('message__overlay-active'), 500);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (file.size <= FILE_SIZE_LIMIT * 1048576) {
      handleUpload();
    } else {
      this.addPreload();
      this.oversizeFile();
    }
  }

  addPreload() {
    this.basicOverlay();
    this.overlay.children[0].style.display = 'none';
    this.overlay.children[1].style.display = 'none';
    const preload = document.createElement('div');
    preload.classList.add('message__info-icon');
    this.overlay.prepend(preload);
  }

  oversizeFile() {
    this.basicOverlay();
    this.overlay.children[0].style.display = 'none';
    this.overlay.children[1].style.display = 'none';
    const oversize = document.createElement('p');
    oversize.classList.add('message__info');
    oversize.innerHTML = `Размер файла превышает ${FILE_SIZE_LIMIT}Мб`;
    this.overlay.prepend(oversize);
  }

  basicOverlay() {
    if (this.overlay.querySelector('.message__info-icon')) {
      this.overlay.querySelector('.message__info-icon').remove();
    }
    if (this.overlay.querySelector('.message__info')) {
      this.overlay.querySelector('.message__info').remove();
    }
    this.overlay.children[0].style.display = '';
    this.overlay.children[1].style.display = '';
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
