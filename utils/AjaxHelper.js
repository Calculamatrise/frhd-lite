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

	static trackSearch(query, callback) {
		if (query.length < 3) return [];
		return this.request("/search/t/" + query, { method: 'POST' }).then(res => {
			if (!res.hasOwnProperty('tracks') || typeof res.tracks !== 'object') {
				throw new Error(res.msg ?? 'Something went wrong! Please try again.');
			}

			let results = [];
			for (let track of res.tracks) {
				let element = document.createElement('div');
				element.addEventListener('click', function() {
					if (typeof callback == 'function') {
						callback(track);
					}
				});
				element.addEventListener('keypress', function(event) {
					if (/^enter$/i.test(event.key)) {
						this.click();
					}
				});

				let avatar = document.createElement('img');
				avatar.setAttribute('src', track.thmb);
				let span = document.createElement('span');
				span.innerText = track.title;
				element.append(avatar, span);
				results.push(element);
			}

			return results;
		}).catch(err => {
			// handle error
			console.trace('%c' + err.message, 'background-color: #290303;border: 1px solid #5c100d;color: #f07f7f;padding: 0.125rem;');
			// console.warn(err);
			return [];
		})
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