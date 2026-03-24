FreeRiderLite.modules.set('playlists', function() {
	if (!location.pathname.match(/^\/u\//i) || Application.router.current_view.username !== Application.settings.user.u_name) return;
	let recentlyPlayedTab = document.querySelector('.tab-entry.recently-played-tab');
	if (!recentlyPlayedTab || document.querySelector('.tab-entry.frhd-lite\\.play-later-tab')) return;
	let playlist = this.fetchAndCachePlaylists('playlater');
	if (playlist.size < 1) return;
	let tab = recentlyPlayedTab.parentElement.appendChild(recentlyPlayedTab.cloneNode(true));
	tab.classList.add('frhd-lite.play-later-tab');
	tab.dataset.panel = '#frhd-lite\\.play-later';
	tab.firstElementChild.lastChild.data = 'Play Later';
	let recentlyPlayedPanel = document.querySelector('#profile_recently_played');
	if (!recentlyPlayedPanel) return;
	let panel = recentlyPlayedPanel.parentElement.appendChild(recentlyPlayedPanel.cloneNode(true));
	panel.setAttribute('id', 'frhd-lite.play-later');
	let list = panel.querySelector('.track-list');
	list.replaceChildren(...Array.from(playlist && playlist.values()).map(entry => {
		const authorUrl = 'https://' + location.host + '/u/' + entry.author;
		const trackUrl = 'https://' + location.host + '/t/' + entry.slug;
		return this.constructor.createElement('li', {
			children: [
				this.constructor.createElement('div.track-list-tile.trackTile', {
					children: [
						this.constructor.createElement('a.top', {
							href: trackUrl,
							children: [
								this.constructor.createElement('img.track-list-tile-thumb.top-image', {
									src: entry.img
								}),
								this.constructor.createElement('img.track-list-tile-thumb', {
									alt: 'Track Preview',
									src: 'https://cdn.' + location.host.split('.').slice(-2).join('.') + '/free_rider_hd/sprites/track_preview_250x150.png'
								}),
								this.constructor.createElement('span.bestTime', {
									innerText: ' ' + entry.averageTime + ' ',
									title: 'Average Time'
								})
							]
						}),
						this.constructor.createElement('div.bottom', {
							children: [
								this.constructor.createElement('a.name', {
									href: trackUrl,
									innerText: entry.title
								}),
								this.constructor.createElement('div.profileGravatarIcon', {
									style: { backgroundImage: 'url(' + authorUrl + '/pic?size=50)' }
								}),
								this.constructor.createElement('a.author', {
									href: authorUrl + '/created',
									innerHTML: '&ensp;' + entry.author
								})
							]
						})
					]
				})
			]
		})
	}))
});