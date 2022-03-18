chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(setEnabled);
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(setEnabled);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "getEnabled":
            chrome.storage.local.get(({ enabled }) => {
                sendResponse(setEnabled({ enabled }));
            });
            break;

        case "toggleEnabled":
            chrome.storage.local.get(({ enabled }) => {
                sendResponse(setEnabled({ enabled: !enabled }));
            });
            break;

        case "getStorage":
        case "resetSettings":
        case "setStorageItem":
        case "toggleStorageItem":
            chrome.tabs.query({ active: true }, function([ tab ]) {
                if (tab.hasOwnProperty("url") && tab.url.match(/https?:\/\/(.+)?fr(.+)?hd(\..+)?\.com/gi)) {
                    chrome.tabs.sendMessage(tab.id, request, function(response) {
                        if (chrome.runtime.lastError) {
                            // chrome.tabs.reload(tab.id);
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

function setEnabled({ enabled = true }) {
    chrome.storage.local.set({ enabled });
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

    return enabled;
}