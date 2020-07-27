this.vars = {
    dismissed: !1,
    update: !1
};
saveToLocalStorage = function() {
    const l = JSON.stringify({
        update: this.vars
    });
    localStorage.setItem("liveUpdate", l)
}
setVar = function(v, i) {
    this.vars[v] = i
    saveToLocalStorage()
}
getVar = function(v) {
    return localStorage.liveUpdate ? JSON.parse(localStorage.liveUpdate).update[v] : this.vars[v]
}
fetch("https://raw.githubusercontent.com/Calculus0972/free-rider-lite/master/update.json").then((response) => response.json()).then(json => {
    var manifest = chrome.runtime.getManifest();
    if(json.version > manifest.version && getVar("dismissed") != !0){
        setVar("update", !0)
    }
    if(getVar("update") != !1){
        const element = document.getElementsByTagName("html")[0];
        element.innerHTML += `<div class="mod-update-notification" id="update-notice" style="width:100%;height:50px;background-color:#2bb82b;color:#fff;position:fixed;top:0;z-index:1002;text-align:center;line-height:46px;cursor:pointer">A new version of Free Rider Lite is available!&nbsp;&nbsp;&nbsp;<button onclick="window.location.href='https://chrome.google.com/webstore/detail/mmmpacciomidmplocdcaheednkepbdkb'" id="update-button" style="height: 30px;background-color: #27ce35;border: none;border-radius: 4px;color: #fff">Update</button>&nbsp;<button class="mod-dismiss-button" id="dismiss-notice" style="height:30px;background-color:#27ce35;border:none;border-radius:4px;color: #fff">Dismiss</button></div>`;
        document.getElementById('dismiss-notice').onclick = (()=>{
            setVar("update", !1);
            setVar("dismissed", !0);
            document.getElementById('update-notice').style.display = "none";
        });
        document.getElementById('update-button').onclick = (()=>{
            setVar("update", !1);
            setVar("dismissed", !0);
            document.getElementById('update-notice').style.display = "none";
        });
    }
});
let inject = document.createElement('script');
inject.setAttribute('src', chrome.runtime.getURL('script/main.js'));
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
//DELETE ELEMENTS
for(const element of document.getElementsByClassName('profile_icons profile_icons-freerider_hd_pro_icon-inactive')) {
    element.parentElement.remove(element.parentElement);
}