'use strict';

let apiKey;

vex.defaultOptions.className = 'vex-theme-plain';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  let domainName = msg.selectionText.trim();
  chrome.storage.sync.get({
    apiKey: 'a4bc2b1cb23bce56eddd44',
    sandBox: true
  }, function (items) {
    let url = items.sandBox?'http://sandbox.namesilo.com/api/': 'https://www.namesilo.com/api/';
    apiKey = items.apiKey;
    if(apiKey.length) {
      chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: url + 'checkRegisterAvailability?version=1&type=xml&domains=' + domainName + '&key=' + apiKey,
        //  data: 'q=something'
      }, function (responseText) {
        let XMLdoc = $.parseXML(responseText);
        if ($(XMLdoc).find('code').text() !== '300') {
          chrome.runtime.sendMessage({
            action: 'notify',
            message: $(XMLdoc).find('detail').text()
          }, function () {
            /*Callback function to deal with the response*/
          });
        } else {
          if($(XMLdoc).find('invalid').text()) {
            chrome.runtime.sendMessage({
              action: 'notify',
              message: 'Invalid domain name, please enter a correct name for domain!'
            }, function () {
              /*Callback function to deal with the response*/
            });
          }
          let vexInst = vex.dialog.open({
            showCloseButton: false,
            escapeButtonCloses: false,
            overlayClosesOnClick: false,
            input: [
              '<div><label style="position: relative;font-weight: 600;bottom: 20px;">Register Domain Name</label></div>',
              '<label>Name:</label><input type="text" style="font-size: 0.75em;" autofocus name="domainname" value="' + domainName + '" placeholder="Please enter a domain name">',
              '<label>Years:</label><input type="number" style="font-size: 0.75em;" autofocus name="years" value=2>',
              '<input name="autorenew" style="position: relative; top: 2px;" type="checkbox" checked><label style="font-size: 0.75em;">Auto-renew</label>',
            ].join(''),
            buttons: [
              $.extend({}, vex.dialog.buttons.YES, {text: 'Register'}),
              $.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
            ],
            callback: function callback(data) {
              if (!data) {
                console.log('Cancelled')
              } else {
                chrome.runtime.sendMessage({
                  method: 'GET',
                  action: 'xhttp',
                  url: url + 'registerDomain?version=1&type=xml&domain=' + data.domainname + '&key=' + apiKey + '&years=' + data.years + '&private=1&auto_renew=' + (data.autorenew?1:0),
                }, function (responseText) {
                  let XMLdoc = $.parseXML(responseText);
                  if ($(XMLdoc).find('code').text() !== '300') {
                    chrome.runtime.sendMessage({
                      action: 'notify',
                      message: $(XMLdoc).find('detail').text()
                    }, function () {
                      /*Callback function to deal with the response*/
                    });
                  } else {
                    chrome.runtime.sendMessage({
                      action: 'notify',
                      message: $(XMLdoc).find('message').text() + '\n' + 'Order total:' + $(XMLdoc).find('order_amount').text()
                    }, function () {
                      /*Callback function to deal with the response*/
                    });
                  }
                });
                console.log('Domain Name:', data.domainname)
              }
            }
          });
        }
        /*Callback function to deal with the response*/
      });
    } else {
      chrome.runtime.sendMessage({
        action: 'notify',
        message: 'Please, get your API key from NameSilo and set it up in options.'
      }, function () {
        /*Callback function to deal with the response*/
      });
    }
  });
});






