browser = (typeof browser !== 'undefined') ? browser : chrome;
let mainDiv;

document.addEventListener('DOMContentLoaded', () => {
    mainDiv = document.querySelector('div');

    browser.runtime.sendMessage(
        {action: "getEnabled"},
        (response) => {
            setContent(response.enabled);
        }
    );


    document.addEventListener('click', () => {
        browser.runtime.sendMessage(
            {action: "toggleEnabled"},
            (response) => {
                setContent(response.enabled);
            }
        );
    });
});



function setContent(enabled) {
    mainDiv.innerHTML = `Free Rider Lite is ${enabled ? "enabled" : "disabled"}.<br/>Click to ${enabled ? "disable" : "enable"}.`;
    if (enabled) mainDiv.classList.add('enabled');
    else mainDiv.classList.remove('enabled');
}