let b = document.createElement('script');
b.innerHTML = `window.mod = {v: ${chrome.runtime.getManifest().version}}`;
document.head.appendChild(b);

let inject = document.createElement('script');
inject.setAttribute('src', chrome.runtime.getURL('js/main.js'));
document.head.appendChild(inject);

for(const element of document.getElementsByClassName('featured')) {
    element.innerText = '';
}

for(const element of document.getElementsByClassName('track-of-the-day-ttl')) {
    element.className = 'core_icons core_icons-icon_daily_badge  daily';
    element.innerHTML = '';
}

for(const element of document.getElementsByClassName('profile_icons profile_icons-icon_forum_active')) {
    element.className = "ico_moon icon-group";
    element.parentElement.className = "profile-forum-link"
}

for(const element of document.getElementsByClassName('profile_icons profile_icons-icon_forum_inactive')) {
    element.className = "ico_moon icon-group";
    element.parentElement.className = "profile-forum-link"
}

for(const element of document.getElementsByClassName('menu_icons menu_icons-icon_notifications notification')) {
    element.href = "https://www.freeriderhd.com/account/settings";
    element.className = "menu_icons menu_icons-icon_settings settings";
}
//DELETE ELEMENTS
for(const element of document.getElementsByClassName('profile_icons profile_icons-freerider_hd_pro_icon-inactive')) {
    element.parentElement.remove(element.parentElement);
}

for(const element of document.getElementsByClassName('menu_icons menu_icons-icon_shop leftNavIconPlacement')) {
    element.parentElement.remove(element.parentElement);
}

for(const element of document.getElementsByClassName('menu_icons menu_icons-icon_campaigns leftNavIconPlacement')) {
    element.parentElement.remove(element.parentElement);
}

for(const element of document.getElementsByClassName('track-list-promote')) {
    element.parentNode.removeChild(element);
}

for(const element of document.getElementsByClassName('track-leaderboard-1')) {
    element.parentNode.removeChild(element);
}

for(const element of document.getElementsByClassName('track-column-ad')) {
    element.parentNode.removeChild(element);
}

for(const element of document.getElementsByClassName('ad')) {
    element.parentNode.removeChild(element);
}