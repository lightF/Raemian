
$(document).on('click', '.mu_btn', function() {
	$('.m_search').hide(); 
	$('.m_menu').show();
});


$(document).on('click', '.m_menu .close, .m_menu .overlay', function() {
	$('.m_menu').hide();
});


$(document).on('click', '.sch_btn', function() {
	$('.m_search').show();
});


$(document).on('click', '.m_search .overlay', function() {
	$('.m_search').hide();
});

$(document).on('click', '.wrap > p', function() {
	if($(this).hasClass('hide')){
		$(this).removeClass('hide');
	} else {
		$(this).addClass('hide');
	}
});

/*dialog  팝업 오픈
	$(document).on('click', '[data-dialog]', function(){
		$('#'+ $(this).data('dialog')).addClass('dialog_open');
	});

// 팝업 공통 닫기
	$('.dialog .close, .dialog .overlay').on('click', function(){
		$('.dialog').removeClass('dialog_open');
	});


// 팝업 내부팝업 dep2 닫기
    $(".dialog .close_in").on("click", function () {
        $(this).parent().parent().parent().removeClass("dialog_open");
    });

// 요청발주와 임의발주 팝업 클릭시 팝업 전환
	$('.btn[data-dialog="Request_order"]').on('click', function(){
		$('#Request_order').addClass('dialog_open');
		$('#optional_sch').removeClass('dialog_open');
	});
	

	$('.btn[data-dialog="optional_sch"]').on('click', function(){
		$('#optional_sch').addClass('dialog_open');
		$('#Request_order').removeClass('dialog_open');
	});

 
//저장품과 예비품 팝업 클릭시 팝업 전환
$('.btn[data-dialog="spare_order"]').on('click', function(){
		$('#spare_order').addClass('dialog_open');
		$('#storage_order').removeClass('dialog_open');
	});
	

	$('.btn[data-dialog="storage_order"]').on('click', function(){
		$('#storage_order').addClass('dialog_open');
		$('#spare_order').removeClass('dialog_open');
	});
*/