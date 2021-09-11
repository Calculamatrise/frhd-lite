export default class {
    constructor(t) {
        this.scene = t;
        this.sounds = {};
    }
    sounds = null;
    update() {
        this.setMute(this.scene.state.paused || this.scene.settings.soundsEnabled === !1 ? !0 : !1)
    }
    setMute(t) {
        for (const e in this.sounds) {
            if (!this.sounds[e]) return;
            this.sounds[e][t ? "pause" : "play"]();
        }
    }
    setVolume(t, e) {
        this.sounds[t] && (this.sounds[t].volume = e)
    }
    muted = !1;
    mute_all() {
        for (var e in this.sounds)
            this.sounds.hasOwnProperty(e) && (this.sounds[e].volume = 0);
        this.muted = !0
    }
    stop_all() {
        for (var e in this.sounds)
            this.sounds.hasOwnProperty(e) && (this.sounds[e].volume = 0, this.sounds[e].stop())
    }
    play(t, e) {
        if ((null === e || "undefined" == typeof e) && (e = 1), this.sounds[t])
            this.sounds[t].volume = e;
        else if (this.scene.settings.soundsEnabled) {
            let i = this.scene.assets.getItem(t);
            this.sounds[t] = new Audio(i.src),
            this.sounds[t].volume = e,
            this.sounds[t].onended = () => delete this.sounds[t];
            this.sounds[t].play().catch(e => e)
        }
    }
    stop(t) {
        this.sounds[t] && (this.sounds[t].pause(), delete this.sounds[t])
    }
    close() {
        this.stop_all(),
        this.sounds = null
    }
}