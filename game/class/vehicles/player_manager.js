import s from "./player.js";

export default class {
	_players = [];
	_playerLookup = {};
	firstPlayer = null;
	constructor(t) {
		this.scene = t;
		this.game = t.game;
		this.settings = t.settings;
		Object.defineProperties(this, {
			scene: { enumerable: false },
			game: { enumerable: false }
		});
	}
	fixedUpdate() {
		if (!this.scene.camera.focusIndex)
			for (let t = this._players.filter(player => !player.complete && !player.isGhost()), e = t.length, i = 0; e > i; i++)
				t[i].fixedUpdate()

		for (let t = this._players.filter(player => !player.complete && player.isGhost()), e = t.length, i = 0; e > i; i++)
			t[i]._replayIterator.next()
	}
	mutePlayers() {
		for (let t = this._players, e = t.length, i = 0; e > i; i++) {
			let s = t[i].getActiveVehicle();
			s.stopSounds()
		}
	}
	updateGamepads() {
		for (let t = this._players.filter(player => !player.isGhost()), e = t.length, i = 0; e > i; i++)
			t[i]._gamepad.update()
	}
	createPlayer(t, e) {
		return new s(this.scene,e)
	}
	addPlayer(t) {
		this._players.push(t),
		this._playerLookup[t.id] = t
	}
	checkKeys() {
		for (let t = this._players.filter(player => !player.isGhost()), e = t.length, i = 0; e > i; i++)
			t[i].checkKeys()
	}
	draw(ctx) {
		for (let t of this._players)
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
	reset() {
		for (let t = this._players, e = t.length, i = 0; e > i; i++)
			t[i].reset()

		for (let t = this._players.filter(player => player.isGhost()), e = t.length, i = 0; e > i; i++)
			t[i]._replayIterator = t[i].createReplayIterator();
	}
	clear() {
		this._players.splice(1),
		this._playerLookup = {},
		this._playerLookup[this.firstPlayer.id] = this.firstPlayer
	}
	_closePlayers() {
		for (let t = this._players, e = t.length, i = 0; e > i; i++)
			t[i].close()
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