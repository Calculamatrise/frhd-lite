export default class {
	muted = false;
	sounds = new Map();
	volume = 1;
	constructor(t) {
		Object.defineProperty(this, 'scene', { value: t || null, writable: true });
		this.muted = t.settings.soundsEnabled !== !1;
		Number.isFinite(t.settings.volume) && (this.volume = t.settings.volume)
	}
	update() {
		let t = this.scene
		  , e = t.settings
		  , i = t.state.paused || !t.state.playing;
		this.muted = i || e.soundsEnabled === !1;
		this.volume !== e.volume && Number.isFinite(e.volume) && (this.volume = e.volume);
		for (let s of this.sounds.values()) {
			s.muted = this.muted;
			if (s.paused && !i) {
				s.play().catch(() => !1);
			} else if (!s.paused && i) {
				s.pause()
			}
			this.scene.game.emit(this.scene.game.constructor.Events.SoundUpdate, s)
		}
	}
	setVolume(t, e) {
		const sound = this.sounds.get(t);
		sound && (sound.volume = (e ?? 1) * this.volume)
	}
	mute_all() {
		for (let t of this.sounds.values())
			t.muted = true;
		this.muted = true
	}
	stop_all() {
		for (let e in this.sounds)
			this.stop(e)
	}
	play(t, e) {
		if (!this.scene.settings.soundsEnabled) return;
		if (!this.sounds.has(t)) {
			const o = this.scene.assets.getItem(t)
				, i = o && this.constructor.play(o);
			i && (this.sounds.set(t, i),
			this.scene.game.emit(this.scene.game.constructor.Events.SoundCreate, i),
			i.addEventListener('ended', () => this.sounds && this.sounds.delete(t), { passive: true }));
		}
		this.setVolume(t, e)
	}
	stop(t) {
		const sound = this.sounds.get(t);
		sound && (sound.pause(),
		this.scene.game.emit(this.scene.game.constructor.Events.SoundDelete, sound),
		this.sounds.delete(t))
	}
	close() {
		this.sounds = null
	}
	static play(asset) {
		if (typeof asset != 'object' || asset === null)
			throw new TypeError('First positional argument: asset must be of type: object');
		return new Audio(asset.src)
	}
}