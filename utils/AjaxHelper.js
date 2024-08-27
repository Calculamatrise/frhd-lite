export default new Proxy(class {
	static async request(path, options = {}) {
		let searchParams = new URLSearchParams(path.replace(/[^?]*/, match => {
			path = match;
			return ''
		}));
		searchParams.set('ajax', true);
		searchParams.set('t_1', 'ref');
		searchParams.set('t_2', 'desk');
		if ((!options.method || /^get$/i.test(options.method)) && options.body instanceof URLSearchParams) {
			for (let [key, value] of options.body.entries()) {
				searchParams.set(key, value);
			}

			delete options.body;
		}

		let res = await fetch(`https://www.freeriderhd.com${path}?${searchParams}`, Object.assign({
			headers: {
				'Content-Type': "application/x-www-form-urlencoded"
			}
		}, options)).then(r => r.json());
		if (res.result === false || /^page\snot\sfound/i.test(res.app_title))
			throw new Error(res.msg || 'Something went wrong! Please try again.');

		return res
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
				typeof callback == 'function' && element.addEventListener('click', () => callback(track), { passive: true });
				element.addEventListener('keypress', function(event) {
					/^enter$/i.test(event.key) && this.click()
				}, { passive: true });
				let thumb = document.createElement('img');
				thumb.setAttribute('src', track.thmb);
				let span = document.createElement('span');
				span.innerText = track.title;
				element.append(thumb, span);
				results.push(element);
			}

			return results
		}).catch(err => {
			// handle error
			console.trace('%c' + err.message, 'background-color: #290303;border: 1px solid #5c100d;color: #f07f7f;padding: 0.125rem;');
			// console.warn(err);
			return []
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
					let results = [];
					for (let user of res.data) {
						let element = document.createElement('div');
						typeof callback == 'function' && element.addEventListener('click', () => callback(user), { passive: true });
						element.addEventListener('keypress', function(event) {
							/^enter$/i.test(event.key) && this.click()
						}, { passive: true });
						let avatar = document.createElement('img');
						avatar.src = user.image;
						let span = document.createElement('span');
						span.innerText = user.d_name;
						element.append(avatar, span);
						results.push(element);
						userCache[user.u_name] = user.u_id;
					}

					await chrome.storage.session.set({ userCache });
					resolve(results)
				})
			})
		}).catch(err => {
			// handle error
			console.trace('%c' + err.message, 'background-color: #290303;border: 1px solid #5c100d;color: #f07f7f;padding: 0.125rem;');
			// console.warn(err);
			return []
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
			})
		}).bind(target)
	}
});