$(document).ready(function() {
	list();
});
	

$(document).on('click', '.btn_search', function() {
	list();
});

//페이지 이동
$(document).on('click', '.receipts .paging a', function() {
	$('[name=payment_search] [name=page]').val($(this).attr('data-page'));
	list();

});

$(document).on('change', '[name=row]', function() {
	list();
});

$(document).on('click', '.payment_list th[data-order]', function() {
	list();
});


$(document).on('click', '.dialog .close', function() {
	list();
});

//등록 / 상세팝업
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
	if (type == 'new'){
		$('[name=payment_detail] input').val('').attr('readonly', false);
		$('[name=payment_detail] input[type=radio]').attr('disabled', false);
		$('[name=payment_detail] a, [name=payment_detail] button').show();
		$('[name=payment_detail] .btn_area a.btn_remove').hide();
		$('.detail_list tbody tr').remove();
		//add_list($('[name=payment_detail] [name=pm_division]:checked').val());

	} else {
		$('[name=payment_detail] input').attr('readonly', true);
		$('[name=payment_detail] input[type=radio]').attr('disabled', true);
		$('[name=payment_detail] a, [name=payment_detail] button').hide();
		$('[name=payment_detail] .btn_area a.btn_remove').show();
		var seq = $(this).closest('tr').attr('data-seq');
		$('[name=payment_detail] [name="seq"]').val(seq);
		detail(seq);
		
	}

});


$(document).on('click', '[name=payment_detail] [name=pm_division], .detail_list .add_btn', function(){
	if ($('[name=payment_detail] [name=pm_place]').val() == '') {
		pop_alert('납품장소를 선택해 주세요.');
		return false;
	} else if ($('[name=payment_detail] [name=pm_storage]').val() == ''){
		pop_alert('배정창고를 선택해 주세요.');
		return false;
	}else {
		add_list($('[name=payment_detail] [name=pm_division]:checked').val());
	}


});

$(document).on('click', '#optional_sch .table.tb_scroll tbody > tr', function(){
	var target_num = $('#optional_sch [name=target_num]').val();
	if (target_num != ''){
		$('[data-dialog="optional_sch"][data-num="'+target_num+'"]').parent().parent().prev().find('input.or_seq').val($(this).find('td:nth-child(3)').text().trim());
		$('[data-dialog="optional_sch"][data-num="'+target_num+'"]').parent().parent().prev().find('input.or_from').val($(this).find('td:nth-child(3)').text().trim());
		$('[data-dialog="optional_sch"][data-num="'+target_num+'"]').prev().val($(this).find('td:nth-child(5)').text().trim());
	}

	$('#optional_sch a.close_in').trigger('click');//창닫기
});

$(document).on('click', '#request_order .table.tb_scroll tbody > tr', function(){
	var target_num = $('#request_order [name=target_num]').val();
	if (target_num != ''){
		
		$('[data-dialog="request_order"][data-num="'+target_num+'"]').parent().parent().prev().find('input.or_seq').val($(this).find('td:nth-child(3)').text().trim());
		$('[data-dialog="request_order"][data-num="'+target_num+'"]').parent().parent().prev().find('input.or_from').val($(this).find('td:nth-child(3)').text().trim());
		$('[data-dialog="request_order"][data-num="'+target_num+'"]').prev().val($(this).find('td:nth-child(5)').text().trim());
	}

	$('#request_order a.close_in').trigger('click');//창닫기
});



//발주요청 삭제
$(document).on('click', '.detail_list .del_btn', function(){
	$(this).closest('tr').remove();
});

$(document).on('change', '[name=payment_detail] [name=pm_division]', function(){
	$('.detail_list tbody tr').remove();
});

$(document).on('click', '.detail_list a[data-dialog]', function(){
	if ($(this).attr('data-dialog') == 'optional_sch'){$('#optional_sch').addClass('dialog_open');
	} else {$('#request_order').addClass('dialog_open');}
});

//수불 삭제
$(document).on('click', '[name=payment_detail] .btn_remove', function() {
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/part/payment/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : $('[name=payment_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 되었습니다.');
					$('.receipts_pop').removeClass('dialog_open');
					list();

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제에 실패하였습니다.');
				}
			}
		});
	});
});

//엑셀다운
$(document).on('click', '[name=payment_detail] .btn_down.xlsx ', function() {
	var seq = $('[name=payment_detail] [name=seq]').val();
	window.location.href = contextPath +'/part/payment/detail/excel?seq='+seq;
});

//수불 저장
$(document).on('click', '[name=payment_detail] .btn_save', function() {
	var chk = '';

	$('[name=payment_detail] input').each(function(i){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
		}
	});
	
	if(chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}

	var params	= $('[name=payment_detail]').serializeArray();

	pop_confirm('저장 하시겠습니까?', function(){

		$.ajax({
			url: contextPath + '/part/payment/edit',
			type: 'post',
			dataType: 'json',
			data: params,
			success: function(data) {
				if (data.code == 1){
					pop_alert('저장 되었습니다.');
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}

			}, complete: function() {
				$('[name=part_detail] .input_file').removeClass('upload');
				$('[name=part_detail] a.file_del').remove();
				$('[name=part_detail] a.img_view img').attr('src', '');
				$('[name=payment_search]')[0].reset();
				list();
			}
		});
	});

	
});

function list(){
	loader();

	var params	= $('[name=payment_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/part/payment/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					var confirm = '', cls = ''; 

					switch(data.result[i].pm_confirm){
						case 1 : confirm = '미승인'; break;
						case 2 : confirm = '승인'; cls = 'wait'; break;
						case 3 : confirm = ''; break;
					}

					ele.push('<tr data-seq="'+data.result[i].seq+'">');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+data.result[i].seq+'</td>');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+length14(data.result[i].pm_date, '-', ':', 3)+'</td>');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+data.result[i].og_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+data.result[i].sr_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+data.result[i].act_company+'</td>');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+data.result[i].pt_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="receipts_log_view" data-type="modify">'+data.result[i].pm_contract+'</td>');
					ele.push('	<td class="btn_add">'+data.result[i].per_name+'</td>');
					/*
					ele.push('	<td>');
					ele.push('		<a class="'+cls+' btn_add" data-dialog="receipts_log_view" data-type="modify" data-mod="'+data.result[i].pm_confirm+'">'+confirm+'</a>');
					ele.push('	</td>');
					*/
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="7">검색된 데이터가 없습니다.</td></tr>');

				$('.payment_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=payment_search] [name=page]').val());

				

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});
}

function detail(seq){

	$.ajax({
		url: contextPath + '/part/payment/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result[0];
				var ele	 = new Array();

				$('[name=payment_detail] [name=pm_contract]').val(item.pm_contract);
				$('[name=payment_detail] [name=pm_letter]').val(item.pm_letter);
				$('[name=payment_detail] [name=og_seq]').val(item.og_seq);
				$('[name=payment_detail] [name=og_seq_name]').val(item.og_seq_name);
				$('[name=payment_detail] [name=act_seq]').val(item.act_seq);
				$('[name=payment_detail] [name=act_seq_name]').val(item.act_seq_name);

				$('[name=payment_detail] [name=pm_date]').val(length14(item.pm_date, '-', ':', 3));
				$('[name=payment_detail] [name=pm_place]').val(item.pm_place);
				$('[name=payment_detail] [name=pm_place_name]').val(item.pm_place_name);

				$('[name=payment_detail] [name=pm_delivery]').val(length14(item.pm_delivery, '-', ':', 3));
				$('[name=payment_detail] [name=pm_storage]').val(item.pm_storage);
				$('[name=payment_detail] [name=pm_storage_name]').val(item.pm_storage_name);

				$('[name=payment_detail] [name=per_seq]').val(item.per_seq);
				$('[name=payment_detail] [name=per_seq_name]').val(item.per_seq_name);
				$('[name=payment_detail] [name=pm_division][value='+item.pm_division+']').prop('checked', true);


				for(var i=0; i < data.result2.length; i++){
					ele.push('<tr>');
					ele.push('	<td>');
					ele.push('		<input type="hidden" name="or_seq[]" class="or_seq" value="'+data.result2[i].or_seq+'" readonly>');
					ele.push('		<input type="hidden" name="or_from[]" class="or_from" value="'+data.result2[i].or_from+'" readonly>');
					ele.push('		<input type="text" name="pt_seq[]" value="'+data.result2[i].pt_seq+'" placeholder="부품명검색" readonly>');
					ele.push('	</td>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp">');
					ele.push('			<input type="hidden" value="'+data.result2[i].pt_seq+'" readonly>');
					ele.push('			<input type="text" name="pt_name[]" value="'+data.result2[i].pt_name +'" readonly>');
					//ele.push('			<a class="btn" data-dialog="'+(item.pm_division == 1 ? 'optional_sch' : 'request_order')+'" data-num="'+i+'"><i class="ri-search-line"></i></a>');
					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('	<td><input type="text" name="or_buy[]" value="'+number_format(data.result2[i].or_buy)+'" readonly></td>');
					ele.push('	<td><input type="text" name="or_assign[]" value="'+number_format(data.result2[i].or_assign)+'" readonly></td>');
					ele.push('	<td><input type="text" name="or_price[]" value="'+number_format(data.result2[i].or_price)+'" readonly></td>');
					//ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					ele.push('</tr>');
				}

				if (i == 0) {ele.push('<tr class="empty"><td colspan="6">등록된 데이터가 없습니다.</td></tr>');}
				$('[name=payment_detail] .detail_list tbody').html(ele.join(''));

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});
}



function add_list(division){
	$('.detail_list tbody tr.empty').remove();

	var tr_num = $('.detail_list tbody tr').length;
	var ele = '';
	ele += '<tr>';
	ele += '	<td>';
	ele += '		<input type="hidden" name="or_seq[]" class="or_seq">';
	ele += '		<input type="hidden" name="or_from[]" class="or_from">';
	ele += '		<input type="text" name="pt_seq[]" placeholder="부품명검색" readonly>';
	ele += '	</td>';
	ele += '	<td>';
	ele += '		<div class="sch_inp">';
	ele += '			<input type="hidden" value="">';
	ele += '			<input type="text" name="pt_name[]" placeholder="검색하기">';
	ele += '			<a class="btn" data-dialog="'+(division == 1 ? 'optional_sch' : 'request_order')+'" data-num="'+tr_num+'"><i class="ri-search-line"></i></a>';
	ele += '		</div>';
	ele += '	</td>';
	ele += '	<td><input type="text" name="or_buy[]" '+(division == 2 ? 'readonly' : '')+' class="input_number" placeholder="입력하세요." value=""></td>';
	ele += '	<td><input type="text" name="or_assign[]" class="input_number" placeholder="입력하세요." value=""></td>';
	ele += '	<td><input type="text" name="or_price[]" class="input_number" placeholder="입력하세요. " value=""></td>';
	ele += '	<td class="tb_btn"><a class="btn del_btn">-</a></td>';
	ele += '</tr>';
	

	$('.detail_list tbody').append(ele);
}