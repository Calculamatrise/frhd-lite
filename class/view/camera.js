import s from "../math/cartesian.js";

export default class {
    constructor(t) {
        let e = t.settings;
        this.settings = e;
        this.scene = t;
        this.zoom = e.cameraStartZoom * t.game.pixelRatio;
        this.desiredZoom = e.cameraStartZoom * t.game.pixelRatio;
        this.zooming = !1;
        this.position = new s(0,0);
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
        var t = this.scene.playerManager.getPlayerCount();
        this.focusIndex = (this.focusIndex + 1) % t,
        this.focusOnPlayer()
    }
    focusOnPlayer() {
        var t = this.scene
            , e = t.playerManager
            , i = e.getPlayerCount();
        i <= this.focusIndex && (this.focusIndex = 0);
        var s = e.getPlayerByIndex(this.focusIndex);
        if (this.playerFocus !== s) {
            var n = this.playerFocus;
            if (this.playerFocus = s,
            t.vehicleTimer.setPlayer(s),
            n) {
                var r = s.getDistanceBetweenPlayers(n);
                r > 1500 && this.fastforward()
            } else
                this.fastforward()
        }
    }
    focusOnMainPlayer() {
        0 === this.focusIndex && this.playerFocus || (this.focusIndex = 0,
        this.focusOnPlayer())
    }
    update() {
        if (this.playerFocus) {
            var t = this.playerFocus.getActiveVehicle()
                , e = t.focalPoint
                , i = this.position
                , s = 3
                , n = e.pos.x - i.x
                , r = e.pos.y - i.y
                , h = Math.sqrt(Math.pow(n, 2) + Math.pow(r, 2));
            h > 1500 && (s = 1),
            i.x += (e.pos.x - i.x) / s,
            i.y += (e.pos.y - i.y) / s
        }
    }
    updateZoom() {
        var t = this.zoom
            , e = this.desiredZoom;
        t !== e && (this.scene.loading = !0,
        this._performZoom(),
        this.zoom === this.desiredZoom && this.zoomComplete())
    }
    zoomToPoint(t) {
        var e = (this.zoom,
        this.scene)
            , i = e.screen
            , s = this.position
            , n = this.zoomPoint
            , r = i.toReal(n.x, "x")
            , o = i.toReal(n.y, "y")
            , a = n.x / i.width
            , h = n.y / i.height
            , l = i.width / t
            , c = i.height / t;
        s.x = r - l * a + l / 2,
        s.y = o - c * h + c / 2
    }
    _performZoom() {
        var t = this.scene
            , e = (t.screen,
        this.position,
        this.zoom)
            , i = this.desiredZoom
            , s = i - e
            , n = s / 3;
        e += n,
        Math.abs(s) < .05 && (e = i),
        this.zoomPoint && this.zoomToPoint(e),
        this.zoom = e
    }
    zoomComplete() {
        this.scene.redraw(),
        this.zooming = !1,
        this.scene.loading = !1
    }
    setZoom(t, e) {
        var i = this.scene;
        this.desiredZoom = Math.round(t * i.game.pixelRatio * 10) / 10,
        this.zooming = !0,
        this.desiredZoom === this.zoom && (this.zooming = !1,
        this.scene.state.loading = !1),
        this.zoomPoint = !1,
        null === this.playerFocus && e && (this.zoomPoint = e),
        this.zoomPercentage = this.getZoomAsPercentage(),
        i.stateChanged()
    }
    resetZoom() {
        var t = this.settings.cameraStartZoom;
        this.setZoom(t)
    }
    getZoomAsPercentage() {
        var t = this.scene.settings
            , e = this.desiredZoom / this.scene.game.pixelRatio / t.cameraStartZoom * 100;
        return 0 | e
    }
    increaseZoom() {
        var t = this.scene.settings
            , e = t.cameraSensitivity
            , i = this.desiredZoom + 2 * e
            , s = this.scene.game.pixelRatio
            , n = t.cameraZoomMax
            , r = n * s;
        this.setZoom(i / s),
        this.desiredZoom > r && this.setZoom(n)
    }
    decreaseZoom() {
        var t = this.scene.settings
            , e = t.cameraSensitivity
            , i = this.desiredZoom - 2 * e
            , s = this.scene.game.pixelRatio
            , n = t.cameraZoomMin
            , r = n * s;
        this.setZoom(i / s),
        this.desiredZoom < r && this.setZoom(n)
    }
    unfocus() {
        this.playerFocus = null,
        this.scene.vehicleTimer.removePlayer()
    }
    fastforward() {
        if (this.playerFocus) {
            var t = this.playerFocus.getActiveVehicle()
                , e = t.focalPoint;
            this.position.x = e.pos.x,
            this.position.y = e.pos.y
        }
    }
    close() {
        this.zoom = null,
        this.scene = null,
        this.position = null,
        this.playerFocus = null
    }
}