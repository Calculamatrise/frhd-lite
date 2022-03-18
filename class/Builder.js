import Storage from "./Storage.js";

export default class {
    constructor(name, { defaults }) {
        if (typeof name !== "string" && typeof name !== "number") {
            throw new TypeError("Name must be of type string.");
        }

        // this.load();

        // let loc = location.pathname;
        // window.addEventListener("popstate", window.onclick = () => {
		// 	if (location.pathname != loc) {
		// 		loc = location.pathname;

        //         this.load();
                
		// 		this.childLoad();
		// 	}
		// });

        this.storage = Storage(name, defaults);
    }
    /**
     * 
     * @private
     */
    _events = new Map();
    get game() {
        if ((window || {}).hasOwnProperty("GameManager") && window.GameManager.hasOwnProperty("game") && typeof window.GameManager.game === "object") {
            return window.GameManager.game;
        }
        
        return null;
    }

    /**
     * 
     * @param {String} event 
     * @param {Function} listener 
     * @returns {Boolean}
     */
    on(event, listener = function() {}) {
        if (typeof event !== "string") {
            throw new Error("Event name must be of type String.");
        } else if (typeof listener !== "function") {
            throw new Error("Event listener must be of type Function.");
        }

        return !!this._events.set(event, listener.bind(this));
    }

    /**
     * 
     * @param {String} event 
     * @param  {...any} args 
     * @returns {Boolean} 
     */
    emit(event, ...args) {
        if (typeof event === "string" && this._events.has(event)) {
            let listener = this._events.get(event);
            if (typeof listener === "function") {
                return !!listener(...args);
            }
        }
    }

    load() {
        let wait = setInterval(() => {
            if (this.game) {
                // Rebinding the game loop.
                if (typeof this.update === "function") {
                    createjs.Ticker.removeAllEventListeners();
                    this.emit("ready");
                    createjs.Ticker.on("tick", (() => {
                        this.game.currentScene.update(),
                        this.update(),
                        this.game.tickCount++;
                    }).bind(this.game));
                }

                clearInterval(wait);
            }
        });
    }

    /**
     * 
     * @param {element} element 
     * @param {attributes} attributes 
     * @returns arbitrary
     */
    static createElement(element, attributes) {
        return Object.assign(document.createElement(element), attributes);
    }
}