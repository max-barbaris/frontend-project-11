import { string } from 'yup';
import onChange from 'on-change';

const shema = string().url().required();

const renderForm = (elements, state) => {
  const { valid, error } = state.form;

  if (valid) {
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
  }

  elements.feedback.textContent = error;
};

const render = (elements, state) => {
  const watchedState = onChange(state, () => renderForm(elements, state));

  return watchedState;
};

export default () => {
  const initialState = { // начальное состояние
    form: {
      valid: false,
      error: null,
    },
    feeds: [],
  };

  const elements = { // элементы
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = render(elements, initialState);

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

    shema
      .notOneOf(watchedState.feeds)
      .validate(url)
      .then(() => {
        updateState({
          valid: true,
          error: null,
        });
        watchedState.feeds.unshift(url);
      })
      .catch((err) => {
        updateState({
          valid: false,
          error: err.message,
        });
      });
  });
};
