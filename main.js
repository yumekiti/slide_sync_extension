const host = 'https://slidesync.yumekiti.net';
// function
const setUUID = async () => {
  const res = await axios.get(host + '/uuid');
  chrome.storage.sync.set({ uuid: res.data.uuid });
};

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get('uuid');
  return uuid.uuid;
};

const getButtons = async () => {
  return await axios.get(host + '/buttons');
};

const socket = io.connect(host, {
  transports: ['websocket'],
});
socket.on('connect', () => {
  console.log('socket connected');
});

socket.on('event', (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;
    const title = tabs[0].title;

    if(!url && !title) return;

    // ページ番号がある要素を取得するイベント
    const getElement = (selector) => {
      return chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (selector) => {
          return document.querySelector(selector).textContent;
        },
        args: [selector],
      });
    };

    // どの要素にクリックするかのイベント
    const clickElement = (selector) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (selector) => {
          document.querySelector(selector).click();
        },
        args: [selector],
      });
    };

    const buttons = await getButtons();

    buttons.data.map((button) => {
      if (url.match(button.url)) {
        const event = value.event;
        const uuid = value.uuid;
        if (event === 'next') {
          clickElement(button.next);
        }
        if (event === 'prev') {
          clickElement(button.prev);
        }
        getElement(button.page).then((res) => {
          data = {
            uuid: uuid,
            page: res[0].result,
            url: url,
          };
          socket.emit('page', data);
        });
      }
    });
  });
});

const createButtonElement = document.getElementById('createButton');
const updateButtonElement = document.getElementById('updateButton');
const textElement = document.getElementById('text');

const start = async () => {
  await setUUID();
  const uuid = await getUUID();
  const link = host + '/room/' + uuid;

  const qrcodeElement = document.getElementById('qrcode');
  qrcodeElement.innerHTML = '';
  new QRCode(qrcodeElement, {
    text: link,
    width: 128 * 2,
    height: 128 * 2,
    colorDark: '#ffffff',
    colorLight: '#333333',
    correctLevel: QRCode.CorrectLevel.H,
  });

  const shareWrapElement = document.getElementById('shareWrap');
  shareWrapElement.classList.remove('hidden');

  // add input
  const urlElement = document.getElementById('urlInputTag');
  urlElement.value = link;

  const copyButtonElement = document.getElementById('copyButton');
  copyButtonElement.addEventListener('click', () => {
    urlElement.select();
    urlElement.setSelectionRange(0, 99999);
    document.execCommand('copy');
  });

  createButtonElement.textContent = 'Room Re:Create';

  await socket.emit('join', uuid);
};

createButtonElement.addEventListener('click', async () => await start());
updateButtonElement.addEventListener('click', async () => {
  const uuid = await getUUID();
  const data = {
    uuid: uuid,
    text: textElement.value,
  };
  await socket.emit('note', data);
});

setTimeout(async () => await start(), 100);
