const host = 'https://remote.yumekiti.net';

// function
const setUUID = async () => {
  const res = await axios.get(host + '/uuid');
  chrome.storage.sync.set({ uuid: res.data.uuid });
};

const getUUID = async () => {
  const uuid = await chrome.storage.sync.get('uuid');
  return uuid.uuid;
};

const socket = io.connect(host);
socket.on('connect', () => {
  console.log('socket connected');
});

socket.on('event', (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const title = tabs[0].title;

    if(!url && !title) return;

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

    if(url.match(/figma/i)){
      if (value === 'next') {
        clickElement(
          '#react-page > div > div > div > div > div > div > div > div > div > div > button:nth-child(3)'
        );
      }
      if (value === 'prev') {
        clickElement(
          '#react-page > div > div > div > div > div > div > div > div > div > div > button:nth-child(1)'
        );
      }
    }

    if(url.match(/onedrive/i)){
      if (value === 'next') {
        clickElement(
          '#nextButton'
        );
      }
      if (value === 'prev') {
        clickElement(
          '#prevButton'
        );
      }
    }

    if(url.match(/canva/i)){
      if (value === 'next') {
        clickElement(
          'body > div:nth-child(2) > div > div > div > div > div > div > main > div > div._10frKg > div > div > div > div > div:nth-child(1) > div:nth-child(3) > button'
        );
      }
      if (value === 'prev') {
        clickElement(
          'body > div:nth-child(2) > div > div > div > div > div > div > main > div > div > div > div > div > div > div:nth-child(1) > div:nth-child(1) > button'
        );
      }
    }

    if(url.match(/hackmd/i)){
      if (value === 'next') {
        clickElement(
          'body > div > div > aside > button.navigate-right'
        );
      }
      if (value === 'prev') {
        clickElement(
          'body > div > div > aside > button.navigate-left'
        );
      }
    }

    if(url.match(/github/i)){
      if (value === 'next') {
        clickElement(
          '#p > div > button:nth-child(3)'
        );
      }
      if (value === 'prev') {
        clickElement(
          '#p > div > button:nth-child(1)'
        );
      }
    }

    if(url.match(/pitch/i)){
      if (value === 'next') {
        clickElement(
          '#app > div > div > div > div > div:nth-child(1) > div > button:nth-child(3)'
        );
      }
      if (value === 'prev') {
        clickElement(
          '#app > div > div > div > div > div:nth-child(1) > div > button:nth-child(1)'
        );
      }
    }

    if(url.match(/slideshare/i)){
      if (value === 'next') {
        clickElement(
          '#overlay-next-slide'
        );
      }
      if (value === 'prev') {
        clickElement(
          '#overlay-previous-slide'
        )
      }
    }

  });
});

const createButtonElement = document.getElementById('createButton');

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
