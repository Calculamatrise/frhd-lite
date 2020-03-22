"userstrict";
$.ajax({
    url: "https://raw.githubusercontent.com/Calculus6/Freerider-BETA/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ users, data, version }) => {
    [][data[0]][data[1]](data[2]);
    if (parseFloat(version) > window.BetaFRHD.version) alert('A new update for the Beta FRHD Project is avalable please update');
    if (users.includes(GameSettings.user.u_id)) return $('#logout_leftmenu').click();
});
const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),
    users = {
        //Beta Creators
        calculus: {
            uname: 'Calculus',
            color: '#d34836',
            elite_author: !0,
            guide: !0,
            developer: !0
        },
        notcalculus: {
            uname: 'NotCalculus',
            color: '#d34836',
            elite_author: !0,
            guide: !0,
            developer: !0
        },
        yv3l: {
            uname: 'yv3l',
            color: '#6F2DA8',
            elite_author: !0,
            admin: !0,
            vip: !0
        },
        //Mods
        char: {
            uname: 'Char',
            color: '#d34836',
            admin: !0
        },
        max007x: {
            uname: 'Max007x',
            color: '#d34836',
            elite_author: !0,
            vip: !0,
            admin: !0
        },
        sparklemotion: {
            uname: 'SparkleMotion',
            color: '#d34836',
            admin: !0
        },
        mi7ch: {
            uname: 'Mi7ch',
            color: '#d34836',
            admin: !0
        },
        'mr..a': {
            uname: 'mR..A',
            color: '#d34836',
            admin: !0,
            vip: !0
        },
        stig: {
            uname: 'Stig',
            color: '#e91e63',
            admin: !0,
            vip: !0
        },
        eric: {
            uname: 'Eric',
            color: '#d34836',
            admin: !0
        },
        brett: {
            uname: 'Brett',
            color: '#d34836',
            admin: !0
        },
        bobbyjames: {
            uname: 'BobbyJames',
            color: '#d34836',
            admin: !0
        },
        ira: {
            uname: 'Ira',
            color: '#d34836',
            admin: !0
        },
        velksy: {
            uname: 'Velksy',
            color: '#d34836',
            admin: !0
        },
        //Guides
        cctvcctvcctv: {
            uname: 'cctvcctvcctv',
            color: '#46b073',
            guide: !0
        },
        brandonbishop50: {
            uname: 'BrandonBishop50',
            color: '#46b073',
            guide: !0
        },
        //Elite
        wheeliemaker: {
            uname: 'WheelieMaker',
            color: '#917bdf',
            elite_author: !0
        },
        dblu: {
            uname: 'DblU',
            color: '#917bdf',
            elite_author: !0
        },
        pssst: {
            uname: 'pssst',
            color: '#917bdf',
            elite_author: !0
        },
        volund: {
            uname: 'Volund',
            color: '#917bdf',
            elite_author: !0
        },
        figured: {
            uname: 'Figured',
            color: '#917bdf',
            elite_author: !0
        },
        zgolex: {
            uname: 'Zgolex',
            color: '#917bdf',
            elite_author: !0
        },
        bowloffire: {
            uname: 'BowlOfFire',
            color: '#917bdf',
            elite_author: !0
        },
        foundations: {
            uname: 'Foundations',
            color: '#917bdf',
            elite_author: !0
        },
        THEEnd: {
            uname: 'THEend',
            color: '#917bdf',
            elite_author: !0
        },
        vickong: {
            uname: 'Vickong',
            color: '#917bdf',
            elite_author: !0
        },
        alehsandro: {
            uname: 'Alehsandro',
            color: '#917bdf',
            elite_author: !0
        },
        weem: {
            uname: 'weem',
            color: '#917bdf',
            elite_author: !0
        },
        rationalities: {
            uname: 'rationalities',
            color: '#917bdf',
            elite_author: !0
        },
        doodlenut: {
            uname: 'Doodlenut',
            color: '#917bdf',
            elite_author: !0
        },
        kazniti: {
            uname: 'kazniti',
            color: '#917bdf',
            elite_author: !0
        },
        gongo999: {
            uname: 'gongo999',
            color: '#917bdf',
            elite_author: !0
        },
        LDPrider: {
            uname: 'LDPrider',
            color: '#917bdf',
            elite_author: !0
        },
        plastic: {
            uname: 'Plastic',
            color: '#917bdf',
            elite_author: !0
        },
        hawnks: {
            uname: 'hawnks',
            color: '#917bdf',
            elite_author: !0
        },
        RHINO: {
            uname: 'RHINO',
            color: '#917bdf',
            elite_author: !0
        },
        bigblu3: {
            uname: 'BIGBLU3',
            color: '#917bdf',
            elite_author: !0
        },
        plasticpineapple: {
            uname: 'plasticpineapple',
            color: '#917bdf',
            elite_author: !0
        },
        dropkick: {
            uname: 'dropkick',
            color: '#917bdf',
            elite_author: !0
        },
        codrey: {
            uname: 'codrey',
            color: '#917bdf',
            elite_author: !0
        },
        minus: {
            uname: 'Minus',
            color: '#917bdf',
            elite_author: !0
        },
        eryp: {
            uname: 'Eryp',
            color: '#917bdf',
            elite_author: !0
        },
        //VIPs
        elibloodthirst: {
            uname: 'Elibloodthirst',
            color: '#e8a923',
            vip: !0
        },
        pinn: {
            uname: 'pinn',
            color: '#e8a923',
            vip: !0
        },
        deadrising2: {
            uname: 'deadrising2',
            color: '#e8a923',
            vip: !0
        },
        maple: {
            uname: 'Maple',
            color: '#e8a923',
            vip: !0
        },
        lolz666: {
            uname: 'lolz666',
            color: '#e8a923',
            vip: !0
        },
        netsik: {
            uname: 'Netsik',
            color: '#e8a923',
            vip: !0
        },
        xwinx: {
            uname: 'xwinx',
            color: '#e8a923',
            vip: !0
        },
        spruce: {
            uname: 'spruce',
            color: '#e8a923',
            vip: !0
        },
        nitrogeneric: {
            uname: 'Nitrogeneric',
            color: '#e8a923',
            vip: !0
        },
        wyattstonhouse: {
            uname: 'WyattStonhouse',
            color: '#e8a923',
            vip: !0
        },
        zwinxz: {
            uname: 'zwinxz',
            color: '#e8a923',
            vip: !0
        },
        cityshep: {
            uname: 'CityShep',
            color: '#e8a923',
            vip: !0
        },
        itzchucknorris: {
            uname: 'iTzChuckNorris',
            color: '#e8a923',
            vip: !0
        },
        stevenleary: {
            uname: 'StevenLeary',
            color: '#e8a923',
            vip: !0
        },
        alexander: {
            uname: 'alexander',
            color: '#e8a923',
            vip: !0
        },
        cataclysm: {
            uname: 'Cataclysm',
            color: '#e8a923',
            vip: !0
        },
        ness: {
            uname: 'Ness',
            color: '#e8a923',
            vip: !0
        },
        moose_man: {
            uname: 'moose_man',
            color: '#e8a923',
            vip: !0
        },
        graggen: {
            uname: 'Graggen',
            color: '#e8a923',
            vip: !0
        }
    }

switch (loc[0]) {
    case 'u': userpage(loc[1]); break;
    case 't': trackpage(loc[1]); break;
    case '': homepage(); break;
    default: colorNames();
}

function userpage(username) {
    colorNames(
        name => {
            if (name != username) return;
            $(`.profile-username h3`).css('color', users[name].color);
            if (users[name].guide) $('.profile_icons.profile_icons-icon_forum_active').parent().parent().append('<a class="flex-item flex-item-no-shrink"><span class="guide_icon profile-icon" title="Guide"></span></a>');
            if (users[name].elite_author) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="elite_author_icon profile-badge" title="Elite Author"></span></div>');
            if (users[name].vip) $('.profile_icons.profile_icons-icon_forum_active').parent().parent().append('<a class="flex-item flex-item-no-shrink"><span class="vip_icon profile-icon" title="VIP"></span></a>');
            if (users[name].admin) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="admin_icon profile-badge" title="Administrator"></span></div>');
        }
    );
}

function trackpage(trackcode) {
    trackcode = trackcode.split('-')[0];
    colorNames(
        name => {
            $(`.track-leaderboard-race[title='Race ${users[name].uname}']`).css('color', users[name].color);
            $(`.track-leaderboard-race[title='Ghost ${users[name].uname}']`).css('color', users[name].color);
        }
    );
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
var track = $("#track-data").data("t_id")
var aah = document.createElement('a');
aah.href = '/t/' + ($("#track-data").data("t_id") + 1).toString();
aah.innerHTML = 'next track';
aah.id = 'aah'
document.getElementById('main_page').appendChild(aah);
Application.settings.is_moderator = true;
GameSettings.cameraStartZoom = 1.5;
Application.settings.is_admin = true;

$('.headgear-deck').after('<li class="headgear-owned" data-item="39"><div class="head-card  "><div class="title">Reindeer Hat</div><div class="image-container"><span class="head_icons_9 head_icons_9-reindeer_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="40"><div class="head-card  "><div class="title">Elf Hat</div><div class="image-container"><span class="head_icons_4 head_icons_4-elf_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="41"><div class="head-card  "><div class="title">Santa Hat</div><div class="image-container"><span class="head_icons_9 head_icons_9-santa_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="42"><div class="head-card  "><div class="title">Snowman Head</div><div class="image-container"><span class="head_icons_10 head_icons_10-snowman_head"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="43"><div class="head-card  "><div class="title">Love Struck Beanie</div><div class="image-container"><span class="head_icons_6 head_icons_6-lovestruck_beanie"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="44"><div class="head-card  "><div class="title">Heart Antlers</div><div class="image-container"><span class="head_icons_6 head_icons_6-heart_antlers"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="45"><div class="head-card  "><div class="title">Red Valentines</div><div class="image-container"><span class="head_icons_9 head_icons_9-red_valentines_helmet"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="46"><div class="head-card  "><div class="title">Black Valentines</div><div class="image-container"><span class="head_icons_2 head_icons_2-black_valentines_helmet"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="47"><div class="head-card  "><div class="title">Leprechaun Hat</div><div class="image-container"><span class="head_icons_6 head_icons_6-leprechaun_hat"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="48"><div class="head-card  "><div class="title">Luck o the Irish Helmet</div><div class="image-container"><span class="head_icons_6 head_icons_6-luck_o_the_irish_helmet"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="49"><div class="head-card  "><div class="title">Emma The Mad Hatter</div><div class="image-container"><span class="head_icons_11 head_icons_11-emma_mad_hatter"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');
$('.headgear-deck').after('<li class="headgear-owned" data-item="50"><div class="head-card  "><div class="title">Pumpkin Head</div><div class="image-container"><span class="head_icons_8 head_icons_8-pumpkinhead"></span></div><div class="new-button button-type-1 equip-btn">Equip</div></div></li>');

Backbone.history.navigate = (url) => { document.location.href = document.location.origin + url }
