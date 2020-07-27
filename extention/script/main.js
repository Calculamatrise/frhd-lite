this.vars = {
    clone: !1,
    dark: !1,
    dropdown: !1,
    feats: !1,
    gameFocusOverlay: !1,
    names: !0
};
saveToLocalStorage = function() {
    const l = JSON.stringify({
        vars: this.vars
    });
    localStorage.setItem("lite", l)
}
setVar = function(v, i) {
    this.vars[v] = i
    saveToLocalStorage()
}
getVar = function(v) {
    return localStorage.lite ? JSON.parse(localStorage.lite).vars[v] : this.vars[v]
}
this.lite = function(){
    var e = document.createElement("style");
    e.type = "text/css",
    e.innerHTML = ".lite.icon{background-image:url(https://i.imgur.com/bNBqU1b.png);margin:7px;width:32px;height:32px;position:fixed;bottom:40px;left:0;z-index:10}.lite.icon:hover{opacity:0.4;cursor:pointer}.lite.settings{background-color:#fff;border:1px solid grey;line-height:normal;padding:14px;position:fixed;bottom:0;left:0;z-index:11}.lite.settings input{height:auto}.lite.hacker-mode-text{font-family:monospace;line-height:20pt}.lite.dropdown{display:none;bottom:0;left:10px;width:300px;length:300px}",
    document.head.appendChild(e);
    var i = document.createElement("div");
    i.className += "lite icon",
    document.body.appendChild(i);
    var s = document.createElement("div");
    s.id = "testest",
    s.className += "lite settings",
    s.innerHTML = `
    <p style="text-align: center;">
        <b>Mod</b> 
        <i>Settings</i>
    </p>
    <br>
    <input title="Refresh your page for changes to take effect" type="checkbox" name="settings" id="dark" ${getVar("dark") ? "checked" : ""}> 
    <label for="dark">Dark Mode</label>
    <br>
    <input title="Enables a beta feature" type="checkbox" name="settings" id="dropdown" ${getVar("feats") ? "checked" : ""}> 
    <label for="names">Feat. Ghosts LB</label>
    <br>
    <input title="Disable the gameFocusOverlay" type="checkbox" name="settings" id="gameFocusOverlay" ${getVar("gameFocusOverlay") ? "checked" : ""}> 
    <label for="gameFocusOverlay">Disable overlay</label>
    <br>
    <input title="Coloured Names" type="checkbox" name="settings" id="names" ${getVar("names") ? "checked" : ""}> 
    <label for="names">Coloured Names</label>
    <br>
    <input title="Your head is applied to all players" type="checkbox" name="settings" id="clone" ${getVar("clone") ? "checked" : ""}> 
    <label for="clone">Clone</label>
    <br>
    <br>
    <p style="font-size: 8pt; text-align: right;">by Calculus</p>`;
    var d = s.querySelector("#dark"),
        g = s.querySelector("#gameFocusOverlay"),
        n = s.querySelector("#names"),
        q = s.querySelector("#clone");
    i.onclick = (()=>{
        var t = e=>{
            s.contains(e.target) || (document.removeEventListener("click", t),
            document.body.removeChild(s))
        }
        ;
        document.body.appendChild(s),
        setTimeout(()=>document.addEventListener("click", t), 0)
    }),
    d.onclick = (()=>{
        setVar("dark", !getVar("dark"))
    }),
    g.onclick = (()=>{
        setVar("gameFocusOverlay", !getVar("gameFocusOverlay"))
    }),
    n.onclick = (()=>{
        setVar("names", !getVar("names"))
    });
    q.onclick = (()=>{
        setVar("clone", !getVar("clone"))
    });
}();
let admin = ['Calculus', 'PreCalculus', 'yv3l', 'Char', 'Max007x', 'SparkleMotion', 'mR..A', 'Stig', 'Eric', 'Mi7ch', 'BobbyJames', 'Ira', 'Velsky'];
let elite = ['yv3l', 'WheelieMaker', 'DblU', 'pssst', 'Volund', 'codrey', 'Figured', 'Zgolex', 'BowlofFire', 'Foundations', 'THEEnd', 'Vickong', 'Alehsandro', 'weem', 'rationalities', 'Doodlenut', 'kazniti', 'gongo999', 'LDPrider', 'Plastic', 'hawnks', 'RHINO', 'BIGBLU3', 'plasticpineapple', 'dropkick', 'Minus', 'Eryp', 'Nitrogeneric', 'WyattStonhouse', 'iTzChuckNorris', 'CityShep'];
let vip = ['Maple', 'Elibloodthirst', 'deadrising2', 'pinn', 'lolz666', 'Netsik', 'xwinx', 'spruce', 'zwinxz', 'StevenLeary', 'alexander', 'Cataclysm', 'Ness', 'moose_man', 'Graggen'];
let guide = ['cctvcctvcctv', 'BrandonBishop50'];
let red = '#d34836';
let green = '#46b073';
let blue = '#7289da';
let purple = '#917bdf';
let orange = '#e8a923';
const page = document.location.href,
loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/');
var users = {};
admin.forEach((a) => {
    users[a.toLowerCase()] = {
        uname: a,
        color: red
    }
});
elite.forEach((e) => {
    users[e.toLowerCase()] = {
        uname: e,
        color: purple
    }
});
vip.forEach((v) => {
    users[v.toLowerCase()] = {
        uname: v,
        color: purple
    }
});
guide.forEach((g) => {
    users[g.toLowerCase()] = {
        uname: g,
        color: green
    }
});
switch(loc[0]){
    case 'u': userpage(loc[1]); break;
    case 't': trackpage(loc[1]); break;
    case '': homepage(); break;
    case 'create': create(); break;
    default: colorNames();
}

function userpage(username){
    colorNames(
        name => {
            if(name != username) return;
            $(`.profile-username h3`).css('color', users[name].color);
            if(elite.indexOf(name) !== -1) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="elite_author_icon profile-badge" title="Elite Author"></span></div>');
            if(vip.indexOf(name) !== -1) {
                $('.profile_icons.profile_icons-icon_forum_active').parent().parent().append('<a class="flex-item flex-item-no-shrink"><span class="vip_banner profile-icon" title="VIP"></span></a>');
            }
            if(admin.indexOf(name) !== -1) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="admin_icon profile-badge" title="Administrator"></span></div>');
        }
    );
    $('.profile-forums-link').insertAfter($('.profile-header .profile-user-info .profile-image'));
}

function trackpage(trackcode) {
    trackcode = trackcode.split('-')[0];
    colorNames(
        name => {
            $(`.track-leaderboard-race[title='Race ${users[name].uname}']`).css('color', users[name].color);
            $(`.track-leaderboard-race[title='Ghost ${users[name].uname}']`).css('color', users[name].color);
        }
    );
    var a = document.createElement('a');
    a.href = '/t/' + ($("#track-data").data("t_id") + 1).toString();
    a.innerHTML = 'Next';
    a.classList = 'nextTrack';
    a.id = 'a'
    document.getElementById('main_page').appendChild(a);
}

function canvas() {
    colorNames(
        name => {
            $(`.track-race[title='Race ${users[name].uname}']`).css('color', users[name].color);
            $(`.track-raceColors[title='Ghost ${users[name].uname}']`).css('color', users[name].color);
        }
    );
}

function homepage() {
    colorNames();
}

function create() {
    $('.topMenu-button_offline').after('<div class="topMenu-button topMenu-button_autoCheck" title="Fix your auto!"><a class="text" onClick="checkAuto()">Check Auto</a></div>');
}

function colorNames(cb = () => { }) {
    if(getVar("names")){
        for (const name in users) {
            if(!users.hasOwnProperty(name))return;
            cb(name)
            $(`.bold:contains(${users[name].uname})`).filter(
                function () {
                    return $(this).text() == users[name].uname
                }
            ).not('#username-text, .track-leaderboard').css('color', users[name].color);
        }
    }
}

function checkAuto() {
    GameManager.game.currentScene.importCode = GameManager.game.currentScene.track.getCode();
    console.log("done!");
}

if(getVar("feats")){
    let inject = document.createElement('script');
    inject.setAttribute('src', 'https://raw.githubusercontent.com/Calculus0972/Official_Featured_Ghosts/master/tampermonkey.script.js');
    document.head.appendChild(inject);
}

if(getVar("gameFocusOverlay")){
    const e = document.createElement("style");
    e.type = "text/css",
    e.innerHTML = ".gameFocusOverlay{display:none;}",
    document.head.appendChild(e)
}

if(getVar("dark")){
    document.getElementsByClassName("game")[0].style.background = "#1d1d1d"
}

//$('.trackTile .top .bestTime').after('<span class="track-rating-percent" rel="v:rating"><span id="track-vote-percent" property="v:average"></span><span property="v:best" content="100"></span><span property="v:worst" content="0"></span><span class="bold"></span></span><div class="ratingBar"><div class="rating-bar_inner" style=""></div></div>')
setTimeout(function(){
    $('.topMenu-button_offline').after('<div class="topMenu-button topMenu-button_autoCheck" title="Auto Checker" onClick="checkAuto()"><a class="text">Check Auto</a></div>');
},500);

Backbone.history.navigate = url => { document.location.href = document.location.origin + url.startsWith('/') ? url : '/' + url }