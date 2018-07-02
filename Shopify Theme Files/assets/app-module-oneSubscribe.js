define([
	"jquery",
	'module-oneContact'
], function ($, OneContact) {

	"use strict";

	/*
		OneSubscribe 1.0.0 Usage
		Yang @onerockwell
        
        OneSubscribe.init({
            el: $('.subscribe-modal'),
            delay: 2000,
            errorMsg: 'Oops, something wrong happened, please try again later',
            successMsg: 'Thank you and welcome to Safiyaa. You will receive an email to confirm your subscription shortly.',
            requiredMsg: 'Error: required field',
            errorEmail: 'Error: please ensure formatting is correct',
            cookieEnabled: false,
            cookieDays: 1
        });
        
  	*/

  	var OneSubscribeView = Backbone.View.extend({
		
		initialize: function (settings) {
			var self = this;
            self.$modal = self.$el;
            self.$form = self.$modal.find('form');
            
            self.errorMsg = settings.errorMsg || self.$modal.data('errormsg');
            self.successMsg = settings.successMsg || self.$modal.data('successmsg');
            self.errorRequired = settings.requiredMsg || self.$modal.data('requiredmsg');
            self.errorEmail = settings.errorEmail || self.$modal.data('erroremail');
            self.delay = settings.delay || self.$modal.data('delay');
            self.days = settings.cookieDays || self.$modal.data('cookiedays');
            self.cookieEnabled = settings.cookieEnabled || self.$modal.data('cookieenable');
            
            if (!ORW.utilities.getCookie('hidesubscriptionmodal') || !self.cookieEnabled) {
                setTimeout(function(){
                    self.open();
                }, self.delay);
            }
			
			OneContact.init({
	            el: self.$modal,
	            submitType: 'json',
	            errorMsg: self.errorMsg,
	            successMsg: self.successMsg,
	            requiredMsg: self.errorRequired,
	            errorEmail: self.errorEmail,
	            successCallback: function(data) {
                    self.submitCallBack(true,data);
                },
	            errorCallback: function(err) { 
                    self.submitCallBack(false,err);
                }
	        });
        
		},

		events: {
            'click .close' : function(e){
                e.preventDefault();
                var self = this;
                self.close(true);
            },
			'click .global-message a' : function(e){
				e.preventDefault();
				var $curr = $(e.currentTarget);
				if ($curr.attr('href')) {
					window.open($curr.attr('href'));
				}
			}
		},
        
        open: function() {
            var self = this;
            self.$modal.addClass('opened');
        },
        
        close: function(userClosed) {
            var self = this;
            self.$modal.removeClass('opened');
            if (userClosed && self.cookieEnabled) {
                // update cookie
                ORW.utilities.setCookie('hidesubscriptionmodal',true,self.days);
            }
        },
        
        submitCallBack: function(isSuccess,data){
            var self = this;
            var errorHandling = function($container,msg){
                if ($container.find('.global-message').length) {
                    $container.find('.global-message').text(msg);
                } else {
                    $container.append('<p class="global-message">' + msg + '</span>');
                }
                return $container.find('.global-message');
            }
            
            self.$globalMsg = errorHandling(self.$form.parent(),'');
            self.$form.addClass('disabled');
            
            if (isSuccess) {
                console.log(data);
                if (data.result != "success") {
                    self.$globalMsg.html(data.msg).addClass('show error');
                } else {
                    // Successed!
                    self.$globalMsg.html(self.successMsg).addClass('show');
                    setTimeout(function(){
                        self.close();
                    }, self.delay);
                    if (self.cookieEnabled) {
                        // update cookie
                        ORW.utilities.setCookie('hidesubscriptionmodal',true,self.days);
                    }
                }
            } else {
                self.$globalMsg.html(self.errorMsg).addClass('show error');
            }
        },
		
		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneSubscribe = {
		init: function (settings) {
			return new OneSubscribeView(settings);
		}
	}

	return OneSubscribe;


});