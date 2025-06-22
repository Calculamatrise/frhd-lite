{
	class ThirdPartyStyleManager extends EventTarget {
		#globalStyle = document.head.appendChild(Object.assign(document.createElement('style'), { id: 'third-party-style-manager.global-style' }));
		app = null;
		colorScheme = null;
		styleSheets = new WeakMap();
		globalStyle = this.createProxyStyle(this.#globalStyle);
		preferredColorScheme = null;
		constructor(parent = null) {
			super();
			Object.defineProperty(this, 'app', {
				configurable: false,
				enumerable: false,
				value: parent
			});
			// styles, styleManager, thirdPartyStyles, thirdPartyStyleManager
			Object.defineProperty(this, 'preferredColorScheme', {
				value: this,
				writable: false
			});
			Object.defineProperty(parent, 'styles', {
				enumerable: true,
				value: this,
				writable: true
			});
			const colorScheme = matchMedia('(prefers-color-scheme: dark)');
			const updatePreferredColorScheme = mediaQuery => {
				Object.defineProperty(this, 'preferredColorScheme', { writable: true });
				Object.defineProperty(this, 'preferredColorScheme', {
					value: mediaQuery.matches ? 'dark' : 'light',
					writable: false
				});
				this.dispatchEvent(new CustomEvent('preferredColorSchemeChange', { detail: this.preferredColorScheme }))
			};
			updatePreferredColorScheme(colorScheme);
			colorScheme.onchange = event => updatePreferredColorScheme(event.target)
		}

		createProxyStyle(style) {
			if (!(style instanceof HTMLStyleElement))
				throw new TypeError('style must be an instance of: HTMLStyleElement');
			Object.defineProperty(style, '_replaceSync', {
				value: function replaceSync(data) {
					if (typeof data != 'object' || data === null)
						throw new TypeError('data must be of type: object');
					const entries = typeof data?.entries == 'function' ? Array.from(data.entries()) : Object.entries(data);
					const filteredEntries = entries.sort(([a], [b]) => a.localeCompare(b)).filter(([_,value]) => Object.values(value).length);
					let textContent = '';
					for (let [key, properties] of filteredEntries) {
						properties = Object.entries(properties);
						for (let property of properties)
							property[0] = property[0].replace(/([A-Z])/g, c => '-' + c.toLowerCase());
						textContent += key + '{' + properties.map(property => property.join(':')).join(';') + '}'; // JSON.stringify().replace(/(?<="),/, ';')
					}
					this.textContent = textContent
				},
				writable: true
			});
			const proxy = new Proxy(Object.defineProperty(new Map(), 'update', {
				value: function update(key, value) {
					const existingValue = this.get(key);
					if (existingValue) return Object.assign(existingValue, value);
					this.set(key, value);
					return value
				},
				writable: true
			}), {
				get: (...args) => {
					const [target, property, receiver] = args;
					let method = Reflect.get(...args);
					if (typeof method == 'function') {
						switch (property) {
						case 'delete':
							return (...args) => {
								const returnValue = method.apply(target, args);
								style._replaceSync(receiver);
								return returnValue
							}
						case 'set':
						case 'update':
							return (key, value) => {
								if (typeof value != 'object' || value === null)
									throw new TypeError('value must be of type: object');
								const proxiedValue = new Proxy(value, {
									deleteProperty: (...args) => {
										const exists = Reflect.has(...args);
										const returnValue = Reflect.deleteProperty(...args);
										exists && style._replaceSync(receiver);
										return returnValue
									},
									set: (...args) => {
										const [target, prop, value] = args;
										if (target[prop] === value) return true;
										const returnValue = Reflect.set(...args);
										style._replaceSync(receiver);
										return returnValue
									}
								});
								const returnValue = method.call(target, key, proxiedValue);
								style._replaceSync(receiver);
								return receiver // returnValue
							}
						default:
							return method.bind(target)
						}
					}
					return method
				}
			});
			this.styleSheets.set(style, proxy);
			return proxy
		}
	}

	self.ThirdPartyStyleManager || Object.defineProperty(self, 'ThirdPartyStyleManager', {
		value: ThirdPartyStyleManager,
		writable: true
	});

	self.GameStyleManager || Object.defineProperty(self, 'GameStyleManager', {
		value: new ThirdPartyStyleManager(Application),
		writable: true
	});
}