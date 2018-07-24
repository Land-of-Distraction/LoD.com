// @Brad - this script will replace the text of the promo banner when a particular query parameter is appended to the URL
// originally implemented to correspond with the DM campaign

if (window.location.search.indexOf('referrer=dm') !== -1) {
  // DM referral identified
  var $banner = $('.promo-banner'),
  	$banner_text = $banner.find('.promo-banner-text');

  $banner_text.html('Get 20% off with code WELCOMELAND');
}