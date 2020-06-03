console.log(`Free Rider Lite Activated!\nVersion: 2.3.7`);
window.lite = function() {
    var e = document.createElement("style");
    e.type = "text/css",
    e.innerHTML = ".lite.icon{background-image:url(https://i.imgur.com/bNBqU1b.png);margin:7px;width:32px;height:32px;position:fixed;top:13px;left:17px;z-index:10}.lite.icon:hover{opacity:0.4;cursor:pointer}.lite.settings{background-color:#fff;border:1px solid grey;line-height:normal;padding:14px;position:fixed;top:70px;left:0;z-index:11}.lite.settings input{height:auto}.lite.hacker-mode-text{font-family:monospace;line-height:20pt}",
    document.head.appendChild(e);
    var i = document.createElement("div");
    i.className += "lite icon",
    document.body.appendChild(i);
    var s = document.createElement("div");
    s.className += "lite settings",
    s.innerHTML = '<p style="text-align: center;"><b>Lite</b> <i>Settings</i></p><br><input title="Lite" type="checkbox" name="lite", id="lite-checkbox" disabled> <label for="lite">Lite</label><br><input title="Dark Mode" type="checkbox" name="dark", id="dark-checkbox" disabled> <label for="dark">Dark (coming soon)</label><br><input title="Coloured Names" type="checkbox" name="names", id="names-checkbox" disabled> <label for="names">Coloured Names</label><br><br><p style="font-size: 8pt; text-align: right;">by Calculus</p>';
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
