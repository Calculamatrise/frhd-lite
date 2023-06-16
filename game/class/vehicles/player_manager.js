import s from "./player.js";

export default class {
    constructor(t) {
        this.scene = t;
        this.game = t.game;
        this.settings = t.settings;
        this.firstPlayer = null;
        this._players = [];
        this._playerLookup = {};
    }
    update() {
        for (var t = this._players, e = t.length, i = 0; e > i; i++)
            t[i].update()
    }
    mutePlayers() {
        for (var t = this._players, e = t.length, i = 0; e > i; i++) {
            var s = t[i].getActiveVehicle();
            s.stopSounds()
        }
    }
    updateGamepads() {
        for (var t = this._players, e = t.length, i = 0; e > i; i++)
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
        for (var t = this._players, e = t.length, i = 0; e > i; i++)
            t[i].checkKeys()
    }
    draw() {
        for (var t = this._players, e = t.length, i = 0; e > i; i++)
            t[i].draw()
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
        for (var t = this._players, e = t.length, i = 0; e > i; i++)
            t[i].reset()
    }
    clear() {
        this._players = [],
        this._playerLookup = {},
        this._players.push(this.firstPlayer),
        this._playerLookup[this.firstPlayer.id] = this.firstPlayer
    }
    _closePlayers() {
        for (var t = this._players, e = t.length, i = 0; e > i; i++)
            t[i].close()
    }
    close() {
        this._closePlayers(),
        this._players = null,
        this.firstPlayer = null,
        this._playerLookup = null,
        this.scene = null,
        this.game = null,
        this.settings = null
    }
}