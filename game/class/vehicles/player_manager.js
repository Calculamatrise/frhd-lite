import s from "./player.js";

export default class {
	_players = [];
	_playerLookup = {};
	firstPlayer = null;
	constructor(t) {
		Object.defineProperty(this, 'scene', { value: t, writable: true }),
		Object.defineProperty(this, 'game', { value: t.game, writable: true }),
		this.settings = t.settings
	}
	fixedUpdate() {
		if (!this.scene.camera.focusIndex)
			for (const t of this._players.filter(player => !player.complete && !player.isGhost()))
				t.fixedUpdate();
		for (const { _replayIterator: t } of this._players.filter(player => !player.complete && player.isGhost()))
			t.next();
		window.hasOwnProperty('lite') && lite.storage.get('confirmRestart') && this.firstPlayer && this.firstPlayer._gamepad.isButtonDown('restart') && this.firstPlayer._restartTimeout && (this.scene.ticks - this.firstPlayer._restartTimeout >= 10) && (this.scene.restartTrack = !0,
		this.firstPlayer._gamepad.setButtonUp('restart'))
	}
	update() {
		for (const t of this._players.filter(player => !player.complete))
			t.update(...arguments)
	}
	lateUpdate() {
		for (const t of this._players.filter(player => !player.complete))
			t.lateUpdate(...arguments)
	}
	mutePlayers() {
		for (let t = this._players, e = t.length, i = 0; e > i; i++) {
			let s = t[i].getActiveVehicle();
			s.stopSounds()
		}
	}
	updateGamepads() {
		for (const { _gamepad: t } of this._players.filter(player => !player.isGhost()))
			t.update()
	}
	createPlayer(t, e) {
		return new s(this.scene,e)
	}
	addPlayer(t) {
		this._players.push(t),
		this._playerLookup[t.id] = t,
		this.game.emit('playerAdd', t)
	}
	checkKeys() {
		for (const t of this._players.filter(player => !player.isGhost()))
			t.checkKeys()
	}
	draw(ctx) {
		for (const t of this._players)
			t.draw(ctx)
	}
	getPlayerByIndex(t) {
		return this._players[t]
	}
	getPlayerById(t) {
		return this._playerLookup[t]
	}
	getPlayerCount() {
		return this._players.length
	}
	removePlayer(t) {
		let e = this._players
		  , i = this._playerLookup
		  , s = e.find(s => t == s._user.u_id && s.isGhost());
		e.splice(e.indexOf(s), 1);
		delete i[s.id],
		this.game.emit('playerRemove', s)
	}
	reset() {
		for (const t of this._players)
			t.reset(),
			t.isGhost() && (t._replayIterator = t.createReplayIterator())
	}
	clear() {
		this._players.splice(1);
		for (const t in this._playerLookup) {
			if (t === this.firstPlayer.id) continue;
			delete this._playerLookup[t];
		}
		this.scene.camera.focusIndex > 0 && this.scene.camera.unfocus()
	}
	_closePlayers() {
		for (const t of this._players)
			t.close()
	}
	close() {
		this._closePlayers(),
		this._players = null,
		this._playerLookup = null,
		this.firstPlayer = null,
		this.scene = null,
		this.game = null,
		this.settings = null
	}
}