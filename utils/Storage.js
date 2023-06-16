import defaults from "../constants/defaults.js";
import ShallowMap from "../shared/ShallowMap.js";

chrome.storage.proxy = chrome.storage.proxy ?? {};
for (const scope of ['local', 'session']) {
    if (typeof chrome.storage[scope] == 'object') {
        chrome.storage.proxy[scope] = chrome.storage.proxy[scope] ?? new Proxy((function() {
            const instance = new ShallowMap();
            if (scope === 'local') {
                Object.assign(instance, { settings: defaults });
            }

            chrome.storage[scope].get(data => Object.assign(instance, data));
            chrome.storage[scope].onChanged.addListener(data => {
                Object.assign(instance, Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.newValue])));
            });

            return instance;
        })(), {
            get(target, property) {
                if (typeof target[property] == 'object' && target[property] !== null && !(target[property] instanceof ShallowMap)) {
                    target[property] = new Proxy(new ShallowMap(target[property]), this);
                }

                return Reflect.get(...arguments);
            },
            set() {
                Reflect.set(...arguments);
                chrome.storage[scope].set(chrome.storage.proxy[scope]);
                return true;
            },
            deleteProperty() {
                Reflect.deleteProperty(...arguments);
                chrome.storage[scope].set(chrome.storage.proxy[scope]);
                return true;
            }
        });
    }
}