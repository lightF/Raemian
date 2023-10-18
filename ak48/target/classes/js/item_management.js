var org_html = new Array();//지사에만 사용됨
org_html = org_list11();

$(document).ready(function () {
	$('.item_management table > tbody').sortable({
		stop: function () {
			item_reload();
		}
	});
});
//삭제
$(document).on('click', '.item_management .tb_btns_right li', function () {
	$('.item_management tbody tr:nth-child(' + ($(this).index() + 1) + ')').remove();
	$(this).remove();
	item_reload();
});
//변경
$(document).on('change', '.item_management [name="item_type"]', function () {
	item_table($(this).val());
});
//추가
$(document).on('click', '.item_management .add', function () {
	var item_url = $('.item_management [name="item_type"]').val();
	item_url = item_url.replaceAll('_', '/');
	if (item_url == '') {
		pop_alert('항목을 선택해주세요');
		return false;
	}
	if (!$('.item_management .table_wrap table tbody tr:first-child [name="code[]"]').val()) $('.item_management .table_wrap table tbody tr').remove();
	var html = new Array();
	var html2 = new Array();

	html.push('<tr>');
	html.push(' <input type="hidden" name="seq[]" value="">');
	html.push('	<input type="hidden" name="code[]" value="' + ($('.item_management .table_wrap table tbody tr').length + 1) + '">');
	html.push('	<td>' + ($('.item_management .table_wrap table tbody tr').length + 1) + '</td>');
	html.push('<td>');
	html.push('<div>');
	if (item_url == '/item/pay/list') html.push('<input type="number" min="0" name="name[]" placeholder="금액을 입력하세요."/>');
	else html.push('<input type="text" name="name[]" placeholder="이름을 입력하세요."/>');
	html.push('</div>');
	html.push('</td>');
	switch (item_url) {
		case '/item/branch/list'://지사리스트
			html.push('<td><select name="division[]">');
			for (var o_i = 0; o_i < org_html.length; o_i++) html.push(org_html[o_i]);
			html.push('</td></select>');
			break;
		case '/item/system/list'://설비리스트
			html.push('<td><select name="division[]">');
			html.push('<option value="" selected>선택</option>');
			html.push('<option value="1">영업시스템</option>');
			html.push('<option value="2">ITS</option>');
			html.push('<option value="3">제한차량</option>');
			html.push('<option value="4">기타</option>');
			html.push('</select></td>');
			break;
	}

	html.push('</tr>');

	html2.push('<li><a class="btn">삭제</a></li>');

	$('.item_management .table_wrap table tbody').append(html.join(''));
	$('.item_management .tb_btns_right ol').append(html2.join(''));
});
//저장
$(document).on('click', '.item_management .update', function () {
	if ($('.item_management [name="item_type"]').val() == '') {
		pop_alert('항목을 선택해주세요');
		return false;
	}
	var data = $('.item_management [name="item"]').serializeArray();
	data = commatoint(data);
	item_table_save($('.item_management [name="item_type"]').val(), data);

});
function item_table_save(item_url, data) {
	if (!item_url) {
		pop_alert('저장위치가 지정되지 않았습니다.');
		return false;
	}

	item_url = item_url.replaceAll('_', '/').replace('list', 'edit');

	$.ajax({
		url: contextPath + item_url,
		type: 'post',
		data: data,
		dataType: 'json',
		traditional: true,
		success: function (data) {
			if (data.code == 1) {
				pop_alert('저장되었습니다.');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {pop_alert('저장에 실패 하였습니다');}
		}, complete: function () {
			item_table($('.item_management [name="item_type"]').val());
		}
	});
}

function item_table(item_url) {
	var html_head = new Array();
	var colgroup = new Array();
	var html = new Array();
	var html2 = new Array();

	$('.item_management .table_wrap table thead').html('');
	$('.item_management .table_wrap table tbody').html('');
	$('.item_management .tb_btns_right ol').html('');

	if (!item_url) html.push('<tr><td colspan="2">조회된 데이터가 없습니다.</td></tr>');

	item_url = item_url.replaceAll('_', '/');
	//console.log(item_url);
	switch (item_url) {
		case '/item/branch/list'://지사리스트
			colgroup.push('	<col width="10%">');
			colgroup.push('	<col width="50%">');
			colgroup.push('	<col width="40%">');

			html_head.push('<tr>');
			html_head.push('	<th>순서</th>');
			html_head.push('	<th>항목명</th>');
			html_head.push('	<th>조직도</th>');
			html_head.push('</tr>');
			break;
		case '/item/system/list'://설비리스트
			colgroup.push('	<col width="10%">');
			colgroup.push('	<col width="50%">');
			colgroup.push('	<col width="40%">');

			html_head.push('<tr>');
			html_head.push('	<th>순서</th>');
			html_head.push('	<th>항목명</th>');
			html_head.push('	<th>설비구분</th>');
			html_head.push('</tr>');
			break;
		case '/item/pay/list'://콜근무수당리스트
			colgroup.push('	<col width="10%">');
			colgroup.push('	<col width="90%">');

			html_head.push('<tr>');
			html_head.push('	<th>순서</th>');
			html_head.push('	<th>금액</th>');
			html_head.push('</tr>');
			break;
		case '/item/model/list'://콜근무수당리스트
			colgroup.push('	<col width="10%">');
			colgroup.push('	<col width="50%">');
			colgroup.push('	<col width="40%">');


			html_head.push('<tr>');
			html_head.push('	<th>순서</th>');
			html_head.push('	<th>항목명</th>');
			html_head.push('	<th>코드</th>');
			html_head.push('</tr>');
		break;
		case '/item/enterprise/list'://업체리스트
			colgroup.push('	<col width="10%">');
			colgroup.push('	<col width="50%">');
			colgroup.push('	<col width="40%">');


			html_head.push('<tr>');
			html_head.push('	<th>업체코드</th>');
			html_head.push('	<th>업체명</th>');
			html_head.push('	<th>사용여부</th>');
			html_head.push('</tr>');
		break;
		default:
			colgroup.push('	<col width="10%">');
			colgroup.push('	<col width="90%">');

			html_head.push('<tr>');
			html_head.push('	<th>순서</th>');
			html_head.push('	<th>항목명</th>');
			html_head.push('</tr>');
		break;
	}

	$.ajax({
		url: contextPath + item_url,
		type: 'post',
		dataType: 'json',
		success: function (data) {
			if (data.code == 1){
				for (var i = 0; i < data.result.length; i++) {
					html.push('<tr>');
					html.push('	<input type="hidden" name="seq[]" value="' + data.result[i].seq + '">');
					html.push('	<input type="hidden" name="code[]" value="' + data.result[i].code + '">');
					html.push('	<td>' + (i + 1) + '</td>');

					if (item_url == '/item/pay/list') html.push('	<td><input type="text" class="input_number" name="name[]" value="' + data.result[i].name + '"></td>');
					else html.push('	<td><input type="text" name="name[]" value="' + data.result[i].name + '"></td>');
					//설비구분 division (1:영업시스템, 2:ITS, 3:제한차량, 4:기타)
					if (html_head.length > 4 && item_url != '/item/model/list') {
						if (item_url == '/item/system/list') {
							html.push('	<td><select name="division[]">');
							if (data.result[i].division < 1) html.push('<option value="" selected>선택</option>');
							else html.push('<option value="">선택</option>');
							if (data.result[i].division == 1) html.push('<option value="1" selected>영업시스템</option>');
							else html.push('<option value="1">영업시스템</option>');
							if (data.result[i].division == 2) html.push('<option value="2" selected>ITS</option>');
							else html.push('<option value="2">ITS</option>');
							if (data.result[i].division == 3) html.push('<option value="3" selected>제한차량</option>');
							else html.push('<option value="3">제한차량</option>');
							if (data.result[i].division == 4) html.push('<option value="4" selected>기타</option>');
							else html.push('<option value="4">기타</option>');
							html.push('</select></td>');
						} else {//지사 - 조직도(사업단)선택
							html.push('	<td><select name="division[]">');
							//						html.push( org_html );
							for (var o_i = 0; o_i < org_html.length; o_i++) {
								html.push(org_html[o_i].replace('value="' + data.result[i].division + '"', 'value="' + data.result[i].division + '" selected'));
							}
							html.push('</select></td>');
						}
					}else if(item_url == '/item/model/list'){
						html.push('	<td><input type="text" name="division[]" value="' + data.result[i].division + '"></td>');
					}
					html.push('</tr>');

					html2.push('<li><a class="btn">삭제</a></li>');
				}
				if (i == 0) {
					if (html_head.length > 4) html.push('<tr><td colspan="3">검색된 데이터가 없습니다.</td></tr>');
					else html.push('<tr><td colspan="2">검색된 데이터가 없습니다.</td></tr>');
				}
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}, complete: function () {
			$('.item_management .table_wrap table colgroup').html(colgroup.join(''));
			$('.item_management .table_wrap table thead').html(html_head.join(''));
			$('.item_management .table_wrap table tbody').html(html.join(''));
			$('.item_management .tb_btns_right ol').html(html2.join(''));

		}
	});
}

function item_reload() {
	//번호재정렬
	$('.item_management table > tbody > tr').each(function () {
		$(this).find('[name="code[]"]').val(($(this).index() + 1));
		$(this).find('td:nth-child(3)').text(($(this).index() + 1));
	});
}

//항목관리 - 사업단 셀렉트
//연료셀렉트 option
function org_list11() {
	var html = new Array();
	html.push('<option value="">선택</option>');
	$.ajax({
		url: contextPath + '/org/list',
		type: 'post',
		data: { section: 11 },
		dataType: 'json',
		success: function (data) {
			if (data.code == 1) {
				for (var i = 0; i < data.result.length; i++) {
					html.push('<option value="' + data.result[i].seq + '">' + data.result[i].og_name + '</option>');
				}
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}
	});
	return html;
}