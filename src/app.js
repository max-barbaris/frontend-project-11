import { string, setLocale } from 'yup';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import axios from 'axios';
import render from './view.js';
import parse from './parser.js';
import ru from './locales/ru.js';

const updateState = (state, field, data) => {
  state[field] = {
    ...state[field],
    ...data,
  };
};

const validateUrl = (url, feeds) => {
  const feedUrls = feeds.map((feed) => feed.url);
  const schema = string().url().required();

  return schema
    .notOneOf(feedUrls)
    .validate(url)
    .then(() => null)
    .catch((error) => error.message);
};

const createProxyUrl = (originURL) => {
  const proxyURL = new URL('/get', 'https://allorigins.hexlet.app');
  proxyURL.searchParams.set('url', originURL);
  proxyURL.searchParams.set('disableCache', 'true');

  return proxyURL.toString();
};

const fetchRssFeed = (watchedState, url) => {
  updateState(watchedState, 'loadingProcess', {
    status: 'processing', // После клика, статус состояние в процессе
    error: null,
  });

  return axios
    .get(createProxyUrl(url), { timeout: 10000 }) // Timeout Время до истечения запроса в мс
    .then((response) => {
      const { title, description, items } = parse(response.data.contents); // Распарсенные данные
      const feed = { // Структура фида
        id: uniqueId(), // Присваеваем уникальный ID
        url,
        title,
        description,
      };
      // Постам присвается ID фида и свой ID (Нормализация данных)
      const posts = items.map((item) => ({ ...item, id: uniqueId(), channelId: feed.id }));

      updateState(watchedState, 'loadingProcess', {
        status: 'success', // Статус завершено
        error: null,
      });
      watchedState.feeds.unshift(feed);
      watchedState.posts.unshift(...posts); // Без spread вставится массив
    })
    .catch((error) => {
      updateState(watchedState, 'loadingProcess', {
        status: 'failed',
        error,
      });
    });
};

export default () => {
  const initialState = { // Начальное состояние
    form: {
      valid: false,
      error: null,
    },
    loadingProcess: {
      status: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
  };

  const elements = { // Элементы
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
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

        validateUrl(url, watchedState.feeds)
          .then((error) => {
            if (!error) {
              updateState(watchedState, 'form', { valid: true, error: null });
              fetchRssFeed(watchedState, url);
            } else {
              updateState(watchedState, 'form', { valid: false, error: error.key });
            }
          });
      });
    });
};
