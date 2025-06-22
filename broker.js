chrome.storage.local.get(({ settings }) => {
	sendPayload({
		action: 'setStorage',
		storage: settings
	})
});
chrome.storage.local.onChanged.addListener(({ settings }) => {
	settings && sendPayload({
		action: 'updateStorage',
		storage: settings.newValue
	})
});

function sendPayload(data) {
	return postMessage(Object.assign({ sender: 'frhd-lite' }, data))
}

(webhook => {
	addEventListener('message', ({ data }) => {
		switch(data.action) {
		case 'report':
			let url = 'http://frhd.co/';
			let content = '';
			data.type !== 'user' && (data.type === 'race' && (content += '[Race](<' + url + 't/' + data.data.t_id + '/r/' + (data.data.u_name || data.data.d_name.toLowerCase()) + '>) by [' + data.data.d_name + '](<' + url + 'u/' + (data.data.u_name || data.data.d_name.toLowerCase()) + '>) on '),
			data.data.t_id && (content += '[' + (data.type === 'race' ? 't' : 'T') + 'rack](<' + url + 't/' + data.data.t_id + '>)'),
			data.type === 'leaderboard' && (content += ' leaderboard'));
			data.type === 'user' && (content += 'User [' + data.data.d_name + '](<' + url + 'u/' + data.data.d_name + '>)');
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
	})
})({
	id: '1254881864557264957',
	secret: 'XQ-9eJh-fxHfn3jgbozovFcHQVhk601Z1-Hks4UWKFKtx2CrNnk7KhlxH1Je-5T-_xVT'
})