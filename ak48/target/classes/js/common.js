var oEditors = [];
var favo = new Array();

var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);

today = year+'-'+month+'-'+day;


$(document).ready(function() {
	//db값 먼저 로드
	item_fuel_list();//연료
	favo_list();//즐겨찾기

	$('.xlsx_down').click(function(){
		//엑셀출력
		export_excel( $(this) );
	});

	
    $('form').submit(function(e){
		e.preventDefault();
	});
	// 팝업 공통 닫기
	//$('.dialog .close, .dialog .overlay').on('click', function () {
	$('.dialog .close').on('click', function () {
		$(this).closest('.dialog').removeClass('dialog_open');
		//$('.dialog').removeClass('dialog_open');
	});

	$('.close_in').click(function() {
		$(this).closest('.dialog').removeClass('dialog_open');
	});

	$('.mu').hover(function() {
		$('header').addClass('open');
		}, function(){
			$('header').removeClass('open');
		});


		//즐겨찾기 on_off
		$('.title .favo').click(function () {              
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		} else {
			$(this).addClass('on');
		}
	});

	$('.mu').hover(function() {
		$('header').addClass('open');
	}, function(){
		$('header').removeClass('open');
	});

	// 팝업 공통 닫기
	/*	$('.dialog .close, .dialog .overlay').on('click', function(){
		$('.dialog').removeClass('dialog_open');
	}); */

	// 팝업 내부팝업 dep2 닫기
	$('.dialog .close_in').on('click', function () {
		$(this).closest('.dialog').find('form input[type=text]').val('');
		$(this).closest('.dialog').removeClass('dialog_open');
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
	$('.btn[data-dialog="storage_order"]').on('click', function(){
		$('#storage_order').addClass('dialog_open');
		$('#storage_order').removeClass('dialog_open');
	});


	$('.btn[data-dialog="storage_order"]').on('click', function(){
		$('#storage_order').addClass('dialog_open');
		$('#storage_order').removeClass('dialog_open');
	});

	//즐겨찾기 - 로컬스토리지저장
	$('.favo').on('click', function(){
		if($(this).hasClass('on') === false) {
			for(var i=0;i<favo.length;i++) {
				if( favo[i].name == $(this).prev().text() ) {
					favo.splice(i, 1);
					break;
				}
			}
		} else {
			favo.push( { 'name': $(this).prev().text(), 'url': document.location.href });
		}
		localStorage.setItem('favo', JSON.stringify(favo));

		favo_list();
	});



	$('.favorites .sortable').sortable({
		update: function( ) {
			var favo_tmp = new Array();
			var i = 0;
			$('.sortable li').each(function(){
				favo_tmp.push({ 'name': $(this).find('a').text(), 'url': $(this).attr('href') });
				i++;
			});
			localStorage.setItem('favo', JSON.stringify(favo_tmp));
		}
	});

});
//즐겨찾기 삭제
$(document).on('click', '.favorites .del', function(){
	for(var i=0;i<favo.length;i++) {
		if( favo[i].name == $(this).prev().text() ) favo.splice(i, 1);
	}
	localStorage.setItem('favo', JSON.stringify(favo));
	favo_list();
});
//웹 에디터 화면 설정 function 
/*
function editeor(title, contents) {

	nhn.husky.EZCreator.createInIFrame({
		oAppRef: oEditors,
		elPlaceHolder: 'contents', // html editor가 들어갈 textarea id 입니다.
		sSkinURI: resourcePath + "/smarteditor2/SmartEditor2Skin.html",  // html editor가 skin url 입니다.
		htParams: {

			// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseToolbar: true,
			// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseVerticalResizer: false,
			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
			bUseModeChanger: false,
			fOnBeforeUnload: function () {

			}
		},

		/**
		 * 수정 시 에디터에 데이터 저장
		 */
/*		fOnAppLoad: function () {
			//수정모드를 구현할 때 사용할 부분입니다. 로딩이 끝난 후 값이 체워지게 하는 구현을 합니다.
			oEditors.getById["contents"].exec("PASTE_HTML", [contents]); //로딩이 끝나면 contents를 txtContent에 넣습니다.
		},

		fCreator: "createSEditor2",
	});
} */

$(window).load(function(){
	$(document).on('keydown','.readonly',function(e){
		e.preventDefault();
	});
});

//삭제, 수정완료창 닫을때 다 닫힘
$(document).on('click', '.pop_alert', function(){
	if($(this).find('.content > .body > p').text().indexOf('실패') != -1 ||
		$(this).find('.content > .body > p').text().indexOf('사번') != -1 ||
		$(this).find('.content > .body > p').text().indexOf('사업단') != -1 ||
		$(this).find('.content > .body > p').text().indexOf('불가능') != -1 ||
		$(this).find('.content > .body > p').text().indexOf('창고') != -1 ||
		$(this).find('.content > .body > p').text().indexOf('납품') != -1 ||
		$(this).find('.content > .body > p').text().indexOf('필수') != -1 ) {
		$(this).removeClass('dialog_open');
	} else {
		$('.dialog_open').removeClass('dialog_open');
	}
});
//dialog  팝업 오픈
$(document).on('click', '[data-dialog]', function(){
	$('#'+ $(this).data('dialog')).addClass('dialog_open');
});

//탭동작
$(document).on('click', '.tab [data-tab]',function(){
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
	$(this).parent().next().find('.box').hide();
	$(this).parent().next().find('[data-tab="'+ $(this).data('tab') +'"]').show();
});

$(document).on('click', 'table thead th[data-order]',function(){
	$(this).addClass('sort');
	
	if( $(this).parents('.cont').find('[name="column"]').val() == $(this).data('column') ){
		if($(this).parents('.cont').find('[name="order"]').val() == 'ASC'){
			$(this).attr('data-order', 'DESC');
			$(this).parents('.cont').find('[name="order"]').val('DESC');
		} else {
			$(this).attr('data-order', 'ASC');
			$(this).parents('.cont').find('[name="order"]').val('ASC');
		}
	} else {
		$(this).parents('.cont').find('[name="column"]').val( $(this).data('column') );
		$(this).parents('.cont').find('[name="order"]').val('ASC');
		$(this).siblings().removeClass('sort').attr('data-order', 'ASC');
	}
});

//파일업로드시 - 이미지업로드
$(document).on('change', '[name="upload[]"]', function(){
	$(this).next().next().next().next().val(3);

	var html3 = new Array();

	html3.push('<a class="img_view" target="_blank">');
	html3.push('<img src=""></a>');
	html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

	$(this).parent().append( html3.join('') );
	$(this).parent('div').addClass('upload');
	//base64처리
	getbase64(this, $(this).next().next().next().next().next().find('img') );
});

//파일삭제시
$(document).on('click', 'a.file_del', function(){
	var target = $(this);

	pop_confirm('파일을 삭제 하시겠습니까?', function(){
		target.parent('div').removeClass('upload');
		target.prev().prev().val(2);
		target.prev().remove();
		target.remove();
	});
	
});


$(document).on('click', '.btn.pdf_down', function(){
	html2pdf($(this));
});


$(document).on('keydown', '[name=search_word]', function(key){
	if (key.keyCode == 13) $(this).next('a').click();
});


$(document).on('keyup', '.input_number', function(key){
	$(this).val(number_format($(this).val()));
});



//웹 에디터 화면 설정 function
function editeor2(title, content, size, read) {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: 'contents', // html editor가 들어갈 textarea id 입니다.
        sSkinURI: resourcePath + '/smarteditor2/SmartEditor2Skin.html',  // html editor가 skin url 입니다.
        htParams: {
            // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
            bUseToolbar: read,
            // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
            bUseVerticalResizer: false,
            // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
            bUseModeChanger: true,
            fOnBeforeUnload: function () {
            }
        },
        /**
         * 수정 시 에디터에 데이터 저장
         */
        fOnAppLoad: function () {
            //수정모드를 구현할 때 사용할 부분입니다. 로딩이 끝난 후 값이 체워지게 하는 구현을 합니다.
            if (content) {
                oEditors.getById['contents'].exec('PASTE_HTML', [content]); //로딩이 끝나면 content를 txtContent에 넣습니다.
            }
            if (read === false) {
                oEditors.getById['contents'].exec('DISABLE_WYSIWYG');
            }
            if (size) {
                oEditors.getById['contents'].exec('RESIZE_EDITING_AREA', [0, size]);
            } else {
                oEditors.getById['contents'].exec('RESIZE_EDITING_AREA', [0, 335]);
            }
        },
        fCreator: 'createSEditor2',
    });
}

function html2pdf(el){
	var target, filename;
	target = el.closest('.content').find('.pop_print')[0];
	if( el.data('filename') != '') filename = el.data('filename');
	else filename = 'download';
	filename += '_' + dayjs().format('YYYYMMDD');
/*
	target.printThis({
		debug: true,
		importCSS: true,
		importStyle: true,
		printDelay: 0,
		pageTitle: el.data('filename')
	});
*/
//	return false;
	html2canvas(target).then(function(canvas) { //저장 영역 div id
	// 캔버스를 이미지로 변환
	var imgData = canvas.toDataURL('image/png');
		 
	var imgWidth = 190; // 이미지 가로 길이(mm) / A4 기준 210mm
	var pageHeight = imgWidth * 1.414;  // 출력 페이지 세로 길이 계산 A4 기준
	var imgHeight = canvas.height * imgWidth / canvas.width;
	var heightLeft = imgHeight;
	var margin = 10; // 출력 페이지 여백설정
	var doc = new jsPDF('p', 'mm');
	var position = 0;
	   
	// 첫 페이지 출력
	doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
	heightLeft -= pageHeight;
		 
	// 한 페이지 이상일 경우 루프 돌면서 출력
	while (heightLeft >= 20) {
		position = heightLeft - imgHeight;
		doc.addPage();
		doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;
	}
 
	// 파일 저장
	doc.save(filename+'.pdf');

	  
	});

}

function editeor(title, contents, ysize) {

	nhn.husky.EZCreator.createInIFrame({
		oAppRef: oEditors,
		elPlaceHolder: 'contents', // html editor가 들어갈 textarea id 입니다.
		sSkinURI: resourcePath + "/smarteditor2/SmartEditor2Skin.html",  // html editor가 skin url 입니다.
		htParams: {

			// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseToolbar: true,
			// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseVerticalResizer: false,
			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
			bUseModeChanger: false,
			fOnBeforeUnload: function () {

			}
		},

		/**
		 * 수정 시 에디터에 데이터 저장
		 */
		fOnAppLoad: function () {
			//수정모드를 구현할 때 사용할 부분입니다. 로딩이 끝난 후 값이 체워지게 하는 구현을 합니다.
			oEditors.getById["contents"].exec("PASTE_HTML", [contents]); //로딩이 끝나면 contents를 txtContent에 넣습니다.
            if(ysize == undefined){
                ysize = 300;
            }
            oEditors.getById["contents"].exec("RESIZE_EDITING_AREA", [0, ysize]); 
		},

		fCreator: "createSEditor2",
	});
}
//3자리 콤마
 function number_format(str) {
     return str.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
 }

//serialzeArray to into(comma)
function commatoint(data){
	var pat = /([0-9]*,)\w+/;
	for (var i=0;i<data.length;i++)
	{
		if (pat.test(data[i].value)) data[i].value = data[i].value.replace(/,/g, '');
	}
	return data;
}


//8자리 int 날짜포멧 전환 type 1 = yyyy mm dd  // type = 2  yy mm dd
function length8(num, formet, type) {

	if (typeof num == '' || num == 'undefined' || num == null) {
		num = '';
	}

	var str = num.toString();
	var num_8 = '';
	switch (type) {
		case 2:
			num_8 = str.substring(2, 4) + formet + str.substring(4, 6) + formet + str.substring(6, 8);
			break;
		default:
			num_8 = str.substring(0, 4) + formet + str.substring(4, 6) + formet + str.substring(6, 8);
			break;
	}
	if( String(num).length < 8 ) num_8 = '';
	return num_8;
}


//14자리 int 날짜포멧 전환 type 1 = yyyy mm dd  hh ii ss // type = 2  yy mm dd hh ii ss // 3 yyyy  mm dd //4 hh ii ss
function length14(num, formet1, formet2, type) {
	if (typeof num == '' || num == 'undefined' || num == null) {
		num = '';
	}

	var str = '';
	if(num > 0) str = num.toString();
	var num_14 = ''
	switch (type) {
		case 5:
			num_14 = str.substring(2, 4) + formet1 + str.substring(4, 6) + formet1 + str.substring(6, 8) + ' ' + str.substring(8, 10) + formet2 + str.substring(10, 12);
			break;
		case 4:
			num_14 = str.substring(8, 10) + formet1 +  str.substring(10, 12);
			break;
		case 3:
			num_14 = str.substring(0, 4) + formet1 + str.substring(4, 6) + formet1 + str.substring(6, 8);
			break;
		case 2:
			num_14 = str.substring(2, 4) + formet1 + str.substring(4, 6) + formet1 + str.substring(6, 8) + ' ' + str.substring(8, 10) + formet2 + str.substring(10, 12) + formet2 + str.substring(12, 14);
			break;
		default:
			num_14 = str.substring(0, 4) + formet1 + str.substring(4, 6) + formet1 + str.substring(6, 8) + ' ' + str.substring(8, 10) + formet2 + str.substring(10, 12) + formet2 + str.substring(12, 14);
			break;
	}
	if( String(num).length < 8 ) num_14 = '';
	return num_14;
}
function datetime_local(num){//for datatime-local
	var str = num.toString();
	return str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + 'T' + str.substring(8, 10) + ':' + str.substring(10, 12) + ':' + str.substring(12, 14);
}
function date2(num, num2){//for datatime-local
	var str = '';
	var str2 = '';
	if(num > 0) {
		str = num.toString();
		str2 = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
		if(num2) str2 = str2.substring(0, (str2.length - num2))
	}
	return str2;
}
function date3(num, num2){//for datatime-local
	var str = '';
	var str2 = '';
	if(num > 0) {
		str = num.toString();
		str2 = str.substring(0, 4) + '-' + str.substring(4, 6);
		if(num2) str2 = str2.substring(0, (str2.length - num2))
	}
	return str2;
}
function time2(num, num2){//for datatime-local
	var str = '';
	var str2 = '';
	if(num > 0) {
		str = num.toString();
		str2 = str.substring(8, 10) + ':' + str.substring(10, 12) + ':' + str.substring(12, 14);
		if(num2) str2 = str2.substring(0, (str2.length - num2))
	}
	return str2;
}
//
function toInt(str, formet1, formet2) {
	if (str) {
		if (formet1) {
			if (formet2) {
				var toInt = str.replaceAll(' ', '').replaceAll(formet1, '').replaceAll(formet2, '').trim();
			} else {
				var toInt = str.replaceAll(' ', '').replaceAll(formet1, '').trim();
			}
		}
	}
	return Number(toInt);
}
//페이징
function paging(total, row, page) {
	if (typeof total == 'undefined') total = 0;
	if (!row) row = 20;
	if (page < 1) page = 1;
	var max_page = Math.ceil(parseInt(total) / row);
	if (page > max_page) page = max_page;
	var page = parseInt(page);
	var max_page2 = Math.ceil(page / 5) * 5;
	var prev_page = page - 1;
	var page_tmp = Math.ceil(page / 5);

	if (page_tmp > 1) page_tmp = (page_tmp - 1) * 5 + 1;
	if (prev_page < 1) prev_page = 1;
	var next_page = page + 1;
	if (next_page > max_page) next_page = max_page;
	if (page > max_page) page = max_page;
	if (max_page2 > max_page) max_page2 = max_page;
	var html = new Array();
	if (!prev_page) prev_page = 1;
	if (!next_page) next_page = 1;
	if (!max_page2) max_page2 = 1;
	if (!max_page) max_page = 1;
	html.push('<li class="page-item"><a class="page-link" data-page="1"><img src="'+resourcePath+'/css/img/prev_prev.png" /></a></li><li class="page-item"><a class="page-link" data-page="' + prev_page + '"><img src="'+resourcePath+'/css/img/prev_.png" /></a></li>');

	for (var i = page_tmp; i <= max_page2; i++) {
		if (i > 0) {
			if (i == page) html.push('<li class="page-item active"><a class="page-link" data-page="' + i + '">' + numberPad(i, 2) + '</a></li>');
			else html.push('<li class="page-item"><a class="page-link" data-page="' + i + '">' + numberPad(i, 2) + '</a></li>');
		}
	}
	if (!i) html.push('<li class="page-item active"><a class="page-link" data-page="1">01</a></li>');

	html.push('<li class="page-item"><a class="page-link" data-page="' + next_page + '"><img src="'+resourcePath+'/css/img/next_.png" /></a></li><li class="page-item"><a class="page-link" data-page="' + (max_page) + '"><img src="'+resourcePath+'/css/img/next_next.png" /></a></li>');
	$('.pagination').html(html.join(''));
}

//넘버 변환2
function numberPad(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}



function loader(){
	var ele = new Array();
	ele.push('<img src="'+resourcePath+'/img/ajax-loader.gif" class="loader">');
	$('body').append(ele.join(''));
}

function close_loader(){
	$('.loader').remove();
}

function pop_alert(txt) {
	if (typeof txt == ('undefined' || '' || null)){
		txt = '저장 되었습니다.'
	}

	var ele = new Array();

	ele.push('<div class="dialog basic chk_pop pop_alert dialog_open">');
	ele.push('	<div class="overlay"></div>');
	ele.push('	<div class="content">');
	ele.push('		<div class="top"></div>');
	ele.push('		<div class="body">');
	ele.push('			<p>'+txt+'</p>');
	ele.push('			<div class="btn_area">');
	ele.push('				<a class="btn point btn_close"><i class="ri-check-line"></i>확인</a>');
	ele.push('			</div>');
	ele.push('		</div>');
	ele.push('	</div>');
	ele.push('</div>');

	$('body').append(ele.join(''));

	$('.pop_alert .btn_close').click(function(){
		$('.pop_alert').remove();
	});

}

function pop_confirm(txt, cb, btn1, btn2) {
	if (typeof txt == ('undefined' || '' || null)){
		txt = '삭제 하시겠습니까?';
	}

	if (typeof btn1 == ('undefined' || '' || null)){
		btn1 = '예';
	}
	if (typeof btn2 == ('undefined' || '' || null)){
		btn2 = '아니오';
	}

	var ele = new Array();

	ele.push('<div class="dialog basic chk_pop pop_confirm dialog_open">');
	ele.push('	<div class="overlay"></div>');
	ele.push('	<div class="content">');
	ele.push('		<div class="top"></div>');
	ele.push('		<div class="body">');
	ele.push('			<p>'+txt+'</p>');
	ele.push('			<div class="btn_area">');
	ele.push('				<a class="btn point btn_ok"><i class="ri-check-line"></i>'+btn1+'</a>');
	ele.push('				<a class="btn close btn_close "><i class="ri-close-line"></i>'+btn2+'</a>');
	ele.push('			</div>');
	ele.push('		</div>');
	ele.push('	</div>');
	ele.push('</div>');

	$('body').append(ele.join(''));
	
	

	$('.pop_confirm .btn_ok').click(function(){
		if (cb){
			cb();
		}
		$('.pop_confirm').remove();
	});

	$('.pop_confirm .btn_close').click(function(){
		$('.pop_confirm').remove();
	});

}
//nl to br
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
//즐겨찾기 on 
function favo_list(){
	if(localStorage.getItem('favo')) favo = JSON.parse(localStorage.getItem('favo'));
	var html = new Array();
	for(var i=0;i<favo.length;i++) {
		//우측나열
		html.push('<li>');
		html.push('<div><i class="ri-code-line"></i></div>');
		html.push('<a href="'+favo[i].url+'">'+favo[i].name+'</a>');
		html.push('<a class="del"><i class="ri-close-line"></i></a>');
		html.push('</li>');
		if( favo[i].name == $('.favo').prev().text() ) $('.favo').addClass('on');
	}
	$('.favorites > div > ul').html( html.join('') );
}
//직원 검색 팝업 호출
$(document).on('change', '#person_sch [name="row"]', function(){
	user_list();
});
$(document).on('click', '#person_sch a.btn', function(){
	user_list();
});
$(document).on('click', '#person_sch .pagination a', function(){
	user_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="person_sch"]', function(){
	var target_tbl = $(this).closest('table').attr('class');
	var target_num = $(this).attr('data-num');
	
	if (typeof target_tbl == '' || target_tbl == 'undefined' || target_tbl == null) {target_tbl = ''}
	if (typeof target_num == '' || target_num == 'undefined' || target_num == null) {target_num = ''}
	

	//새 팝업시 초기화
	$('#person_sch [name="page"]').val(1);
	$('#person_sch [name="column"]').val('per_name');
	$('#person_sch [name="order"]').val('ASC');
	$('#person_sch .top.comm > p > span').text('인원현황');
	$('#person_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	user_list('', target_tbl, target_num);
});
//삭제
$(document).on('click', '#person_sch .btn.del', function(){
	$('[name="' + $('#person_sch [name="target"]').val()+ '"]').val('').next().val('');
});

//직원 검색 선택부분
$(document).on('click', '#person_sch .table.tb_scroll tbody > tr', function(){
	var target_tbl = $('#person_sch [name="user_list"] [name=target_tbl]').val();
	var target_num = $('#person_sch [name="user_list"] [name=target_num]').val();
	
	if (target_tbl && target_num){
		$('.'+target_tbl).find('[data-dialog="person_sch"][data-num="'+target_num+'"]').prev().prev().val($(this).find('[name="seq"]').val());
		$('.'+target_tbl).find('[data-dialog="person_sch"][data-num="'+target_num+'"]').prev().val($(this).find('td:nth-child(5)').text());
	} else {
		$('[name="' + $('#person_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(5)').text());
	}

	$('#person_sch a.close_in').trigger('click');//창닫기
});

//직원 리스트 검색 팝업 /user/list
var user_name = new Array();
function user_list(page, target_tbl, target_num, seq){

	target_tbl == '' ? target_tbl == '' : target_tbl == target_tbl;
	target_num == '' ? target_num == '' : target_num == target_num;
	
	$('#person_sch [name="user_list"] [name=target_tbl]').val(target_tbl);
	$('#person_sch [name="user_list"] [name=target_num]').val(target_num);

	$('#person_sch table tbody').html('');
	var html = new Array();
	if(page) $('#person_sch [name="user_list"] [name="page"]').val( page );
	var data = $('#person_sch [name="user_list"]').serializeArray();

	//검색
	if( $('#person_sch [name="user_list_search"] [name="search_word"]').val() != '')
		data.push({'name': $('#person_sch [name="user_list_search"] [name="search_column"] option:selected').val(), 'value': $('#person_sch [name="user_list_search"] [name="search_word"]').val()});
	if (seq != '') data.push({'seq' : seq});

	$.ajax({
		url: contextPath + '/user/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
				html.push('	<input type="hidden" name="per_team" value="'+data.result[i].per_team+'">');
				html.push('	<input type="hidden" name="per_id" value="'+data.result[i].per_id+'">');
				html.push('	<td>'+data.result[i].per_id+'</td>');
				html.push('	<td>'+data.result[i].per_name+'</td>');
				html.push('	<td>'+data.result[i].jg_seq+'</td>');
				html.push('	<td>'+data.result[i].j_seq+'</td>');
				html.push('</tr>');


				user_name[ data.result[i].seq ] = data.result[i].per_name;
				

				if(seq == data.result[i].seq){
					$('[name=payment_detail] [nme=per_seq_text]').val(data.result[i].per_name);
					$('[name=action_detail] [name=at_repair_text]').val(data.result[i].per_name);
				}
				
			}
			
			$('#total_person_pop').text( number_format(data.total) );
			$('#person_sch table tbody').html( html.join('') );

			paging(data.total, $('#person_sch [name="user_list"] [name="row"]').val(), $('#person_sch [name="user_list"] [name="page"]').val());
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}
//팝업호출창의 검색 규격
$(document).on('change', '[name="search_case"]', function(){
	$(this).parent().next().children('div').css('display', 'none').find('input, select').val('');
	$(this).parent().next().find('.'+$(this).val()).css('display', 'flex');
	$('.pop_search_submit').show();
});

//팝업호출창의 검색 
$(document).on('click', '.pop_search_submit', function(){
	eval( $(this).closest('form').attr('name') +'(1)' );
});
//팝업호출창 정렬
$(document).on('click', '.dialog table thead th[data-order]',function(){
	if( $(this).parents('form').find('[name="column"]').val() == $(this).data('column') ){
		if($(this).parents('form').find('[name="order"]').val() == 'ASC'){
			$(this).attr('data-order', 'DESC');
			$(this).parents('form').find('[name="order"]').val('DESC');
		} else {
			$(this).attr('data-order', 'ASC');
			$(this).parents('form').find('[name="order"]').val('ASC');
		}
	} else {
		$(this).parents('form').find('[name="column"]').val( $(this).data('column') );
		$(this).parents('form').find('[name="order"]').val('ASC');
		$(this).siblings().removeClass('sort').attr('data-order', 'ASC');
	}

	eval( $(this).closest('form').attr('name') +'(1)' );
});

//소속팀 검색 팝업 호출
$(document).on('change', '#team_sch [name="row"]', function(){
	org_list();
});

$(document).on('click', '#team_sch a.btn', function(){
	org_list();
});

$(document).on('click', '#team_sch .pagination a', function(){
	org_list( $(this).data('page') );
});

$(document).on('click', '[data-dialog="team_sch"]', function(){
	var target_num	= $(this).attr('data-num');
	var target_type	= $(this).attr('data-type');
	var pop_yn		= $(this).closest('.dialog').hasClass('dialog_open');
	
	//새 팝업시 초기화
	$('#team_sch .top.comm > p > span').text('점검팀');
	$('#team_sch [name="target"]').val( $(this).prev().prev().attr('name') );

	if (pop_yn == true){
		$('#team_sch [name="pop_yn"]').val('y');
	} else {
		$('#team_sch [name="pop_yn"]').val('n');
	}

	$('#team_sch [name="target_type"]').val(target_type);
	org_list('', target_num);
});

//삭제
$(document).on('click', '#team_sch .btn.del', function(){
	$('[name="' + $('#team_sch [name="target"]').val()+ '"]').val('').next().val('');
});

//소속팀 검색 선택부분
$(document).on('click', '#team_sch .tree label', function(){
	var target_num	= $('#team_sch [name=target_num]').val();
	var target_type	= $('#team_sch [name=target_type]').val();
	var level		= $(this).find('[name=og_level]').val();
	var pop_yn		= $('#team_sch [name=pop_yn]').val();

	$('#team_sch [name=active_level]').val(level);
	$('#team_sch .tree label').removeClass('active');
	$(this).addClass('active');
	
	if (level == 4) {
		if (pop_yn == 'y'){
			$('.dialog_open [name="' + $('#team_sch [name="target"]').val()+ '"]').prev().prev('[name=pname]').val( $(this).parent('li').parent('ul').parent('li').children('label').text().trim());
			$('.dialog_open [name="' + $('#team_sch [name="target"]').val()+ '"]').prev('[name=pcode]').val( $(this).prev().attr('data-pcode'));
			
			if (target_num){
				$('[data-dialog="team_sch"][data-num="'+target_num+'"]').prev().prev().val($(this).prev().val());
				$('[data-dialog="team_sch"][data-num="'+target_num+'"]').prev().val($(this).text().trim());
			} else {
				$('.dialog_open [name="' + $('#team_sch [name="target"]').val()+ '"]').val( $(this).prev().val()  ).next().val(  $(this).text().trim() );
			} 

			$('.dialog_open .group_seq').val($(this).prev().attr('data-pcode'));
			$('.dialog_open .group_name').val($(this).parent('li').parent('ul').parent('li').children('label').text().trim());

		} else {
			if (target_type == 'group'){

				$('[name="' + $('#team_sch [name="target"]').val()+ '"]').val( $(this).parent('li').parent('ul').parent('li').children('input').val() );
				$('[name="' + $('#team_sch [name="target"]').val()+ '"]').next().val( $(this).parent('li').parent('ul').parent('li').children('label').text().trim() );
			} else {

				$('[name="' + $('#team_sch [name="target"]').val()+ '"]').prev().prev('[name=pname]').val( $(this).parent('li').parent('ul').parent('li').children('label').text().trim());
				$('[name="' + $('#team_sch [name="target"]').val()+ '"]').prev('[name=pcode]').val( $(this).prev().attr('data-pcode'));
				$('[name="' + $('#team_sch [name="target"]').val()+ '"]').val( $(this).prev().val()  ).next().val(  $(this).text().trim() );
				
			}

			$('.group_seq').val($(this).prev().attr('data-pcode'));
			$('.group_name').val($(this).parent('li').parent('ul').parent('li').children('label').text().trim());
		}

		
	}
});

//삭제
$(document).on('click', '#team_sch .btn.del', function(){
	$('[name="' + $('#team_sch [name="target"]').val()+ '"]').val('').next().val('');
});


//소속팀 검색부분, 부모요소도 전부 노출함
$(document).on('click', '#team_sch [name="org_list"] .btn', function(){	
	if( $('#team_sch [name="org_list_search"]').val() != '') {
		$('#team_sch .tree li').css('display', 'none');
		var pr = $('#team_sch .tree li > label:contains("'+$('#team_sch [name="org_list_search"]').val()+'")').parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		

	} else {
		$('#team_sch .tree li').css('display', '');
	}

});

//창닫기
$(document).on('click', '#team_sch [name="org_list"] a.btn', function(){
	var level = $('#team_sch [name=active_level]').val();

	if (level != 4) {
		pop_alert('해당 팀을 선택 해주세요.<br/>사업단이 자동 선택 됩니다.'); 
		return false;
	}
	$('#team_sch').removeClass('dialog_open');

});

//소속팀 리스트 검색 팝업 /org/list, 트리구조임
var org_name = new Array();
function org_list(page, target_num){
	$('#team_sch [name=target_num]').val(target_num);
	$('#team_sch .tree').html('');
	var html = new Array();

	$.ajax({
		url: contextPath + '/org/list',
		type: 'post',
		data: { page: 1, row: 999, section: 0},
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<ul>');
				html.push('<li>');
				html.push('<input type="checkbox" name="tree_og" value="'+data.result[i].seq+'" id="tree_'+data.result[i].seq+'" data-code="'+data.result[i].og_code+'" data-pcode="'+data.result[i].og_pcode+'">');
				html.push('<label for="tree_'+data.result[i].seq+'">');
				html.push('	<input type="hidden" name="og_level" value="'+data.result[i].og_level+'">');
				html.push('	<span></span>'+data.result[i].og_name+'');
				html.push('</label>');
				html.push('</li>');
				html.push('</ul>');
				org_name[ data.result[i].seq ] = data.result[i].og_name;
			}

			$('#team_sch .tree').html( html.join('') );

		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}, complete: function(){
			//부모코드 찾아서 붙이기
			//return false;
			$('#team_sch .tree ul').each(function(){
				var de_id = $(this).children('li').children('input').data().code;
				var pr_id = $(this).children('li').children('input').data().pcode;

				if( de_id == pr_id) {
					$('#team_sch .tree').append($(this).clone().wrapAll('<ul/>').parent().html() );
					$(this).remove();
				} else {
					$('#team_sch .tree [data-code="'+pr_id+'"]').parent().append($(this).clone().wrapAll('<ul/>').parent().html() );
					$(this).remove();
				}
			});


		}
	});
}



//표준명1 검색 팝업 호출
$(document).on('change', '#standard1_sch [name="row"]', function(){
	facility_standard1_list();
});
$(document).on('click', '#standard1_sch a.btn', function(){
	facility_standard1_list();
});
$(document).on('click', '#standard1_sch .pagination a', function(){
	facility_standard1_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="standard1_sch"]', function(){
	//새 팝업시 초기화
	$('#standard1_sch .top.comm > p > span').text('점검팀');
	$('#standard1_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	facility_standard1_list();
});
//삭제
$(document).on('click', '#standard1_sch .btn.del', function(){
	$('[name="' + $('#standard1_sch [name="target"]').val()+ '"]').val('').next().val('');
});

//표준명1 검색 선택부분
$(document).on('click', '#standard1_sch .tree label', function(){
	$('#standard1_sch .tree label').removeClass('active');
	$(this).addClass('active');
	$('[name="' + $('#standard1_sch [name="target"]').val()+ '"]').val( $(this).prev().val()  ).next().val(  $(this).text() );
});

//창닫기
$(document).on('click', '#standard1_sch [name="facility_standard1_list"] a.btn', function(){	
	$('#standard1_sch a.close_in').trigger('click');//창닫기
});

//표준명1 검색부분, 부모요소도 전부 노출함
$(document).on('click', '#standard1_sch [name="facility_standard1_list"] .btn', function(){
	if( $('#standard1_sch [name="facility_standard1_list"] [name=search_name]').val() != '') {
		$('#standard1_sch .tree li').css('display', 'none');
		//var pr = $('#standard1_sch .tree li > label:contains("'+$('#standard1_sch [name="facility_standard1_list_search"]').val()+'")').parent();
		var pr = $('#standard1_sch .tree li > label:contains("'+$('#standard1_sch [name="facility_standard1_list"] [name=search_name]').val()+'")').parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		

	} else {
		$('#standard1_sch .tree li').css('display', '');
	}

});
//표준명1 리스트 검색 팝업, 트리구조임
var standard1_name = new Array();
function facility_standard1_list(page){
	$('#standard1_sch .tree').html('');
	var html = new Array();
	var data = new Array();
	data.section = 10;
	data.ds_name = $('[name=facility_standard1_list] [name=search_name]').val();

	$.ajax({
		url: contextPath + '/facility/standard1/list',
		type: 'post',
		data: { section: 10},
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<ul>');
				html.push('<li>');
				html.push('<input type="checkbox" name="tree_standard1" value="'+data.result[i].seq+'" id="tree_'+data.result[i].seq+'" data-code="'+data.result[i].ds_code+'" data-pcode="'+data.result[i].ds_pcode+'" checked>');
				html.push('<label for="tree_'+data.result[i].seq+'"><span></span>'+data.result[i].ds_name+'</label>');
				html.push('</li>');
				html.push('</ul>');
				standard1_name[ data.result[i].seq ] = data.result[i].ds_name;
			}

			$('#standard1_sch .tree').html( html.join('') );
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}, complete: function(){
			//부모코드 찾아서 붙이기
			//return false;
			$('#standard1_sch .tree ul').each(function(){
				var de_id = $(this).children('li').children('input').data().code;
				var pr_id = $(this).children('li').children('input').data().pcode;
				if( de_id == pr_id) {
					$('#standard1_sch .tree').append($(this).clone().wrapAll('<ul/>').parent().html() );
					$(this).remove();
				} else {
					$('#standard1_sch .tree [data-code="'+pr_id+'"]').parent().append($(this).clone().wrapAll('<ul/>').parent().html() );
					$(this).remove();
				}
			});


		}
	});
}

//표준명1 검색 팝업 호출
$(document).on('change', '#standard2_sch [name="row"]', function(){
	facility_standard2_list();
});
$(document).on('click', '#standard2_sch a.btn', function(){
	facility_standard2_list();
});
$(document).on('click', '#standard2_sch .pagination a', function(){
	facility_standard2_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="standard2_sch"]', function(){
	//새 팝업시 초기화
	$('#standard2_sch .top.comm > p > span').text('점검팀');
	$('#standard2_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	facility_standard2_list();
});
//삭제
$(document).on('click', '#standard2_sch .btn.del', function(){
	$('[name="' + $('#standard2_sch [name="target"]').val()+ '"]').val('').next().val('');
});

//소속팀 검색 선택부분
$(document).on('click', '#standard2_sch .tree label', function(){
	$('#standard2_sch .tree label').removeClass('active');
	$(this).addClass('active');
	$('[name="' + $('#standard2_sch [name="target"]').val()+ '"]').val( $(this).prev().val()  ).next().val(  $(this).text() );
});

//창닫기
$(document).on('click', '#standard2_sch [name="facility_standard2_list"] a.btn', function(){	
	$('#standard2_sch a.close_in').trigger('click');//창닫기
});

//표준명1 검색부분, 부모요소도 전부 노출함
$(document).on('click', '#standard2_sch [name="facility_standard2_list"] .btn', function(){
	//if( $('#standard2_sch [name="facility_standard2_list_search"]').val() != '') {
	if( $('#standard2_sch [name="search_name"]').val() != '') {
		$('#standard2_sch .tree li').css('display', 'none');
		//var pr = $('#standard2_sch .tree li > label:contains("'+$('#standard2_sch [name="facility_standard2_list_search"]').val()+'")').parent();
		var pr = $('#standard2_sch .tree li > label:contains("'+$('#standard2_sch [name="search_name"]').val()+'")').parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		
		pr = pr.parent().parent();
		pr.css('display', '');
		

	} else {
		$('#standard2_sch .tree li').css('display', '');
	}

});
//표준명1 리스트 검색 팝업, 트리구조임
var standard2_name = new Array();
function facility_standard2_list(page){

	$('#standard2_sch .tree').html('');
	var html = new Array();

	$.ajax({
		url: contextPath + '/facility/standard2/list',
		type: 'post',
		data: { section: 10},
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<ul>');
				html.push('<li>');
				html.push('<input type="checkbox" name="tree_standard2" value="'+data.result[i].seq+'" id="tree2_'+data.result[i].seq+'" data-code="'+data.result[i].ds_code+'" data-pcode="'+data.result[i].ds_pcode+'" checked>');
				html.push('<label for="tree2_'+data.result[i].seq+'"><span></span>'+data.result[i].ds_name+'</label>');
				html.push('</li>');
				html.push('</ul>');
					
				standard2_name[ data.result[i].seq ] = data.result[i].ds_name;


			}
			$('#standard2_sch .tree').html( html.join('') );
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}, complete: function(){
			//부모코드 찾아서 붙이기
			//return false;
			$('#standard2_sch .tree ul').each(function(){
				var de_id = $(this).children('li').children('input').data().code;
				var pr_id = $(this).children('li').children('input').data().pcode;
				if( de_id == pr_id) {
					$('#standard2_sch .tree').append($(this).clone().wrapAll('<ul/>').parent().html() );
					$(this).remove();
				} else {
					$('#standard2_sch .tree [data-code="'+pr_id+'"]').parent().append($(this).clone().wrapAll('<ul/>').parent().html() );
					$(this).remove();
				}
			});


		}
	});
}

//차량 검색 팝업 호출
$(document).on('change', '#car_sch [name="row"]', function(){
	car_vehicle_list();
});
$(document).on('click', '#car_sch a.btn', function(){
	car_vehicle_list();
});
$(document).on('click', '#car_sch .pagination a', function(){
	car_vehicle_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="car_sch"]', function(){
	//새 팝업시 초기화
	$('#car_sch [name="page"]').val(1);
	$('#car_sch [name="column"]').val('ve_number');
	$('#car_sch [name="order"]').val('ASC');
	$('#car_sch .top.comm > p > span').text('차량검색');
	$('#car_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	car_vehicle_list();
});
//삭제
$(document).on('click', '#car_sch .btn.del', function(){
	$('[name="' + $('#car_sch [name="target"]').val()+ '"]').val('').next().val('');
});

//차량 검색 선택부분
$(document).on('click', '#car_sch .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#car_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(4)').text());
	$('#car_sch a.close_in').trigger('click');//창닫기
});

//차량 리스트 검색 팝업 /user/list
var car_number = new Array();
function car_vehicle_list(page){
	$('#car_sch table tbody').html('');
	var html = new Array();
	if(page) $('#car_sch [name="car_vehicle_list"] [name="page"]').val( page );
	var data = $('#car_sch [name="car_vehicle_list"]').serializeArray();
	//검색
	if( $('#car_sch [name="car_vehicle_list"] [name="search_word"]').val() != '') 
		data.push({'name': $('#car_sch [name="car_vehicle_list_search"] [name="search_column"] option:selected').val(), 'value': $('#car_sch [name="car_vehicle_list_search"] [name="search_word"]').val()});
	$.ajax({
		url: contextPath + '/car/vehicle/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
				html.push('<input type="hidden" name="ve_drive" value="'+data.result[i].ve_drive+'">');
				html.push('<input type="hidden" name="ve_fuel" value="'+data.result[i].ve_fuel+'">');
				html.push('	<td>'+data.result[i].ve_number+'</td>');
				html.push('	<td>'+data.result[i].ve_name+'</td>');
				html.push('	<td>'+data.result[i].ve_model+'</td>');
				if (data.result[i].ve_fuel != ''){
					html.push('	<td>'+fuel_name[ data.result[i].ve_fuel ]+'</td>');
				} else {
					html.push('	<td>'+data.result[i].ve_fuel+'</td>');
				}
				html.push('</tr>');
				car_number[ data.result[i].seq ] = data.result[i].ve_number;
				
			}
			$('#total_car').text( number_format(data.total) );
			$('#car_sch table tbody').html( html.join('') );
			paging(data.total, $('#car_sch [name="car_vehicle_list"] [name="row"]').val(), $('#car_sch [name="car_vehicle_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}

//창고 검색 팝업 호출
$(document).on('change', '#store_sch [name="row"]', function(){
	part_storage_list();
});
$(document).on('click', '#store_sch a.btn', function(){
	part_storage_list();
});
$(document).on('click', '#store_sch .pagination a', function(){
	part_storage_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="store_sch"]', function(){
	//새 팝업시 초기화
	$('#store_sch [name="page"]').val(1);
	$('#store_sch [name="column"]').val('sr_name');
	$('#store_sch [name="order"]').val('ASC');
	$('#store_sch .top.comm > p > span').text('인원현황');
	$('#store_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	part_storage_list();
});
//삭제
$(document).on('click', '#store_sch .btn.del', function(){
	$('[name="' + $('#store_sch [name="target"]').val()+ '"]').val('').next().val('');
});

//창고 검색 선택부분
$(document).on('click', '#store_sch .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#store_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(4)').text());
	$('#store_sch a.close_in').trigger('click');//창닫기
});

//창고 리스트 검색 팝업 /user/list
var storage_name = new Array();
function part_storage_list(page, seq){
	$('#store_sch table tbody').html('');
	var html = new Array();
	if(page) $('#store_sch [name="part_storage_list"] [name="page"]').val( page );
	var data = $('#store_sch [name="part_storage_list"]').serializeArray();

	//검색
	if( $('#store_sch [name="part_storage_list"] [name="search_word"]').val() != '') 
		data.push({'name': $('#store_sch [name="part_storage_list_search"] [name="search_column"] option:selected').val(), 'value': $('#store_sch [name="part_storage_list_search"] [name="search_word"]').val()});
		data.push({name: 'section', value: 10});
	$.ajax({
		url: contextPath + '/part/storage/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
				html.push('<input type="hidden" name="ve_drive" value="'+data.result[i].ve_drive+'">');
				html.push('<input type="hidden" name="ve_fuel" value="'+data.result[i].ve_fuel+'">');
				html.push('	<td>'+data.result[i].sr_name+'</td>');
				html.push('	<td>'+data.result[i].sr_division+'</td>');
				html.push('	<td>'+String(data.result[i].sr_type).replace('1', '창고').replace('2', '캐비닛').replace('3', '차량')+'</td>');
				html.push('</tr>');
				storage_name[ data.result[i].seq ] = data.result[i].sr_name;

				if (seq == data.result[i].seq){
					$('[name=payment_detail] [name=pm_place_text]').val(data.result[i].sr_name);
					$('[name=payment_detail] [name=pm_storage_text]').val(data.result[i].sr_name);
					

				}
			}
			$('#total_car').text( number_format(data.total) );
			$('#store_sch table tbody').html( html.join('') );
			paging(data.total, $('#store_sch [name="part_storage_list"] [name="row"]').val(), $('#store_sch [name="part_storage_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}


//거래처 팝업창
$(document).on('change', '#act_sch [name="row"]', function(){
	facility_account_list();
});
$(document).on('click', '#act_sch a.btn', function(){
	facility_account_list();
});
$(document).on('click', '#act_sch .pagination a', function(){
	facility_account_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="act_sch"]', function(){
	//새 팝업시 초기화
	$('#act_sch [name="page"]').val(1);
	$('#act_sch [name="column"]').val('act_company');
	$('#act_sch [name="order"]').val('ASC');
	$('#act_sch .top.comm > p > span').text('거래처');
	$('#act_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	facility_account_list();
});

$(document).on('click', '#act_sch .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#act_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(2)').text());
	$('#act_sch a.close_in').trigger('click');//창닫기
});

var facility_account_name = new Array();
function facility_account_list(page, seq){
	$('#act_sch table tbody').html('');
	var html = new Array();
	if(page) $('#act_sch [name="facility_account_list"] [name="page"]').val( page );
	var data = $('#act_sch [name="facility_account_list"]').serializeArray();

	if (seq != '') data.push({name: 'seq', value: seq});

	$.ajax({
		url: contextPath + '/facility/account/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
				html.push('	<td>'+data.result[i].act_company+'</td>');
				html.push('	<td>'+data.result[i].act_ceo+'</td>');
				html.push('	<td>'+data.result[i].act_manager+'</td>');
				html.push('	<td>'+data.result[i].act_phone+'</td>');
				html.push('</tr>');
				
				facility_account_name[ data.result[i].seq ] = data.result[i].act_company;
				
				if (seq == data.result[i].seq){

					$('[name=device_detail] [name=dc_install_text]').val(data.result[i].act_company);
					$('[name=device_detail] [name=dc_produce_text]').val(data.result[i].act_company);
					$('[name=device_detail] [name=dc_supply_text]').val(data.result[i].act_company);

					$('[name=payment_detail] [name=act_seq_text]').val(data.result[i].act_company);

				}
				
			}
			$('#act_sch .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#act_sch table tbody').html( html.join('') );
			paging(data.total, $('#act_sch [name="facility_account_list"] [name="row"]').val(), $('#act_sch [name="facility_account_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}

//기기 팝업창
$(document).on('change', '#equip_sch [name="row"]', function(){
	facility_device_list();
});
$(document).on('click', '#equip_sch a.btn', function(){
	facility_device_list();
});
$(document).on('click', '#equip_sch .pagination a', function(){
	facility_device_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="equip_sch"]', function(){
	//새 팝업시 초기화
	$('#equip_sch [name="page"]').val(1);
	$('#equip_sch [name="column"]').val('dc_name');
	$('#equip_sch [name="order"]').val('ASC');
	$('#equip_sch .top.comm > p > span').text('기기');
	$('#equip_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	facility_device_list();
});

$(document).on('click', '#equip_sch .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#equip_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(2)').text());
	$('#equip_sch a.close_in').trigger('click');//창닫기
});

var device_name = new Array();
function facility_device_list(page, seq){
	$('#equip_sch table tbody').html('');
	var html = new Array();
	var data2 = new Array();
	if(page) $('#equip_sch [name="facility_device_list"] [name="page"]').val( page );
	var data = $('#equip_sch [name="facility_device_list"]').serializeArray();
		
	for(var i=0;i<data.length;i++) {
		if(data[i].value != '') data2.push(data[i]);
	}

	//검색
	if( $('#equip_sch [name="facility_device_list"] [name="search_word"]').val() != '') 
		data.push({'name': $('#equip_sch [name="facility_device_list_search"] [name="search_column"] option:selected').val(), 'value': $('#equip_sch [name="facility_device_list_search"] [name="search_word"]').val()});

	if (seq != '') data2.push({name: 'seq', value: seq});

	$.ajax({
		url: contextPath + '/facility/device/list',
		type: 'post',
		data: data2,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
				/*
				html.push('	<td>'+data.result[i].act_company+'</td>');
				html.push('	<td>'+data.result[i].act_ceo+'</td>');
				html.push('	<td>'+data.result[i].act_manager+'</td>');
				html.push('	<td>'+data.result[i].act_phone+'</td>');

				html.push('	<td>'+data.result[i].dc_name+'</td>');
				html.push('	<td>'+data.result[i].ds_name+'</td>');
				html.push('	<td>'+data.result[i].dc_team+'</td>');
				*/
				html.push('	<td>'+data.result[i].dc_name+'</td>');
				
				html.push('	<td>'+data.result[i].dc_location+'</td>');
				/*
				html.push('	<td>'+length8(data.result[i].dc_current, '-', 1)+'</td>');
				*/
				html.push('</tr>');
				device_name[ data.result[i].seq ] = data.result[i].dc_team;
				
				if (seq == data.result[i].seq){
					console.log(seq);
					$('[name=part_detail] [name=ds_seq_text]').val(data.result[i].dc_team);
					$('[name=breakdown_detail] [name=dc_seq_text]').val(data.result[i].dc_team);

				}
			}
			$('#equip_sch .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#equip_sch table tbody').html( html.join('') );
			paging(data.total, $('#equip_sch [name="facility_device_list"] [name="row"]').val(), $('#equip_sch [name="facility_device_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}

//업체 팝업창
$(document).on('change', '#cmt_sch [name="row"]', function(){
	item_enterprise_list();
});
$(document).on('click', '#cmt_sch a.btn', function(){
	item_enterprise_list();
});
$(document).on('click', '#cmt_sch .pagination a', function(){
	item_enterprise_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="cmt_sch"]', function(){
	//새 팝업시 초기화
	$('#cmt_sch [name="page"]').val(1);
	$('#cmt_sch [name="order"]').val('ASC');
	$('#cmt_sch .top.comm > p > span').text('업체');
	$('#cmt_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	item_enterprise_list();
});

$(document).on('click', '#cmt_sch table tbody > tr', function(){
	$('[name="' + $('#cmt_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(3)').text());
	$('#cmt_sch a.close_in').trigger('click');//창닫기
});

function item_enterprise_list(page){
	$('#cmt_sch table tbody').html('');
	var html = new Array();
	if(page) $('#cmt_sch [name="item_enterprise_list"] [name="page"]').val( page );
	var data = $('#cmt_sch [name="item_enterprise_list"]').serializeArray();

	$.ajax({
		url: contextPath + '/item/enterprise/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
				html.push('	<input type="hidden" name="code" value="'+data.result[i].code+'">');
				html.push('	<td>'+data.result[i].name+'</td>');
				html.push('	<td>'+data.result[i].division+'</td>');
				html.push('</tr>');
			
				
			}
			$('#cmt_sch .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#cmt_sch table tbody').html( html.join('') );
			paging(data.total, $('#cmt_sch [name="item_enterprise_list"] [name="row"]').val(), $('#cmt_sch [name="item_enterprise_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}


///breakdown/list

//고장관리 팝업창
$(document).on('change', '#error_num_sch [name="row"]', function(){
	breakdown_list();
});
$(document).on('click', '#error_num_sch a.btn', function(){
	breakdown_list();
});
$(document).on('click', '#error_num_sch .pagination a', function(){
	breakdown_list( $(this).data('page') );
});
$(document).on('click', '[data-dialog="error_num_sch"]', function(){
	//새 팝업시 초기화
	$('#error_num_sch [name="page"]').val(1);
	$('#error_num_sch [name="column"]').val('dc_name');
	$('#error_num_sch [name="order"]').val('ASC');
	$('#error_num_sch .top.comm > p > span').text('고장관리');
	$('#error_num_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	breakdown_list();
});

$(document).on('click', '#error_num_sch .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#error_num_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('td:nth-child(3)').text());
	$('#error_num_sch a.close_in').trigger('click');//창닫기
});

var breakdown_code = new Array();
function breakdown_list(page){
	$('#error_num_sch table tbody').html('');
	var html = new Array();
	var data2 = new Array();
	if(page) $('#error_num_sch [name="breakdown_list"] [name="page"]').val( page );
	var data = $('#error_num_sch [name="breakdown_list"]').serializeArray();
		
	for(var i=0;i<data.length;i++) {
		if(data[i].value != '') data2.push(data[i]);
	}

	//검색
	if( $('#error_num_sch [name="breakdown_list"] [name="search_word"]').val() != '') 
		data.push({'name': $('#error_num_sch [name="breakdown_list_search"] [name="search_column"] option:selected').val(), 'value': $('#error_num_sch [name="breakdown_list_search"] [name="search_word"]').val()});
	$.ajax({
		url: contextPath + '/breakdown/list',
		type: 'post',
		data: data2,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr><input type="hidden" name="seq" value="'+data.result[i].seq+'"><input type="hidden" name="bk_code" value="'+data.result[i].bk_code+'">');
				html.push('	<input type="hidden" name="bk_start" value="'+data.result[i].bk_start+'">');
				html.push('	<input type="hidden" name="bk_receipt" value="'+data.result[i].bk_receipt+'">');
				//html.push('	<td>'+String(data.result[i].bk_standard).replace('1', '자사과실').replace('2' ,'상대과실').replace('3', '쌍방과실')+'</td>');
				html.push('	<td>'+String(data.result[i].bk_standard).replace('1', '단순정비').replace('2' ,'경정비').replace('3', '중정비').replace('4', '입고수리').replace('5', '원상복구')+'</td>');
				html.push('	<td>'+length14(data.result[i].bk_receipt, '-', ':', 2)+'</td>');
				html.push('	<td>'+data.result[i].dc_name+'</td>');
				html.push('	<td>'+data.result[i].dc_location+'</td>');
				html.push('</tr>');
				breakdown_code[ data.result[i].seq ] = data.result[i].bk_code;
			}
			$('#error_num_sch .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#error_num_sch table tbody').html( html.join('') );
			paging(data.total, $('#error_num_sch [name="breakdown_list"] [name="row"]').val(), $('#error_num_sch [name="breakdown_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}





//담당업무 리스트
var task_name = new Array();
function item_task_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/task/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				task_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="at_seq"], [name="sc_relation[]"]').html( html.join('') );
		}

	});
}
//직책 리스트
var job_name = new Array();
function item_job_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/job/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				job_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="j_seq"]').html( html.join('') );
		}

	});
}
var grade_name = new Array();
//직급 리스트
function item_grade_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/grade/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				grade_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="jg_seq"]').html( html.join('') );
		}

	});
}
//직위 리스트
var position_name = new Array();
function item_position_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/position/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	

				position_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="pos_seq"]').html( html.join('') );
		}

	});
}
//최종학력 리스트
var edu_name = new Array();
function item_edu_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/edu/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				edu_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="fe_seq"], [name="fe_seq[]"]').html( html.join('') );
		}

	});
}
//지사 리스트
var branch_name = new Array();
function item_branch_list(og_seq){

	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/branch/list',
		type: 'post',
		data : {division: og_seq},
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				branch_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="brc_seq"]').html( html.join('') );
		}

	});
}

var org_name2 = new Array();
function org_list2(){
	//var html = new Array();
	//html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/org/list',
		type: 'post',
		data: {section : 11 },
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				//html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				org_name2[ data.result[i].og_code ] = data.result[i].og_name;
				
			}
			//$('[name="brc_seq"]').html( html.join('') );
		}

	});
}
//처리구분 리스트
var process_name = new Array();
function item_process_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/process/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				process_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="prc_seq"]').html( html.join('') );
		}

	});
}
//설비 리스트 - 보류
//item_system_list();
var system_name = new Array();
function item_system_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/system/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				system_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="sys_seq"], [name="sys_name"]').html( html.join('') );
		}

	});
}
//직업구분 리스트, 미사용
var division_name = new Array();
function item_division_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/division/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				division_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="wd_seq"]').html( html.join('') );
		}

	});
}
//근무형태 리스트
var type_name = new Array();
function item_type_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/type/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				type_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="wt_seq"], [name="wt_seq[]"]').html( html.join('') );
		}

	});
}
//콜근무수당 리스트 //미사용
var pay_name = new Array();
function item_pay_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/pay/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].amount+'</option>');	
				pay_name[ data.result[i].seq ] = data.result[i].amount;
			}
			$('[name="pay_name"]').html( html.join('') );
		}

	});
}
//모델 리스트
var model_name = new Array();
function item_model_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/model/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				model_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="md_seq"], [name="md_name"]').html( html.join('') );
		}

	});
}
//안전용품 리스트
var safe_name = new Array();
function item_safe_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/safe/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				safe_name[ data.result[i].seq ] = data.result[i].name;
				
				/*
				if (item){
					item[i] = {'code' : data.result[i].code , 'name' : data.result[i].name}
					item.push(item[i]);
				}
				*/
			}
			$('[name="sd_product"]').html( html.join('') );
			/*
			if (item){
				return item;
			}
			*/

		}

	});
}
var fuel_name = new Array();
//연료셀렉트 option
function item_fuel_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/fuel/list',
		type: 'post',
		data: { section: 11 },
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				fuel_name[ data.result[i].seq ] = data.result[i].name;
			}
			$('[name="ve_fuel"]').html( html.join('') );
		}

	});
}
//예산과목
var budget_name = new Array();
item_budget_list();
function item_budget_list(){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/item/budget/list',
		type: 'post',
		data: { section: 11 },
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) pop_alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].seq+'">'+data.result[i].name+'</option>');	
				budget_name[ data.result[i].seq ] = data.result[i].name;

			}
			$('[name="bg_seq"]').html( html.join('') );
		}

	});
}

//저장품 팝업창
$(document).on('change', '#storage_order [name="row"]', function(){
	breakdown_part_list();
});
$(document).on('click', '#storage_order a.btn', function(){
	breakdown_part_list();
});
$(document).on('click', '#storage_order .pagination a', function(){
	breakdown_part_list( $(this).data('page'));
});
$(document).on('click', '[data-dialog="storage_order"]', function(){
	//새 팝업시 초기화
	$('#storage_order [name="page"]').val(1);
	$('#storage_order [name="column"]').val('seq');
	$('#storage_order [name="order"]').val('ASC');
	$('#storage_order .top.comm > p > span').text('저장품');
	$('#storage_order [name="target"]').val( $(this).prev().prev().attr('name') );

	var target_num = $(this).attr('data-num');
	breakdown_part_list('','', target_num);
});

$(document).on('click', '#storage_order .table.tb_scroll tbody > tr', function(){
	var target_num = $('#storage_order [name=target_num]').val();
	if (target_num != ''){
		$('[data-dialog="storage_order"][data-num="'+target_num+'"]').prev().prev().val($(this).find('[name="pt_seq"]').val());
		$('[data-dialog="storage_order"][data-num="'+target_num+'"]').prev().val($(this).find('td:nth-child(5)').text().trim());
	} else {
		$('[name="' + $('#storage_order [name="target"]').val()+ '"]').val( $(this).find('[name="pt_seq"]').val()  ).next().val( $(this).find('td:nth-child(5)').text().trim());
	}
	$('#storage_order a.close_in').trigger('click');//창닫기
});

var breakdown_part_name = new Array();
function breakdown_part_list(page, section, target_num){

	if (target_num) $('#storage_order [name="breakdown_part_list"] [name=target_num]').val(target_num);

	$('#storage_order table tbody').html('');
	var html = new Array();
	if(page) $('#storage_order [name="breakdown_part_list"] [name="page"]').val( page );
	var data = $('#storage_order [name="breakdown_part_list"]').serializeArray();
	$.ajax({
		url: contextPath + '/breakdown/part/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr>');
				html.push('<tr><input type="hidden" name="pt_seq" value="'+data.result[i].seq+'">');
				html.push('<td>'+data.result[i].og_name+'</td>');
				html.push('<td>'+data.result[i].pt_code+'</td>');
				html.push('<td>'+system_name[ data.result[i].sys_seq ]+'</td>');
				html.push('<td>'+data.result[i].pt_name+'</td>');
				html.push('<td>'+data.result[i].or_total+'</td>');
				html.push('</tr>');
				breakdown_part_name[ data.result[i].seq ] = data.result[i].pt_name;
			}
			$('#storage_order .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#storage_order table tbody').html( html.join('') );
			paging(data.total, $('#storage_order [name="breakdown_part_list"] [name="row"]').val(), $('#storage_order [name="breakdown_part_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}

//예비품 팝업창
$(document).on('change', '#spare_order [name="row"]', function(){
	breakdown_part_list2();
});
$(document).on('click', '#spare_order a.btn', function(){
	breakdown_part_list2();
});
$(document).on('click', '#spare_order .pagination a', function(){
	breakdown_part_list2( $(this).data('page') );
});
$(document).on('click', '[data-dialog="spare_order"]', function(){
	//새 팝업시 초기화
	$('#spare_order [name="page"]').val(1);
	$('#spare_order [name="column"]').val('seq');
	$('#spare_order [name="order"]').val('ASC');
	$('#spare_order .top.comm > p > span').text('예비품');
	$('#spare_order [name="target"]').val( $(this).prev().prev().attr('name') );

	var target_num = $(this).attr('data-num');
	breakdown_part_list2('', '', target_num);
});

$(document).on('click', '#spare_order .table.tb_scroll tbody > tr', function(){
	var target_num = $('#spare_order [name=target_num]').val();
	if (target_num != ''){
		$('[data-dialog="spare_order"][data-num="'+target_num+'"]').prev().prev().val($(this).find('[name="pt_seq"]').val());
		$('[data-dialog="spare_order"][data-num="'+target_num+'"]').prev().val($(this).find('td:nth-child(5)').text().text().trim());
	} else {
		$('[name="' + $('#spare_order [name="target"]').val()+ '"]').val( $(this).find('[name="pt_seq"]').val()  ).next().val( $(this).find('td:nth-child(5)').text().trim());
	}
	$('#spare_order a.close_in').trigger('click');//창닫기
});


var breakdown_part_name2 = new Array();
function breakdown_part_list2(page, section, target_num){
	if (target_num) $('#spare_order [name="breakdown_part_list2"] [name=target_num]').val(target_num);

	$('#spare_order table tbody').html('');
	var html = new Array();
	if(page) $('#spare_order [name="breakdown_part_list2"] [name="page"]').val( page );
	var data = $('#spare_order [name="breakdown_part_list2"]').serializeArray();
	$.ajax({
		url: contextPath + '/breakdown/part/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr>');
				html.push('<tr><input type="hidden" name="pt_seq" value="'+data.result[i].seq+'">');
				html.push('<td>'+budget_name[ data.result[i].bg_seq ]+'</td>');
				html.push('<td>'+data.result[i].pt_code+'</td>');
				html.push('<td>'+data.result[i].ds_name+'</td>');
				html.push('<td>'+data.result[i].pt_name+'</td>');
				html.push('<td>'+data.result[i].pt_spec+'</td>');
				html.push('</tr>');

				breakdown_part_name2[ data.result[i].seq ] = data.result[i].pt_name;
			}
			$('#spare_order .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#spare_order table tbody').html( html.join('') );
			paging(data.total, $('#spare_order [name="breakdown_part_list2"] [name="row"]').val(), $('#spare_order [name="breakdown_part_list2"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}


//임의발주 팝업
$(document).on('change', '#optional_sch [name="row"]', function(){
	part_order_list();
});
$(document).on('click', '#optional_sch a.btn', function(){
	part_order_list();
});
$(document).on('click', '#optional_sch .pagination a', function(){
	part_order_list( '', $(this).data('page') );
});

$(document).on('click', '[data-dialog="optional_sch"]', function(){
	$('#request_order').removeClass('dialog_open');
	//새 팝업시 초기화
	$('#optional_sch [name="page"]').val(1);
	$('#optional_sch [name="column"]').val('seq');
	$('#optional_sch [name="order"]').val('ASC');
	$('#optional_sch [name="target"]').val( $(this).prev().prev().attr('name') );
	part_order_list($(this).attr('data-num'));
});

$(document).on('click', '#optional_sch .table.tb_scroll tbody > tr', function(){
	var target_num = $('#optional_sch [name=target_num]').val();
	if (target_num != ''){
		$('[data-dialog="optional_sch"][data-num="'+target_num+'"]').prev().prev().val($(this).find('[name="pt_seq"]').val());
		$('[data-dialog="optional_sch"][data-num="'+target_num+'"]').prev().val($(this).find('td:nth-child(5)').text());
	} else {
		$('[name="' + $('#optional_sch [name="target"]').val()+ '"]').val( $(this).find('[name="pt_seq"]').val()  ).next().val( $(this).find('td:nth-child(5)').text());
	}
	$('#optional_sch a.close_in').trigger('click');//창닫기
});

var part_order_name = new Array();
function part_order_list(target_num, page){

	$('#optional_sch [name="part_order_list"] [name=target_num]').val(target_num);
	$('#optional_sch table tbody').html('');
	var html = new Array();
	if(page) $('#optional_sch [name="part_order_list"] [name="page"]').val( page );
	var data = $('#optional_sch [name="part_order_list"]').serializeArray();
	$.ajax({
		url: contextPath + '/part/order/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
				html.push('<tr>');
				html.push('<tr><input type="hidden" name="pt_seq" value="'+data.result[i].seq+'">');
				html.push('<td>'+budget_name[ data.result[i].bg_seq ]+'</td>');
				html.push('<td>'+data.result[i].pt_code+'</td>');
				html.push('<td>'+data.result[i].ds_name+'</td>');
				html.push('<td>'+data.result[i].pt_name+'</td>');
				html.push('<td>'+data.result[i].pt_spec+'</td>');
				html.push('</tr>');
				part_order_name[ data.result[i].seq ] = data.result[i].pt_name;
			}
			$('#optional_sch .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#optional_sch table tbody').html( html.join('') );
			paging(data.total, $('#optional_sch [name="part_order_list"] [name="row"]').val(), $('#optional_sch [name="part_order_list"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}

//요청발주 팝업
$(document).on('change', '#request_order [name="row"]', function(){
	part_order_list2();
});
$(document).on('click', '#request_order a.btn', function(){
	part_order_list2();
});
$(document).on('click', '#request_order .pagination a', function(){
	part_order_list2( $(this).data('page') );
});
$(document).on('click', '[data-dialog="request_order"]', function(){
	$('#optional_sch').removeClass('dialog_open');
	//새 팝업시 초기화
	$('#request_order [name="page"]').val(1);
	$('#request_order [name="column"]').val('seq');
	$('#request_order [name="order"]').val('ASC');
	$('#request_order [name="sr_seq"]').val( $('[name=payment_detail] [name=pm_storage]').val());
	$('#request_order [name="target"]').val( $(this).prev().prev().attr('name') );
	part_order_list2();
});

$(document).on('click', '#request_order .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#request_order [name="target"]').val()+ '"]').val( $(this).find('[name="pt_seq"]').val()  ).next().val( $(this).find('td:nth-child(3)').text());
	$('#request_order a.close_in').trigger('click');//창닫기
});

function part_order_list2(page){
	$('#request_order table tbody').html('');
	var html = new Array();
	if(page) $('#request_order [name="part_order_list2"] [name="page"]').val( page );
	var data = $('#request_order [name="part_order_list2"]').serializeArray();
	$.ajax({
		url: contextPath + '/part/order/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			for(var i=0;i<data.result.length;i++) {
			html.push('<tr>');
			html.push('<td>');
			html.push('	<input type="hidden" name="og_seq" value="'+data.result[i].og_seq+'">');
			html.push(+data.result[i].og_name+'</td>');
			html.push('<td>'+data.result[i].pt_code+'</td>');
			html.push('<td>'+data.result[i].sys_name+'</td>');
			html.push('<td>'+data.result[i].pt_name+'</td>');
			html.push('<td>'+data.result[i].or_total+'</td>');
			html.push('</tr>');
			}
			$('#request_order .tb_bottom .count > p > span').text( number_format(data.total) );
			$('#request_order table tbody').html( html.join('') );
			paging(data.total, $('#request_order [name="part_order_list2"] [name="row"]').val(), $('#request_order [name="part_order_list2"] [name="page"]').val()) 
		}, error: function(){
			alert('데이터 로드에 실패하였습니다.');
		}
	});
}


function getbase64(input, expression) {
    if (input.files && input.files[0])
    {
        var reader = new FileReader();
 
            reader.onload = function (e) {
                $(expression).attr('src', e.target.result);
           }
           reader.readAsDataURL(input.files[0]);
     }
}

//엑셀출력
function export_excel( obj ){
	var table_tmp = obj.parents('.dialog_open').find('table');
	var filename = obj.parents('.dialog_open').find('h2').text();
	table_tmp.tableExport(
		{
			fileName: filename+'_'+dayjs().format('YYYYMMDD'),
			type:'excel',
			numbers: {output: false}, 
            excelFileFormat:'xlshtml',
			mso: {
	            worksheetName: '시트',
				fileFormat: 'xlsx',
				xlsx: {
					date: 14,
					numbers: 0,
					currency: 164,
					onHyperlink: null
				}
			},
			htmlContent: true,
			html: 'yyyy-mm-dd'
		});
}