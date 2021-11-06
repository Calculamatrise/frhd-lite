browser = (typeof browser !== 'undefined') ? browser : chrome;

const mainDiv = document.querySelector('div');

browser.runtime.sendMessage({ action: "getEnabled" }, ({ enabled }) => setContent(enabled));

document.addEventListener('click', function() {
    browser.runtime.sendMessage({ action: "toggleEnabled" }, ({ enabled }) => setContent(enabled));
});

function setContent(enabled) {
    mainDiv.innerHTML = `Lite is ${enabled ? "enabled" : "disabled"}.<br/>Click to ${enabled ? "disable" : "enable"}.`;
    if (enabled) mainDiv.classList.add('enabled');
    else mainDiv.classList.remove('enabled');
}