//Doesn't follows Regular structure
//Author windsor@1r
var CheckoutPage = {};

CheckoutPage.init = {
	initScripts: function(){

		CheckoutPage.init.updateContinueShopping();

	},

	updateContinueShopping: function(){
		var $continueBtn = $('.step__footer__continue-btn');
		var $intendedLink = $('.continue-shopping-link').text();

		$continueBtn.attr('href',$intendedLink);

	}//updateContinueShopping
}

if (window.jQuery){
	$(function() {
		CheckoutPage.init.initScripts();
	});
}