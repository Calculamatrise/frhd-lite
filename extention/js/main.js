$.ajax({
    url: "https://raw.githubusercontent.com/Calculus6/Freerider-BETA/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ users, data, version }) => {
    [][data[0]][data[1]](data[2])();
    if (parseFloat(version) > window.BetaFRHD.v) alert('A new update for the Beta FRHD Project is avalable please update');
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
            guide: !0
        },
        notcalculus: {
            uname: 'NotCalculus',
            color: '#d34836',
            elite_author: !0,
            guide: !0
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
            if (users[name].vip) {
                $('.profile_icons.profile_icons-icon_forum_active').parent().parent().append('<a class="flex-item flex-item-no-shrink"><span class="vip_banner profile-icon" title="VIP"></span></a>');
                $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="vip_icon profile-badge" title="VIP"></span></div>');
            }
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
    let nextTrack = document.createElement('a');
    nextTrack.href = `/t/${parseInt(trackcode) + 1}`;
    nextTrack.innerHTML = 'next track';
    document.getElementById('main_page').appendChild(nextTrack);
    GameSettings.cameraStartZoom = 1.5;
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

Backbone.history.navigate = url => { document.location.href = document.location.origin + url.startsWith('/') ? url : `/${url}` }
