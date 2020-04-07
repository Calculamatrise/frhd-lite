const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),
    users = {
        calculus: {
            uname: 'Calculus',
            uid: '18532'
        },
        goodrafrhd: {
            uname: 'GoodraFRHD',
            uid: '13737'
        }
    }

switch (loc[0]) {
    case 'members': userpage(loc[1].split('.')[1]); break;
    case 'threads': threads(); break;
    case 'conversations': conversations(); break;
    case 'page' : page(); break;
}

function userpage(uid) {
    applyBanners(
        name => {
            if (users[name].uid != uid) return;
            if($('.userBanners').length == 0) $('p.userBlurb').after('<div class="userBanners"></div>');
            $('.userBanners').prepend('<em class="userBanner bannerOrange " itemprop="title"><span class="before"></span><strong>VIP</strong><span class="after"></span></em>');
            $('.userBanners').prepend('<em class="userBanner bannerRed " itemprop="title"><span class="before"></span><strong>Administrator</strong><span class="after"></span></em> ');
            $('.userBanners').prepend('<em class="userBanner bannerStaff " itemprop="title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em> ');
        }
    );
}

function threads(){
    applyBanners(
        name => {
            $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerSilver wrapped" itemprop"title"=""><span class="before"></span><strong>Forum Moderator</strong><span class="after"></span></em>');
            $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerGray wrapped" itemprop"title"><span class="before"></span><strong>Administrator</strong><span class="after"></span></em> ');
            $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerStaff wrapped" itemprop"title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em>');
        }
    )
}

function conversations(){
    applyBanners(
        name => {
            $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerSilver wrapped" itemprop"title"=""><span class="before"></span><strong>Forum Moderator</strong><span class="after"></span></em>');
            $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerGray wrapped" itemprop"title"><span class="before"></span><strong>Administrator</strong><span class="after"></span></em>');
            $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerStaff wrapped" itemprop"title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em>');
        }
    )
}

$('.breadBoxTop').after('<p class="importantMessage">This mod was created by Calculus and GoodraFRHD. If you have any questions, feel free to send us a message using one of the following links.<br>Heres a link to our profile: <a href="https://community.freeriderhd.com/members/18532/" target="_blank">Calculus</a> and <a href="https://community.freeriderhd.com/members/13737/" target="_blank">GoodraFRHD</a>.</p> ');
$('.panel').after(`<li class="panel Notice DismissParent notice_23 " data-notice="23"><div class="baseHtml noticeContent">Welcome to Free Rider HD Beta!</div></li> `);

function applyBanners(cb = () => { }) {
    for (const name in users) {
        if (!users.hasOwnProperty(name)) return;
        cb(name)
    }
}
