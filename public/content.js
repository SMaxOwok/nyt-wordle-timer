var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener(
  'message',
  (event) => {
    switch (event.data.type) {
      case 'SET_WORDLE_TIMER_DATA':
        const { id, days_since_launch, print_date } = event.data;

        chrome.storage.sync.get(['wt-id']).then((result) => {
          if (result['wt-id'] === id) return;

          chrome.storage.sync.set({
            'wt-id': id,
            'wt-number': days_since_launch,
            'wt-date': print_date,
            'wt-start': new Date().toLocaleString(),
            'wt-end': null,
          });
        });

        break;
      default:
        break;
    }
  },
  false,
);

const waitForAddedNode = ({ selector, onComplete }) => {
  new MutationObserver(function () {
    const node = document.querySelector(selector);

    if (node) {
      this.disconnect();

      onComplete(node);
    }
  }).observe(document, {
    subtree: true,
    childList: true,
    attributes: false,
  });
};

const getHours = (seconds) =>
  Math.floor(seconds / 60 / 60)
    .toString()
    .padStart(2, '0');
const getMinutes = (seconds) =>
  Math.floor((seconds / 60) % 60)
    .toString()
    .padStart(2, '0');
const getSeconds = (seconds) =>
  Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

const handleFinish = (mutations) => {
  if (!mutations[0].addedNodes.length) return;

  chrome.storage.sync.get(['wt-end']).then((result) => {
    if (!!result['wt-end']) return;

    chrome.storage.sync.set({
      'wt-end': new Date().toLocaleString(),
    });

    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: 'FINISHED',
    });
  });
};

const handleShareButtonVisible = (button) => {
  if (!button) return;

  button.addEventListener('click', () => {
    chrome.storage.sync.get(['wt-start', 'wt-end']).then((result) => {
      const delta =
        Math.abs(
          new Date(result['wt-end']).valueOf() -
            new Date(result['wt-start']).valueOf(),
        ) / 1000;
      const time = `${getHours(delta)}:${getMinutes(delta)}:${getSeconds(
        delta,
      )}`;

      setTimeout(() => {
        navigator.clipboard.readText().then((text) => {
          const adjusted = `${text}\n\nFinished in ${time}`;

          navigator.clipboard.writeText(adjusted);
        });
      }, 500);
    });
  });
};

waitForAddedNode({
  selector: 'div[id*=gameToaster]',
  onComplete: (node) =>
    new MutationObserver(handleFinish).observe(node, {
      childList: true,
      subtree: true,
    }),
});

waitForAddedNode({
  selector: 'svg[data-testid=icon-share]',
  onComplete: (node) => handleShareButtonVisible(node.closest('button')),
});
