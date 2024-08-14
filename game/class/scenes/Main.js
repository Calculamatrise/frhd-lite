import BaseScene from "./BaseScene.js";
import b from "../controls/fullscreen.js";
import w from "../controls/pause.js";
import T from "../controls/settings.js";
import r from "../utils/campaignscore.js";
import P from "../utils/formatnumber.js";
import o from "../utils/racetimes.js";

async function digestMessage(message) {
	const msgUint8 = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
	.map((b) => b.toString(16).padStart(2, '0'))
	.join('');
	return hashHex
}

export default class extends BaseScene {
	races = [];
	playing = false;
	ready = false;
	loading = false;
	fullscreenControls = null;
	settingsControls = null;
	constructor(t) {
		super(t);
		this.raceTimes = new o(this);
		this.settings.isCampaign && (this.campaignScore = new r(this));
		this.setStartingVehicle(),
		this.state = this.setStateDefaults(),
		this.oldState = this.setStateDefaults(),
		this.createMainPlayer(),
		this.createControls(),
		this.registerTools(),
		this.setStartingVehicle(),
		this.restart(),
		t.settings.analyticsEnabled !== false && this.initAnalytics()
	}
	getCanvasOffset() {
		return {
			height: 0,
			width: 0
		}
	}
	createMainPlayer() {
		let t = super.createMainPlayer();
		t.setKeyMap(this.settings.playHotkeys),
		t.recordKeys(this.settings.keysToRecord)
	}
	createControls() {
		this.pauseControls = new w(this),
		this.settings.fullscreenAvailable && (this.fullscreenControls = new b(this)),
		this.settingsControls = new T(this)
	}
	createTrack() {
		let t = super.createTrack()
		  , e = this.getAvailableTrackCode();
		0 != e && (t.read(e),
		this.setTrackAllowedVehicles(),
		this.state.preloading = !1,
		this.loading = !1,
		this.restartTrack = !0,
		this.ready = !0)
	}
	play() {
		this.state.playing || (this.state.playing = !0,
		this.hideControlPlanel())
	}
	buttonDown(t) {
		this.state.showDialog || super.buttonDown(t)
	}
	exitFullscreen() {
		this.settings.fullscreenAvailable && (this.settings.fullscreen = !1,
		this.state.fullscreen = !1,
		this.trackEvent("game-ui", "game-fullscreen-toggle", "game-out-fullscreen"))
	}
	toggleFullscreen() {
		let t = super.toggleFullscreen();
		t && this.trackEvent("game-ui", "game-fullscreen-toggle", this.settings.fullscreen ? "game-into-fullscreen" : "game-out-fullscreen")
	}
	trackEvent(t, e, i) {
		Application.Helpers.GoogleAnalyticsHelper.track_event({
			category: t,
			action: e,
			label: i,
			value: 0,
			non_interaction: !0
		})
	}
	setTrackAllowedVehicles() {
		let t = this.track
		  , e = this.settings.track;
		e && (t.allowedVehicles = e.vehicles)
	}
	interactWithControls() {
		super.interactWithControls(),
		this.settings.fullscreenAvailable && this.fullscreenControls.click()
		this.settingsControls.click()
	}
	updateControls() {
		super.updateControls(),
		this.settings.fullscreenAvailable && this.fullscreenControls.update()
		this.settingsControls.update()
	}
	redrawControls() {
		super.redrawControls(),
		this.settings.fullscreenAvailable && this.fullscreenControls.redraw(),
		this.settingsControls.redraw()
	}
	registerTools() {
		let t = super.registerTools();
		t.setTool("Camera")
	}
	fixedUpdate() {
		let t, e;
		this.ready ? (this.updateToolHandler(),
		this.mouse.update(),
		this.state.paused || this.state.showDialog || (this.playerManager.updateGamepads(),
		this.playerManager.checkKeys()),
		this.camera.focusIndex > 0 && (t =  this.playerManager.firstPlayer._gamepad.downButtons,
		t = ~~t['right'] - ~~t['left']) && (e = this.playerManager.getPlayerByIndex(this.camera.focusIndex)) && e.isGhost() && e._gamepad.playbackTicks > 0 && (e._replayIterator.next((e._gamepad.playbackTicks ?? this.ticks) + 5 * t), /* add option for amount of ticks to skip */
		this.state.playing = false),
		super.fixedUpdate(),
		this.updateScore()) : this.importCode && this.createTrack()
	}
	draw(ctx) {
		super.draw(...arguments),
		this.settings.fullscreenAvailable && this.fullscreenControls.draw(ctx),
		this.settingsControls.draw(ctx),
		this.campaignScore && this.campaignScore.draw(ctx),
		this.raceTimes.draw(ctx)
	}
	isStateDirty() {
		let e = this.state;
		e.fullscreen != GameSettings.fullscreen && (e.fullscreen = GameSettings.fullscreen);
		return super.isStateDirty()
	}
	updateScore() {
		this.campaignScore && this.campaignScore.update(),
		this.raceTimes.update()
	}
	restart() {
		this.message.show("Press Any Key To Start", 1, "#333333", "#FFFFFF"),
		this.track.resetPowerups(),
		this.restartTrack = !1,
		this.state.paused = !1,
		this.state.playing = !this.settings.waitForKeyPress,
		this.ticks = 0,
		this.playerManager.reset(),
		this.playerManager.getPlayerCount() > 0 && (this.camera.focusIndex = 1),
		this.camera.focusOnPlayer(),
		this.camera.fastforward(),
		this.showControlPlanel("main")
	}
	setStartingVehicle() {
		let t = this.settings
		  , e = t.startVehicle;
		t.track && (e = t.track.vehicle),
		this.vehicle = e
	}
	updatePlayers() {
		this.playerManager.update()
	}
	hideControlPlanel() {
		this.state.showSkip && (this.state.showSkip = !1),
		this.state.showControls !== !1 && (this.state.showControls = !1)
	}
	showControlPlanel(t) {
		this.settings.isCampaign && this.settings.campaignData.can_skip && this.analytics && this.analytics.deaths > 5 && (this.state.showSkip = !0),
		this.stateshowControls !== t && this.settings.showHelpControls && (this.state.showControls = t)
	}
	resize() {
		this.pauseControls.resize(),
		this.settings.fullscreenAvailable && this.fullscreenControls.resize(),
		this.settingsControls.resize(),
		super.resize()
	}
	setStateDefaults() {
		let t = super.setStateDefaults();
		return t.paused = !1,
		t.playerAlive = !0,
		t.showControls = !1,
		t.showSkip = !1,
		t
	}
	command(t, ...e) {
		super.command(...arguments);
		switch (t) {
		case "clear race":
			this.races.splice(0),
			this.restartTrack = !0,
			this.raceTimes.clear();
			break;
		case "add race":
			let r = e[0]
			  , o = e[1];
			this.addRaces(r),
			o && (this.state.dialogOptions = {
				races: this.races
			},
			this.command("dialog", "race_dialog"));
			break;
		case "change vehicle":
			let a = e[0];
			this.selectVehicle(a);
			break;
		case "restart":
			this.command("dialog", !1),
			this.restartTrack = !0;
			break;
		case "resume":
			this.state.paused = !1;
			break;
		case "fullscreen":
			this.toggleFullscreen();
			break;
		case "exit_fullscreen":
			this.exitFullscreen()
		}
	}
	addRaces(t) {
		this.mergeRaces(t),
		this.sortRaces(),
		this.formatRaces(),
		this.game.emit('trackChallengeUpdate', this.races),
		this.addRaceTimes(),
		this.addPlayers(),
		this.restartTrack = !0
	}
	addRaceTimes() {
		let t = this.settings.raceColors
		  , e = t.length
		  , i = this.races
		  , s = this.raceTimes;
		s.clear();
		for (let n in i) {
			let r = i[n];
			r.user.color = t[n % e],
			s.addRace(r, n)
		}
	}
	addPlayers() {
		let t = this.playerManager;
		t.clear();
		let e = this.settings.keysToRecord;
		for (let { user, race: i } of this.races) {
			let s = i.code;
			"string" == typeof s && (s = JSON.parse(s));
			let h = t.createPlayer(this, user);
			h.setBaseVehicle(i.vehicle),
			h.setAsGhost();
			let l = h.getGamepad();
			l.loadPlayback(s, e),
			t.addPlayer(h)
		}
	}
	clearRaces() {
		this.races.splice(0),
		this.game.emit('trackChallengeUpdate', this.races),
		this.raceTimes.clear(),
		this.playerManager.clear()
	}
	formatRaces(t) {
		t ||= this.races;
		for (let { race: e } of t.filter(t => 'string' == typeof t.race.code)) {
			let i = JSON.parse(e.code);
			i.hasOwnProperty('bike_options') && i.bike_options instanceof Array && (i.bike_options = new Map(i.bike_options.map(s => s.split(/\s*:\s*/))));
			for (let s of Object.keys(Object.fromEntries(Object.entries(i).filter(([, value]) => value instanceof Array))))
				i[s] = i[s].reduce((s, n) => (s[n] = ~~s[n] + 1, s), {});
			e.code = i
		}
		return t
	}
	removeDuplicateRaces() {
		this.races = this.races.filter((race, index, races) => index === races.findIndex(dup => this.uniqesByUserIdIterator(dup) == this.uniqesByUserIdIterator(race)))
	}
	removeRaces(t) {
		t = Array.from(t).map(e => parseInt(e));
		let e = this.races
		  , i = [];
		for (let i of e.filter(({ user: i }) => t.includes(i.u_id)))
			i = e.splice(e.indexOf(i), 1),
			this.playerManager.removePlayer(t),
			this.game.emit('trackRaceDelete', i[0]);
		this.game.emit('trackRacesDelete', i);
		this.game.emit('trackChallengeUpdate', this.races),
		this.addRaceTimes(),
		this.camera.focusOnMainPlayer()
	}
	uniqesByUserIdIterator(t) {
		let e = t.user;
		return String(e.u_id)
	}
	sortRaces() {
		this.races.length > 1 ? this.races.sort((a, b) => this.sortByRunTicksIterator(a) - this.sortByRunTicksIterator(b)) : this.sortByRunTicksIterator(this.races[0]),
		this.game.emit('trackRacesSort', this.races)
	}
	mergeRaces(t) {
		let e = this.races;
		t && t.forEach(i => {
			let s = e.find(n => this.uniqesByUserIdIterator(n) == this.uniqesByUserIdIterator(i));
			s ? (s.runTime = null, this.sortByRunTicksIterator(Object.assign(s, i))) : (e.push(i),
			this.game.emit('trackRaceCreate', i))
		})
	}
	redraw() {
		super.redraw(),
		this.raceTimes.redraw()
	}
	sortByRunTicksIterator(t) {
		let e = parseInt(t.race.run_ticks);
		return t.runTime ||= P(e / this.settings.drawFPS * 1e3),
		e
	}
	verifyComplete() {
		let t = this.playerManager.firstPlayer
		  , e = t._powerupsConsumed.targets
		  , i = this.track.targets;
		return i.findIndex(n => -1 === e.indexOf(n.id)) === -1
	}
	async trackComplete() {
		if (this.verifyComplete()) {
			this.sound.play("victory_sound");
			let t = this.playerManager;
			t.mutePlayers();
			let e = t.firstPlayer
			  , i = e.getGamepad()
			  , s = i.getReplayString()
			  , n = this.settings
			  , r = this.ticks
			  , o = P(r / n.drawFPS * 1e3)
			  , a = $("#track-data").data("t_id")
			  , h = {
					t_id: a,
					u_id: n.user.u_id,
					code: s,
					vehicle: e._baseVehicleType,
					run_ticks: r,
					fps: 25,
					time: o
				};
			h.sig = await digestMessage(h.t_id + "|" + h.u_id + "|" + h.code + "|" + h.run_ticks + "|" + h.vehicle + "|" + h.fps + "|erxrHHcksIHHksktt8933XhwlstTekz");
			let u = this.races;
			u.length > 0 && (h.races = u.map(({ user }) => user.u_id)),
			n.isCampaign && (h.is_campaign = !0);
			let q = {
				postData: h,
				analytics: this.analytics
			};
			this.state.dialogOptions = Object.assign({}, q)
			if (!navigator.onLine) {
				this.state.dialogOptions.postData = {},
				this.game.emit('trackRaceUploadError', Object.defineProperty(new Error("Failed to upload race"), 'data', {
					value: Object.assign({}, q)
				}));
			} else
				this.settings.bestGhostEnabled && -1 === this.races.findIndex(t => n.user.u_id == this.uniqesByUserIdIterator(t) && t.race.run_ticks <= r) && this.addRaces([{
					race: structuredClone(h),
					user: n.user
				}]),
				this.game.emit('trackRaceUpload', q);
			this.command("dialog", (n.isCampaign ? "campaign" : "track") + '_complete'),
			i.reset(!0),
			this.listen()
		}
	}
	close() {
		this.fullscreenControls = null,
		this.settingsControls = null,
		this.raceTimes = null,
		this.score = null,
		this.campaignScore = null,
		super.close()
	}
}