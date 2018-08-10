define([
	"jquery",
	"facebook"
], function ($) {

	"use strict";

	/*
		OneSocial 2.0.0 Usage
		Yang@onerockwell

		Share button for social media

		// Html

		<div class="social-share clear-conatiner">
            <div class="share-fb share-elm"></div>
            <div class="share-pin share-elm"></div>
            <div class="share-tw share-elm"></div>
            <div class="share-google share-elm"></div>
        </div>

		// Use example on PDP
		$item represent the wrapper or container of the target element you want to share

		new OneSocial.init({
			el: $item,
			image: $item.find('img').prop('src'),
			title: $item.find('h4').text(),
			description: $item.find('p').text(),
			pinterestTag: '#RK',
			twitterTag: '@RK',
		});
	*/

	var SocialView = Backbone.View.extend({

		initialize: function (settings) {
			console.info('init social');

			this.$socialWrapper = this.$el;
			this.isFacebookInit = false;
            this.settings = settings;

			this.title = settings.title || $('meta[property="og:title"]').attr('content');
			this.link = settings.link || window.location.href;
			this.description = settings.description || $('meta[name="description"]').attr('content');

			this.pinterestTag = settings.pinterestTag || null;
			this.twitterTag = settings.twitterTag || null;
			this.productData = settings.product || null;

			this.storeName = ORW.facebook.storeName || '';

			this.options = {
				'title': this.title,
				'link' : this.link,
				'description': this.description,
				'pinTag': this.pinterestTag,
				'twTag' : this.twitterTag,
				'product' : this.productData
			}

			// if (typeof(window.FB) != "undefined") { this.facebookInit(); }
			this.facebookInit();
			this.emailSharingInit();
		},

		events: {
			'click .share-copy': function (e) {
				var self = this,
				link = self.link;

				e.preventDefault();
				// window.prompt("Copy link to clipboard", link);
				var $temp = $("<input>");
				$("body").append($temp);
				$temp.val(link).select();
				document.execCommand("copy");
				$temp.remove();

				var successMessage = $('<span>').text('link copied to your clipboard!').addClass('copy-success');
				$(e.currentTarget).after(successMessage);
				var $copySucess = this.$socialWrapper.find('.copy-success');
				$copySucess.delay(3000).slideUp(300,function(){
					// $(this).remove();
				});
				// setTimeout($copySucess.remove(),3000);
				// self.seoTools('productEmail');
			},
			'click .share-fb': function (e) {
				e.preventDefault();
				var self = this;
				if (self.isFacebookInit) {
					window.FB.ui({
					        method: 'share',
					        // caption: self.title,
					        href: self.link,
					        // picture: self.findImage(e),
					        // description: self.description,
				    	}, function(response) {
				    });
				    // self.seoTools('productLike');
				}
			},
			'click .share-tw': function (e) {
				e.preventDefault();
				var self = this;
				var shareUrl = encodeURIComponent(self.link);
				if (this.twitterTag) {
					var description = encodeURIComponent(self.title + ' ' + self.twitterTag);
				} else {
					var description = encodeURIComponent(self.title);
				}
				var url = 'https://twitter.com/share?url='+shareUrl+"&text="+description;
				var nw = window.open(url, 'share', 'height=375,width=650');
				if (window.focus) { nw.focus(); }
				// self.seoTools('productTweet');
			},
			'click .share-pin': function (e) {
				e.preventDefault();
				var self = this;
				var shareUrl = encodeURIComponent(self.link);
				var image = encodeURIComponent(self.findImage(e));
				if (self.pinterestTag) {
					var description = encodeURIComponent(self.title + ' ' + self.pinterestTag);
				} else {
					var description = encodeURIComponent(self.title);
				}
				var url = "https://pinterest.com/pin/create/button/?url="+shareUrl+"&description="+description+"&media="+image;
				var nw = window.open(url, 'share', 'height=375,width=650');
				if (window.focus) { nw.focus(); }
				// self.seoTools('productPin');
			},
			'click .share-google': function (e) {
				e.preventDefault();
                var self = this;
				var image = self.findImage(e);
				var url = encodeURI("https://plus.google.com/share?url="+self.link);
				var nw = window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
				if (window.focus) { nw.focus(); }
			},

		},

        findImage: function (e) {
            var self = this;
            var image = '';
            var $curr = $(e.currentTarget);

            if (self.settings.image && $.type(self.settings.image) == 'string') {
                return self.settings.image
            } else if (self.settings.image && $.type(self.settings.image) == 'function') {
				var resultImg = self.settings.image;
				if (resultImg()) {
					return resultImg();
				}
			}

            if ($('body').hasClass('template-product')) {
                // Product page share
                var $image = $('#ProductPhoto img');
            } else {
                var $image = $curr.closest('img');
            }

            if ($image.length > 1) {
                $image = $image.first();
                image = $image.prop('src');
            } else if ($image.length == 1) {
                image = $image.prop('src');
            }

            return image;
        },

		facebookInit: function () {
			var self = this;
			var appId = ORW.facebook.id;
			var appVer = ORW.facebook.ver;
			// var appId = '817233515111522';
			// var appVer = 'v2.6';

			if (appId && appVer) {
				FB.init({
					appId      : appId,
					xfbml      : true,
					version    : appVer
				});
				FB.getLoginStatus(function(response) {
					console.log(response);
				});

				self.isFacebookInit = true;

				console.info('init FB');
			}
		},

		emailSharingInit: function () {
			var self = this;
			// Init email sharing
			var link = encodeURIComponent(self.link);
			var shareSubject = 'Check%20this%20out%20on%20' + self.storeName;
			var shareBody = 'Check%20out' + '%20%22' + self.title + '%22%20' + 'on%20' + self.storeName + '%20at' + '%0D%0A%0D%0A' + link;
			_.each(this.$socialWrapper.find('.share-mail'),function(link){
				var $link = $(link);
				$link.attr('href','mailto:?subject=' + shareSubject + '&body=' + shareBody);
			})
		},

		seoTools: function (eventType) {
			var self = this;
			if (self.productData && dataLayer) {
				dataLayer.push({
					'event': eventType,
					'product' : self.productData
				});
			}
		},

		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneSocial = {
		init: function (settings) {
			return new SocialView(settings);
		}
	}

	return OneSocial;
});
