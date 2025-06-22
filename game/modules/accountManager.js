Object.defineProperty(FreeRiderLite.prototype, 'initAccountManager', {
	value: function initAccountManager() {
		if (!this._authLogin) {
			Object.defineProperty(this, '_authLogin', {
				value: user => {
					sessionStorage.clear();
					// this.constructor.deleteStorageEntry('current_user', { temp: true });
					user.u_id && this.constructor.updateStorageEntry('account-manager', {
						[user.u_id]: {
							asr: Application.settings.app_signed_request,
							name: user.d_name
						}
					})
				},
				writable: true
			}),
			Application.events.subscribe('auth.login', this._authLogin);
			if (Application.User.logged_in) {
				let accounts = this.constructor.getStorageEntry('account-manager') || {};
				if (Object.keys(accounts) < 1) {
					this.constructor.updateStorageEntry('account-manager', {
						[Application.settings.user.u_id]: {
							asr: Application.settings.app_signed_request,
							name: Application.settings.user.d_name
						}
					})
				}
			}
		}
		// modify function to save token/login?
		// or subscribe auth.login and save asr
		// this.replaceLogin(); vvv
		// Application.router.auth_dialog_view.login_with_email
		if (!Application.User.logged_in) return;
		let logout = Application.router.left_navigation_view.el.querySelector('a.logout');
		if (!logout.hasAttribute('id')) return;
		logout.removeAttribute('id'),
		logout.innerText = "Switch",
		logout.addEventListener('click', event => {
			event.stopPropagation(),
			event.stopImmediatePropagation(),
			this.constructor.getAccountManager({ createIfNotExists: true }).showModal()
		}, { passive: true })
	},
	writable: true
});