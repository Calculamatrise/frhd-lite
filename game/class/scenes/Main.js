import Scene from "./Scene.js";
import b from "../controls/fullscreen.js";
import w from "../controls/pause.js";
import T from "../controls/settings.js";
import u from "../tools/cameratool.js";
import c from "../tools/toolhandler.js";
import r from "../utils/campaignscore.js";
import P from "../utils/formatnumber.js";
import o from "../utils/racetimes.js";
import Track from "../tracks/track.js";

async function digestMessage(message) {
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray
	.map((b) => b.toString(16).padStart(2, "0"))
	.join(""); // convert bytes to hex string
	return hashHex;
}

export default class extends Scene {
	races = [];
	playing = !1;
	ready = !1;
	preloading = !0;
	loading = !0;
	fullscreenControls = null;
	settingsControls = null;
	showSkip = !1;
	constructor(t) {
		super(t);
		this.raceTimes = new o(this);
		this.settings.isCampaign && (this.campaignScore = new r(this));
		this.loading = !1;
		this.setStartingVehicle(),
		this.state = this.setStateDefaults(),
		this.oldState = this.setStateDefaults(),
		this.createMainPlayer(),
		this.createControls(),
		this.registerTools(),
		this.setStartingVehicle(),
		this.restart(),
		this.initializeAnalytics()
	}
	getCanvasOffset() {
		var t = {
			height: 0,
			width: 0
		};
		return t
	}
	initializeAnalytics() {
		this.analytics = {
			deaths: 0
		}
	}
	createMainPlayer() {
		var t = this.playerManager
			, e = t.createPlayer(this, this.settings.user)
			, i = e.getGamepad();
		i.setKeyMap(this.settings.playHotkeys),
		i.recordKeys(this.settings.keysToRecord),
		i.onButtonDown = this.buttonDown.bind(this),
		i.listen(),
		this.playerManager.firstPlayer = e,
		this.playerManager.addPlayer(e)
	}
	createControls() {
		this.pauseControls = new w(this),
		this.settings.fullscreenAvailable && (this.fullscreenControls = new b(this)),
		this.settingsControls = new T(this)
	}
	createTrack() {
		this.track && this.track.close();
		let t = new Track(this)
		, e = this.getAvailableTrackCode();
		0 != e && (t.read(e),
		this.track = t,
		this.setTrackAllowedVehicles(),
		this.state.preloading = !1,
		this.loading = !1,
		this.restartTrack = !0,
		this.ready = !0),
		this.track = t
	}
	play() {
		this.state.playing || (this.state.playing = !0,
		this.hideControlPlanel())
	}
	buttonDown(t) {
		if (!this.state.showDialog) {
			var e = this.camera;
			switch (t) {
			case "change_camera":
				e.focusOnNextPlayer();
				break;
			case "pause":
				this.state.paused = !this.state.paused;
				break;
			case "settings":
				this.openDialog("settings");
				break;
			case "exit_fullscreen":
				this.exitFullscreen();
				break;
			case "change_vehicle":
				this.toggleVehicle();
				break;
			case "zoom_increase":
				e.increaseZoom();
				break;
			case "zoom_decrease":
				e.decreaseZoom();
				break;
			case "fullscreen":
				this.toggleFullscreen()
			}
		}
	}
	exitFullscreen() {
		this.settings.fullscreenAvailable && (this.settings.fullscreen = !1,
		this.state.fullscreen = !1,
		this.trackEvent("game-ui", "game-fullscreen-toggle", "game-out-fullscreen"))
	}
	toggleFullscreen() {
		if (this.settings.embedded) {
			var t = this.settings
				, e = t.basePlatformUrl + "/t/" + t.track.url;
			window.open(e)
		} else
			this.settings.fullscreenAvailable && (this.settings.fullscreen = !this.settings.fullscreen,
			this.state.fullscreen = !this.settings.fullscreen,
			this.trackEvent("game-ui", "game-fullscreen-toggle", this.settings.fullscreen ? "game-into-fullscreen" : "game-out-fullscreen"))
	}
	trackEvent(t, e, i) {
		var s = {
			category: t,
			action: e,
			label: i,
			value: 0,
			non_interaction: !0
		};
		Application.Helpers.GoogleAnalyticsHelper.track_event(s)
	}
	setTrackAllowedVehicles() {
		var t = this.track
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
	registerTools() {
		var t = new c(this);
		this.toolHandler = t,
		t.registerTool(u),
		t.setTool("Camera")
	}
	fixedUpdate() {
		this.ready ? (this.updateToolHandler(),
		this.mouse.update(),
		this.state.paused || this.state.showDialog || (this.playerManager.updateGamepads(),
		this.playerManager.checkKeys()),
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
		this.settings.mobile ? this.message.show("Press Any Button To Start", 1, "#333333") : this.message.show("Press Any Key To Start", 1, "#333333", "#FFFFFF"),
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
		var t = this.settings
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
		this.settings.isCampaign && !this.settings.mobile && this.settings.campaignData.can_skip && this.analytics && this.analytics.deaths > 5 && (this.state.showSkip = !0),
		this.stateshowControls !== t && this.settings.showHelpControls && (this.state.showControls = t)
	}
	resize() {
		this.pauseControls.resize(),
		this.settings.fullscreenAvailable && this.fullscreenControls.resize(),
		this.settingsControls.resize(),
		super.resize()
	}
	updateState() {
		null !== this.game.onStateChange && this.game.onStateChange(this.state)
	}
	setStateDefaults() {
		var t = {};
		return t.playing = !this.settings.waitForKeyPress,
		t.paused = !1,
		t.playerAlive = !0,
		t.inFocus = !0,
		t.preloading = !0,
		t.fullscreen = this.settings.fullscreen,
		t.showControls = !1,
		t.showSkip = !1,
		t.showDialog = !1,
		t.dialogOptions = !1,
		t
	}
	openDialog(t) {
		this.state.playing = !1,
		this.state.showDialog = t
	}
	command() {
		var t = Array.prototype.slice.call(arguments, 0)
			, e = t.shift();
		switch (e) {
		case "clear race":
			this.races = [],
			this.restartTrack = !0,
			this.raceTimes.clear();
			break;
		case "add race":
			var r = t[0]
				, o = t[1];
			this.addRaces(r),
			o && (this.state.dialogOptions = {
				races: this.races
			},
			this.command("dialog", "race_dialog"));
			break;
		case "change vehicle":
			var a = t[0];
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

		super.command(...arguments);
	}
	addRaces(t) {
		this.mergeRaces(t),
		this.sortRaces(),
		this.formatRaces(),
		this.addRaceTimes(),
		this.addPlayers(),
		this.restartTrack = !0
	}
	addRaceTimes() {
		var t = this.settings.raceColors
			, e = t.length
			, i = this.races
			, s = this.raceTimes;
		s.clear();
		for (var n in i) {
			var r = i[n];
			r.user.color = t[n % e],
			s.addRace(r, n)
		}
	}
	addPlayers() {
		var t = this.races
			, e = this.playerManager;
		e.clear();
		var i = this.settings.keysToRecord;
		for (var s in t) {
			var n = t[s]
				, r = n.user
				, o = n.race
				, a = o.code;
			"string" == typeof a && (a = JSON.parse(a));
			var h = e.createPlayer(this, r);
			h.setBaseVehicle(o.vehicle),
			h.setAsGhost();
			var l = h.getGamepad();
			l.loadPlayback(a, i),
			e.addPlayer(h)
		}
	}
	formatRaces() {
		var t = this.races;
		for (var e in t) {
			var i = t[e].race
				, s = i.code;
			if ("string" == typeof s) {
				s = JSON.parse(s);
				for (var n in s) {
					s[n] instanceof Array && (s[n] = s[n].reduce((o, r) => (o[r] = ~~o[r] + 1, o), {}))
				}
				i.code = s
			}
		}
	}
	removeDuplicateRaces() {
		this.races = this.races.filter((race, index, races) => index === races.findIndex(dup => this.uniqesByUserIdIterator(dup) == this.uniqesByUserIdIterator(race)))
	}
	uniqesByUserIdIterator(t) {
		var e = t.user;
		return e.u_id
	}
	sortRaces() {
		this.races = this.races.sort((a, b) => this.sortByRunTicksIterator(a) - this.sortByRunTicksIterator(b))
	}
	mergeRaces(t) {
		var e = this.races;
		t && t.forEach(t => {
			var i = e.find(e => {
				return e.user.u_id === t.user.u_id
			});
			i ? Object.assign(i, t) : e.push(t)
		})
	}
	sortByRunTicksIterator(t) {
		var e = this.settings
			, i = parseInt(t.race.run_ticks)
			, s = P(i / e.drawFPS * 1e3);
		return t.runTime = s,
		i
	}
	verifyComplete() {
		var t = this.playerManager.firstPlayer
			, e = t._powerupsConsumed.targets
			, i = this.track.targets
			, s = !0;
		for (var n in i) {
			var r = i[n]
				, o = r.id;
			-1 === e.indexOf(o) && (s = !1)
		}
		return s
	}
	async trackComplete() {
		if (this.verifyComplete()) {
			this.sound.play("victory_sound");
			var t = this.playerManager;
			t.mutePlayers();
			var e = t.firstPlayer
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
			var u = this.races
				, p = u.length
				, d = [];
			if (p > 0) {
				for (var f = 0; p > f; f++)
					d.push(u[f].user.u_id);
				h.races = d
			}
			n.isCampaign && (h.is_campaign = !0),
			this.state.dialogOptions = {
				postData: h,
				analytics: this.analytics
			},
			navigator.onLine || (localStorage.setItem('offline_races', Object.assign(Object.assign({}, JSON.parse(localStorage.getItem('offline_races'))), {
				[this.settings.track.id]: this.state.dialogOptions
			})), alert('Your connection is offline! Free Rider Lite saved your ghost, and it will be published when your connection is back online!')),
			n.isCampaign ? this.command("dialog", "campaign_complete") : this.command("dialog", "track_complete"),
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