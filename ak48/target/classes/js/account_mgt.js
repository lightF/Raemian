$(document).ready(function() {
	list();
});


$(document).on('click', '.btn_search', function() {
	list();
});


//리스트 정렬
$(document).on('click', '.tbl_account th[data-order]', function() {
	list();
});


//페이지 이동
$(document).on('click', '.account .paging a', function() {
	$('[name=frm_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});

$(document).on('click', '.dialog .close', function() {
	list();
});

//등록 팝업 / 상세내역 팝업 불러오기
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');

	$('.account_pop [name=type]').val(type);
	$('.account_pop .btn_area a').hide();

	if (type == 'new'){
		$('[name=frm_detail] input').val('');
		$('[name=frm_detail] select option').prop('selected', 'selected');
		$('[name=frm_detail] a.close').show();

	} else {
		var seq = $(this).find('[name=seq]').val();
		$('[name=frm_detail] .btn.xlsx, [name=frm_detail] .btn_remove').show();
		detail(seq);
	}
	
});

//주소 검색
$(document).on('click', '.account_pop .btn_addr', function() {
	daum_postcode();
});

//거래처 등록
$(document).on('click', '.account_pop .btn_save', function() {
	var chk = '';
		$('[name=frm_detail] input').each(function(i){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
		}
	});
	
	if(chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}

	pop_confirm('저장 하시겠습니까?', function(){
		var params	= $('[name=frm_detail]').serializeArray();
		$.ajax({
			url: contextPath + '/facility/account/edit',
			type: 'post',
			dataType: 'json',
			data: params,
			success: function(data) {
				if (data.code == 1){
					pop_alert('저장 되었습니다.');

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패 하였습니다.');
				}

			}, complete: function() {
				$('.account_pop').removeClass('dialog_open');
				$('.account [name=frm_search]')[0].reset();
				list();
			}
		});
	
	});
	
	

});


//거래처 삭제
$(document).on('click', '.account_pop .btn_remove', function() {
	var seq = $('form[name=frm_detail] [name=seq]').val();
	
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/facility/account/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : seq},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 되었습니다.');

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제 실패 하였습니다.');
				}

			}, complete: function() {
				$('.account_pop').removeClass('dialog_open');
				list();
			}
		});
	});
	
});


//등록창 닫기
$(document).on('click', '.account_pop .close_in', function() {
	$('.account_pop').removeClass('dialog_open');

});

//엑셀다운
$(document).on('click', '[name=frm_detail] .btn.xlsx ', function() {
	var seq = $('[name=frm_detail] [name=seq]').val();
	window.location.href = contextPath +'/facility/account/detail/excel?seq='+seq;
});

function list(){
	loader();

	var params	= $('[name=frm_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});
	
	$.ajax({
		url: contextPath + '/facility/account/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			$('.tbl_account tbody').html('');

			if (data.code == 1){

				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr class="btn_add" data-dialog="account_add_view" data-type="modify">');
					ele.push('	<td><input tye="hidden" name="seq" value="'+data.result[i].seq+'">'+data.result[i].seq+'</td>');
					ele.push('	<td>'+data.result[i].act_company+'</td>');
					ele.push('	<td>'+data.result[i].act_ceo+'</td>');
					ele.push('	<td>'+data.result[i].act_manager+'</td>');
					ele.push('	<td>'+data.result[i].act_hp+'</td>');
					ele.push('	<td>'+data.result[i].act_fax+'</td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="6">검색된 데이터가 없습니다.</td></tr>');

				$('.tbl_account tbody').html(ele.join(''));
				$('.count_tot').text(number_format(data.total));
				
				paging(data.total, $('[name=row] option:selected').val(), $('[name=frm_search] [name=page]').val());
				

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}, error:function(){
			close_loader();
			pop_alert('데이터 로드에 실패하였습니다.');
		}
	});

}


function detail(seq){

	$.ajax({
		url: contextPath + '/facility/account/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				$('[name=frm_detail] [name=seq]').val(data.result[0].seq);
				$('[name=frm_detail] [name=act_company]').val(data.result[0].act_company);
				$('[name=frm_detail] [name=act_number]').val(data.result[0].act_number);
				$('[name=frm_detail] [name=act_ceo]').val(data.result[0].act_ceo);
				$('[name=frm_detail] [name=act_status]').val(data.result[0].act_status);
				$('[name=frm_detail] [name=act_phone]').val(data.result[0].act_phone);
				$('[name=frm_detail] [name=act_event]').val(data.result[0].act_event);
				$('[name=frm_detail] [name=act_fax]').val(data.result[0].act_fax);
				$('[name=frm_detail] [name=act_email]').val(data.result[0].act_email);
				$('[name=frm_detail] [name=act_zip]').val(data.result[0].act_zip);
				$('[name=frm_detail] [name=act_addr]').val(data.result[0].act_addr);
				$('[name=frm_detail] [name=act_detail]').val(data.result[0].act_detail);
				$('[name=frm_detail] [name=act_url]').val(data.result[0].act_url);
				$('[name=frm_detail] [name=act_manager]').val(data.result[0].act_manager);
				$('[name=frm_detail] [name=act_hp]').val(data.result[0].act_hp);
				$('[name=frm_detail] [name=act_tag]').val(data.result[0].act_tag);
				$('[name=frm_detail] [name=act_use] option[value='+data.result[0].act_use+']').prop('selected', 'selected');

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}, complete: function() {
			
		}
	});

}

function daum_postcode(){

	 new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var addr = ''; // 주소 변수
			var extraAddr = ''; // 참고항목 변수

			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				addr = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				addr = data.jibunAddress;
			}

			// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
			if(data.userSelectedType === 'R'){
				// 법정동명이 있을 경우 추가한다. (법정리는 제외)
				// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
				if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
					extraAddr += data.bname;
				}
				// 건물명이 있고, 공동주택일 경우 추가한다.
				if(data.buildingName !== '' && data.apartment === 'Y'){
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				}
				// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
				if(extraAddr !== ''){
					extraAddr = ' (' + extraAddr + ')';
				}
				// 조합된 참고항목을 해당 필드에 넣는다.
				document.getElementsByName("act_addr")[0].value = extraAddr;
			
			} else {
				document.getElementsByName("act_addr").value = '';
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementsByName('act_zip')[0].value = data.zonecode;
			document.getElementsByName("act_addr")[0].value = addr;
			// 커서를 상세주소 필드로 이동한다.
			document.getElementsByName("act_detail")[0].focus();
		}
	}).open();
}
