var s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener(
  "message",
  (event) => {
    switch (event.data.type) {
      case "SET_WORDLE_TIMER_DATA":
        const { id, days_since_launch, print_date } = event.data;

        chrome.storage.sync.get(["wt-id"]).then((result) => {
          if (result["wt-id"] === id) return;

          chrome.storage.sync.set({
            "wt-id": id,
            "wt-number": days_since_launch,
            "wt-date": print_date,
          });
        });

        break;
      default:
        break;
    }
  },
  false
);
