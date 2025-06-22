import Vector from "../math/cartesian.js";

export default class {
	desiredZoom = 1;
	focusIndex = 0;
	playerFocus = null;
	position = new Vector;
	settings = null;
	zoom = 1;
	zooming = false;
	zoomPercentage = 0;
	zoomPoint = false;
	constructor(t) {
		Object.defineProperty(this, 'scene', { value: t, writable: true });
		this.settings = t.settings;
		this.desiredZoom = t.settings.cameraStartZoom * t.game.pixelRatio;
		this.zoom = this.desiredZoom;
		this.zoomPercentage = this.getZoomAsPercentage()
	}
	focusOnNextPlayer() {
		this.focusIndex = (this.focusIndex + 1) % this.scene.playerManager.getPlayerCount(),
		this.focusOnPlayer()
	}
	focusOnPlayer() {
		this.scene.playerManager.getPlayerCount() <= this.focusIndex && (this.focusIndex = 0);
		let s = this.scene.playerManager.getPlayerByIndex(this.focusIndex);
		if (this.playerFocus !== s) {
			this.focusIndex === 0 && (this.scene.playerManager._players.filter(player => player.isGhost()).forEach(player => player._replayIterator.next(this.scene.ticks)),
			this.focusIndex = 0);
			if (this.playerFocus = s, this.scene.vehicleTimer.setPlayer(s), this.playerFocus) {
				s.getDistanceBetweenPlayers(this.playerFocus) > 1500 && this.fastforward();
			} else
				this.fastforward();
			this.scene.game.emit('cameraFocus', s)
		}
	}
	focusOnMainPlayer() {
		this.focusIndex === 0 && this.playerFocus || (this.focusIndex = 0, this.focusOnPlayer())
	}
	// update(delta) {
	// 	if (!this.playerFocus) return;
	// 	const { focalPoint: { displayPos: target }} = this.playerFocus.getActiveVehicle()
	// 		, diff = target.sub(this.position)
	// 		, distance = diff.len()
	// 		, factor = distance > 1500 ? 1 : 1 / 3;
	// 		// , factor = distance > 1500 ? delta : delta / 3;
	// 	this.position.inc(diff.factor(factor))
	// 	// this.position.lerpTo(diff, delta)
	// 	// let speed = 3;
	// 	// let smoothing = 1 - Math.exp(-speed * delta);
	// 	// let smoothing = 1 - Math.pow(.01, delta); // 0.01 → speed constant
	// 	// this.position.lerpTo(target, smoothing)
	// }
	update() {
		if (!this.playerFocus) return;
		const { focalPoint } = this.playerFocus.getActiveVehicle()
			, { displayPos: target } = focalPoint
			, diff = target.sub(this.position)
			, distance = diff.len()
			, speed = 3
			, smoothing = 1 - Math.exp(-speed * (distance / 500));
		this.position.lerpTo(target, smoothing)
	}
	updateZoom(delta) {
		this.desiredZoom !== this.zoom && (this.scene.loading = !0, this._performZoom(delta), this.zoom === this.desiredZoom && this.zoomComplete())
	}
	zoomToPoint(t) {
		this.position.x = this.scene.screen.toReal(this.zoomPoint.x, 'x') - this.scene.screen.width / t * this.zoomPoint.x / this.scene.screen.width + this.scene.screen.width / t / 2,
		this.position.y = this.scene.screen.toReal(this.zoomPoint.y, 'y') - this.scene.screen.height / t * this.zoomPoint.y / this.scene.screen.height + this.scene.screen.height / t / 2
	}
	_performZoom(delta) {
		let speed = 3
		  , e = this.zoom + (this.desiredZoom - this.zoom) / (speed / delta);
		Math.abs(this.desiredZoom - this.zoom) < .05 && (e = this.desiredZoom),
		this.zoomPoint && this.zoomToPoint(e),
		this.zoom = e
	}
	zoomComplete() {
		this.scene.redraw(),
		this.zooming = !1,
		this.scene.loading = !1
	}
	setZoom(t, e) {
		this.desiredZoom = Math.round(t * window.devicePixelRatio * 10) / 10,
		this.zooming = !0,
		this.desiredZoom === this.zoom && (this.zooming = !1, this.scene.state.loading = !1),
		this.zoomPoint = !1,
		null === this.playerFocus && e && (this.zoomPoint = e),
		this.zoomPercentage = this.getZoomAsPercentage(),
		this.scene.updateState()
	}
	resetZoom() {
		this.setZoom(this.settings.cameraStartZoom)
	}
	getZoomAsPercentage() {
		return this.desiredZoom / window.devicePixelRatio / this.scene.settings.cameraStartZoom * 100 | 0
	}
	increaseZoom() {
		this.setZoom((this.desiredZoom + 2 * this.scene.settings.cameraSensitivity) / window.devicePixelRatio),
		this.desiredZoom > this.scene.settings.cameraZoomMax * window.devicePixelRatio && this.setZoom(this.scene.settings.cameraZoomMax)
	}
	decreaseZoom() {
		this.setZoom((this.desiredZoom - 2 * this.scene.settings.cameraSensitivity) / window.devicePixelRatio),
		this.desiredZoom < this.scene.settings.cameraZoomMin * window.devicePixelRatio && this.setZoom(this.scene.settings.cameraZoomMin)
	}
	unfocus() {
		this.focusIndex = 0,
		this.playerFocus = null,
		this.scene.vehicleTimer.removePlayer()
	}
	fastforward() {
		if (!this.playerFocus) return;
		const { focalPoint: { displayPos: t }} = this.playerFocus.getActiveVehicle();
		this.position.equ(t)
	}
	close() {
		this.zoom = null,
		this.scene = null,
		this.position = null,
		this.playerFocus = null
	}
}