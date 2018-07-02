define([
	"jquery",

	], function ($) {

	"use strict";

	/*
		OneExpand 1.1.0 Usage
		Yang @onerockwell
        
        <div class="container">
            <div class="wrapper has-content">
                <div class="title">...</div>
                <div class="content">...</div>
            </div>
            <div class="wrapper">
                <div class="title">...</div>
            </div>
            ...
        </div>
        
        OneExpand.init({
            el: jQuery('.container'),
            wrapperSlt: '.wrapper',
            titleSlt: '.title',
            contentSlt: '.content',
            activeClass: 'opened',
            trigger: 'click',
			noAction: false,
            multiple: false
        });
        
  	*/

  	var OneExpandView = Backbone.View.extend({
		
		initialize: function (settings) {
			var self = this;
            self.$container = self.$el;
            
            self.wrapperSlt = settings.wrapperSlt || '.wrapper';
            self.titleSlt = settings.titleSlt || '.title';
            self.contentSlt = settings.contentSlt || '.content';
            self.activeClass = settings.activeClass || 'opened';
            self.allowMultiple = settings.allowMultiple || false;
            self.trigger = settings.trigger || 'click';
			self.noAction = settings.noAction || false;
			self.events = {};
            
            var eventKey = self.trigger + ' ' + self.wrapperSlt + ' > ' + self.titleSlt;
            // console.log(eventKey);
			
			// Customize only for Mobile Menu
			self.events['touchstart .back-to'] = function(e){
				e.preventDefault();
				var $curr = $(e.currentTarget);
				$curr.parents(self.wrapperSlt + '.' + self.activeClass).removeClass(self.activeClass);
			};
			
			self.events[eventKey] = 'expandCtl';
            self.delegateEvents();
		},

		events: {
		},
        
        expandCtl: function(e){
            e.preventDefault();
			
            var self = this;
            var $title = $(e.currentTarget);
            var $wrapper = $title.parent(self.wrapperSlt);
            var $content = $title.siblings(self.contentSlt);
            
            if ($content.length) {
                $wrapper.toggleClass(self.activeClass);
				if (!self.noAction) {
					$content.slideToggle();
				}
                
                if (!self.allowMultiple) {
                    // Can only open one tab at a time
                    var $otherWrappers = $wrapper.siblings('.' + self.activeClass);
                    if ($otherWrappers.length) {
                        $otherWrappers.removeClass(self.activeClass);
						if (!self.noAction) {
							$otherWrappers.find(self.contentSlt).slideUp();
						}
                    }
                }
                
            } else if ($title.attr('href')) {
                window.location.href = $title.attr('href');
            }
            
        },
		
		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneExpand = {
		init: function (settings) {
			return new OneExpandView(settings);
		}
	}

	return OneExpand;


});