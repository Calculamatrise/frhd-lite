<!DOCTYPE html>
<html>
    <head>
        <title>FRHD Lite</title>
    </head>
    <body>
        <p style="text-align: center;"><b>Lite</b> 
            <i>Settings</i>
        </p>
        <br>
        <input title="Lite" type="checkbox" name="lite", id="lite-checkbox"> 
        <label for="lite">Lite</label>
        <br>
        <input title="Dark Mode" type="checkbox" name="dark", id="dark-checkbox" disabled> 
        <label for="dark">Dark (coming soon)</label>
        <br>
        <input title="Coloured Names" type="checkbox" name="names", id="names-checkbox"> 
        <label for="names">Coloured Names</label>
        <br>
        <br>
        <p style="font-size: 8pt; text-align: right;">by Calculus</p>
    </body>
</html>
<style>
    html {
        width: 150px;
    }
    .lite.icon{background-image:url(https://i.imgur.com/bNBqU1b.png);margin:7px;width:32px;height:32px;position:fixed;bottom:40px;left:0;z-index:10}
    .lite.icon:hover{opacity:0.4;cursor:pointer}
    .lite.settings{background-color:#fff;border:1px solid grey;line-height:normal;padding:14px;position:fixed;bottom:0;left:0;z-index:11}
    .lite.settings input{height:auto}
    .lite.hacker-mode-text{font-family:monospace;line-height:20pt}
</style>
<script>
window.lite = function() {
    var i = document.createElement("div");
    i.className += "lite icon",
    document.body.appendChild(i);
    var f = s.querySelector("#lite-checkbox")
        , d = s.querySelector("#dark-checkbox")
        , n = s.querySelector("#names-checkbox");
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
}()
</script>
