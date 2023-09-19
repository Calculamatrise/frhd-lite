chrome.storage.local.get(({ enabled, settings }) => enabled && sessionStorage.setItem('lite', JSON.stringify(settings)));
chrome.storage.local.onChanged.addListener(function ({ settings }) {
	settings && postMessage({
		action: 'updateStorage',
		storage: settings.newValue
	});
});