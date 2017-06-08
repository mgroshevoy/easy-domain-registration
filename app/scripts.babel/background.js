'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

//chrome.browserAction.setBadgeText({text: '\'Allo'});

chrome.contextMenus.create({
  title: 'Register Domain: %s',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function (event) {
  console.log(event);
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, event, function (response) {
      console.log(response);
    });
  });
});

/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  switch (request.action) {
    case 'xhttp':
      let xhttp = new XMLHttpRequest();
      let method = request.method ? request.method.toUpperCase() : 'GET';

      xhttp.onload = function () {
        callback(xhttp.responseText);
      };
      xhttp.onerror = function () {
        // Do whatever you want on error. Don't forget to invoke the
        // callback to clean up the communication port.
        callback();
      };
      xhttp.open(method, request.url, true);
      if (method === 'POST') {
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
      xhttp.send(request.data);
      return true; // prevents the callback from being called too early on return
      break;
    case 'notify':
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.extension.getURL('images/icon-38.png'),
        title: 'Easy Domain Registration',
        message: request.message,
      });
      return true;
      break;
  }
});