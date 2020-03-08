window.BetaFRHD = {
    v: chrome.runtime.getManifest().version
}

let inject = document.createElement('script');
inject.setAttribute('src', chrome.runtime.getURL('js/main.js'));
document.head.appendChild(inject);

for (const element of document.getElementsByClassName('featured')) {
    element.innerText = '';
}