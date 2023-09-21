chrome.storage.local.get(({ settings }) => {
	postMessage({
		action: 'setStorage',
		storage: settings
	});
});

chrome.storage.local.onChanged.addListener(({ settings }) => {
	settings && postMessage({
		action: 'updateStorage',
		storage: settings.newValue
	});
});