import onChange from 'on-change';

const render = (elements, state, i18nextInstance) => {
  const renderForm = ({ form }) => {
    const { valid, error } = form;
    const { input, feedback } = elements;

    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');

    if (valid) {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
    else {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t(`errors.${error}`);
    }
  };

  const renderFeeds = ({ feeds }) => {
    const { feedsContainer } = elements;

    const feedFragment = document.createElement('div');
    feedFragment.classList.add('card', 'border-0');

    const feedCard = document.createElement('div');
    feedCard.classList.add('card-body');

    const feedTitle = document.createElement('h2');
    feedTitle.classList.add('card-title', 'h4');
    feedTitle.textContent = i18nextInstance.t('feeds');

    const feedList = document.createElement('ul');
    feedList.classList.add('list-group', 'border-0', 'rounded-0');

    const feedItem = feeds.map((feed) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'border-0', 'border-end-0');

      const itemTitle = document.createElement('h3');
      itemTitle.classList.add('h6', 'm-0');
      itemTitle.textContent = feed.title;

      const itemDescription = document.createElement('p');
      itemDescription.classList.add('m-0', 'small', 'text-black-50');
      itemDescription.textContent = feed.description;

      item.append(itemTitle);
      item.append(itemDescription);

      return item;
    });

    feedList.append(...feedItem);
    feedCard.append(feedTitle);
    feedFragment.append(feedCard);
    feedFragment.appendChild(feedList);
    feedsContainer.innerHTML = '';
    feedsContainer.appendChild(feedFragment);
  };

  const renderPosts = ({ posts, viewedPosts }) => {
    const { postsContainer } = elements;

    const postsFragment = document.createElement('div');
    postsFragment.classList.add('card', 'border-0');

    const postsCard = document.createElement('div');
    postsCard.classList.add('card-body');

    const postsTitle = document.createElement('h2');
    postsTitle.classList.add('card-title', 'h4');
    postsTitle.textContent = i18nextInstance.t('posts');

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    const postsItem = posts.map((post) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const itemLink = document.createElement('a');
      const className = viewedPosts.has(post.id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
      itemLink.classList.add(...className);
      itemLink.dataset.id = post.id;
      itemLink.textContent = post.title;
      itemLink.setAttribute('href', post.link);
      itemLink.setAttribute('rel', 'noopener noreferrer');
      itemLink.setAttribute('target', '_blank');

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', post.id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.textContent = i18nextInstance.t('preview');

      item.appendChild(itemLink);
      item.appendChild(button);

      return item;
    });

    postsList.append(...postsItem);
    postsCard.append(postsTitle);
    postsFragment.append(postsCard);
    postsFragment.appendChild(postsList);
    postsContainer.innerHTML = '';
    postsContainer.appendChild(postsFragment);
  };

  const renderModal = ({ posts, modal }) => {
    const { modalWindow } = elements;
    const post = posts.find(item => item.id === modal.postId);

    const title = modalWindow.querySelector('.modal-title');
    title.textContent = post.title;
    const body = modalWindow.querySelector('.modal-body');
    body.textContent = post.description;
    const readButton = modalWindow.querySelector('.modal-footer > a');
    readButton.textContent = i18nextInstance.t('readFull');
    readButton.href = post.link;
    const closeButton = modalWindow.querySelector('.modal-footer > button');
    closeButton.textContent = i18nextInstance.t('close');
  };

  const renderLoadingProcess = ({ loadingProcess }) => {
    const { submit, input, feedback } = elements;
    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');

    switch (loadingProcess.status) {
      case 'failed':
        submit.disabled = false;
        input.removeAttribute('readonly');
        feedback.classList.add('text-danger');
        feedback.textContent = i18nextInstance.t([`errors.${loadingProcess.error}`, 'errors.unknown']);
        break;
      case 'success':
        submit.disabled = false;
        input.removeAttribute('readonly');
        input.value = '';
        feedback.classList.add('text-success');
        feedback.textContent = i18nextInstance.t('loading.success');
        input.focus();
        break;
      case 'processing':
        submit.disabled = true;
        input.setAttribute('readonly', true);
        feedback.classList.add('text-success');
        feedback.innerHTML = i18nextInstance.t('loading.processing');
        break;
      default:
        throw new Error(`Unknown loadingProcess status: '${loadingProcess.status}'`);
    }
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form':
        renderForm(state);
        break;
      case 'feeds':
        renderFeeds(state);
        break;
      case 'posts':
        renderPosts(state);
        break;
      case 'loadingProcess':
        renderLoadingProcess(state);
        break;
      case 'modal.postId':
        renderModal(state);
        break;
      case 'viewedPosts':
        renderPosts(state);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export default render;
