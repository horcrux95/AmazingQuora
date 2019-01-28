//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.isNumber = function() {
  return /^\d+$/.test(this);
};
///////////////////////////////////////////////////////////////
let QuoraController = new Array();
let ClassController = [
  "QuestionStoryBundle",
  "AnswerStoryBundle",
  "ExploreAnswerBundle",
  "AskQuestionPromptBundle",
  "SuggestedUsersBundle",
  "SuggestedTopicsBundle"
];

questionBundler = false;
userSugBunndler = false;
topicSugBunndler = false;
advertisemetsBundler = false;

genricSetter("unanswered", "QuestionStoryBundle", "questionBundler");
genricSetter("usersuggestions", "SuggestedUsersBundle", "userSugBunndler");
genricSetter("topicsuggestions", "SuggestedTopicsBundle", "topicSugBunndler");
chrome.storage.sync.get(["advertisemets"], function(result) {
  advertisemetsBundler = result["advertisemets"];
});
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
let answerSet = new Set();
let answerMap = new Set();
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
setInterval(function() {
  AmazingQuora();
}, 500);
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
let headerEventListener = false;
let columnEventListener = false;
///////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let SiteHeaderElementRef = document.getElementsByClassName(
  "SiteHeader LoggedInSiteHeader new_header"
);
let customSiteHeaderElementRef;

if (SiteHeaderElementRef[0]) {
  SiteHeaderElementRef[0].setAttribute("id", "siteHeaderBlurId");
  customSiteHeaderElementRef = document.getElementById("siteHeaderBlurId");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let columnLayoutElementRef = document.getElementsByClassName(
  "layout_3col_left"
);
let customcolumnLayoutElementRef;
if (columnLayoutElementRef[0]) {
  columnLayoutElementRef[0].setAttribute("id", "columnBlurId");
  customcolumnLayoutElementRef = document.getElementById("columnBlurId");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function customSiteHeaderClear() {
  customSiteHeaderElementRef.style.filter = "blur(0px)";
}

function customSiteHeaderBlur() {
  customSiteHeaderElementRef.style.filter = "blur(40px)";
}

function customcolumnClear() {
  customcolumnLayoutElementRef.style.filter = "blur(0px)";
}

function customcolumnBlur() {
  customcolumnLayoutElementRef.style.filter = "blur(40px)";
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ControlFocus() {
  chrome.storage.sync.get(["focusMode"], function(result) {
    if (customSiteHeaderElementRef && customcolumnLayoutElementRef) {
      if (result.focusMode == true) {
        customSiteHeaderElementRef.style.filter = "blur(40px)";
        customcolumnLayoutElementRef.style.filter = "blur(40px)";

        headerEventListener = true;
        columnEventListener = true;

        customSiteHeaderElementRef.addEventListener(
          "mouseover",
          customSiteHeaderClear
        );
        customSiteHeaderElementRef.addEventListener(
          "mouseout",
          customSiteHeaderBlur
        );
        customcolumnLayoutElementRef.addEventListener(
          "mouseover",
          customcolumnClear
        );
        customcolumnLayoutElementRef.addEventListener(
          "mouseout",
          customcolumnBlur
        );
      } else if (result.focusMode == false) {
        customSiteHeaderElementRef.style.filter = "blur(0px)";
        customcolumnLayoutElementRef.style.filter = "blur(0px)";

        if (headerEventListener == true) {
          headerEventListener = false;

          customSiteHeaderElementRef.removeEventListener(
            "mouseover",
            customSiteHeaderClear
          );
          customSiteHeaderElementRef.removeEventListener(
            "mouseout",
            customSiteHeaderBlur
          );
        }

        if (columnEventListener == true) {
          columnEventListener = false;

          customcolumnLayoutElementRef.removeEventListener(
            "mouseover",
            customcolumnClear
          );
          customcolumnLayoutElementRef.removeEventListener(
            "mouseout",
            customcolumnBlur
          );
        }
      }
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ControlFocus();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fetchUpvotes() {
  let answer = document.getElementsByClassName("ui_qtext_more_link");

  for (let i = 0; i < answer.length; i++) {
    let url = "https://www.quora.com" + answer[i].getAttribute("href");

    if (!answerSet.has(url)) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.send();

      xhr.onreadystatechange = function() {
        //   console.log(xhr.status);
        //   console.log(xhr.readyState);
        if (
          (xhr.readyState === 4 || xhr.readyState === 3|| xhr.readyState === 2|| xhr.readyState === 1) &&
          xhr.status === 200
        ) {
          let parser = new DOMParser();
          let cdoc = parser.parseFromString(xhr.responseText, "text/html");

          setTimeout(function() {
            let el = cdoc.getElementsByClassName("ui_button_count");
            let numcheck = false;
            if (el[0]) {
              if (el[0].children[1]) {
                numcheck = el[0].children[1].innerText.isNumber();

                answerSet.add(url);

                let para = document.createElement("p");
                let node;

                if (numcheck) {
                  let str = el[0].children[1].innerText;
                  str = str.slice(0, str.length / 2) + " Upvote";
                  node = document.createTextNode(str);
                } else {
                  node = document.createTextNode(
                    el[0].children[1].innerText + " Upvote"
                  );
                }

                para.setAttribute("id", "likeDislikeRatio");
                para.style.color = "#666";
                para.style.border = " 1px solid lightgrey";
                para.style.width = "fit-content";
                para.style.borderRadius = "20px";
                para.style.padding = "10px";
                para.style.paddingTop = "2px";
                para.style.paddingBottom = "2px";
                para.style.backgroundColor = "#f8f8f8";

                para.appendChild(node);

                if (answer[i].children[1]) {
                  answer[i].children[1].remove();
                }
                answer[i].appendChild(para);
              }
            }
          }, 2000);
        } else {
          console.log("Error", xhr.statusText);
        }
      };
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function searchAndRemove(search_term) {
  var index = QuoraController.indexOf(search_term); // <-- Not supported in <IE9

  if (index !== -1) {
    QuoraController.splice(index, 1);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function genricSetter(key, label, variableName) {
  chrome.storage.sync.get([key], function(result) {
    window[variableName] = result[key];

    if (result[key] == true) {
      QuoraController.push(label);
    } else if (result[key] == false) {
      searchAndRemove(label);
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkAdvertisement(className) {
  let flag = true;
  let i = 0;

  for (i = 0; i < ClassController.length; i++) {
    if (className.indexOf(ClassController[i]) != -1) {
      flag = false;
    }
  }

  if (i == ClassController.length && flag == true) {
    return true;
  } else {
    return false;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.focusMode) {
    ControlFocus();
  }

  if (request.unanswered) {
    genricSetter("unanswered", "QuestionStoryBundle", "questionBundler");
  }

  if (request.advertisemets) {
    chrome.storage.sync.get(["advertisemets"], function(result) {
      advertisemetsBundler = result["advertisemets"];
    });
  }

  if (request.usersuggestions) {
    genricSetter("usersuggestions", "SuggestedUsersBundle", "userSugBunndler");
  }

  if (request.topicsuggestions) {
    genricSetter(
      "topicsuggestions",
      "SuggestedTopicsBundle",
      "topicSugBunndler"
    );
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function genralizedFilter() {
  let answerFilter = document.getElementsByClassName("paged_list_wrapper");
  for (let i = 0; i < answerFilter[0].children.length; i++) {
    let el = answerFilter[0].children[i];

    if (el.children[0]) {
      let className = el.children[0].getAttribute("class");

      if (className) {
        if (
          (className.indexOf("QuestionStoryBundle") != -1 &&
            !questionBundler) ||
          className.indexOf("AnswerStoryBundle") != -1 || //ignore
          className.indexOf("ExploreAnswerBundle") != -1 || //ignore
          className.indexOf("AskQuestionPromptBundle") != -1 || //ignore
          (className.indexOf("SuggestedUsersBundle") != -1 &&
            !userSugBunndler) ||
          (className.indexOf("SuggestedTopicsBundle") != -1 &&
            !topicSugBunndler) ||
          (checkAdvertisement(className) && !advertisemetsBundler)
        ) {
          continue;
        } else {
          el.remove();
        }
      }
    }
  }

  let feed_expand = document.getElementsByClassName("feed_expand");

  for (let i = 0; i < feed_expand.length; i++) {
    let el = feed_expand[i];
    el.remove();
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function AmazingQuora() {
  genralizedFilter();

  fetchUpvotes();
}
