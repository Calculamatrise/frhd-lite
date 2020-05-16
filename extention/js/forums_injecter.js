window.mod = {
    v: chrome.runtime.getManifest().version
}

let inject = document.createElement('script');
inject.setAttribute('src', chrome.runtime.getURL('js/forums_main.js'));
document.head.appendChild(inject);