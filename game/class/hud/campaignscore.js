export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
.campaign-score {
	color: var(--color, currentColor);
	display: flex;
	font-family: 'helsinki';
	font-size: 12px;
	gap: .5em;
	left: 6px;
	line-height: 1em;
	max-height: 40%;
	opacity: .975;
	overflow: hidden;
	pointer-events: none;
	position: absolute;
	top: 36px;
	width: fit-content;
}

.campaign-icons {
	height: 1.5em;
	width: 1.5em;
}

.campaign-icons.bronze { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='%23ffffff' stroke='%236a5546' stroke-width='1.5'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%23a28b7a' stroke='%23a28b7a' stroke-width='.25'/%3E%3Cpath d='M 4 12 a 1 1 0 0 1 16 0 Z' fill='%23c0ab9b'/%3E%3Cpath d='M12 6L13.854 10.146L18.404 10.545L14.909 13.454L16.18 17.955L12 15.5L7.82 17.955L9.091 13.454L5.596 10.545L10.146 10.146Z' fill='%236a5546'/%3E%3C/svg%3E") }
.campaign-icons.silver { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='%23ffffff' stroke='%2389939b' stroke-width='1.5'/%3E%3Ccircle r='8' cy='12' cx='12' fill='%23c3c9ce' stroke='%23c3c9ce' stroke-width='.25'/%3E%3Cpath d='M 4 12 a 1 1 0 0 1 16 0 Z' fill='%23dce1e5'/%3E%3Cpath d='M12 6L13.854 10.146L18.404 10.545L14.909 13.454L16.18 17.955L12 15.5L7.82 17.955L9.091 13.454L5.596 10.545L10.146 10.146Z' fill='%2389939b'/%3E%3C/svg%3E") }
.campaign-icons.gold { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='%23ffffff' stroke='%23948247' stroke-width='1.5'/%3E%3Ccircle cx='12' cy='12' r='8' fill='%23cab369' stroke='%23cab369' stroke-width='.25'/%3E%3Cpath d='M 4 12 a 1 1 0 0 1 16 0 Z' fill='%23e1ce90'/%3E%3Cpath d='M12 6L13.854 10.146L18.404 10.545L14.909 13.454L16.18 17.955L12 15.5L7.82 17.955L9.091 13.454L5.596 10.545L10.146 10.146Z' fill='%23948247'/%3E%3C/svg%3E") }

.campaign-score > :not(.achieved) { opacity: .4 }

.campaign-score .best.time { color: hsl(0 0% 50%) }
.campaign-score > .race {
	display: flex;
	font-size: 12px;
	gap: .3em;
}

.campaign-score > .race:not(.focused) { opacity: .3 }
.campaign-score > .race > .user {
	aspect-ratio: 1;
	border-radius: 50%;
	font-size: 10px;
	height: .8em;
	line-height: 1;
	padding: .3em;
	text-align: center;
	width: .8em;
}

.campaign-score > .race > .target-row { margin-left: .3em }
.campaign-score > .race .targets {
	font-size: .9em;
	margin-left: .3em;
	vertical-align: top;
}
.campaign-score > .race .sprite { height: 1em }
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	constructor(t) {
		Object.defineProperty(this, 'gui', { value: t.game.gui, writable: true });
		this.init(t);
		this.settings = t.settings;
		this.updateState()
	}

	init(t) {
		if (this.element) return console.warn('[Game] Campaign score already initialized!');

		const styleSheet = this.constructor.getStyleSheet();
		this.gui.insertStyleSheet(styleSheet);

		const container = this.gui.constructor.createElement('div.campaign-score');

		let e = t.settings.campaignData.goals;

		const bronzeRow = this.gui.constructor.createElement('div.row');
		const bronzeIcon = this.gui.constructor.createElement('span.campaign-icons.bronze');
		bronzeRow.appendChild(bronzeIcon);
		const bronzeTime = this.gui.constructor.createElement('span');
		bronzeTime.textContent = e.third;
		bronzeRow.appendChild(bronzeTime);
		container.appendChild(bronzeRow);
		this.bronze = bronzeRow;

		const silverRow = this.gui.constructor.createElement('div.row');
		const silverIcon = this.gui.constructor.createElement('span.campaign-icons.silver');
		silverRow.appendChild(silverIcon);
		const silverTime = this.gui.constructor.createElement('span');
		silverTime.textContent = e.second;
		silverRow.appendChild(silverTime);
		container.appendChild(silverRow);
		this.silver = silverRow;

		const goldRow = this.gui.constructor.createElement('div.row');
		const goldIcon = this.gui.constructor.createElement('span.campaign-icons.gold');
		goldRow.appendChild(goldIcon);
		const goldTime = this.gui.constructor.createElement('span');
		goldTime.textContent = e.first;
		goldRow.appendChild(goldTime);
		container.appendChild(goldRow);
		this.gold = goldRow;

		this.element = container;
		this.gui.appendChild(this.element);

		t.game.on('trackComplete', this.updateState.bind(this))
	}

	updateState() {
		switch (this.settings.campaignData.user.has_goal) {
		case 1:
		case "first":
			this.gold?.classList.add('achieved');
		case 2:
		case "second":
			this.silver?.classList.add('achieved');
		case 3:
		case "third":
			this.bronze?.classList.add('achieved');
		}
	}
}