"use strict";
let admin = ['goodrafrhd'];
let dev = ['calculus', 'polygon'];
const page = document.location.href,
    loc = document.location.pathname.toLocaleLowerCase().slice(1).split('/'),
    users = {
        calculus: {
            uname: 'Calculus',
            uid: '18532',
        },
        goodrafrhd: {
            uname: 'GoodraFRHD',
            uid: '13737',
        },
        polygon: {
            uname: 'Polygon',
            uid: '4475',
        }
    }

switch (loc[0]) {
    case 'members': userpage(loc[1].split('.')[1]); break;
    case 'threads': threads(); break;
    case 'conversations': conversations(); break;
    case '': homepage(); break;
    case 'page' : page(); break;
}

function userpage(uid) {
    applyBanners(
        name => {
            if (users[name].uid != uid) return;
            if($('.userBanners').length == 0) $('p.userBlurb').after('<div class="userBanners"></div>');
            if(admin.indexOf(name) !== -1){
                $('.userBanners').prepend('<em class="userBanner bannerOrange " itemprop="title"><span class="before"></span><strong>VIP</strong><span class="after"></span></em>');
                $('.userBanners').prepend('<em class="userBanner bannerRed " itemprop="title"><span class="before"></span><strong>Administrator</strong><span class="after"></span></em>\n');
                $('.userBanners').prepend('<em class="userBanner bannerStaff " itemprop="title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em>\n');
            }
            if(users[name].uid == '4475' || users[name].uid == '18532'){
                $('.userBanners').prepend('<em class="userBanner bannerRed " itemprop="title"><span class="before"></span><strong>Developer</strong><span class="after"></span></em>');
            }
        }
    );
}

function threads(){
    applyBanners(
        name => {
            if(admin.indexOf(name) !== -1){
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerOrange wrapped" itemprop"title"=""><span class="before"></span><strong>VIP</strong><span class="after"></span></em>\n');
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerRed wrapped" itemprop"title"><span class="before"></span><strong>Administrator</strong><span class="after"></span></em>\n');
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerStaff wrapped" itemprop"title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em>\n');
            }
            if(users[name].uid == '4475' || users[name].uid == '18532'){
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerRed wrapped" itemprop"title"><span class="before"></span><strong>Developer</strong><span class="after"></span></em> ');
            }
        }
    )
}

function conversations(){
    applyBanners(
        name => {
            if(admin.indexOf(name) !== -1){
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerOrange wrapped" itemprop"title"=""><span class="before"></span><strong>VIP</strong><span class="after"></span></em>');
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerRed wrapped" itemprop"title"><span class="before"></span><strong>Administrator</strong><span class="after"></span></em> ');
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerStaff wrapped" itemprop"title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em>');
            }
            if(users[name].uid === '4475' || users[name].uid == '18532'){
                $(`h3.userText a.username[href="members/${name}.${users[name].uid}/"]`).parent().parent().find('em.userTitle').after('<em class="userBanner bannerRed wrapped" itemprop"title"><span class="before"></span><strong>Developer</strong><span class="after"></span></em> ');
            }
        }
    )
}

//$('.breadBoxTop').after('<p class="importantMessage">This mod was created by Calculus and GoodraFRHD. If you have any q   uestions, feel free to send us a message using one of the following links.<br>Heres a link to our profile: <a href="https://community.freeriderhd.com/members/18532/" target="_blank">Calculus</a> and <a href="https://community.freeriderhd.com/members/13737/" target="_blank">GoodraFRHD</a>.</p> ');

// function homepage(){
//     applyBanners(
//         name => {
//             if(users[name].uid == '18532'){
//                 if($('.sidebar .avatarList li').length == 0) $('.sidebar .visitorPanel').after('<div class="section staffOnline avatarList"><div class="secondaryContent"><h3>Staff Online Now</h3><ul></ul></div></div>');
//                 $(".sidebar .avatarList ul").append('<li><a href="members/calculus.18532/" class="avatar Av1212s" data-avatarhtml="true"><img src="https://s3.amazonaws.com/kano-xfro-frhd/avatars/s/18/18532.jpg?1584737316" width="48" height="48" alt="Calculus"></a><a href="members/calculus.18532/" class="username" dir="auto">Calculus</a><div class="userTitle">Guide</div></li>');
//             }
//         }
//     )
// }

function applyBanners(cb = () => { }) {
    for (const name in users) {
        if (!users.hasOwnProperty(name)) return;
        cb(name)
    }
}