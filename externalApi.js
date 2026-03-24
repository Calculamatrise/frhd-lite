chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
	let res = "418 I'm a teapot";
	if (/^manifest/i.test(message)) {
		let manifest = chrome.runtime.getManifest();
		/^manifest\.version$/i.test(message) && (res = { version: manifest.version })
	}
	sendResponse(res)
});