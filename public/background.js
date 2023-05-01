const URL_MATCHER = /https?:\/\/w{0,3}\.?nytimes\.com\/games\/wordle\/.*/;

const handleIconChange = (url, tabId) => {
  if (url === undefined) {
    chrome.action.setIcon({
      path: 'wt-gray.png',
      tabId: tabId,
    });
  } else if (url.match(URL_MATCHER) === null) {
    chrome.action.setIcon({
      path: 'wt-gray.png',
      tabId: tabId,
    });
  } else {
    chrome.storage.sync.get(['wt-end']).then((result) => {
      if (!!result['wt-end']) {
        chrome.action.setIcon({
          path: 'wt-green.png',
          tabId: tabId,
        });
      } else {
        chrome.action.setIcon({
          path: 'wt-yellow.png',
          tabId: tabId,
        });
      }
    });
  }
};

chrome.tabs.onActivated.addListener((info) => {
  chrome.tabs.get(info.tabId, (change) =>
    handleIconChange(change.url, info.tabId),
  );
});

chrome.tabs.onUpdated.addListener((tabId, _change, tab) =>
  handleIconChange(tab.url, tabId),
);

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  switch (request.type) {
    case 'FINISHED':
      chrome.tabs
        .query({ active: true, lastFocusedWindow: true })
        .then(([tab]) => {
          if (!tab) return;

          chrome.action.setIcon({
            path: 'wt-green.png',
            tabId: tab.id,
          });
        });

      break;
    default:
      break;
  }
});
