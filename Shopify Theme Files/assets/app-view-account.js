define([
    'jquery'
], function ($) {

    "use strict";

    var ViewAccount = Backbone.View.extend({

        newAddressForm: '#AddressNewForm',
        newAddresstoggle: '.address-new-toggle',
        newAddressPrimaryToggle: '.address-new-toggle.main-toggle',
        editAddressToggle: '.address-edit-toggle',
        editAddressDelete: '.address-delete',
        editAddressId: '#EditAddress_',
        addressContainer: '.address-list',
        addressList: '.address-list .address',
        addressDetails: '.address-list .address-details',
        addressCountryOption: '.address-country-option',
        addressCountryNew: 'AddressCountryNew',//no '.' or '#'
        addressProvinceNew: 'AddressProvinceNew',//no '.' or '#'
        addressProvinceContainerNew: 'AddressProvinceContainerNew',//no '.' or '#'

        initialize: function(opts){
            var self = this;
            self.$content = self.$el;

            self.tabs();

            if($('body').hasClass('template-customers-addresses')){
              self.addresses();
            }

        },

        events: {

        },

        tabs: function(){
            var self = this;
            var tabSwitch = function($elem, className){
                $elem.addClass(className);
                $elem.siblings().removeClass(className);
            };
            var tabUpdate = function(e){
                var $curr = $(e.currentTarget);
                var $tabContainer = $curr.parents('.tab-container');
                var tabVal = $curr.attr('data-tab');
                console.log('selector:#' + tabVal);
                var $activeTab  = $tabContainer.find('#' + tabVal + '');
                
                tabSwitch($curr, 'active');
                tabSwitch($activeTab, 'active');
            };
            var events = {
                'click .tab-titles a' : function(e){
                    tabUpdate(e);
                }
            };
            // Update and delegate adding events
            _.extend(self.events, events);
            self.delegateEvents();
        },

        addresses: function(){
            var self = this;

            var $newAddressForm = $(self.newAddressForm);

            if(!$newAddressForm.length){
              return;
            }

            // Initialize observers on address selectors, defined in shopify_common.js
            if(Shopify){
              new Shopify.CountryProvinceSelector(self.addressCountryNew, self.addressProvinceNew, {
                  hideElement: self.addressProvinceContainerNew
              });
            }

            // Initialize each edit form's country/province selector
            $(self.addressCountryOption).each(function() {
              var formId = $(this).data('form-id');
              var countrySelector = 'AddressCountry_' + formId;
              var provinceSelector = 'AddressProvince_' + formId;
              var containerSelector = 'AddressProvinceContainer_' + formId;

              new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
                hideElement: containerSelector
              });
            });

            // Toggle new/edit address forms
            $(self.newAddresstoggle).on('click', function() {
              $(self.newAddresstoggle).toggleClass('active');
              if($(self.newAddresstoggle).hasClass('active')){
                    var headerHeight = 60;
                    var moduleLinkOffset = $('.account-actions').offset();
                    var elTopScroll = moduleLinkOffset.top - headerHeight;
                    $("html, body").animate({scrollTop:elTopScroll},225);
              }
              $newAddressForm.toggleClass('hide');
              $(self.newAddressPrimaryToggle).toggleClass('hide');
              $(self.addressDetails).toggleClass('hide');
              $(self.addressContainer).toggleClass('hide');
            });

            $(self.editAddressToggle).on('click', function() {
              var formId = $(this).data('form-id');
              $(self.editAddressId + formId).toggleClass('hide');
              $(self.newAddressPrimaryToggle).toggleClass('hide');
              $(self.addressDetails).toggleClass('hide');
              $(self.addressList).toggleClass('open');
            });

            $(self.editAddressDelete).on('click', function() {
              var $el = $(this);
              var formId = $el.data('form-id');
              var confirmMessage = $el.data('confirm-message');
              if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
                Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
              }
            });
        }//addresses function end

    });

    return ViewAccount;

});