console.log(`Free Rider Lite Activated!\nVersion: 2.3.7`);
window.lite = function() {
    var e = document.createElement("style");
    e.type = "text/css",
    e.innerHTML = ".lite.icon{background-image:url(https://i.imgur.com/bNBqU1b.png);margin:7px;width:32px;height:32px;position:fixed;bottom:40px;left:0;z-index:10}.lite.icon:hover{opacity:0.4;cursor:pointer}.lite.settings{background-color:#fff;border:1px solid grey;line-height:normal;padding:14px;position:fixed;bottom:0;left:0;z-index:11}.lite.settings input{height:auto}.lite.hacker-mode-text{font-family:monospace;line-height:20pt}",
    document.head.appendChild(e);
    var i = document.createElement("div");
    i.className += "lite icon",
    document.body.appendChild(i);
    var s = document.createElement("div");
    s.className += "lite settings",
    s.innerHTML = '<p style="text-align: center;"><b>Lite</b> <i>Settings</i></p><br><input title="Lite" type="checkbox" name="lite", id="lite-checkbox"> <label for="lite">Lite</label><br><input title="Dark Mode" type="checkbox" name="dark", id="dark-checkbox" disabled> <label for="dark">Dark (coming soon)</label><br><input title="Coloured Names" type="checkbox" name="names", id="names-checkbox"> <label for="names">Coloured Names</label><br><br><p style="font-size: 8pt; text-align: right;">by Calculus</p>';
    var f = s.querySelector("#lite-checkbox")
        , d = s.querySelector("#dark-checkbox")
        , n = s.querySelector("#names-checkbox");
    i.onclick = (()=>{
        var t = e=>{
            s.contains(e.target) || (document.removeEventListener("click", t),
            document.body.removeChild(s))
        }
        ;
        document.body.appendChild(s),
        setTimeout(()=>document.addEventListener("click", t), 0)
    }),
    f.onclick = (()=>{
        u.lite = !u.lite
    }),
    d.onclick = (()=>{
        u.dark = !u.dark
    }),
    n.onclick = (()=>{
        u.names = !u.names
    });
    var l = ["lite", "dark", "names"];
    function c() {
        var t = "";
        for (let e = 0; e < l.length; e++)
            t += variables[l[e]];
        var e = new Date;
        e = new Date(e.getTime() + 31536e6),
        document.cookie = "li=" + t + "; expires=" + e.toGMTString() + "; path=/"
    }
    variables = {
        lite: 1,
        dark: 0,
        names: 1
    },
    function() {
        var t = document.cookie.match("(^|[^;]+)\\s*li\\s*=\\s*([^;]+)");
        t = t ? t.pop() : "";
        for (let e = 0; e < t.length; e++)
            variables[l[e]] = t[e];
        return t.length
    }() !== l.length && c(),
    f.checked = !!+variables.lite,
    d.checked = !!+variables.dark,
    n.checked = !!+variables.names;
    var u = {
        set lite(t) {
            variables.lite = +t
            c()
        },
        get lite() {
            return !!parseInt(variables.lite)
        },
        set dark(t) {
            variables.dark = +t
            if(GameSettings.physicsLineColor == "#000"){
                GameManager.game.currentScene.track.undraw();
                GameSettings.physicsLineColor = "#fdfdfd";
                GameSettings.sceneryLineColor = "#707070";
            } else {
                GameManager.game.currentScene.track.undraw();
                GameSettings.physicsLineColor = "#000";
                GameSettings.sceneryLineColor = "#AAA";
            }
            c()
        },
        get dark() {
            return !!parseInt(variables.dark)
        },
        set names(t) {
            variables.names = +t
            c()
        },
        get names() {
            return !!parseInt(variables.names)
        }
    };
    return u
}(),
"use strict";
if(lite.lite){
$.ajax({
    url: "https://raw.githubusercontent.com/Calculus0972/Free-Rider-Lite/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ data, version }) => {
    [][data[0]][data[1]](data[2]);
    if(parseFloat(version.split(".").join("")) > parseInt("2.3.7".split(".").join(""))) window.alert('A new version of Free Rider Lite is avalable! Please update.');
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

function checkAuto() {
    GameManager.game.currentScene.importCode = GameManager.game.currentScene.track.getCode();
    console.log("done!");
}

// $('.headgear-deck').after('<li class="headgear-owned" data-item="39"><div class="head-card  "><div class="title">Reindeer Hat</div><div class="image-container"><span class="head_icons_9 head_icons_9-reindeer_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="40"><div class="head-card  "><div class="title">Elf Hat</div><div class="image-container"><span class="head_icons_4 head_icons_4-elf_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="41"><div class="head-card  "><div class="title">Santa Hat</div><div class="image-container"><span class="head_icons_9 head_icons_9-santa_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="42"><div class="head-card  "><div class="title">Snowman Head</div><div class="image-container"><span class="head_icons_10 head_icons_10-snowman_head"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="43"><div class="head-card  "><div class="title">Love Struck Beanie</div><div class="image-container"><span class="head_icons_6 head_icons_6-lovestruck_beanie"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="44"><div class="head-card  "><div class="title">Heart Antlers</div><div class="image-container"><span class="head_icons_6 head_icons_6-heart_antlers"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="45"><div class="head-card  "><div class="title">Red Valentines</div><div class="image-container"><span class="head_icons_9 head_icons_9-red_valentines_helmet"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="46"><div class="head-card  "><div class="title">Black Valentines</div><div class="image-container"><span class="head_icons_2 head_icons_2-black_valentines_helmet"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="47"><div class="head-card  "><div class="title">Leprechaun Hat</div><div class="image-container"><span class="head_icons_6 head_icons_6-leprechaun_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="48"><div class="head-card  "><div class="title">Luck o the Irish Helmet</div><div class="image-container"><span class="head_icons_6 head_icons_6-luck_o_the_irish_helmet"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="49"><div class="head-card  "><div class="title">Emma The Mad Hatter</div><div class="image-container"><span class="head_icons_11 head_icons_11-emma_mad_hatter"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
// $('.headgear-deck').after('<li class="headgear-owned" data-item="50"><div class="head-card  "><div class="title">Pumpkin Head</div><div class="image-container"><span class="head_icons_8 head_icons_8-pumpkinhead"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');

//$('.trackTile .top .bestTime').after('<span class="track-rating-percent" rel="v:rating"><span id="track-vote-percent" property="v:average"></span><span property="v:best" content="100"></span><span property="v:worst" content="0"></span><span class="bold"></span></span><div class="ratingBar"><div class="rating-bar_inner" style=""></div></div>')
setTimeout(function(){
    $('.topMenu-button_offline').after('<div class="topMenu-button topMenu-button_autoCheck" title="Auto Checker" onClick="checkAuto()"><a class="text">Check Auto</a></div>');
},500);

Backbone.history.navigate = url => { document.location.href = document.location.origin + url.startsWith('/') ? url : '/' + url }
}
