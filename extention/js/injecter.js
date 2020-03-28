let b = document.createElement('script');
b.innerHTML = `window.BetaFRHD = {v: ${chrome.runtime.getManifest().version}}`;
document.head.appendChild(b);

let inject = document.createElement('script');
inject.setAttribute('src', chrome.runtime.getURL('js/main.js'));
document.head.appendChild(inject);

for (const element of document.getElementsByClassName('featured')) {
    element.innerText = '';
}
document.getElementsByClassName('notification')[0].title = 'Notifications';
document.getElementsByClassName('left-nav-profile')[0].insertAdjacentHTML('afterend','<li class="left-nav-item "><a href="https://www.freeriderhd.com/leaderboards"><span class="menu_icons menu_icons-icon_campaigns campaign  leftNavIconPlacement"></span> Leaderboards</a></li>');