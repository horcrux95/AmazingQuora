///////////////////////////////////////////////////////////////////////////////////////////
let focusModecheckbox = document.getElementsByClassName("focusMode");
let unansweredcheckbox = document.getElementsByClassName("unanswered");
let advertisemetscheckbox = document.getElementsByClassName("advertisemets");
let usersuggestionscheckbox = document.getElementsByClassName("usersuggestions");
let topicsuggestionscheckbox = document.getElementsByClassName("topicsuggestions");
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
chrome.storage.sync.get(["focusMode"], function(result) {
  if (result.focusMode) {
    focusModecheckbox[0].checked = result.focusMode;
  }
});

chrome.storage.sync.get(["unanswered"], function(result) {
  if (result.unanswered) {
    unansweredcheckbox[0].checked = result.unanswered;
  }
});

chrome.storage.sync.get(["advertisemets"], function(result) {
  if (result.advertisemets) {
    advertisemetscheckbox[0].checked = result.advertisemets;
  }
});

chrome.storage.sync.get(["usersuggestions"], function(result) {
  if (result.usersuggestions) {
    usersuggestionscheckbox[0].checked = result.usersuggestions;
  }
});

chrome.storage.sync.get(["topicsuggestions"], function(result) {
  if (result.topicsuggestions) {
    topicsuggestionscheckbox[0].checked = result.topicsuggestions;
  }
});



///////////////////////////////////////////////////////////////////////////////////////////

function Sendmessage(key,value) {

  let obj={};
  obj[key]=value;

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      obj,
      function(response) {
      }
    );
  });

}
///////////////////////////////////////////////////////////////////////////////////////////


focusModecheckbox[0].addEventListener("change", function() {
  if (this.checked) {
    focusModecheckbox[0].checked = true;
    chrome.storage.sync.set({ focusMode: true }, function() {
      Sendmessage("focusMode",true);
    });
  } else {
    focusModecheckbox[0].checked = false;

    chrome.storage.sync.set({ focusMode: false }, function() {
      Sendmessage("focusMode",true);
    });
  }
});

unansweredcheckbox[0].addEventListener("change", function() {
  if (this.checked) {
    unansweredcheckbox[0].checked = true;
    chrome.storage.sync.set({ unanswered: true }, function() {
      Sendmessage("unanswered",true);
    });
  } else {
    unansweredcheckbox[0].checked = false;

    chrome.storage.sync.set({ unanswered: false }, function() {
      Sendmessage("unanswered",true);
    });
  }
});

advertisemetscheckbox[0].addEventListener("change", function() {
  if (this.checked) {
    advertisemetscheckbox[0].checked = true;
    chrome.storage.sync.set({ advertisemets: true }, function() {
      Sendmessage("advertisemets",true);
    });
  } else {
    advertisemetscheckbox[0].checked = false;

    chrome.storage.sync.set({ advertisemets: false }, function() {
      Sendmessage("advertisemets",true);
    });
  }
});

usersuggestionscheckbox[0].addEventListener("change", function() {
  if (this.checked) {
    usersuggestionscheckbox[0].checked = true;
    chrome.storage.sync.set({ usersuggestions: true }, function() {
      Sendmessage("usersuggestions",true);
    });
  } else {
    usersuggestionscheckbox[0].checked = false;

    chrome.storage.sync.set({ usersuggestions: false }, function() {
      Sendmessage("usersuggestions",true);
    });
  }
});


topicsuggestionscheckbox[0].addEventListener("change", function() {
  if (this.checked) {
    topicsuggestionscheckbox[0].checked = true;
    chrome.storage.sync.set({ topicsuggestions: true }, function() {
      Sendmessage("topicsuggestions",true);
    });
  } else {
    topicsuggestionscheckbox[0].checked = false;

    chrome.storage.sync.set({ topicsuggestions: false }, function() {
      Sendmessage("topicsuggestions",true);
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////
