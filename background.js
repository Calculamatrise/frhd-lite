if (typeof chrome === "undefined")
    chrome = browser;

const state = {
    enabled: true
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(t => {
        setEnabled({ enabled: t.enabled ? state.enabled : true });
    });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(setEnabled);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "getEnabled":
            sendResponse(state)
        break;

        case "toggleEnabled":
            setEnabled({ enabled: !state.enabled });
            sendResponse(state);
        break;
    }
});

function setEnabled({ enabled }) {
    chrome.storage.local.set({ enabled: state.enabled = enabled });
    chrome.declarativeNetRequest.updateEnabledRulesets({
        [enabled ? "enableRulesetIds" : "disableRulesetIds"]: [
            "ruleset_1"
        ]
    });
    chrome.action.setIcon({
        path: {
            256: enabled ? "/icons/icon_256.png" : "/icons/disabled/icon_256.png",
            128: enabled ? "/icons/icon_128.png" : "/icons/disabled/icon_128.png",
            64: enabled ? "/icons/icon_64.png" : "/icons/disabled/icon_64.png",
            32: enabled ? "/icons/icon_32.png" : "/icons/disabled/icon_32.png",
            16: enabled ? "/icons/icon_16.png" : "/icons/disabled/icon_16.png"
        }
    });
}