const WORDLE_ENDPOINT = "https://www.nytimes.com/svc/wordle/v2";

(function () {
  var XHR = XMLHttpRequest.prototype;

  var open = XHR.open;
  var send = XHR.send;

  XHR.open = function (_method, url) {
    this._url = url;

    return open.apply(this, arguments);
  };

  XHR.send = function () {
    this.addEventListener("load", function () {
      const url = this._url ? this._url.toLowerCase() : this._url;

      if (!url) return;
      if (!url.startsWith(WORDLE_ENDPOINT)) return;

      try {
        window.postMessage({
          type: "SET_WORDLE_TIMER_DATA",
          ...JSON.parse(this.responseText),
        });
      } catch (err) {
        console.log("Error in responseType try catch");
        console.log(err);
      }
    });

    return send.apply(this, arguments);
  };
})(XMLHttpRequest);
