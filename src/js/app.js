import Controller from './Controller';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const app = new Controller(body);
  app.init();
});
