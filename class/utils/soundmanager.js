export default class {
    constructor(t) {
        this.scene = t;
        this.sounds = {};
    }
    sounds = null;
    update() {
        var t = createjs.Sound
            , e = this.scene
            , i = e.settings;
        t.setMute(e.state.paused || i.soundsEnabled === !1 ? !0 : !1)
    }
    setVolume(t, e) {
        this.sounds[t] && (this.sounds[t].volume = e)
    }
    muted = !1;
    mute_all() {
        var t = this.sounds;
        for (var e in t)
            t.hasOwnProperty(e) && (t[e].volume = 0);
        this.muted = !0
    }
    stop_all() {
        var t = this.sounds;
        for (var e in t)
            t.hasOwnProperty(e) && (t[e].volume = 0,
            t[e].stop())
    }
    play(t, e) {
        if ((null === e || "undefined" == typeof e) && (e = 1),
        this.sounds[t])
            this.sounds[t].volume = e;
        else if (this.scene.settings.soundsEnabled) {
            var i = createjs.Sound.play(t, {
                volume: e
            })
                , s = this;
            i.addEventListener("complete", function() {
                s.sounds[t] = null
            }),
            this.sounds[t] = i
        }
    }
    stop(t) {
        this.sounds[t] && (this.sounds[t].stop(),
        this.sounds[t] = null)
    }
    close() {
        this.sounds = null
    }
}