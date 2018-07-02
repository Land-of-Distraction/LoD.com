/*
	Onemodal 3.0.0 
	Adding Magento 2.0 compatibility
	Adding Responsive ( Large to Small )
	Yang@onerockwell
*/

define([
	"jquery",
	'text!' + ORW.appUrl + '/app-template-oneModalFrame.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalInnermessage.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalDefault.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalMessage.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalMessagebox.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalVideo.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalLoadingtext.html' + ORW.appUrlHash,
	'text!' + ORW.appUrl + '/app-template-oneModalQuickshop.html' + ORW.appUrlHash,
	'jquery.actual'
	], function ($, FrameTemp, InnermessageTemp, DefaultTemp, MessageTemp, MessageBoxTemp, VideoTemp, LoadingTextTemp, QuickShopTemp) {

	var OnemodalView = Backbone.View.extend({

		initialize: function (settings) {
			this.$onemodal = this.$el;
			this.$overlay = this.$el.find('.overlay');
			this.$modalContent = this.$el.find('.box-content');
			this.$close = this.$el.find('.close');
			this.$modalContentInner = this.$el.find('.box-content .box-inner').html(settings.contentHtml);
			this.$innerLoadingContainer = this.$el.find('.inner-loading-container');
			this.$videobox = this.$modalContent.find('.video');

			this.animation = settings.animate;
			this.theme = settings.theme;
			this.modalClass = settings.modalClass;
			this.width = settings.width ? settings.width : 0;
			this.height = settings.height ? settings.height : 0;
			this.callback = settings.callback;
			this.showOverLay = settings.overlay != 'none' ? true : false;
			this.overlayOpacity = 0.65;
			this.fadeSpeed = 300;
			this.openSpeed = 250;
			this.pageWidth = 974;
			this.engageFlag = false;

			return this;
		},

		update: function (settings) {
			var self = this;
			var html = settings.contentHtml;
			var margin = settings.margin;
			var mh = 2;
			
			self.engageFlag = true;
			self.theme = settings.theme;
			self.animation = settings.animate;
			self.modalClass = settings.modalClass;

			// Update and delegate adding events
			_.extend(self.events, settings.events);
			self.delegateEvents();

			if ( self.animation == 'fade' ) {
				self.$modalContentInner.transition({ 'opacity': 0 }, self.fadeSpeed, 'ease', function () {

					var $newInner = self.$modalContentInner.html(html);
					var w = settings.width ? settings.width : self.$modalContentInner.actual('width', { absolute : true, includeMargin : true });
					var h = settings.height ? settings.height : self.$modalContentInner.actual('height', { absolute : true, includeMargin : true });

					if (self.$modalContentInner.find('.video').length) {
						self.$videobox = self.$modalContentInner.find('.video');
					};
					
					if (self.$onemodal.hasClass('loader')) {
						self.$onemodal.removeClass('loader').addClass(self.modalClass);
						self.$modalContent.css({
							'opacity': 0,
							'width': w,
							'height': 'auto',
							'transform': 'translate(-50%,-50%)'
						}).transition({ 'opacity': 1 }, self.fadeSpeed, 'ease', function(){
							self.$modalContent.css({ 'overflow': 'visible' });
							self.$modalContentInner.transition({ 'opacity': 1 }, self.fadeSpeed, 'ease', function(){
								self.engageFlag = false;
								self.$modalContent.css({
									'width' : 'calc(100% - ' + margin + 'px)',
									'maxWidth' : w,
									'height' : 'auto',
								});
							});
							self.theme != 'loader' && self.$close.css({ 'opacity' : 1 });
							
							settings.callback();
						});
					} else {
						self.$modalContent.transition({
							'width': w,
							}, self.openSpeed, 'ease', function(){
								self.$modalContent.transition({
									'height': 'auto',
								}, self.openSpeed, 'ease', function () {
									self.$modalContent.css({ 'overflow': 'visible' });
									self.$modalContentInner.transition({ 'opacity': 1 }, self.fadeSpeed, 'ease', function(){
										self.engageFlag = false;
										self.$modalContent.css({
											'width' : 'calc(100% - ' + margin + 'px)',
											'maxWidth' : w,
											'height' : 'auto',
										});
									});
									self.theme != 'loader' && self.$close.css({ 'opacity' : 1 });
									
									settings.callback();
								});
						});
					}

				});
			} else {
				self.$modalContentInner.transition({ 'opacity': 0 }, self.fadeSpeed, 'ease', function () {
					self.$modalContent.transition({
						'height': mh,
						// 'marginTop': -mh/2
					}, self.openSpeed, 'ease', function(){
						self.$modalContent.transition({
							'width': 0,
							// 'marginLeft': 0,
						}, self.openSpeed, function(){

							var $newInner = self.$modalContentInner.html(html);
							self.$onemodal.removeClass('loader');
							self.theme != 'loader' && self.$modalContent.css({ 'transform': 'translateY(0)' });
							
							var w = settings.width ? settings.width : self.$modalContentInner.actual('width', { absolute : true, includeMargin : true });
							var h = settings.height ? settings.height : self.$modalContentInner.actual('height', { absolute : true, includeMargin : true });
							if (self.$modalContentInner.find('.video').length) {
								self.$videobox = self.$modalContentInner.find('.video');
							};

							self.$modalContent.transition({
								'width': w,
								// 'marginLeft': -w/2,
								}, self.openSpeed, 'ease', function(){
									self.$modalContent.transition({
										'height': h,
										// 'marginTop': -h/2
									}, self.openSpeed, 'ease', function () {
										self.$modalContent.css({ 'overflow': 'visible' });
										self.$modalContentInner.transition({ 'opacity': 1 }, self.fadeSpeed, 'ease', function(){
											self.engageFlag = false;
											self.$modalContent.css({
												'width' : 'calc(100% - ' + margin + 'px)',
												'maxWidth' : w,
												'height' : 'auto',
											});
										});
										self.theme != 'loader' && self.$close.css({ 'opacity' : 1 });
										
										settings.callback();
									});
							});
						});
					});
				});
			}

			return this;
		},

		show: function () {
			var self = this;

			self.engageFlag = true;
			self.$onemodal.addClass(self.modalClass).show();
			self.callback();

			var w = self.width ? self.width : self.$modalContentInner.actual('outerWidth', { absolute : true, includeMargin : true });
			var h = self.height ? self.height : self.$modalContentInner.actual('outerHeight', { absolute : true, includeMargin : true });
			var mh = 2;
			var margin = 0;

			if(self.animation == "openshow") {
				self.$overlay.transition({opacity: self.overlayOpacity}, self.fadeSpeed, 'ease', function(){
					self.$modalContent.css({
						'width': 0,
						'height': mh,
						// 'marginTop': -mh/2,
						// 'marginLeft': 0,
						'opacity': 1,
					}).transition({
						'width': w,
						// 'marginLeft': -w/2
						}, self.openSpeed, 'ease', function(){
							self.$modalContent.transition({
								'height': h,
								// 'marginTop': -h/2,
							}, self.openSpeed, 'ease', function () {
								self.$modalContent.css({ 'overflow': 'visible' });
								self.$modalContentInner.transition({ 'opacity': 1 }, self.fadeSpeed, 'ease', function(){
									self.engageFlag = false;
								});
								self.theme != 'loader' && self.$close.css({ 'opacity' : 1 });
							});
					});
				});
			}else {
				if (self.showOverLay){
					self.$overlay.transition({opacity: self.overlayOpacity}, self.fadeSpeed, 'ease', function(){
						self.$modalContentInner.css({ 'opacity': 1 });
						self.$modalContent.css({
							'width': w,
							'height': 'auto',
							'transform': 'translate(-50%,-50%)'
						}).transition({ 'opacity': 1, 'transform': 'translate(-50%,-50%)', }, self.fadeSpeed, 'ease', function(){
							self.$modalContent.css({ 'overflow': 'visible' });
							self.engageFlag = false;
							self.theme != 'loader' && self.$close.css({ 'opacity' : 1 });
						});
					});
				} else {
					self.$modalContentInner.css({ 'opacity': 1 });
					self.$modalContent.css({
						'width': w,
						'height': 'auto',
						'transform': 'translate(-50%,-50%)'
					}).transition({ 'opacity': 1, 'transform': 'translate(-50%,-50%)', }, self.fadeSpeed, 'ease', function(){
						self.$modalContent.css({ 'overflow': 'visible' });
						self.engageFlag = false;
						self.theme != 'loader' && self.$close.css({ 'opacity' : 1 });
					});
				}
			};

			return this;
		},

		hide: function (forceClose) {
			var self = this;
			var mh = 3;

			if (self.engageFlag && self.theme != 'loader') return false;

			if (self.theme != 'loader' || forceClose) {

				self.$close.css({ 'opacity' : 0 });

				// Hide inner message/loader box before close the modal
				if (self.$innerLoadingContainer.is(':visible')) {
					self.$innerLoadingContainer.hide();
				}

				if (self.animation == 'openshow') {
					self.$modalContentInner.transition({ 'opacity': 0 }, self.fadeSpeed, 'ease', function () {
						self.$modalContent.css({ 'overflow': 'hide' });
						self.$modalContent.transition({
							'height': mh,
							// 'marginTop': -mh/2,
						}, self.openSpeed, 'ease', function(){
							self.$modalContent.transition({
								'width': 0,
								// 'marginLeft': 0,
								'height': 0,
								// 'marginTop': 0
							}, self.openSpeed, function(){
								self.$overlay.transition({opacity: 0}, self.fadeSpeed, 'ease', function(){
									self.$onemodal.remove();
									self.destory();
								})
							});
						});
					});

				} else {
					self.$modalContent.css({ 'overflow': 'hide' });
					self.$modalContent.transition({ 'opacity': 0, 'transform': 'translate(-50%,-50%)', }, self.fadeSpeed, 'ease', function(){
						self.$overlay.transition({opacity: 0}, self.fadeSpeed, 'ease', function(){
							self.$onemodal.remove();
							self.destory();
						})
					});
				};
			}

			
			return this;
		},

		resize: function () {
			var self = this;
			return self;
		},

		destory: function() {
			this.undelegateEvents();
		}
	});

	var Onemodal = {
		/*
			Settings

			content = {
				type: '',		// *Accept 'success', 'error', 'video' ...
				content: ''		// Accept content string or html
				w: 300,			// Video width
				h: 200,			// Video height
				url: '',		// *Video link
				videoType: 'vm' // Video type, Accept 'yt' and 'vm'
			}

			settings = {
				theme : '', 	// *Accept NA, 'loader' and 'dark', this controls the layout of modal box
				type : '', 		// *Accept any title and title class for modal content
				animate : '', 	// Accept 'fade' or 'openshow'
				width : '',		// Accept new window width, shouldn't be used while set video width
				height : '', 	// Accept new window height, shouldn't be used while set video height
				content : content,
			}
		*/

		buildBox: function (settings) {
			
			// Old _.template return string has been deprecated since _.1.7.0 @yang
			var frame = _.template(FrameTemp);  
			frame = frame({content: settings});
			var e = {};
			e = {
				'click .overlay' : function (e) { e.stopPropagation(); this.hide(); },
				'click .box-content > .close'   : function (e) { e.stopPropagation(); this.hide(); },
				'click .confirm' : function (e) { e.stopPropagation(); this.hide(); },
				'click .cancel'  : function (e) { e.stopPropagation(); this.hide(); },
			};
			

			// Extend default events with adding events, e holds the final events
			_.extend(e, settings.events);
			settings.events = e;

			// Build up frame for alert box
			if ($('body').find('.onemodal').length) {
				$('body').find('.onemodal').remove();
			};
			settings.el = $(frame).appendTo("body");

			return new OnemodalView(settings);
		},

		showMessage: function(settings) {
			settings.theme = settings.theme ? settings.theme : '';
			settings.modalClass = settings.modalClass ? settings.modalClass : '';
			settings.animate = settings.animate ? settings.animate : 'openshow';
			settings.contentHtml = this.buildTemplate(settings.type, settings.content);
			settings.callback = settings.callback ? settings.callback : function(){};
			var box = this.buildBox(settings);
			this.currentBox = box.show();
			return this;
		},

		updateMessage: function(settings) {
			settings.theme = settings.theme ? settings.theme : '';
			settings.modalClass = settings.modalClass ? settings.modalClass : '';
			settings.animate = settings.animate ? settings.animate : 'openshow';
			settings.contentHtml = this.buildTemplate(settings.type, settings.content);
			settings.callback = settings.callback ? settings.callback : function(){};
			if (this.currentBox) {
				var self = this;
				setTimeout(function() {
					self.currentBox.update(settings); // Update including auto reposition for new loaded content
				}, 300);
			};
			return this;
		},

		showLoading: function (settings) {
			var settings = settings || {};

			settings = { 'theme': 'loader', 'modalClass': 'loader-class', 'animate': 'fade', 'loadingtext': settings.loadingtext, 'events': settings.events, 'overlay': settings.overlay };
			settings.callback = settings.callback ? settings.callback : function(){};
			if (settings.loadingtext) {
				settings.contentHtml = this.buildTemplate('loadingtext', { content: settings.loadingtext });
			}

			var box = this.buildBox(settings);
			this.currentBox = box.show();
			return this;
		},

		hideLoading: function () {
			if (this.currentBox) {
				this.currentBox.hide(true);
			};
			return this;
		},
		
		close: function () {
			if (this.currentBox) {
				this.currentBox.hide(true);
			};
			return this;
		},


		// For inner loading and message box
		showInnerMessage: function(d){
			var self = this;
			self.updateInnerMessage(d, true)
		},

		updateInnerMessage: function(d, ctl){
			var self = this;
			ctl = ctl || false
			if (self.currentBox) {
				var innerHtml = self.buildTemplate('innermessage', d);
				var $innerLoader = self.currentBox.$el.find('.inner-loading-container');
				var $loader = $innerLoader.find('.loading');
				var $messageBox = $innerLoader.find('.message').html(innerHtml);

				if (!ctl) {
					$loader.transition({ "opacity": 0 }, 150, 'ease', function () {
						$messageBox.transition({ "opacity": 1 }, 150, 'ease');
					});
				}else {
					$messageBox.transition({ "opacity": 1 }, 150, 'ease');
					$innerLoader.show().transition({ "opacity": 1 }, 250, 'ease');
				};


				$innerLoader.on('click', function () {
					self.hideInnerLoading();
				});
			};
		},

		showInnerLoading: function () {
			var self = this;
			if (self.currentBox) {
				var $innerLoader = self.currentBox.$el.find('.inner-loading-container');
				var $loader = $innerLoader.find('.loading').css({ "opacity": 1 });
				var $messageBox = $innerLoader.find('.message').css({ "opacity": 0 });

				if ($innerLoader.length) {
					if (!$innerLoader.is(':visible')) {
						$innerLoader.show().transition({ "opacity": 1 }, 250, 'ease');
					};
				};

				$innerLoader.on('click', function () {
					self.hideInnerLoading();
				});
			};

			return this;
		},

		hideInnerLoading: function () {
			var self = this;
			if (self.currentBox) {
				var $innerLoader = self.currentBox.$el.find('.inner-loading-container');
				var $loader = $innerLoader.find('.loading');
				var $messageBox = $innerLoader.find('.message');

				if ($innerLoader.length) {
					if ($innerLoader.is(':visible')) {
						$innerLoader.transition({ "opacity": 0 }, 250, 'ease', function(){
							$(this).hide();
							$loader.css({ "opacity": 1 });
							$messageBox.css({ "opacity": 0 });
						});
					};
				};
			};

			return this;
		},

		buildTemplate: function (type, innercontent) {
			var typeTemplate;
			var data = {};

			switch(type) {
				case '':
					typeTemplate = DefaultTemp;
					break;
				case 'default':
					typeTemplate = DefaultTemp;
					break;
				case 'message':
					typeTemplate = MessageTemp;
					break;
				case 'messagebox':
					typeTemplate = MessageBoxTemp;
					break;
				case 'video':
					typeTemplate = VideoTemp;
					break;
				case 'quickshop':
					typeTemplate = QuickShopTemp;
					break;
				case 'loadingtext':
					typeTemplate = LoadingTextTemp;
					break;
				case 'innermessage':
					typeTemplate = InnermessageTemp;
					break;
			};
			
			var compiled = _.template(typeTemplate);
			return compiled({content: innercontent});

			// return _.template( typeTemplate, {content: innercontent}, {escape: false} ); Deprecated since _.1.7.0 @yang
			
			
		}
	}

	return Onemodal;
});
