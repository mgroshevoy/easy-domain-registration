'use strict';

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get({
    apiKey: 'a4bc2b1cb23bce56eddd44',
    sandBox: true
  }, function (items) {
    let url = items.sandBox ? 'http://sandbox.namesilo.com/api/' : 'https://www.namesilo.com/api/';
    let apiKey = items.apiKey;
    let xhttp = new XMLHttpRequest();
    let method = 'GET';

    xhttp.onload = function () {
      console.log(xhttp.responseXML);
      console.log($(xhttp.responseXML).find('balance').text());
      $('#accountbalance').text($(xhttp.responseXML).find('balance').text());
    };
    xhttp.onerror = function () {
      // Do whatever you want on error. Don't forget to invoke the
      // callback to clean up the communication port.
    };
    xhttp.open(method, url + 'getAccountBalance?version=1&type=xml&key=' + apiKey, true);
    if (method === 'POST') {
      xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhttp.send();
  });
});


