// Scroll Move
function scrollMove(t,h,m){
	"use strict";
	if(h==undefined) h=0;
	if(m!=undefined && jQuery(window).width()<993) h=m;
		var o = jQuery('html, body');
	if(navigator.userAgent.toLowerCase().match(/trident/i)){
		o = jQuery('html');
	}
	o.animate({
		scrollTop:jQuery(t).offset().top-h
	},500);
}

'use strict';

var address = unescape(location.href);
var param = "";
if(address.indexOf("tab", 0) != -1) {
    param = address.substring(address.indexOf("tab", 0) + 4);
} else {
    param = "1";
}

go_tab(param);

$(".tab_btn").on("click", function () {
    var tab = $(this).data("tab");
    go_tab(tab);

    //alert(type);
});


function go_tab(num){
    $(".tab_btn").removeClass("active");
    $(".tab_btn").eq(num-1).addClass("active");
    $(".tab_contant").hide();
    $("#tab_" + num).show();

    $(".sub_3_1 .title").removeClass("active");
    $("#tab_" + num + ".sub_3_1 .title").eq(0).addClass("active");
}


 $(document).ready(function(){
        // main
        var winW = $(window).outerWidth(),
            winH,
            winSct = $(window).scrollTop(),
            sectPosY = [];
        for(var i=0;i < $('section.px-sect').length;i++){
            var sect = $('section.px-sect').eq(i).offset().top;
            sectPosY.push(sect);
        }
        if(winW >= 992){
            winH = $(window).height();
            mainScroll();
        }

        $(window).resize(function(){
            winW = $(window).outerWidth();
            if(winW >= 992){
                winH = $(window).height();
                mainScroll();
            }
        });
        function mainScroll(){
            $(window).on('scroll', function(e){
                winSct = $(window).scrollTop();
                for(var i=0;i < sectPosY.length;i++){
                    if(winSct >= sectPosY[i]-80){
                        $('#index .index-nv ol li').eq(i).addClass('on').siblings('li').removeClass('on');
                    }
                }
            });
        }
    });



jQuery(function($){
	"use strict";
	var w = $(window);
	var $body = $('body');
	var wrap = $('#wrap');
    var hGap = 0;
    var fH = $('#wrap');
    // if
	w.scroll(function(){
		if(w.scrollTop()>80){
			$body.addClass('if-scroll');
		} else {
			$body.removeClass('if-scroll');
		}
	});

    // scroll
	w.scroll(function(){
		if(w.scrollTop()>$('.last-sect').offset().top-0){
			$body.addClass('ft-scroll');
		} else {
			$body.removeClass('ft-scroll');
		}
	});

     // scroll
	w.scroll(function(){
		if(w.scrollTop()>$('#px1').offset()){
			$body.addClass('fix-snb');
		} else {
			$body.removeClass('fix-snb');
		}
	});

	var bgRatioDefault = 19/15;
	if(w.width()<769){
		var tD = 0;
		var hGap = 80;
	} else {
		var tD = 200;
		var hGap = 124;
	}

    $(".px-h").css("min-height",w.height()-hGap);


// scroll
	var id = 'px1';
	function scrollSection(){
		wrap.find('section.px-sect').each(function(){
			var t = $(this);
			var tT = t.offset().top;
			var tH = t.innerHeight();
			var sT = w.scrollTop();
			var wH = w.height();
			if(t.attr('data-delay')){
				tD = t.attr('data-delay');
			}
			// intro animation
			if(tT-wH<sT-tD && tT+tH>sT){
				t.find('.animated').removeClass('ani-stop');
			} else {
				t.find('.animated').addClass('ani-stop');
			}
			// bg
			if(w.width()<769) return;
			if(tT-wH<sT && tT+tH>sT){
				t.find('.px-start').each(function(){
					var bgRatio = bgRatioDefault;
					var t2 = $(this);
					if(t2.attr('data-bgRatio')){
						bgRatio = eval(t2.attr('data-bgRatio'));
					}
					var sV = Math.round((tH*Math.abs(bgRatio-1))*(sT-tT+wH)/(tH+wH));
					$(this).css({
						'-webkit-transform':'translate(0,'+sV+'px)',
						'transform':'translate(0,'+sV+'px)'
					});
				});
			}
		});
	}
	w.on("scroll",function(){
		scrollSection();
	});
	scrollSection();
    
    // GNB

	$('#mNav>ul>li>a').click(function(){
		$(this).find('.caret').toggleClass('fa-flip-vertical').end().next().slideToggle(150).parents('body').removeClass('overflow');
		return false;
	});

});