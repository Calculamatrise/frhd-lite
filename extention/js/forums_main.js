$('.userBanners').prepend('<em class="userBanner bannerStaff " itemprop="title"><span class="before"></span><strong>Staff Member</strong><span class="after"></span></em> ');

Backbone.history.navigate = (url) => { document.location.href = document.location.origin + url }