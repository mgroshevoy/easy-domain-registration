'use strict';

// Saves options to chrome.storage
function save_options() {
  let apiKey = document.getElementById('apikey').value;
  let sandBox = document.getElementById('sandbox').checked;
  chrome.storage.sync.set({
    apiKey: apiKey,
    sandBox: sandBox,
  }, function() {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.extension.getURL('images/icon-38.png'),
      title: 'Easy Domain Registration',
      message: 'Your options saved.'
    });
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    apiKey: 'a4bc2b1cb23bce56eddd44',
    sandBox: true,
  }, function(items) {
    document.getElementById('apikey').value = items.apiKey;
    document.getElementById('sandbox').checked = items.sandBox;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);
