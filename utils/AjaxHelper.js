export default new Proxy(class {
    static request(path, options = {}) {
        if (!options.method || (options.method).toUpperCase() === 'GET') {
            path += '?' + options.body.toString();
            delete options.body;
        }

        let searchParams = new URLSearchParams(path.replace(/[^?]*/, match => {
            path = match;
            return '';
        }));
        searchParams.set('ajax', true);
        searchParams.set('t_1', 'ref');
        searchParams.set('t_2', 'desk');
        return fetch(`https://www.freeriderhd.com${path}?${searchParams.toString()}`, Object.assign({
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            }
        }, options)).then(r => r.json());
    }

    static userSearch(query, callback) {
        if (query.length < 3) return [];
        return this.request("/search/u_mention_lookup/" + query, { method: 'POST' }).then(res => {
            if (res.code !== true || res.result === false) {
                throw new Error(res.msg);
            }

            return new Promise(resolve => {
                chrome.storage.session.get(async ({ userCache = {}}) => {
                    const results = [];
                    for (const user of res.data) {
                        const element = document.createElement('div');
                        element.addEventListener('click', function() {
                            if (typeof callback == 'function') {
                                callback(user);
                            }
                        });
                        element.addEventListener('keypress', function(event) {
                            if (/^enter$/i.test(event.key)) {
                                this.click();
                            }
                        });

                        const avatar = document.createElement('img');
                        avatar.src = user.image;
                        const span = document.createElement('span');
                        span.innerText = user.d_name;
                        element.append(avatar, span);
                        results.push(element);
                        userCache[user.u_name] = user.u_id;
                    }

                    await chrome.storage.session.set({ userCache });
                    resolve(results);
                });
            });
        }).catch(err => {
            // testing
            return new Promise(resolve => {
                chrome.storage.session.get(async ({ isModerator, userCache = {}}) => {
                    if (isModerator !== 1) {
                        return [];
                    }

                    const results = [];
                    for (const user of [{
                        d_name: 'Calculus',
                        image: '/icons/icon_32.png',
                        u_name: 'calculus',
                        u_id: 566630
                    }, {
                        d_name: 'Char',
                        image: '/icons/icon_32.png',
                        u_name: 'char',
                        u_id: 50003
                    }]) {
                        const element = document.createElement('button');
                        element.classList.add('tab');
                        element.classList.add('ripple');
                        element.addEventListener('pointerdown', function() {
                            if (typeof callback == 'function') {
                                callback(user);
                            }
                        });
                        element.addEventListener('keypress', function(event) {
                            if (/^enter$/i.test(event.key)) {
                                this.click();
                            }
                        });
    
                        const avatar = document.createElement('img');
                        avatar.src = user.image;
                        const span = document.createElement('span');
                        span.innerText = user.d_name;
                        element.append(avatar, span);
                        results.push(element);
                        userCache[user.u_name] = user.u_id;
                    }
    
                    await chrome.storage.session.set({ userCache });
                    resolve(results);
                });
            });

            // handle error
            console.trace('%c' + err.message, 'background-color: #290303;border: 1px solid #5c100d;color: #f07f7f;padding: 0.125rem;');
            // console.warn(err);
            return [];
        })
    }
}, {
    get(target, property) {
        if (property in target) {
            return Reflect.get(...arguments);
        }

        return (function(path, body) {
            return target.request(path, {
                body: new URLSearchParams(body),
                method: String(property).toUpperCase()
            });
        }).bind(target);
    }
});