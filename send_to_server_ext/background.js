function makeRequest(subject) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://localhost:3075/help', true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  console.log("got subject:", subject)
  request.send(JSON.stringify({'subject': subject}));
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      console.log(data);
    } else {
      console.log("error");
    }
  };
  request.onerror = function() {
    console.log("error");
  };
}

console.log("Hello from extension's background.js page");

function executeMainAction(tab_id, subject, body, selection) {
  console.log("subject", subject);
  makeRequest(subject);
}

chrome.runtime.onConnect.addListener(function(port) {
  var tab = port.sender.tab;

  // This will get called by the content script we execute in
  // the tab as a result of the user pressing the browser action.
  port.onMessage.addListener(function(info) {
    var max_length = 1024;
    if (info.selection.length > max_length)
      info.selection = info.selection.substring(0, max_length);
    executeMainAction(tab.id, info.title, tab.url, info.selection);
  });
});

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  // We can only inject scripts to find the title on pages loaded with http
  // and https so for all other pages, we don't ask for the title.
  if (tab.url.indexOf("http:") != 0 &&
      tab.url.indexOf("https:") != 0) {
    executeMainAction(tab.id, "", tab.url, "");
  } else {
    chrome.tabs.executeScript(null, {file: "content_script.js"});
  }
});
