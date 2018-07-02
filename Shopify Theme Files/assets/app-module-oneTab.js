define([
	"jquery",

	], function ($) {

	"use strict";

	/*
		OneTab 1.0.0 Usage
		Yang @onerockwell
  	*/

  	var OneTabView = Backbone.View.extend({
		
		initialize: function (settings) {
			var self = this;
		},

		events: {
			'click .tab-titles div' : function(e){
                var self = this;
                self.tabUpdate(e);
            }
		},
        
        tabSwitch: function($elem, className){
            $elem.addClass(className);
            $elem.siblings().removeClass(className);
        },
        
        tabUpdate: function(e){
            var self = this;
            var $curr = $(e.currentTarget);
            var $tabContainer = $curr.parents('.tab-container');
            var tabVal = $curr.attr('data-tab');
            var $activeTab  = $tabContainer.find('.tabs-content [data-tab="' + tabVal + '"]');
            
            self.tabSwitch($curr, 'active');
            self.tabSwitch($activeTab, 'active');
        },
		
		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneTab = {
		init: function (settings) {
			return new OneTabView(settings);
		}
	}

	return OneTab;


});