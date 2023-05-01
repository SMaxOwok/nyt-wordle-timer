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

const handleFinish = (mutations) => {
  if (!mutations[0].addedNodes.length) return;

  chrome.storage.sync.get(['wt-id']).then((result) => {
    if (!!result['wt-end']) return;

    chrome.storage.sync.set({
      'wt-end': new Date().toLocaleString(),
    });
  });
};

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

const observer = new MutationObserver(handleFinish);

waitForAddedNode({
  selector: 'div[id*=gameToaster]',
  onComplete: (node) =>
    observer.observe(node, { childList: true, subtree: true }),
});
