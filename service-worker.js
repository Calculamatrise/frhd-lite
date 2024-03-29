import defaults from "./constants/defaults.js";

const contentScripts = [{
	excludeMatches: [
		"*://*/*\?ajax*",
		"*://*/*&ajax*",
		"*://*.com/*api/*"
	],
	id: "connection-broker",
	js: ["broker.js"],
	matches: [
		"*://frhd.kanoapps.com/*",
		"*://www.freeriderhd.com/*"
	],
	runAt: "document_end"
}, {
	excludeMatches: [
		"*://*/*\?ajax*",
		"*://*/*&ajax*",
		"*://*.com/*api/*"
	],
	id: "game",
	js: ["game/main.js", "shared/Zip.js"],
	matches: [
		"*://frhd.kanoapps.com/*",
		"*://www.freeriderhd.com/*"
	],
	runAt: "document_end",
	world: "MAIN"
}];

chrome.runtime.onStartup.addListener(function() {
	self.dispatchEvent(new ExtendableEvent('activate'));
});

chrome.runtime.onUpdateAvailable.addListener(function() {
	chrome.storage.session.set({ updateAvailable: true }).then(() => {
		chrome.action.setBadgeText({ text: '1' });
	});
});

chrome.storage.local.onChanged.addListener(function({ enabled }) {
	enabled && setState({ enabled: enabled.newValue });
});

self.addEventListener('activate', function() {
	chrome.storage.local.get(({ enabled }) => {
		enabled || setState({ enabled })
	});
});

self.addEventListener('install', async function() {
	const scripts = await chrome.scripting.getRegisteredContentScripts();
	scripts.length == 0 && chrome.scripting.registerContentScripts(contentScripts);
	chrome.storage.local.get(({ enabled = true, settings }) => {
		chrome.storage.local.set({
			enabled,
			badges: true,
			settings: Object.assign(defaults, settings)
		});
	});
}, { once: true });

async function setState({ enabled = true }) {
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
		[(enabled ? 'en' : 'dis') + 'ableRulesetIds']: enabled ? ["frhd-assets"] : await chrome.declarativeNetRequest.getEnabledRulesets()
	});
}