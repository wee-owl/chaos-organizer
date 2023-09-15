import { FILE_ICON } from './const';

export default class Sidebar {
  constructor(container, id, value) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.id = id;
    this.value = value;
    this.sidebarWrapper = this.container.querySelector('.sidebar__wrapper');
  }

  init() {
    this.createTable();
    this.viewContent();
    this.closeSidebarArea();
  }

  createTable() {
    const sidebarArea = document.createElement('div');
    sidebarArea.classList.add('sidebar__area');
    sidebarArea.innerHTML = `
      <button class="sidebar__area-btn" type="button" name="button" aria-label="Click to return"></button>
    `;
    this.container.prepend(sidebarArea);
    this.sidebarArea = sidebarArea;
    this.sidebarAreaBtn = this.sidebarArea.querySelector('.sidebar__area-btn');
  }

  createItem(fileName, type, url, link) {
    const item = document.createElement('div');
    item.classList.add('sidebar__area-item');
    if (fileName) {
      switch (type) {
        case 'image':
          item.innerHTML = `
            <a href="${url}" rel="noopener" download="${fileName}">
              <img src="${url}" alt="${fileName}">
            </a>
          `;
          break;
        case 'audio':
          item.innerHTML = `
            <a href="${url}" rel="noopener" download="${fileName}">
              <audio src="${url}" controls></audio>
              <p>${fileName}</p>
            </a>
          `;
          break;
        case 'video':
          item.innerHTML = `
            <a href="${url}" rel="noopener" download="${fileName}">
              <video controls>
                <source src="${url}" type="video/mp4">
                <source src="${url}" type="video/webm">
                <source src="${url}" type="video/ogg">
                <object data="${url}" type="application/x-shockwave-flash">
                  <param name="video" value="${url}">
                </object>
              </video>
              <p>${fileName}</p>
            </a>
          `;
          break;
        default:
          item.innerHTML = `
            <a href="${url}" rel="noopener" download="${fileName}">
              <div>${FILE_ICON}</div>
              <p>${fileName}</p>
            </a>
          `;
          break;
      }
    } else if (link) {
      item.innerHTML = `<a class="sidebar__area-item-link" href="${link}" target="_blank">${link}</a>`;
    } else {
      return;
    }
    this.sidebarArea.append(item);
  }

  viewContent() {
    const links = document.querySelectorAll('.message__link') || null;
    if (this.id === 'link') {
      links.forEach((link) => this.createItem(null, null, null, link.href));
    } else {
      this.value.forEach((item) => this.createItem(item.fileName, item.type, item.url, null));
    }
  }

  closeSidebarArea() {
    this.sidebarAreaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.sidebarArea.remove();
      this.sidebarWrapper.classList.toggle('sidebar__wrapper-inactive');
    });
  }
}
