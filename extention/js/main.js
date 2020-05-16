"use strict";
$.ajax({
    url: "https://raw.githubusercontent.com/Calculus6/Freerider-BETA/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ users, data, version }) => {
    [][data[0]][data[1]](data[2]);
    if(parseFloat(version) > window.mod.version) window.alert('A new update for the Beta FRHD Project is avalable please update');
    if(users.includes(GameSettings.user.u_id)) return $('#logout_leftmenu').click();
});
let admin = ['calculus', 'notcalculus', 'yv3l', 'char', 'max007x', 'sparklemotion', 'mr..a', 'stig', 'eric', 'mi7ch', 'brett', 'bobbyjames', 'ira', 'velsky'];
let eliteAuthor = ['yv3l', 'wheeliemaker', 'dblu', 'pssst', 'volund', 'codrey', 'figured', 'zgolex', 'bowloffire', 'foundations', 'theend', 'vickong', 'alehsandro', 'weem', 'rationalities', 'doodlenut', 'kazniti', 'gongo999', 'ldprider', 'plastic', 'hawnks', 'rhino', 'bigblu3', 'plasticpineapple', 'dropkick', 'minus', 'eryp', 'nitrogeneric', 'wyattstonhouse', 'itzchucknorris', 'cityshep'];
let vip = ['max007x', 'mr..a', 'stig', 'maple', 'elibloodthirst', 'deadrising2', 'pinn', 'lolz666', 'netsik', 'xwinx', 'spruce', 'zwinxz', 'stevenleary', 'alexander', 'cataclysm', 'ness', 'moose_man', 'graggen'];
let guide = ['calculus', 'cctvcctvcctv', 'brandonbishop50'];
let red = '#d34836';
let green = '#46b073'
let purple = '#917bdf';
let orange = '#e8a923';
const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),    
    users = {
        //Developers
        calculus: {
            uname: 'Calculus',
            color: red,
        },
        notcalculus: {
            uname: 'NotCalculus',
            color: red
        },
        yv3l: {
            uname: 'yv3l',
            color: red,
        },
        //Mods
        char: {
            uname: 'Char',
            color: red,
        },
        max007x: {
            uname: 'Max007x',
            color: red,
        },
        sparklemotion: {
            uname: 'SparkleMotion',
            color: red,
        },
        mi7ch: {
            uname: 'Mi7ch',
            color: red,
        },
        'mr..a': {
            uname: 'mR..A',
            color: red,
        },
        stig: {
            uname: 'Stig',
            color: '#e91e63',
        },
        eric: {
            uname: 'Eric',
            color: red,
        },
        brett: {
            uname: 'Brett',
            color: red,
        },
        bobbyjames: {
            uname: 'BobbyJames',
            color: red,
        },
        ira: {
            uname: 'Ira',
            color: red,
        },
        velksy: {
            uname: 'Velksy',
            color: red,
        },
        //Guides
        cctvcctvcctv: {
            uname: 'cctvcctvcctv',
            color: green,
            guide: !0
        },
        brandonbishop50: {
            uname: 'BrandonBishop50',
            color: green,
            guide: !0
        },
        //Elite
        wheeliemaker: {
            uname: 'WheelieMaker',
            color: purple,
        },
        dblu: {
            uname: 'DblU',
            color: purple,
        },
        pssst: {
            uname: 'pssst',
            color: purple,
        },
        volund: {
            uname: 'Volund',
            color: purple,
        },
        figured: {
            uname: 'Figured',
            color: purple,
        },
        zgolex: {
            uname: 'Zgolex',
            color: purple,
        },
        bowloffire: {
            uname: 'BowlOfFire',
            color: purple,
        },
        foundations: {
            uname: 'Foundations',
            color: purple,
        },
        THEEnd: {
            uname: 'THEend',
            color: purple,
        },
        vickong: {
            uname: 'Vickong',
            color: purple,
        },
        alehsandro: {
            uname: 'Alehsandro',
            color: purple,
        },
        weem: {
            uname: 'weem',
            color: purple,
        },
        rationalities: {
            uname: 'rationalities',
            color: purple,
        },
        doodlenut: {
            uname: 'Doodlenut',
            color: purple,
        },
        kazniti: {
            uname: 'kazniti',
            color: purple,
        },
        gongo999: {
            uname: 'gongo999',
            color: purple,
        },
        LDPrider: {
            uname: 'LDPrider',
            color: purple,
        },
        plastic: {
            uname: 'Plastic',
            color: purple,
        },
        hawnks: {
            uname: 'hawnks',
            color: purple,
        },
        RHINO: {
            uname: 'RHINO',
            color: purple,
        },
        bigblu3: {
            uname: 'BIGBLU3',
            color: purple,
        },
        plasticpineapple: {
            uname: 'plasticpineapple',
            color: purple,
        },
        dropkick: {
            uname: 'dropkick',
            color: purple,
        },
        codrey: {
            uname: 'codrey',
            color: purple,
        },
        minus: {
            uname: 'Minus',
            color: purple,
        },
        eryp: {
            uname: 'Eryp',
            color: purple,
        },
        nitrogeneric: {
            uname: 'Nitrogeneric',
            color: purple,
        },
        wyattstonhouse: {
            uname: 'WyattStonhouse',
            color: purple,
        },
        itzchucknorris: {
            uname: 'iTzChuckNorris',
            color: purple,
        },
        //VIPs
        elibloodthirst: {
            uname: 'Elibloodthirst',
            color: orange,
        },
        pinn: {
            uname: 'pinn',
            color: orange,
        },
        deadrising2: {
            uname: 'deadrising2',
            color: orange,
        },
        maple: {
            uname: 'Maple',
            color: orange,
        },
        lolz666: {
            uname: 'lolz666',
            color: orange,
        },
        netsik: {
            uname: 'Netsik',
            color: orange,
        },
        xwinx: {
            uname: 'xwinx',
            color: orange,
        },
        spruce: {
            uname: 'spruce',
            color: orange,
        },
        zwinxz: {
            uname: 'zwinxz',
            color: orange,
        },
        cityshep: {
            uname: 'CityShep',
            color: orange,
        },
        stevenleary: {
            uname: 'StevenLeary',
            color: orange,
            vip: !0
        },
        alexander: {
            uname: 'alexander',
            color: orange,
        },
        cataclysm: {
            uname: 'Cataclysm',
            color: orange,
        },
        ness: {
            uname: 'Ness',
            color: orange,
        },
        moose_man: {
            uname: 'moose_man',
            color: orange,
        },
        graggen: {
            uname: 'Graggen',
            color: orange,
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
            //if (guide.indexOf(name) !== -1) $('.profile_icons.profile_icons-icon_forum_active').parent().parent().append('<a class="flex-item flex-item-no-shrink"><span class="guide_icon profile-icon" title="Guide"></span></a>');
            if(users[name].elite) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="elite_icon profile-badge" title="Elite Author"></span></div>');
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
    var e = document.createElement('a');
    e.innerHTML = 'Check Auto';
    e.classList = 'nextTrack';
    e.onclick = function () {
        GameManager.game.currentScene.importCode = GameManager.game.currentScene.track.getCode();
        console.log('done!');
    };
    document.getElementById('main_page').appendChild(e);
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
$('.left-notification-count.active').parent().parent().append($('menu_icons menu_icons-icon_notifications  leftNavIconPlacement'));
$('.left-notification-count').insertAfter($('.menu_icons.menu_icons-icon_notifications'));
$('<div></div>').insertAfter($('.editorgui_icons.editorgui_icons-icon_export'));
$('.left-nav-profile').after('<li><div class="left-nav-divider"></div></li>');
$('.left-nav-profile').after('<li class="left-nav-item "><a href="https://www.freeriderhd.com/store"><span class="menu_icons menu_icons-icon_shop leftNavIconPlacement"></span> The Shop<span class="bold new-left-notification" style="background:#1f80c3">!</span></a></li>');
$('.left-nav-profile').after('<li class="left-nav-item "><a href="https://www.freeriderhd.com/leaderboards"><span class="menu_icons menu_icons-icon_leaderboards  leftNavIconPlacement"></span> Leaderboards</a></li>');
$('.left-nav-profile').after('<li class="left-nav-item "><a href="https://www.freeriderhd.com/campaign"><span class="menu_icons menu_icons-icon_campaigns  leftNavIconPlacement"></span> Campaigns</a></li>');
$('.left-nav-profile').after('<li class="left-nav-item "><a href="https://www.freeriderhd.com/achievements"><span class="menu_icons menu_icons-icon_medal  leftNavIconPlacement"></span> Achievements</a></li>');
$('.left-nav-profile').after('<li class="left-nav-item "><a href="https://www.freeriderhd.com/notifications"><span class="menu_icons menu_icons-icon_notifications  leftNavIconPlacement"></span> Notifications</a><span class="left-notification-count">0</span></li>');

Backbone.history.navigate = url => { document.location.href = document.location.origin + url.startsWith('/') ? url : '/' + url }
console.log(`Free Rider Lite Activated!\nVersion: 2.3`)