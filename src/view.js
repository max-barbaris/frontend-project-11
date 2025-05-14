import onChange from 'on-change';

const render = (elements, state, i18nextInstance) => {
  const renderForm = ({ form }) => {
    const { valid, error } = form;
    const { input, feedback } = elements;

    if (valid) {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    } else {
      input.classList.add('is-invalid');
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
    feedTitle.textContent = 'Фиды';

    const feedList = document.createElement('ul');
    feedList.classList.add('list-group', 'border-0', 'rounded-0');

    const feedItem = feeds.map((feed) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'border-0', 'border-end-0');

      const itemTitle = document.createElement('h3');
      itemTitle.classList.add('h6', 'm-0');
      itemTitle.textContent = feed.title;

      const itemDescription = document.createElement('p');
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

  const renderPosts = ({ posts }) => {
    const { postsContainer } = elements;

    const postsFragment = document.createElement('div');
    postsFragment.classList.add('card', 'border-0');

    const postsCard = document.createElement('div');
    postsCard.classList.add('card-body');

    const postsTitle = document.createElement('h2');
    postsTitle.classList.add('card-title', 'h4');
    postsTitle.textContent = 'Посты';

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    const postsItem = posts.map((post) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const itemLink = document.createElement('a');
      itemLink.classList.add('fw-bold');
      itemLink.dataset.id = post.id;
      itemLink.textContent = post.title;
      itemLink.setAttribute('href', post.link);
      itemLink.setAttribute('rel', 'noopener noreferrer');
      itemLink.setAttribute('target', '_blank');

      item.appendChild(itemLink);

      return item;
    });

    postsList.append(...postsItem);
    postsCard.append(postsTitle);
    postsFragment.append(postsCard);
    postsFragment.appendChild(postsList);
    postsContainer.innerHTML = '';
    postsContainer.appendChild(postsFragment);
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
      default:
        break;
    }
  });

  return watchedState;
};

export default render;
