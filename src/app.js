import { string, setLocale } from 'yup';
import i18next from 'i18next';
import render from './view.js';
import ru from './locales/ru.js';

const schema = string().url().required();

export default () => {
  const initialState = { // Начальное состояние
    form: {
      valid: false,
      error: null,
    },
    feeds: [],
  };

  const elements = { // Элементы
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const defaultLanguage = 'ru';
  const i18nextInstance = i18next.createInstance(); // Создаёт новый независимый экземпляр
  i18nextInstance
    .init({
      lng: defaultLanguage,
      debug: false, // Отключает вывод отладочных сообщений
      resources: { ru }, // Загружает словари переводов
    })
    .then(() => {
      setLocale({
        string: {
          url: () => ({ key: 'notUrl' }),
        },
        mixed: { // Ключи перевода для сообщений без значения
          notOneOf: () => ({ key: 'exists' }),
        },
      });

      const watchedState = render(elements, initialState, i18nextInstance);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const url = data.get('url');

        const updateState = (form) => {
          watchedState.form = {
            ...watchedState.form,
            ...form,
          };
        };

        schema
          .notOneOf(watchedState.feeds)
          .validate(url)
          .then(() => {
            updateState({
              valid: true,
              error: null,
            });
            watchedState.feeds.unshift(url);
          })
          .catch((error) => {
            updateState({
              valid: false,
              error: error.message?.key || 'notUrl',
            });
          });
      });
    });
};
