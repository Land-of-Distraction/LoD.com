define([
    'jquery'
], function ($) {

    "use strict";

    var viewUtility = Backbone.View.extend({

        initialize: function(opts){
            var self = this;
            self.$content = self.$el;

            self.toggle();
            self.utilityMenuDrop();

        },

        events: {

        },

        toggle: function(){
            var self = this;
            var events = {
                'click .tab-toggle' : function(e){
                    $('.tab-toggle').not(e.currentTarget).removeClass('active');
                    $(e.currentTarget).toggleClass('active');
                }
            };
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        utilityMenuDrop: function(){
            var self = this;
            var events = {
                'click .utility-menu' : function(e){
                    $(e.currentTarget).toggleClass('active');
                }
            };
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
            
        }

    });

    return viewUtility;

});