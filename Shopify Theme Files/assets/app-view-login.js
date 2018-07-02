define([
    'jquery'
], function ($) {

    "use strict";

    var ViewLogin = Backbone.View.extend({

        recoverPassword: '#RecoverPassword',
        recoverPasswordForm: '#RecoverPasswordForm',
        hideRecoverPasswordLink: '#HideRecoverPasswordLink',
        customerLoginForm: '#CustomerLoginForm',
        resetSuccess: '#ResetSuccess',
        resetSuccessMessage: '.reset-password-success',
        recoverHash: '#recover',

        initialize: function(opts){
            var self = this;
            self.$content = self.$el;

            self.formInit();

        },

        events: {

        },

        formInit: function(){

            // The contents of this form js are taken from /src/scripts/templates/customers-login.js
            // It has been refactored to fit within the onerockwell js framework.
            var self = this;

            if (!$(self.recoverPassword).length) {
                return;
            }

            self.checkUrlHash();
            self.resetPasswordSuccess();

            var events = {
                'click #RecoverPassword' : function(e){
                    self.onShowHidePasswordForm(e);
                },
                'click #HideRecoverPasswordLink' : function(e){
                    self.onShowHidePasswordForm(e);
                }
            }

            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        onShowHidePasswordForm: function(e) {
            var self = this;
            e.preventDefault();
            self.toggleRecoverPasswordForm();
        },


        checkUrlHash: function() {
            var self = this;
            var hash = window.location.hash;

            // Allow deep linking to recover password form
            if (hash === self.recoverHash) {
                self.toggleRecoverPasswordForm();
            }
        },

        toggleRecoverPasswordForm: function(){
            /**
             *  Show/Hide recover password form
             */
            var self = this;
            $(self.recoverPasswordForm).toggleClass('hide');
            $(self.customerLoginForm).toggleClass('hide');
        },

        resetPasswordSuccess: function(){
            /**
             *  Show reset password success message
             */
            var self = this;
            var $formState = $(self.resetSuccessMessage);

            // check if reset password form was successfully submited.
            if (!$formState.length) {
                return;
            }

            // show success message
            $(self.resetSuccess).removeClass('hide');
        }

    });

    return ViewLogin;

});