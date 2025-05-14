export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml'); // Приобразование строки xml в DOM дерево
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    const error = new Error(parseError.textContent); // Создаём объект Error
    error.isParsingError = true; // Добавляем свойство для идентификации ошибки
    error.data = data; // Изначальные данные для отладки
    throw error; // Выбрасываем ошибку
  }

  const channelTitle = doc.querySelector('channel > title').textContent;
  const channelDescription = doc.querySelector('channel > description').textContent;
  const channelItems = doc.querySelectorAll('item');
  const items = Array.from(channelItems).map((item) => { // Array.from, так как NodeList
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;

    return { title, link, description };
  });

  return { title: channelTitle, description: channelDescription, items };
};
