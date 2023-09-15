import { BOT_COMMAND } from './const';
import answers from './AnswersDB';

export default class Bot {
  constructor(value) {
    if (!value) {
      throw new Error('Incorrect value');
    }
    this.value = value;
    this.answer = null;
  }

  init() {
    return this.getResult();
  }

  getResult() {
    const count = (this.value.match(/@chaos/g) || []).length;
    if (count > 1) {
      this.answer = 'Команда некорректна. Пожалуйста, уточните команду.';
    } else {
      const result = this.getCommand().trim();
      if (!result.length) {
        let answer = '';
        for (let i = 1; i < BOT_COMMAND.length; i += 1) {
          answer += `${BOT_COMMAND[0]}: ${BOT_COMMAND[i]}\n`;
        }
        this.answer = answer;
      } else {
        for (let i = 1; i < BOT_COMMAND.length; i += 1) {
          if (result.includes(BOT_COMMAND[i])) {
            const command = answers[BOT_COMMAND[i]];
            this.answer = command[Bot.getRandom(0, command.length - 1)];
          }
        }
        if (this.answer === null) this.answer = 'Команда некорректна. Пожалуйста, уточните команду.';
      }
    }
    return this.answer;
  }

  getCommand() {
    function cutStr(str, char) {
      return str.replace(new RegExp(`.*?${char}(.*)`), '$1');
    }
    return cutStr(this.value, BOT_COMMAND[0]);
  }

  static getRandom(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
