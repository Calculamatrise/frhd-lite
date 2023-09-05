export default class {
	muted = !1;
	sounds = null;
	constructor(t) {
		this.scene = t;
		this.sounds = {};
	}
	update() {
		let e = this.scene;
		this.muted = e.state.paused || e.settings.soundsEnabled === !1
		for (let i in this.sounds) {
			this.sounds[i].muted = this.muted
			if (this.sounds[i].paused && !e.state.paused) {
				this.sounds[i].play();
			} else if (!this.sounds[i].paused && e.state.paused) {
				this.sounds[i].pause();
			}
		}
	}
	setVolume(t, e) {
		this.sounds[t] && (this.sounds[t].volume = this.muted ? 0 : e ?? 1)
	}
	mute_all() {
		let t = this.sounds;
		for (let e in t)
			t[e].muted = true,
			t[e].volume = 0;
		this.muted = !0
	}
	stop_all() {
		for (let e in this.sounds)
			this.stop(e)
	}
	play(t, e) {
		if (!this.sounds[t] && this.scene.settings.soundsEnabled) {
			let o = this.scene.assets.getItem(t)
			, i = o && new Audio(o.src);
			i && (this.sounds[t] = i,
			i.addEventListener('ended', () => {
				delete this.sounds[t]
			}))
		}

		this.setVolume(t, e)
	}
	stop(t) {
		this.sounds[t] && (this.sounds[t].pause(),
		delete this.sounds[t])
	}
	close() {
		this.sounds = null
	}
}