import Vector from "../math/cartesian.js";

export default class {
    constructor(t) {
        this.settings = t.settings;
        this.scene = t;
        this.zoom = t.settings.cameraStartZoom * t.game.pixelRatio;
        this.desiredZoom = t.settings.cameraStartZoom * t.game.pixelRatio;
        this.zooming = !1;
        this.position = new Vector(0, 0);
        this.zoomPercentage = this.getZoomAsPercentage();
        this.zoomPoint = !1;
    }
    settings = null
    scene = null
    zoom = 1
    position = null
    desiredZoom = 1
    zoomPercentage = 0
    focusIndex = 0
    playerFocus = null
    focusOnNextPlayer() {
        this.focusIndex = (this.focusIndex + 1) % this.scene.playerManager.getPlayerCount(),
        this.focusOnPlayer()
    }
    focusOnPlayer() {
        this.scene.playerManager.getPlayerCount() <= this.focusIndex && (this.focusIndex = 0);
        let s = this.scene.playerManager.getPlayerByIndex(this.focusIndex);
        if (this.playerFocus !== s) {
            if (this.playerFocus = s, this.scene.vehicleTimer.setPlayer(s), this.playerFocus) {
                s.getDistanceBetweenPlayers(this.playerFocus) > 1500 && this.fastforward()
            } else
                this.fastforward()
        }
    }
    focusOnMainPlayer() {
        this.focusIndex === 0 && this.playerFocus || (this.focusIndex = 0, this.focusOnPlayer())
    }
    update() {
        if (this.playerFocus) {
            let t = this.playerFocus.getActiveVehicle(), s = 3;
            Math.sqrt(Math.pow(t.focalPoint.pos.x - this.position.x, 2) + Math.pow(t.focalPoint.pos.y - this.position.y, 2)) > 1500 && (s = 1),
            this.position.x += (t.focalPoint.pos.x - this.position.x) / s,
            this.position.y += (t.focalPoint.pos.y - this.position.y) / s
        }
    }
    updateZoom() {
        this.desiredZoom !== this.zoom && (this.scene.loading = !0, this._performZoom(), this.zoom === this.desiredZoom && this.zoomComplete())
    }
    zoomToPoint(t) {
        this.position.x = this.scene.screen.toReal(this.zoomPoint.x, "x") - this.scene.screen.width / t * this.zoomPoint.x / this.scene.screen.width + this.scene.screen.width / t / 2,
        this.position.y = this.scene.screen.toReal(this.zoomPoint.y, "y") - this.scene.screen.height / t * this.zoomPoint.y / this.scene.screen.height + this.scene.screen.height / t / 2
    }
    _performZoom() {
        let e = this.zoom + (this.desiredZoom - this.zoom) / 3;
        Math.abs(this.desiredZoom - this.zoom) < .05 && (e = this.desiredZoom),
        this.zoomPoint && this.zoomToPoint(e),
        this.zoom = e;
    }
    zoomComplete() {
        this.scene.redraw(),
        this.zooming = !1,
        this.scene.loading = !1
    }
    setZoom(t, e) {
        this.desiredZoom = Math.round(t * this.scene.game.pixelRatio * 10) / 10,
        this.zooming = !0,
        this.desiredZoom === this.zoom && (this.zooming = !1, this.scene.state.loading = !1),
        this.zoomPoint = !1,
        null === this.playerFocus && e && (this.zoomPoint = e),
        this.zoomPercentage = this.getZoomAsPercentage(),
        this.scene.stateChanged()
    }
    resetZoom() {
        this.setZoom(this.settings.cameraStartZoom)
    }
    getZoomAsPercentage() {
        return this.desiredZoom / this.scene.game.pixelRatio / this.scene.settings.cameraStartZoom * 100 | 0
    }
    increaseZoom() {
        this.setZoom(this.desiredZoom + 2 * this.scene.settings.cameraSensitivity / this.scene.game.pixelRatio),
        this.desiredZoom > this.scene.settings.cameraZoomMax * this.scene.game.pixelRatio && this.setZoom(this.scene.settings.cameraZoomMax)
    }
    decreaseZoom() {
        this.setZoom(this.desiredZoom - 2 * this.scene.settings.cameraSensitivity / this.scene.game.pixelRatio),
        this.desiredZoom < this.scene.settings.cameraZoomMin * this.scene.game.pixelRatio && this.setZoom(this.scene.settings.cameraZoomMin)
    }
    unfocus() {
        this.playerFocus = null,
        this.scene.vehicleTimer.removePlayer()
    }
    fastforward() {
        if (this.playerFocus) {
            let t = this.playerFocus.getActiveVehicle();
            this.position.x = t.focalPoint.pos.x,
            this.position.y = t.focalPoint.pos.y
        }
    }
    close() {
        this.zoom = null,
        this.scene = null,
        this.position = null,
        this.playerFocus = null
    }
}