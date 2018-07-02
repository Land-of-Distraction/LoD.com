define([
	"jquery",

	], function ($) {

	"use strict";

	/*
		OneContact 1.0.0 Usage
		Yang @onerockwell
        
        OneContact.init({
            el: $('.contact-form-container'),
            submitType: 'json' || 'default',
            errorMsg: 'Oops, something wrong happened, please try again later',
            successMsg: 'Thank you and welcome to Safiyaa. You will receive an email to confirm your subscription shortly.',
            requiredMsg: 'Error: required field',
            errorEmail: 'Error: please ensure formatting is correct',
            successCallback: function(d){},
            errorCallback: function(err){}
        });
        
  	*/

  	var OneContactView = Backbone.View.extend({
		
		initialize: function (settings) {
			var self = this;
            self.$form = self.$el.find('form');
            
            self.submitType = settings.submitType || 'default';
            self.errorMsg = settings.errorMsg || 'Oops, something wrong happened, please try again later';
            self.successMsg = settings.successMsg || 'Thank you for your interest! We will be in touch soon.';
            self.errorRequired = settings.requiredMsg || 'Error: required field';
            self.errorEmail = settings.errorEmail || 'Error: please ensure formatting is correct';
            self.successCallback = settings.successCallback ? settings.successCallback : function(d){ alert(d) };
            self.errorCallback = settings.errorCallback ? settings.errorCallback : function(err){ alert(err) };
		},

		events: {
            'submit form' : function(e){
                e.preventDefault();
                var self = this;
                if (self.validation(e)) {
                    if (self.submitType == 'json') {
                        self.formSubmitJSON(e);
                    } else {
                        self.formSubmit(e);
                    }
                }
            },
            'blur input.required' : 'validation'
		},
        
        validation: function(e) {
            var self = this;
            var passValidation = true;
			var $curr = $(e.currentTarget);
            var $requiredFields = self.$form.find('input.required');
            var errorHandling = function($container,msg){
                if ($container.find('.error-msg').length) {
                    $container.find('.error-msg').text(msg);
                } else {
                    $container.append('<span class="error-msg">' + msg + '</span>');
                }
            }
			
			if ($curr.hasClass('required')) {
				$requiredFields = $curr;
			}
            
            _.each($requiredFields,function(input){
                var $input = $(input);
                var $parent = $input.parent();
                var value = $input.val();
                var isEmailField = $input.attr('type') == 'email' ? true : false;
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                
                if (value == '') {
                    passValidation = false;
                    $parent.addClass('error');
                    errorHandling($parent,self.errorRequired);
                } else if (isEmailField) {
                    var resutl = regex.test(value);
                    if (!resutl) {
                        passValidation = false;
                        errorHandling($parent,self.errorEmail);
                    } else {
                        $parent.removeClass('error');
                    }
                } else {
                    $parent.removeClass('error');
                }
                
            });
            
            return passValidation;
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
        
        formSubmit: function(e) {
            var self = this;
            var $form = self.$form;
            $.ajax({
                async: true,
                type: $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                cache       : false,
                error       : function(err) { 
                    self.errorCallback(err);
                },
                success     : function(data) {
                    e.preventDefault();
                    self.successCallback(data);
                }
            });
        },
        
        formSubmitJSON: function(e) {
            var self = this;
            var $form = self.$form;
            $.ajax({
                type: $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                cache       : false,
                dataType    : 'json',
                contentType: "application/json; charset=utf-8",
                error       : function(err) { 
                    self.errorCallback(err);
                },
                success     : function(data) {
                    self.successCallback(data);
                }
            });
        },
        
		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneContact = {
		init: function (settings) {
			return new OneContactView(settings);
		}
	}

	return OneContact;

});