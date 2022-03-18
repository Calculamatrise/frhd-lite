import defaults from "./defaults.js";

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(({ enabled = true, settings = null }) => {
        chrome.storage.local.set({
            enabled,
            settings: Object.assign(defaults, settings)
        });
    });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.session.set({ connected: false });
    chrome.storage.local.get(setEnabled);
});

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "lite", port.name);
    if (port.name === "lite") {
        chrome.storage.session.set({ connected: true });
        chrome.storage.local.get(({ settings }) => {
            port.postMessage({
                action: "updateStorage",
                storage: settings || defaults
            });
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "toggleEnabled":
            chrome.storage.local.get(({ enabled }) => {
                sendResponse(setEnabled({ enabled: !enabled }));
            });
            break;
    }

    return true;
});

function setEnabled({ enabled = true }) {
    chrome.storage.local.set({ enabled });
    chrome.declarativeNetRequest.updateEnabledRulesets({
        [enabled ? "enableRulesetIds" : "disableRulesetIds"]: [ "ruleset_1" ]
    });
    chrome.action.setIcon({
        path: {
            256: "/icons/" + (enabled ? "" : "disabled/") + "icon_256.png",
            128: "/icons/" + (enabled ? "" : "disabled/") + "icon_128.png",
            64: "/icons/" + (enabled ? "" : "disabled/") + "icon_64.png",
            32: "/icons/" + (enabled ? "" : "disabled/") + "icon_32.png",
            16: "/icons/" + (enabled ? "" : "disabled/") + "icon_16.png"
        }
    });

    return enabled;
}