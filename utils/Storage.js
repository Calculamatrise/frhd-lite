import ShallowMap from "../shared/ShallowMap.js";

chrome.storage.proxy ?? Object.defineProperty(chrome.storage, 'proxy', {
	value: {},
	writable: true
});
for (const scope of Array('local', 'session').filter(scope => typeof chrome.storage[scope] == 'object' && typeof chrome.storage.proxy[scope] == 'undefined')) {
	chrome.storage.proxy[scope] = (() => {
		const root = new ShallowMap();
		const instance = new Proxy(root, {
			set(target, property, value, receiver) {
				if (value && typeof value === 'object' && !(value instanceof ShallowMap)) {
					value = new Proxy(new ShallowMap(value), this);
				}
				const returnValue = Reflect.set(target, property, value, receiver);
				if (target === root) {
					chrome.storage[scope].set({ [property]: value });
				} else {
					chrome.storage[scope].set(chrome.storage.proxy[scope]);
				}
				return returnValue
			},
			deleteProperty(target, property) {
				const returnValue = Reflect.deleteProperty(target, property);
				if (target === root) {
					chrome.storage[scope].remove(property);
				} else {
					chrome.storage[scope].set(chrome.storage.proxy[scope]);
				}
				return returnValue
			}
		});
		chrome.storage[scope].get(data => Object.assign(instance, data));
		chrome.storage[scope].onChanged.addListener(data => {
			Object.assign(instance, Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.newValue])))
		});
		return instance
	})();
}