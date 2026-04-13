import defaults from "./constants/defaults.js";

const excludeMatches = [
	"*://*/*?ajax*",
	"*://*/*&ajax*",
	"*://*.com/*api/*"
];
const documentUrlPatterns = [
	"*://frhd.kanoapps.com/*",
	"*://www.freeriderhd.com/*"
];
const moduleScript = {
	excludeMatches,
	id: "mod",
	js: ["mod/main.js"],
	matches: documentUrlPatterns,
	runAt: "document_end",
	world: "MAIN"
};
const contentScripts = [{
	excludeMatches,
	id: "connection-broker",
	js: ["broker.js", "game/renderer/inject.js"],
	matches: documentUrlPatterns,
	runAt: "document_start"
}, {
	excludeMatches,
	id: "game",
	js: [
		"preload/ThirdPartyScriptManager.js",
		"preload/ThirdPartyStyleManager.js",
		"game/main.js"
	],
	matches: documentUrlPatterns,
	runAt: "document_start",
	world: "MAIN"
}, moduleScript];

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.get(({ enabled, settings }) => {
		enabled !== undefined && setState({ enabled });
		chrome.storage.local.set({
			enabled: enabled ?? true,
			badges: true,
			settings: Object.assign(defaults, settings)
		})
	})
});

chrome.runtime.onStartup.addListener(function() {
	self.dispatchEvent(new ExtendableEvent('activate'))
});

chrome.runtime.onUpdateAvailable.addListener(async function() {
	await chrome.storage.session.set({ updateAvailable: true });
	await chrome.action.setBadgeBackgroundColor({ color: '#b87c14' });
	chrome.action.setBadgeText({ text: '1' })
});

chrome.storage.local.onChanged.addListener(function({ enabled, settings }) {
	enabled && setState({ enabled: enabled.newValue })
});

self.addEventListener('activate', function() {
	chrome.storage.local.get(({ enabled }) => enabled || updateIcon(enabled))
});

async function setState({ enabled = true }) {
	if (enabled) {
		await chrome.scripting.registerContentScripts(contentScripts);
	} else {
		await chrome.scripting.unregisterContentScripts();
	}

	await chrome.declarativeNetRequest.updateEnabledRulesets({
		[(enabled ? 'en' : 'dis') + 'ableRulesetIds']: enabled ? ["frhd-assets"] : await chrome.declarativeNetRequest.getEnabledRulesets()
	});

	return updateIcon(enabled)
}

function updateIcon(enabled = true) {
	const path = size => `/icons/${enabled ? '' : 'disabled/'}icon_${size}.png`;
	return chrome.action.setIcon({
		path: {
			16: path(16),
			48: path(48),
			128: path(128)
		}
	})
}

import "./externalApi.js";