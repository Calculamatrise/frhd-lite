browser = (typeof browser !== 'undefined') ? browser : chrome;

const url = browser.runtime.getURL('scripts/game.lite.js');

const state = {
    enabled: true
}

browser.webRequest.onBeforeRequest.addListener(
    function() {
        return state.enabled ? {redirectUrl: url} : null;
    },
    {
        urls: [
            '*://cdn.freeriderhd.com/free_rider_hd/assets/scripts/game/game.min.*.js'
        ],
        types: ["script"]
    },
    ["blocking"]
);


browser.runtime.onInstalled.addListener(function() {
    browser.storage.local.set({enabled: true});
    state.enabled = true;
});



function setEnabled(val) {
    browser.storage.local.set({enabled: val});
    state.enabled = val;
    browser.browserAction.setIcon({
        path: {
            128: val ? "icons/icon_128.png" : "icons/grey_128.png",
        }
    });
}


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "toggleEnabled") {
        setEnabled(!state.enabled);
        sendResponse({enabled: state.enabled});
    }
    else if (request.action == "getEnabled") {
        sendResponse({enabled: state.enabled});
    }
});



browser.runtime.onStartup.addListener(() => {
    browser.storage.local.get(vars => {
        setEnabled(vars.enabled);
    });
});