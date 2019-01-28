"use strict";

chrome.runtime.onInstalled.addListener(function() {

  console.log("background js is running");
  
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.quora.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });

  chrome.storage.sync.get(["focusMode"], function(result) {
    if (!result.focusMode) {  
      chrome.storage.sync.set({ focusMode: false }, function() {
          console.log("Default value is set to " + false + " in  BJS");
        });
    }
  });

  chrome.storage.sync.get(["unanswered"], function(result) {
    if (!result.unanswered) {  
      chrome.storage.sync.set({ unanswered: true }, function() {
          console.log("Default value is set to " + true + " in  BJS");
        });
    }
  });

  chrome.storage.sync.get(["advertisemets"], function(result) {
    if (!result.advertisemets) {  
      chrome.storage.sync.set({ advertisemets: true }, function() {
          console.log("Default value is set to " + true + " in  BJS");
        });
    }
  });

  chrome.storage.sync.get(["usersuggestions"], function(result) {
    if (!result.usersuggestions) {  
      chrome.storage.sync.set({ usersuggestions: false }, function() {
          console.log("Default value is set to " + false + " in  BJS");
        });
    }
  });

  chrome.storage.sync.get(["topicsuggestions"], function(result) {
    if (!result.topicsuggestions) {  
      chrome.storage.sync.set({ topicsuggestions: false }, function() {
          console.log("Default value is set to " + false + " in  BJS");
        });
    }
  });
});
