const workerUrl = chrome.runtime.getURL('game/renderer/worker.js');
const injectedScript = document.createElement('script');
injectedScript.type = 'module';
injectedScript.src = chrome.runtime.getURL('game/renderer/loader.js');
injectedScript.addEventListener('load', function() {
	postMessage({
		sender: 'frhd-lite/renderer',
		workerUrl
	});
	this.remove()
}, { once: true, passive: true });
document.documentElement.appendChild(injectedScript);