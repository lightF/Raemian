// ie check
var _ua = navigator.userAgent.toLowerCase();
if(_ua.match(/trident\/(\d.\d)/i)){
   var ieCheck = _ua.match(/trident\/(\d.\d)/i)[1];
}
var ie8Check = _ua.match(/msie [7]/i) || _ua.match(/msie [8]/i);
var ie9Check = _ua.match(/msie [9]/i);
var ie10Check = _ua.match(/msie [10]/i);
var ie11Check = ieCheck=="7.0";

// Scroll Move
function scrollMove(t,h){
	"use strict";
	if(h==undefined) h=0;
	var o = jQuery('body');
	if(navigator.userAgent.toLowerCase().match(/trident/i)){
		o = jQuery('html');
	}
	o.animate({
		scrollTop:jQuery(t).offset().top-h
	},500);
}


// Menu Open
function menuOpen(o){
	jQuery('#wrap').append('<button type="button" id="sidebar_tg" onclick="menuClose();"><b class="sr-only">Close</b></button>');
	var a = -jQuery(window).scrollTop();
	jQuery('body').addClass('nav_open');
	jQuery('#wrap').css('top',a);
	setTimeout(function(){
		jQuery('#'+o).show(0,function(){
			jQuery('body').addClass('snb_open');
		});
	},60);
}

// Menu Close
function menuClose(){
	jQuery('body').removeClass('snb_open');
	jQuery('#sidebar_tg').remove();
	setTimeout(function(){
		jQuery('body').removeClass('nav_open');
		jQuery(window).scrollTop(-jQuery('#wrap').position().top);
		jQuery('#wrap').removeAttr('style');
		jQuery('.side_nav').hide();
	},510);
}


jQuery(function($){
	"use strict";
	var w = $(window);
	var $body = $('body');

// bootstrap
	$('[data-toggle="tooltip"]').tooltip();

// scroll
	w.scroll(function(){
		if(w.width()<993){
			return;
		}
		if(w.scrollTop()>105){
			$body.addClass('if-scroll');
		} else {
			$body.removeClass('if-scroll');
		}
	});

// Menu Open
$('#mTg').click(function(){
	if($('body').hasClass('nav_open')){
		menuClose();
	} else {
		menuOpen('snb');
	}
	return false;
});

// GNB
	var gnb = $('#gnb');
	gnb.find('a').hover(function(){
		$(this).parent().siblings().find('.xe-widget-wrapper').hide();
		$(this).next('div').show();
	})
	.focus(function(){
		$(this).parent().siblings().find('.xe-widget-wrapper').hide();
		$(this).next('div').show();
	});
	gnb.mouseleave(function(){
		$(this).find('.xe-widget-wrapper').hide();
	});

// ie8 bg
	if(ie8Check){
		$('.sect').each(function(){
			var img = String($(this).css('background-image')).split('.kr/')[1].split('"')[0];
			$(this).prepend('<div class="bg_full"><img src="'+img+'"></div>').css('background-image','');
		});
	}
});