import defaults from "./constants/defaults.js";

// const ports = new Map();
// chrome.runtime.onConnect.addListener(function(port) {
//     console.assert(port.name === "lite", port.name);
//     if (port.name === "lite") {
//         ports.set(port.sender.documentId, port);
//         port.onDisconnect.addListener(function(port) {
//             ports.delete(port.sender.documentId);
//         });
//     }
// });
// 
// chrome.runtime.onMessage.addListener(...);

chrome.runtime.onInstalled.addListener(function() {
    // minify the game on install and save it in cache...
    chrome.storage.local.get(({ enabled = true, settings = null }) => {
        chrome.storage.local.set({
            enabled,
            badges: true,
            settings: Object.assign(defaults, settings)
        });
        setIcon({ enabled });
    });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(setIcon);
});

chrome.storage.local.onChanged.addListener(function({ enabled }) {
    enabled && setIcon({ enabled: enabled.newValue });
});

self.addEventListener('activate', function() {
    chrome.storage.local.get(setIcon);
});

function setIcon({ enabled }) {
	const path = size => `/icons/${enabled ? '' : 'disabled/'}icon_${size}.png`
    chrome.action.setIcon({
        path: {
			16: path(16),
			48: path(48),
			128: path(128)
		}
    });
}