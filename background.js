const state = {
    enabled: true
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(data => {
        setEnabled({ enabled: data.enabled ? state.enabled : true });
    });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(setEnabled);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "getEnabled":
            sendResponse(state.enabled)

            break;

        case "toggleEnabled":
            sendResponse(setEnabled({ enabled: !state.enabled }));

            break;

        case "getStorage":
        case "resetSettings":
        case "setStorageItem":
        case "toggleStorageItem":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0].hasOwnProperty("url") && tabs[0].url.match(/https?:\/\/.+fr(.+)?hd\.com/gi)) {
                    chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
                        if (chrome.runtime.lastError) {
                            // chrome.tabs.reload(tabs[0].id);
                            // it can no longer post/receive messages from the page, for whatever reason.
                            // this only occurs when the extension is refreshed; it shouldn't be an issue
                            return;
                        }

                        sendResponse(response);
                    });
                }
            });

            break;
    }

    return true;
});

function setEnabled({ enabled }) {
    chrome.storage.local.set({ enabled: state.enabled = enabled });
    // chrome.declarativeNetRequest.updateEnabledRulesets({
    //     [enabled ? "enableRulesetIds" : "disableRulesetIds"]: [
    //         "ruleset_1"
    //     ]
    // });
    chrome.action.setIcon({
        path: {
            256: enabled ? "/icons/icon_256.png" : "/icons/disabled/icon_256.png",
            128: enabled ? "/icons/icon_128.png" : "/icons/disabled/icon_128.png",
            64: enabled ? "/icons/icon_64.png" : "/icons/disabled/icon_64.png",
            32: enabled ? "/icons/icon_32.png" : "/icons/disabled/icon_32.png",
            16: enabled ? "/icons/icon_16.png" : "/icons/disabled/icon_16.png"
        }
    });

    return enabled;
}