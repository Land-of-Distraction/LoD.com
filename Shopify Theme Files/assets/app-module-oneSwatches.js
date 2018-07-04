define([
	"jquery"
], function ($) {
	"use strict";

	/*

	OneSwatches 2.1.0 Usage
	Yang @onerockwell
	Adding option availablity check

	OneSwatches 2.0.0 Usage
	Yang @onerockwell

	OneSwatches 1.0.0 Usage
	Yang & Patrick @onerockwell

	*/

	var OneSwatchesView = Backbone.View.extend({
		initialize: function (settings) {
			var self = this;
			self.optionsMapMix = {};
			self.optionsFlowStr = ['','',''];
			self.$content = self.$el;
			self.$media = self.$content.find('.product-media');
			self.$optionSelects = self.$content.find('.single-option-selector');
			self.$optionSwatches = self.$content.find('.oneswatch .swatches');

			if (settings.product) {
				self.buildOptionMaps(settings.product);
				window.optionsMapMix = self.optionsMapMix;
			}

			// PreSelect
			if (settings.preSelect) {
				_.each(self.$optionSelects, function(select) {
					var $select = $(select),
						$firstEnabledOption = $select.children(':not([disabled])').first();

					// only preselect an available option, if available
					if ($firstEnabledOption.length)
						$select.val($firstEnabledOption.val());

					$select.trigger('change');
				});
			} else {
				_.each(self.$content.find('.single-option-selector'), function(select) {
					if ($(select).siblings('label').length) {
						if ($(select).siblings('label').text().toLowerCase() != "color") {
							$(select).prepend('<option value="">Select ' + $(select).siblings('label').text() + '</option>').val('');
						} else if ($(select).siblings('label').text().toLowerCase() == "color" || $(select).siblings('label').text().toLowerCase() == "amount") {
							// if(self.$media.length){//Trigger only on PDP
							$(select).trigger('change');
							// }
						}
					} else {
						var $selectorWrapperOneSwatch = self.$content.find('.selector-wrapper.oneswatch').first();
						var $firstSelectorLabel = $selectorWrapperOneSwatch.find('.swatch-label').first().text();

						var label = 'Size'; // Hard coded single select | Select ' + label + '
						$(select).prepend('<option value="">'+$firstSelectorLabel+'</option>').val('');
					}
				});
			}

			// Single select
			if (self.$optionSelects.length == 1) {
				self.updateOptionsInSelector();
			}

			// Click outside to close
			$(window).on('click', function (e) {
				$('.oneswatch').removeClass('opened');
			});
		},

		events: {
			'click .oneswatch'               : 'swatchDropdown',
			'click .swatches .swatch'        : 'swatchHandle',
			'change .single-option-selector' : 'dropdownHandle'
		},

		swatchDropdown: function(e) {
			// Dropdown control
			e.stopPropagation();
			e.preventDefault();

			var self = this,
				$curr = $(e.currentTarget);
				$curr.siblings('.oneswatch').removeClass('opened');
				$curr.toggleClass('opened');
		},

		swatchHandle: function(e) {
			// Swatch click control
			var self = this,
				$curr = $(e.currentTarget),
				$parent = $curr.closest('.swatches'),
				$form = $curr.closest('form'),
				$label = $parent.siblings('.swatch-label'),
				selectAttr = $parent.data('name'),
				selectIndex = $parent.data('option'),
				val = $curr.data('name');

			if ($curr.hasClass('active')) {
				return false;
			}

			if ( $form.attr('id').split('-').length > 1 ) {
				// PLP
				var selectorArray = $form.attr('id').split('-'),
					pid = selectorArray[1],
					$dropdown = $('#productSelect-' + pid + '-option-' + selectIndex);
			} else {
				// PDP
				var $dropdown = $('#productSelect-option-' + selectIndex);
			}

			$dropdown.val(val);
			$dropdown.change();

			if ($form.attr('id').split('-').length > 1) {//PLP
				console.log('add to cart click');
				$form.find('.add-to-cart-btn').trigger('click');
			}

			// if (self.isMobile()) {
			$label.text(selectAttr + ': ' + val);
			// }
		},

		dropdownHandle: function(e) {
			var self = this;

			self.updateOptionsInSelector(e);
			self.updateSwatches(e);
		},

		updateSwatches: function(e) {
			var self = this,
				$curr = $(e.currentTarget),
				$form = $curr.closest('form'),
				selectedValue = $curr.val(),
				optionIndexArray = $curr.data('option').split('option'),
				optionIndex = optionIndexArray[1] - 1; // Please make sure all dropdown has a valid data-option attribute
				// console.log(optionIndexArray[1]);

			var $swatchContainer = $form.find('.swatches[data-option="' + optionIndex + '"]'),
				$label = $swatchContainer.siblings('.swatch-label'),
				$selectedSwatch = $swatchContainer.find('li').filter(function(index) {
					return $(this).data('select') == selectedValue;
				}),
				selectAttr = $swatchContainer.data('name');

			// console.log($selectedSwatch);
			$swatchContainer.find('li').removeClass('active');

			if ($selectedSwatch && !$selectedSwatch.hasClass('active')) {
				$selectedSwatch.addClass('active');
			}

			// if (!self.isMobile()) {
			$label.text(selectAttr + ': ' + selectedValue);
			// }

			self.updateImage(e, selectAttr);
		},

		updateImage: function(e, attribute){
			var self = this,
				$curr = $(e.currentTarget), // Shopify select dropdown
				$form = $curr.closest('form'),
				$media = self.$content.find('.product-media'),
				selectedValue = $curr.val(),
				canUpdateImage = false;

			attribute = attribute.replace(/\-| |\_|\//g,'').toLowerCase();

			if ( attribute.indexOf("color") >= 0 || attribute.indexOf("finish") >= 0 ) {
				canUpdateImage = true;
			}

			// console.log(selectedValue);
			if (canUpdateImage) {
				// Only apply when color got selected
				if ( $form.attr('id').split('-').length > 1 ) {
					// PLP
					var $selectedSwatch = $form.find('.swatches [data-select="' + selectedValue + '"]');

					var imageSrc = $selectedSwatch.length ? $selectedSwatch.data('image') : false;

					if (imageSrc) {
						$form.parents('.item').find('.product-image').attr('src',imageSrc);
					}
				} else {
					// PDP
					selectedValue = selectedValue.replace(/\-| |\_|\//g,'').toLowerCase();

					// console.log(selectedValue);
					var $thumbnails = $media.find('#ProductThumbs li');

					var $selectedThumbs = $thumbnails.filter(function(index) {
						return $(this).data('option') == selectedValue;
					});

					if ($selectedThumbs.length) {
						$thumbnails.removeClass('active').addClass('inactive');

						$selectedThumbs.removeClass('inactive').addClass('active');
					}
				}
			}
		},

		buildOptionMaps: function(product) {
			var self = this;
			// console.log(product);

			// Building our mapping object.
			for (var i=0; i<product.variants.length; i++) {
				var variant = product.variants[i];

				if (variant.available) {
					// For each option
					_.each(product.options, function(option, k) {
						// k is option index

						// Gathering values for the 1st option.
						self.optionsMapMix[k] = self.optionsMapMix[k] || [];

						switch (k) {
							case 0:	// Order: 0-1-2
								// Gathering values for the 2nd option.
								if (product.options.length == 1) {
									var key = variant.options[k];
									self.optionsMapMix[k] = self.optionsMapMix[k] || [];
									self.optionsMapMix[k].push(variant.options[0].toString());
								}

								if (product.options.length > 1) {
									var key = variant.options[k];
									self.optionsMapMix[k][key] = self.optionsMapMix[k][key] || [];
									self.optionsMapMix[k][key].push(variant.options[1]);
									self.optionsMapMix[k][key] = Shopify.uniq(self.optionsMapMix[k][key]);
								}

								// Gathering values for the 3rd option.
								if (product.options.length === 3) {
									var key = variant.options[k] + ' / ' + variant.options[1];
									self.optionsMapMix[k][key] = self.optionsMapMix[k][key] || [];
									self.optionsMapMix[k][key].push(variant.options[2]);
									self.optionsMapMix[k][key] = Shopify.uniq(self.optionsMapMix[k][key]);
								}

							break;

							case 1:	// Order: 1-0-2
								// Gathering values for the 2nd option.
								if (product.options.length > 1) {
									var key = variant.options[k];
									self.optionsMapMix[k][key] = self.optionsMapMix[k][key] || [];
									self.optionsMapMix[k][key].push(variant.options[0]);
									self.optionsMapMix[k][key] = Shopify.uniq(self.optionsMapMix[k][key]);
								}

								// Gathering values for the 3rd option.
								if (product.options.length === 3) {
									var key = variant.options[k] + ' / ' + variant.options[0];
									self.optionsMapMix[k][key] = self.optionsMapMix[k][key] || [];
									self.optionsMapMix[k][key].push(variant.options[2]);
									self.optionsMapMix[k][key] = Shopify.uniq(self.optionsMapMix[k][key]);
								}

							break;

							case 2:	// Order: 2-0-1
								// Gathering values for the 2nd option.
								if (product.options.length > 1) {
									var key = variant.options[k];
									self.optionsMapMix[k][key] = self.optionsMapMix[k][key] || [];
									self.optionsMapMix[k][key].push(variant.options[0]);
									self.optionsMapMix[k][key] = Shopify.uniq(self.optionsMapMix[k][key]);
								}

								// Gathering values for the 3rd option.
								if (product.options.length === 3) {
									var key = variant.options[k] + ' / ' + variant.options[0];
									self.optionsMapMix[k][key] = self.optionsMapMix[k][key] || [];
									self.optionsMapMix[k][key].push(variant.options[1]);
									self.optionsMapMix[k][key] = Shopify.uniq(self.optionsMapMix[k][key]);
								}

							break;
						}
					});
				}
			}
		},

		updateOptionsInSelector: function(e) {
			var self = this;

			var optionsfilter = function(options, optionsArray, value, resultsArray) {
				if (options && options.length) {
					_.each(options, function(option) {
						if ($.inArray(option, resultsArray) == -1) {
							resultsArray.push(option);

							var key = value + ' / ' + option;

							var newOptions = optionsArray[key];

							optionsfilter(newOptions, optionsArray, value, resultsArray);
						}
					});
				} else {
					return resultsArray;
				}
			};

			if ($.isEmptyObject(self.optionsMapMix)) {
				return false;
			}

			if (e == null) {
				// For single select update without passing event
				var $selector = self.$optionSelects,
					$options = $selector.find('option'),
					optionArray = self.optionsMapMix[0],
					availableOptions = [];

				// Update select options
				// $selector.val('');
				$options.attr('disabled','disabled');

				$options = $options.filter(function(index, elem) {
					return $.inArray($(elem).attr('value'), optionArray) != -1;
				});

				if ($options && $options.length) {
					$options.removeAttr('disabled');
				}

				// Update swatches
				var $linkedSwatch = self.$optionSwatches;

				var $swatches = $linkedSwatch.find('.swatch').addClass('disabled');

				$swatches = $swatches.filter(function(index,elem) {
					var swatchValue = String($(elem).data('select'));

					return $.inArray(swatchValue, optionArray) != -1;
				});

				if ($swatches && $swatches.length)
					$swatches.removeClass('disabled');

				return false;
			} else {
				// For multi selects update using event trigger
				var $curr = $(e.currentTarget),
					availableOptions = [],
					selectorValue = $curr.val(),
					selectorIndex = self.$optionSelects.index($curr),
					optionArray = self.optionsMapMix[selectorIndex],
					results = optionArray[selectorValue];

				// Here we need to 'flatrize' the available options
				availableOptions.push(selectorValue);

				optionsfilter(results, optionArray, selectorValue, availableOptions);

				// Should the values array also check selected values? For 3 selections, we need to check the selected value agains the avaliable mitrix

				// self.optionsFlowStr[selectorIndex] = selectorValue;
				// console.log(self.optionsFlowStr);

				// _.each(self.$optionSelects, function(select){
				// 	var $selector = $(select);
				// 	var initialValue = $selector.val();
				// 	var currIndex = self.$optionSelects.index($selector);
				// 	var $options = $selector.find('option');
				//
				// 	if (currIndex !== selectorIndex && initialValue) {
				// 		console.log('also chose: ' + initialValue);
				// 	}
				// });

				// console.log(availableOptions);

				// Update the other two select dropdowns and swatches
				_.each(self.$optionSelects, function(select) {
					var $selector = $(select);

					var initialValue = $selector.val();

					var currIndex = self.$optionSelects.index($selector);

					var $options = $selector.find('option');

					if (currIndex !== selectorIndex) {
						// Update select options
						$selector.val('');

						$options.attr('disabled','disabled');

						$options = $options.filter(function(index,elem) {
							return $.inArray($(elem).attr('value'), availableOptions) != -1;
						});

						if ($options && $options.length) {
							$options.removeAttr('disabled');
						}

						if ($.inArray(initialValue, availableOptions) !== -1) {
							$selector.val(initialValue);
						}

						// Update swatches
						var $linkedSwatch = self.$optionSwatches.filter(function(index,elem) {
							return $(elem).data('option') == currIndex;
						});

						var $swatches = $linkedSwatch.find('.swatch').addClass('disabled').removeClass('active');

						$swatches = $swatches.filter(function(index,elem) {
							var swatchValue = String($(elem).data('select'));

							return $.inArray(swatchValue, availableOptions) != -1;
						});

						if ($swatches && $swatches.length)
							$swatches.removeClass('disabled');

						var $selectedSwatch = $swatches.filter('[data-select="' + initialValue + '"]');

						// if ($selectedSwatch && $selectedSwatch.length) $selectedSwatch.addClass('active');
					}
				});

				return false;
			}
		},

		isMobile: function () {
			var self = this;

			var w = $(window).width();

			if (w <= ORW.responsiveSizes.tablet) {
				return true;
			}

			return false;
		},

		destroy: function() {
			var self = this;

			self.undelegateEvents();
		}
	});

	var OneSwatches = {
		init: function (settings) {
			return new OneSwatchesView(settings);
		}
	}

	return OneSwatches;
});