chrome.storage.local.get(({ settings }) => {
	postMessage({
		action: 'setStorage',
		storage: settings
	})
});

chrome.storage.local.onChanged.addListener(({ settings }) => {
	settings && postMessage({
		action: 'updateStorage',
		storage: settings.newValue
	})
});

// handle reports
const webhooks = new Map()
	.set('general', {
		id: '1254881864557264957',
		secret: 'XQ-9eJh-fxHfn3jgbozovFcHQVhk601Z1-Hks4UWKFKtx2CrNnk7KhlxH1Je-5T-_xVT'
	})
	.set('race', {
		id: '1267600869235359949',
		secret: 'd4KQrXcJ3LjzxNm9eb5DuaEmtqL5LIITG9JCyrG5V40qH9icQTd_m3elKpCz4AmkHyBI'
	})
	.set('request', {
		id: '1267950678408560681',
		secret: 'J8oBLl-LAokQg1NS1rHNnALtG31bMXsQRN_XOUMEHQPHkqDXQHtOKNrOnVfWrXqQLAbu'
	});
addEventListener('message', ({ data }) => {
	switch(data.action) {
	case 'report':
		let url = 'http://frhd.co/';
		let content = '';
		data.type !== 'user' && (data.type === 'race' && (content += '[Race](<' + url + 't/' + data.data.t_id + '/r/' + (data.data.u_name || data.data.d_name.toLowerCase()) + '>) by [' + data.data.d_name + '](<' + url + 'u/' + (data.data.u_name || data.data.d_name.toLowerCase()) + '>) on '),
		data.data.t_id && (content += '[' + (data.type === 'race' ? 't' : 'T') + 'rack](<' + url + 't/' + data.data.t_id + '>)'),
		data.type === 'leaderboard' && (content += ' leaderboard'));
		data.type === 'user' && (content += 'User [' + data.data.d_name + '](<' + url + 'u/' + data.data.d_name + '>)');
		let targetWebhooks = [webhooks.get('general')];
		webhooks.has(data.type) && targetWebhooks.push(webhooks.get(data.type));
		for (let webhook of targetWebhooks) {
			fetch('https://discord.com/api/webhooks/' + webhook.id + '/' + webhook.secret, {
				body: JSON.stringify({
					content: content + ' was reported by [' + data.reporter.d_name + '](<' + url + 'u/' + data.reporter.u_name + '>).'
				}),
				headers: { 'Content-Type': 'application/json' },
				method: 'POST'
			}).then(r => r.text())
			// navigator.sendBeacon('https://discord.com/api/webhooks/' + webhook.id + '/' + webhook.secret, new URLSearchParams({
			// 	content: content + ' was reported by [' + data.reporter.d_name + '](<' + url + 'u/' + data.reporter.u_name + '>).'
			// }))
		}
	}
})