define([
	"jquery",
    'module-oneTab'
], function ($,OneTab) {

	"use strict";

	/*
		OneExpand 1.0.0 Usage
		Yang @onerockwell
  	*/
	
	/*
		Usage:
		
		sizeChart: function(){
            var self = this;
            var events = {
                'click [trigger]' : function(e){
                    e.stopPropagation();
    				e.preventDefault();
                    self.sizeChartModal.open();
                }
            }
            self.sizeChartModal = OneSizeChart.init({
                el: $('.size-chart-modal')
            });
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        }
		
	*/

  	var OneSizeChartView = Backbone.View.extend({
		
		initialize: function (settings) {
			var self = this;
            self.$modal = self.$el;
            self.$table = self.$el.find('.chart-table');
            self.currentUnit = 'cm';
            self.buildChart();
            OneTab.init({
                el: self.$modal.find('.tab-container')
            });
			
			$(window).on('click', function (e) {
				self.close();
			});
			$(document).keyup(function(e) {
                if (e.keyCode == 27) { // escape
                    self.close();
                }
            });
		},

		events: {
			'click .size-chart-content' : function(e){
				e.stopPropagation();
				e.preventDefault();
			},
            'click .close' : function(e){
                var self = this;
                self.close();
            },
            'click .chart-table .top li' : function(e){
                var self = this;
                var $curr = $(e.currentTarget);
                var sizeCode = $curr.data('code');
                
                self.$table.find('.top li').removeClass('active');
                var $selected = self.$table.find('.top li').filter(function(index){
					return $(this).data('code') == sizeCode;
				});
                $selected.addClass('active');
            },
            'click .unit-switch .switch' : function(e){
                var self = this;
                var $curr = $(e.currentTarget);
                var unit = $curr.data('value');
                var unitSwitch = function(value,unitCode){
                    value = parseFloat(value);
                    if (unitCode == 'cm') {
                        return value;
                    } else {
                        return Number((value/2.54).toFixed(1));
                    }
                }
                
                $curr.siblings('.switch').removeClass('active');
                $curr.addClass('active');
                
                if (unit != self.currentUnit) {
                    self.currentUnit = unit;
                    var value = '', result = '';
                    var $items = self.$table.find('.unit-convert').filter(function(index){
    					return $(this).data('value') && $(this).data('value') != '-';
    				});
                    _.each($items, function(item){
                        value = $(item).data('value');
                        result = unitSwitch(value,unit);
                        $(item).html(result.toString() + ' ' + unit);
                    });
                }
            }
		},
        
        buildChart: function(){
            var self = this;
            if (window.size_chart) {
                var data = window.size_chart;
                var colHtml = '';
                var mobileHtml = '';
                var colTitleHtml = '';
                var colTitleClass = 'active';
                var regionArray = [];
                function containsObject(obj, list) {
                    for ( var i = 0; i < list.length; i++) {
                        if (list[i].code === obj.code) {
                            return true;
                        }
                    }
                    return false;
                }
                
                // Compose chart data table
                _.each(data, function(size,index){
                    var activeClass = 'active', mobileHtmlTop = '';
                    colHtml += '<div class="col col-' + index + '">';
                    colHtml +=      '<ul class="top">';
                    _.each(size.varies, function(item){
                        
                        var code = item.code;
                        var name = item.name;
                        var value = item.value;
                        var region = {
                            'name' : name,
                            'code' : code
                        };
                        
                        if (!containsObject(region,regionArray)) {
                            regionArray.push(region);
                        }
                        
                        colHtml +=      '<li class="' + activeClass + '" data-code="' + code +'">' + value + '</li>'; activeClass = '';
                        mobileHtmlTop+= '<li data-code="' + code +'">' + code + ' ' + value + '</li>';
                    });
                    colHtml +=      '</ul>';
                    colHtml +=      '<ul class="bottom desktop">';
                    colHtml +=          '<li class="unit-convert" data-code="bust" data-value="' + size.bust + '">' + size.bust + ' cm</li>';
                    colHtml +=          '<li class="unit-convert" data-code="waist" data-value="' + size.waist + '">' + size.waist + ' cm</li>';
                    colHtml +=          '<li class="unit-convert" data-code="hip" data-value="' + size.hip + '">' + size.hip + ' cm</li>';
                    colHtml +=          '<li class="unit-convert" data-code="sleeve" data-value="' + size.sleeve + '">' + size.sleeve + ' cm</li>';
                    colHtml +=          '<li class="unit-convert" data-code="cross" data-value="' + size.cross + '">' + size.cross + ' cm</li>';
                    colHtml +=      '</ul>';
                    colHtml += '</div>';
                    
                    mobileHtml += '<div class="mobile-bottom row row-' + index + '">';
                    mobileHtml +=      '<ul class="top">';
                    mobileHtml +=           mobileHtmlTop;
                    mobileHtml +=      '</ul>';
                    mobileHtml +=      '<ul class="bottom">';
                    mobileHtml +=          '<li ><div class="left">Bust</div><div class="right unit-convert" data-code="bust" data-value="' + size.bust + '">' + size.bust + ' cm</div></li>';
                    mobileHtml +=          '<li ><div class="left">Waist</div><div class="right unit-convert" data-code="waist" data-value="' + size.waist + '">' + size.waist + ' cm</div></li>';
                    mobileHtml +=          '<li ><div class="left">Hip</div><div class="right unit-convert" data-code="hip" data-value="' + size.hip + '">' + size.hip + ' cm</div></li>';
                    mobileHtml +=          '<li ><div class="left">Sleeve</div><div class="right unit-convert" data-code="sleeve" data-value="' + size.sleeve + '">' + size.sleeve + ' cm</div></li>';
                    mobileHtml +=          '<li ><div class="left">Cross Shoulder</div><div class="right unit-convert" data-code="cross" data-value="' + size.cross + '">' + size.cross + ' cm</div></li>';
                    mobileHtml +=      '</ul>';
                    mobileHtml += '</div>';
                    
                });
                
                
                // Comopose column title
                colTitleHtml += '<div class="col col-title">';
                colTitleHtml +=     '<ul class="top">';
                _.each(regionArray, function(region){
                    colTitleHtml +=     '<li data-code="' + region.code + '" class="' + colTitleClass + '"><span class="desktop">' + region.name + ' (' + region.code + ')</span><span class="mobile">' + region.code + '</span></li>';
                    colTitleClass = '';
                });
                colTitleHtml +=     '</ul>';
                colTitleHtml +=     '<ul class="bottom desktop">';
                colTitleHtml +=         '<li data-code="bust">Bust</li><li data-code="waist">Waist</li><li data-code="hip">Hip</li><li data-code="sleeve">Sleeve</li><li data-code="cross">Cross Shoulder</li>';
                colTitleHtml +=     '</ul>';
                colTitleHtml += '</div>';
                
                $(colTitleHtml + colHtml + mobileHtml).appendTo(self.$table);
            }
        },
        
        open: function(){
            var self = this;
            self.$modal.addClass('opened');
        },
        
        close: function(){
            var self = this;
            self.$modal.removeClass('opened');
        },
        
		destroy: function() {
            var self = this;
            self.undelegateEvents();
        }

	});

	var OneSizeChart = {
		init: function (settings) {
			return new OneSizeChartView(settings);
		}
	}

	return OneSizeChart;


});