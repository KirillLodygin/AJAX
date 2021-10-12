const app = document.querySelector('.app');
let selectedTask = '',
  likeClicked = false;
let serverResponse = { status: '' };

const templateBlocks = {
  selectTaskSection: {
    block: 'section',
    cls: '',
    content: [
      {
        block: 'form',
        cls: 'tasks-form',
        attrs: { action: '' },
        method: {
          eventName: 'click',
          methodFunc: evt => {
            stopDefAction(evt);
          },
        },
        content: [
          {
            block: 'div',
            cls: 'tasks',
            content: [
              {
                block: 'button',
                cls: 'tasks__btn',
                innerText: 'Вход на сайт',
                method: {
                  eventName: 'click',
                  methodFunc: () => {
                    createFirstTaskBlock();
                  },
                },
              },
              {
                block: 'button',
                cls: 'tasks__btn',
                innerText: 'Приехал в Магадан',
                method: {
                  eventName: 'click',
                  methodFunc: () => {
                    createSecondTaskBlock();
                  },
                },
              },
              {
                block: 'button',
                cls: 'tasks__btn',
                innerText: 'Лайк/дизлайк',
                method: {
                  eventName: 'click',
                  methodFunc: () => {
                    createThirdTaskBlock();
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },

  formTaskBlock: {
    block: 'section',
    cls: '',
    content: [
      {
        block: 'form',
        cls: 'task-form',
        attrs: { action: '' },
        method: {
          eventName: 'click',
          methodFunc: evt => {
            stopDefAction(evt);
          },
        },
        content: [
          {
            block: 'h2',
            cls: '',
          },
          {
            block: 'h3',
            cls: '',
            innerText: 'Вырианты ответа сервера',
          },
          {
            block: 'div',
            cls: 'choice-of-answer',
            method: {
              eventName: 'click',
              methodFunc: evt => {
                simulateServerResponse(evt);
              },
            },
            content: [
              {
                block: 'button',
                cls: ['choice-of-answer__btn', 'ok-btn'],
                attrs: { 'data-diff': 'ok' },
                innerText: 'ok',
              },
              {
                block: 'button',
                cls: ['choice-of-answer__btn', 'error-btn'],
                attrs: { 'data-diff': 'error' },
                innerText: 'error',
              },
            ],
          },
        ],
      },
    ],
  },

  firstTaskBlock: [
    {
      block: 'label',
      cls: '',
      innerText: 'Логин',
      attrs: { for: 'login' },
    },
    {
      block: 'input',
      cls: 'login-input',
      attrs: {
        id: 'login',
        type: 'text',
      },
      method: [
        {
          eventName: 'blur',
          methodFunc: () => {
            if (!document.querySelector('.login-input').value) {
              reportBug('login-input', 'login-sentence');
            }
          },
        },
        {
          eventName: 'input',
          methodFunc: () => {
            removeErrorMessage('login-input', 'login-sentence');
          },
        },
      ],
    },
    {
      block: 'p',
      cls: ['sentence', 'login-sentence'],
    },
    {
      block: 'label',
      cls: '',
      innerText: 'Пароль',
      attrs: { for: 'password' },
    },
    {
      block: 'input',
      cls: 'password-input',
      attrs: {
        id: 'password',
        type: 'password',
      },
      method: [
        {
          eventName: 'blur',
          methodFunc: () => {
            if (!document.querySelector('.password-input').value) {
              reportBug('password-input', 'password-sentence');
            }
          },
        },
        {
          eventName: 'input',
          methodFunc: () => {
            removeErrorMessage('password-input', 'password-sentence');
          },
        },
      ],
    },
    {
      block: 'p',
      cls: ['sentence', 'password-sentence'],
    },
    {
      block: 'div',
      cls: 'btn-wrapper',
      content: [
        {
          block: 'button',
          cls: '',
          innerText: 'Ok',
          method: {
            eventName: 'click',
            methodFunc: evt => {
              sendLoginAndPassword(evt);
            },
          },
        },
      ],
    },
  ],

  secondTaskBlock: [
    {
      block: 'input',
      cls: 'server-response-input',
      attrs: {
        type: 'text',
        name: 'server-response-input',
      },
    },
    {
      block: 'label',
      cls: '',
      innerText: 'Выбирай, куда отправишься!',
      attrs: { for: 'cities' },
    },
    {
      block: 'select',
      cls: ['select-css', 'cities'],
      attrs: {
        id: 'cities',
        name: 'select',
      },
      method: {
        eventName: 'change',
        methodFunc: () => {
          removeWarning();
        },
      },
      content: [
        {
          block: 'option',
          innerText: 'Выберите город',
        },
        {
          block: 'option',
          innerText: 'Москва',
          attrs: { value: 'Москву' },
        },
        {
          block: 'option',
          innerText: 'Магадан',
          attrs: { value: 'Магадан' },
        },
        {
          block: 'option',
          innerText: 'Санкт-Петербург',
          attrs: { value: 'Санкт-Петербург' },
        },
        {
          block: 'option',
          innerText: 'Воронеж',
          attrs: { value: 'Воронеж' },
        },
        {
          block: 'option',
          innerText: 'Ярославль',
          attrs: { value: 'Ярославль' },
        },
        {
          block: 'option',
          innerText: 'Тула',
          attrs: { value: 'Тулу' },
        },
        {
          block: 'option',
          innerText: 'Мурманск',
          attrs: { value: 'Мурманск' },
        },
      ],
    },
    {
      block: 'p',
      cls: ['sentence', 'select-sentence'],
    },
    {
      block: 'div',
      cls: 'btn-wrapper',
      content: [
        {
          block: 'button',
          cls: '',
          innerText: 'Ok',
          method: {
            eventName: 'click',
            methodFunc: e => {
              sendCity(e);
            },
          },
        },
      ],
    },
  ],

  citySection: {
    block: 'section',
    cls: '',
    content: [
      {
        block: 'div',
        cls: ['city-div', 'task-form'],
        content: [
          {
            block: 'h2',
            cls: 'city-h2',
          },
          {
            block: 'div',
            cls: 'btn-wrapper',
            content: [
              {
                block: 'button',
                cls: 'return-button',
                innerText: 'Назад',
                method: {
                  eventName: 'click',
                  methodFunc: () => {
                    comeBack();
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },

  thirdTaskBlock: [
    {
      block: 'p',
      cls: 'like-sentence',
    },
    {
      block: 'div',
      cls: 'like-button-wrapper',
      content: [
        {
          block: 'button',
          cls: 'like-button',
          content: [
            {
              block: 'i',
              cls: ['far', 'fa-thumbs-up'],
            },
          ],
          method: {
            eventName: 'click',
            methodFunc: () => {
              onLikeClick();
            },
          },
        },
      ],
    },
  ],
};

const templateEngine = block => {
  if (!block) {
    return document.createTextNode('');
  }

  if (
    typeof block === 'string' ||
    typeof block === 'number' ||
    block === true
  ) {
    return document.createTextNode(String(block));
  }

  if (Array.isArray(block)) {
    const fragment = document.createDocumentFragment();

    block.forEach(contentItem => {
      const el = templateEngine(contentItem);

      fragment.appendChild(el);
    });

    return fragment;
  }

  const element = document.createElement(block.block);

  []
    .concat(block.cls)
    .filter(Boolean)
    .forEach(className => element.classList.add(className));

  if (block.attrs) {
    Object.keys(block.attrs).forEach(key => {
      element.setAttribute(key, block.attrs[key]);
    });
  }

  if (block.innerText) element.innerText = block.innerText;

  if (block.method) {
    if (Array.isArray(block.method)) {
      block.method.forEach(item =>
        element.addEventListener(item.eventName, item.methodFunc),
      );
    }

    element.addEventListener(block.method.eventName, block.method.methodFunc);
  }

  element.appendChild(templateEngine(block.content));

  return element;
};

function startTasksDemonstration() {
  app.appendChild(templateEngine(templateBlocks.selectTaskSection));

  if (window.location.search.substring(1)) {
    const taskButtons = document.querySelector('.tasks').children;
    for (let button of taskButtons) {
      button.classList.add('display-none');
    }

    let params = decodeURI(window.location.search.substring(1)).split('&');
    createCitySection(params[0].split('=')[1], params[1].split('=')[1]);
  }
}

function stopDefAction(evt) {
  evt.preventDefault();
}

function clearTaskField() {
  let appSections = app.children;
  if (appSections.length > 1) app.removeChild(app.lastChild);
  serverResponse.status = '';
}

function createFirstTaskBlock() {
  if (selectedTask !== 'First Task') {
    selectedTask = 'First Task';
    clearTaskField();
    app.appendChild(templateEngine(templateBlocks.formTaskBlock));
    document.querySelector('h2').textContent = 'Вход на сайт';
    document
      .querySelector('.task-form')
      .appendChild(templateEngine(templateBlocks.firstTaskBlock));
  }
}

function simulateServerResponse(evt) {
  if (evt.target.getAttribute('data-diff') === 'ok') {
    document.querySelector('.ok-btn').classList.toggle('attention');
    document.querySelector('.error-btn').classList.remove('attention');
    if (serverResponse.status === 'ok') {
      serverResponse.status = '';
      return;
    }
    serverResponse.status = 'ok';
  }

  if (evt.target.getAttribute('data-diff') === 'error') {
    document.querySelector('.error-btn').classList.toggle('attention');
    document.querySelector('.ok-btn').classList.remove('attention');
    if (serverResponse.status === 'error') {
      serverResponse.status = '';
      return;
    }
    serverResponse.status = 'error';
  }
  if (document.querySelectorAll('.server-response-input').length > 0) {
    document.querySelector('.server-response-input').value =
      serverResponse.status;
  }
}

function reportBug(querySelector1, querySelector2, message) {
  document.querySelector(`.${querySelector1}`).classList.add('attention');
  document.querySelector(`.${querySelector2}`).textContent = message;
  document.querySelector(`.${querySelector2}`).classList.add('opacity');
}

function removeErrorMessage(querySelector1, querySelector2) {
  document.querySelector(`.${querySelector1}`).classList.remove('attention');
  document.querySelector(`.${querySelector2}`).textContent = '';
  document.querySelector(`.${querySelector2}`).classList.remove('opacity');
}

function createToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'left',
    stopOnFocus: true,
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    offset: {
      x: 550,
      y: 320,
    },
  }).showToast();
}

async function sendRequestToSite() {
  let response = await new Promise(function (resolve) {
    setTimeout(() => resolve(serverResponse), 1000);
  });

  if (response.status === 'error') {
    reportBug('password-input', 'password-sentence', 'Пароль указан неверно!');
    return;
  }

  if (response.status === 'ok') {
    createToast('Вход на сайт осуществлен!');
    return;
  }

  createToast('Возникли проблемы с сервером!');
}

function sendLoginAndPassword(evt) {
  if (
    !document.querySelector('.login-input').value ||
    !document.querySelector('.password-input').value
  ) {
    if (!document.querySelector('.login-input').value) {
      reportBug(
        'login-input',
        'login-sentence',
        'Поле обязательно для заполнения!',
      );
    }

    if (!document.querySelector('.password-input').value) {
      reportBug(
        'password-input',
        'password-sentence',
        'Поле обязательно для заполнения!',
      );
    }

    return;
  }

  evt.target.disabled = true;
  evt.target.classList.toggle('attention');

  sendRequestToSite().then(() => {
    evt.target.disabled = false;
    evt.target.classList.toggle('attention');
  });
}

function createSecondTaskBlock() {
  if (selectedTask !== 'Second Task') {
    selectedTask = 'Second Task';
    clearTaskField();
    app.appendChild(templateEngine(templateBlocks.formTaskBlock));
    document.querySelector('h2').textContent = 'Приехал в Магадан';
    document
      .querySelector('.task-form')
      .appendChild(templateEngine(templateBlocks.secondTaskBlock));
    document.querySelector('.task-form').method = 'get';
    document.querySelector('.server-response-input').value = '';
  }
}

function removeWarning() {
  if (document.querySelector('.cities').value !== 'Выберите город') {
    removeErrorMessage('cities', 'select-sentence');
  }
}

function sendCity(evt) {
  const citiesSelect = document.querySelector('.cities');

  if (citiesSelect.value === 'Выберите город') {
    reportBug('cities', 'select-sentence', 'Надо выбрать город!');
    return;
  }

  citiesSelect.classList.remove('attention');
  evt.target.parentNode.parentNode.submit();
}

async function findOutResultOfTrip(serverResponse, city) {
  let response = await new Promise(function (resolve) {
    setTimeout(() => resolve(serverResponse), 1000);
  });

  if (response === 'error') {
    document.querySelector('.city-h2').textContent = 'Поездка невозможна!';
    document.querySelector('.city-h2').classList.add('opacity');
    return;
  }

  if (response === 'ok') {
    document.querySelector('.city-h2').textContent = `Еду в ${city}!`;
    document.querySelector('.city-h2').classList.add('opacity');
    return;
  }

  createToast('Возникли проблемы с сервером!');
}

function createCitySection(serverResponse, city) {
  app.appendChild(templateEngine(templateBlocks.citySection));
  document.querySelector('.return-button').classList.add('display-none');
  findOutResultOfTrip(serverResponse, city).then(() =>
    document.querySelector('.return-button').classList.remove('display-none'),
  );
}

function comeBack() {
  document.location.href = 'http://localhost:8080/';
}

function createThirdTaskBlock() {
  if (selectedTask !== 'Third Task') {
    selectedTask = 'Third Task';
    clearTaskField();
    app.appendChild(templateEngine(templateBlocks.formTaskBlock));

    document.querySelector('h2').textContent = 'Оптимистичный лайк/дизлайк';

    document.querySelector('h3').classList.add('display-none');
    document.querySelector('.choice-of-answer').classList.add('display-none');

    document
      .querySelector('.task-form')
      .appendChild(templateEngine(templateBlocks.thirdTaskBlock));

    if (localStorage.getItem('like')) {
      document.querySelector('.like-button').disabled = true;
      likeClicked = true;

      let promise = new Promise(resolve => {
        setTimeout(
          () =>
            resolve(
              'Ранее лайк не удалось отправить на сайт, и он был сохранен в localStorage.',
            ),
          750,
        );
      });

      promise.then(result => {
        document.querySelector('.like-sentence').textContent = result;
        document.querySelector('.like-sentence').classList.add('opacity');
        document.querySelector('.like-button').classList.toggle('like-clicked');

        let promise = new Promise(resolve => {
          setTimeout(
            () => resolve('Имитируем попытку отправить лайк на сайт.'),
            1200,
          );
        });

        promise.then(result => {
          document.querySelector('.like-sentence').classList.remove('opacity');
          setTimeout(() => {
            document.querySelector('.like-sentence').textContent = result;
            document.querySelector('.like-sentence').classList.add('opacity');

            let promise = new Promise(resolve => {
              setTimeout(() => resolve('Лайк успешно передан.'), 1000);
            });
            promise.then(result => {
              document
                .querySelector('.like-sentence')
                .classList.remove('opacity');
              localStorage.removeItem('like');
              setTimeout(() => {
                document.querySelector('.like-sentence').textContent = result;
                document
                  .querySelector('.like-sentence')
                  .classList.add('opacity');
                document.querySelector('.like-button').disabled = false;
              }, 800);
            });
          }, 800);
        });
      });
    }
  }
}

async function simulateLikeResponse(serverResponse) {
  document.querySelector('.like-button').disabled = true;
  document.querySelector('.like-sentence').classList.remove('opacity');

  let response = await new Promise(function (resolve) {
    setTimeout(() => resolve(serverResponse), 1300);
  });

  if (!response) {
    document.querySelector('.like-sentence').textContent = 'Лайк снят!';
    document.querySelector('.like-button').disabled = false;

    if (localStorage.getItem('like')) localStorage.removeItem('like');

    return;
  }

  document.querySelector('.like-sentence').textContent =
    'Не удалось передать лайк. Он записан в localStorage.';
  localStorage.setItem('like', true);
  document.querySelector('.like-button').disabled = false;
}

function onLikeClick() {
  document.querySelector('.like-button').classList.toggle('like-clicked');
  likeClicked = !likeClicked;

  simulateLikeResponse(likeClicked).then(() =>
    document.querySelector('.like-sentence').classList.add('opacity'),
  );
}

document.addEventListener('DOMContentLoaded', startTasksDemonstration);
