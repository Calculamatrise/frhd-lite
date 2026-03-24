FreeRiderLite.modules.set('trackModeration', async function() {
	if (!location.pathname.match(/^\/u\//i) || !Application.settings.user.moderator) return;
	const container = await this.constructor.waitForElm('.tab_buttons');
	if (!container) return;
	const modContainer = container.querySelector('.mod-container') || container.appendChild(this.constructor.createElement('div.mod-container'));
	for (const metadata of document.querySelectorAll("#created_tracks .bottom")) {
		const label = metadata.appendChild(this.constructor.createElement('label', {
			style: { display: 'block' }
		}));
		const avatar = metadata.querySelector('.profileGravatarIcon');
		avatar && avatar.style.setProperty('margin-right', '4px');
		label.appendChild(metadata.querySelector('.profileGravatarIcon'));
		label.appendChild(metadata.querySelector('.author'));
		label.appendChild(this.constructor.createElement('input', {
			type: 'checkbox',
			style: {
				float: 'right',
				height: '1.5rem'
			}
		}));
	}

	const action = modContainer.appendChild(this.constructor.createElement('select.track-moderation', {
		children: [
			this.constructor.createElement('option', {
				disabled: true,
				innerText: 'Select an action',
				value: 'default'
			}),
			this.constructor.createElement('option', {
				innerText: 'Delete selected',
				value: 'hide'
			}),
			this.constructor.createElement('option', {
				innerText: 'Deselect all',
				value: 'deselect'
			}),
			this.constructor.createElement('option', {
				innerText: 'Select all',
				value: 'select'
			})
		]
	}));
	action.addEventListener('change', async event => {
		event.target.disabled = true;
		switch (event.target.value) {
		case 'hide':
			let tracks = document.querySelectorAll("#created_tracks li:has(.bottom > label > input[type='checkbox']:checked)");
			if (tracks.length > 0) {
				let dialog = document.body.appendChild(this.constructor.createElement('dialog', {
					style: {
						border: 'none',
						boxShadow: '0 0 4px 0px hsl(190deg 25% 60%)',
						maxHeight: '75vh',
						maxWidth: '50vw',
						padding: 0,
						width: '120vmin'
					}
				}));
				let title = dialog.appendChild(this.constructor.createElement('p', {
					innerText: 'Are you sure you would like to delete the following tracks?',
					style: {
						backgroundColor: 'inherit',
						boxShadow: '0 0 4px 0 black',
						padding: '1rem',
						position: 'sticky',
						top: 0,
						zIndex: 3
					}
				}));
				let close = title.appendChild(this.constructor.createElement('span.core_icons.core_icons-icon_close', {
					style: { float: 'right' }
				}));
				close.addEventListener('click', () => dialog.remove(), { passive: true });
				let list = dialog.appendChild(this.constructor.createElement('ul.track-list.clearfix', {
					style: {
						maxHeight: '50cqh',
						overflowY: 'auto',
						padding: '1rem',
						textAlign: 'center'
					}
				}));
				list.append(...Array.from(tracks).map(track => {
					let clone = track.cloneNode(true);
					clone.style.setProperty('width', 'min-content');
					return clone;
				}));
				let form = dialog.appendChild(this.constructor.createElement('form', {
					method: 'dialog',
					style: {
						backgroundColor: 'inherit',
						bottom: 0,
						boxShadow: '0 0 4px 0 black',
						display: 'flex',
						gap: '.25em',
						padding: '1rem',
						position: 'sticky',
						zIndex: 2
					}
				}));
				form.appendChild(this.constructor.createElement('button.new-button.button-type-1', {
					innerText: 'Cancel',
					value: 'cancel'
				}));
				let confirm = form.appendChild(this.constructor.createElement('button.new-button.button-type-2', {
					innerText: 'Confirm',
					value: 'default'
				}));
				confirm.addEventListener('click', async event => {
					event.preventDefault();
					for (let button of form.querySelectorAll('button')) {
						button.disabled = true;
						button.style.setProperty('opacity', .5);
						button.style.setProperty('pointer-events', 'none');
					}

					form.appendChild(this.constructor.createElement('span.loading-hourglass'));
					let cache = [];
					let tracks = list.querySelectorAll(".bottom:has(> label > input[type='checkbox']:checked)");
					for (let metadata of tracks) {
						let name = metadata.querySelector('.name');
						let url = name.href;
						let [tid] = url.match(/(?<=\/t\/)\d+/);
						await fetch('/moderator/hide_track/' + tid);
						cache.push(tid);
						let container = metadata.closest('li');
						container.remove();
					}

					// post message to extension?
					let key = 'frhd-lite_recently-hidden-tracks';
					let storage = Object.assign({}, JSON.parse(sessionStorage.getItem(key)));
					storage[Date.now()] = cache;
					sessionStorage.setItem(key, JSON.stringify(storage));
					dialog.close(event.target.value);
				});
				dialog.addEventListener('close', event => {
					action.disabled = false;
					dialog.remove();
				});
				dialog.showModal();
			}
		case 'deselect':
			for (let checkbox of document.querySelectorAll("#created_tracks .bottom > label > input[type='checkbox']:checked"))
				checkbox.checked = false;
			break;
		case 'select':
			for (let checkbox of document.querySelectorAll("#created_tracks .bottom > label > input[type='checkbox']:not(:checked)"))
				checkbox.checked = true
		}

		event.target.value = 'default';
		event.target.disabled = false
	}, { passive: true })
});

FreeRiderLite.styleSheet
	.set('.tab_buttons:has(.tracks-created-tab:not(.active)) > .mod-container > select', { display: 'none' })
	.set('.tab_buttons > .mod-container .track-moderation', {
		borderRadius: '.5em',
		float: 'right',
		fontFamily: 'system-ui,roboto_medium,Arial,Helvetica,sans-serif',
		letterSpacing: '-.02em',
		padding: '0 .25em'
	});