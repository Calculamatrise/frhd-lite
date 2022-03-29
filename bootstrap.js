const port = chrome.runtime.connect({ name: "lite" });
port.onMessage.addListener((message) => {
    return sessionStorage.setItem("lite", JSON.stringify(message.storage)), true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    postMessage(request);
    sendResponse({
        result: true
    });
});

chrome.storage.local.get(({ enabled }) => {
    enabled && document.head.appendChild(Object.assign(document.createElement("script"), {
        src: `chrome-extension://${chrome.runtime.id}/class/Lite.js`,//*/`chrome-extension://${chrome.runtime.id}/class/Game.js`,//*/"https://raw.githubusercontent.com/Calculamatrise/frhd-lite/master/class/Game.js",
        type: "module"
    }));
});