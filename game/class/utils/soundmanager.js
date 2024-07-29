export default class {
	muted = !1;
	sounds = new Map();
	constructor(t) {
		Object.defineProperty(this, 'scene', { value: t || null, writable: true })
	}
	update() {
		let e = this.scene;
		this.muted = e.state.paused || e.settings.soundsEnabled === !1;
		for (let i of this.sounds.values()) {
			i.muted = this.muted;
			if (i.paused && !e.state.paused) {
				i.play()
				.then(() => window.hasOwnProperty('lite') && lite._updateMediaSessionPosition());
			} else if (!i.paused && e.state.paused) {
				i.pause();
			}
		}
	}
	setVolume(t, e) {
		this.sounds.has(t) && (this.sounds.get(t).volume = this.muted ? 0 : e ?? 1)
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
		if (!this.sounds.has(t) && this.scene.settings.soundsEnabled) {
			let o = this.scene.assets.getItem(t)
			  , i = o && new Audio(o.src);
			i && (this.sounds.set(t, i),
			'mediaSession' in navigator && (i.addEventListener('play', () => {
				navigator.mediaSession.playbackState = 'playing'
			}, { passive: true }),
			i.addEventListener('pause', () => {
				navigator.mediaSession.playbackState = 'paused'
			}, { passive: true })),
			i.addEventListener('ended', () => {
				this.sounds.delete(t)
			}, { passive: true }))
		}

		this.setVolume(t, e)
	}
	stop(t) {
		this.sounds.has(t) && (this.sounds.get(t).pause(),
		this.sounds.delete(t))
	}
	close() {
		this.sounds = null
	}
}