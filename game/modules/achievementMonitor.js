Object.defineProperty(FreeRiderLite.prototype, 'initAchievementMonitor', {
	value: function initAchievementMonitor() {
		this.nativeEvents.has('notificationEvent') || this.initNotificationEvent();
		!this.achievementMonitor && (Application.events.subscribe('notification.received', ({ data }) => {
			if ('undefined' != typeof data && ('undefined' != typeof data.achievements_earned)) {
				'undefined' != typeof data.achievements_earned && Application.events.publish('achievementsEarned', data.achievements_earned);
				this.refreshAchievements({ force: true }) // only update percentages // this.updateAchievements?
			}
		}),
		Object.defineProperty(this, 'achievementMonitor', { value: {
			container: this.constructor.createElement('div#achievements-container', {
				style: {
					display: 'flex',
					flexDirection: 'column',
					fontFamily: 'riffic',
					gap: '.4rem'
				}
			})
		}, writable: true }),
		this.achievementMonitor.wrapper = this.constructor.createElement('div#frhd-lite\\.achievement-monitor', {
			children: [
				this.constructor.createElement('a', {
					children: [
						this.constructor.createElement('span', {
							innerText: 'Daily Achievements',
							style: { float: 'left' }
						}),
						this.achievementMonitor.countdown = this.constructor.createElement('span.time-remaining', {
							innerText: '00:00:00',
							style: { float: 'right' }
						})
					],
					href: '/achievements',
					style: {
						borderBottom: '1px solid var(--brdr-clr, hsl(190deg 25% 60%))',
						color: 'currentColor',
						fontFamily: 'helsinki',
						paddingBottom: '5px'
					}
				}),
				this.achievementMonitor.container
			],
			style: {
				backgroundColor: 'var(--bg-clr, hsl(190 25% 95% / 1))',
				// backgroundImage: 'linear-gradient(transparent, hsl(191 25% 90% / 1))',
				border: '1px solid var(--brdr-clr, hsl(190deg 25% 60%))',
				borderRadius: '1rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '.6rem',
				margin: '0 .6rem',
				padding: '1.5rem',
				width: '-webkit-fill-available'
			}
		})),
		this.refreshAchievements().then(r => {
			this.achievementMonitor.countdown.innerText = [String(Math.floor(r.time_left / 3600)).padStart(2, '0'), String(Math.floor((r.time_left % 3600) / 60)).padStart(2, '0'), String(Math.floor(r.time_left % 60)).padStart(2, '0')].join(':');
			this.achievementMonitor.countdownTimer ||= setInterval(() => {
				let lastTime = this.achievementMonitor.countdown.innerText.split(':').map(e => parseInt(e));
				lastTime[2] === 0 && (lastTime[1] === 0 && (lastTime[0]--,
				lastTime[1] = 59),
				lastTime[1]--,
				lastTime[2] = 59);
				lastTime[2]--;
				lastTime.reduce((sum, remainingTime) => sum += remainingTime, 0) === 0 && clearInterval(this.achievementMonitor.countdownTimer);
				this.achievementMonitor.countdown.innerText = lastTime.map(e => String(e).padStart(2, '0')).join(':');
				r.time_left -= 1,
				window.navigation && navigation.addEventListener('navigate', e => e.navigationType != 'replace' && this.constructor.updateAchievements({ time_left: r.time_left }), { once: true, passive: true })
			}, 1e3);
			const rightContent = document.querySelector('#right_content');
			rightContent.prepend(this.achievementMonitor.wrapper)
		})
	},
	writable: true
});