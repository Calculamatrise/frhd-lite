export default class {
	muted = !1;
	sounds = null;
    constructor(t) {
        this.scene = t;
        this.sounds = {};
    }
    update() {
        let e = this.scene;
		for (let i in this.sounds) {
			this.sounds[i] && (this.sounds[i].muted = e.state.paused || e.settings.soundsEnabled === !1)
			if (this.sounds[i] && this.sounds[i].paused && !e.state.paused) {
				this.sounds[i].play();
			} else if (this.sounds[i] && !this.sounds[i].paused && e.state.paused) {
				this.sounds[i].pause();
			}
		}
	}
    setVolume(t, e) {
        this.sounds[t] && (this.sounds[t].volume = e)
    }
    mute_all() {
        let t = this.sounds;
        for (var e in t)
            t.hasOwnProperty(e) && (t[e].volume = 0);
        this.muted = !0
    }
    stop_all() {
        let t = this.sounds;
        for (var e in t)
            t.hasOwnProperty(e) && (this.stop(t))
    }
    play(t, e) {
        if ((null === e || "undefined" == typeof e) && (e = 1),
        this.sounds[t])
            this.sounds[t].volume = e;
        else if (this.scene.settings.soundsEnabled) {
			let o = this.scene.assets.getItem(t);
			let i = new Audio(o.src)
			  , s = this;
			i.volume = e
			i.addEventListener("ended", () => {
				s.sounds[t] = null
			})
			i.play()
            this.sounds[t] = i
        }
    }
    stop(t) {
        this.sounds[t] && (this.sounds[t].pause(),
        this.sounds[t] = null)
    }
    close() {
        this.sounds = null
    }
}