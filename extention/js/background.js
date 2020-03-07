chrome.webRequest.onBeforeRequest.addListener(({ url }) => {
    return {
		cancel: !0
	};
}, {
    urls: [
		'https://cdn.freeriderhd.com/free_rider_hd/assets/styles/combined/gui/combined.min.*.css',
		'https://cdn.freeriderhd.com/free_rider_hd/styles/application/frhd_app.min.*.css'
	],
    types: ['stylesheet']
}, ['blocking']);