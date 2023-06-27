import defaults from "./constants/defaults.js";

const contentScripts = [{
	id: "bootstrap",
	js: ["bootstrap.js"],
	matches: [
		"*://frhd.kanoapps.com/*",
		"*://www.freeriderhd.com/*"
	],
	runAt: "document_start"
}, {
	id: "game",
	js: ["game/main.js"],
	matches: [
		"*://frhd.kanoapps.com/*",
		"*://www.freeriderhd.com/*"
	],
	runAt: "document_end",
	world: "MAIN"
}];

chrome.scripting.registerContentScripts(contentScripts);

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

	enabled ? chrome.scripting.getRegisteredContentScripts().then(scripts => scripts.length > 0 || chrome.scripting.registerContentScripts(contentScripts)) : chrome.scripting.unregisterContentScripts();
	chrome.declarativeNetRequest.updateEnabledRulesets({
		[(enabled ? 'en' : 'dis') + "ableRulesetIds"]: ["frhd-assets"]
	});
}