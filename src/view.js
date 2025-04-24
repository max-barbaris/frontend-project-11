import onChange from 'on-change';

const render = (elements, state, i18nextInstance) => {
  const renderForm = () => {
    const { valid, error } = state.form;
    const { input, feedback } = elements;

    if (valid) {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    } else {
      input.classList.add('is-invalid');
      feedback.textContent = i18nextInstance.t(`errors.${error}`);
    }
  };
  const watchedState = onChange(state, () => renderForm());

  return watchedState;
};

export default render;
