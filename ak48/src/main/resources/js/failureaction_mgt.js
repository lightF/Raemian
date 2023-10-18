$(document).ready(function() {
	item_process_list();
	item_branch_list();
	item_system_list();
	org_list();

	list();
});
	

$(document).on('click', '.btn_search', function() {
	list();
});

$(document).on('click', '.action_list th[data-order]', function() {
	list();
});


//페이지 이동
$(document).on('click', '.failureaction .paging a', function() {
	$('[name=action_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});

$(document).on('click', '.dialog .close', function() {
	list();
});


//보고서
$(document).on('click', '.action_list .btn_report', function() {
	var data = new Array();
	data.og_seq			= $(this).closest('tr').find('[name=og_seq]').val();
	data.at_daily		= $(this).closest('tr').find('[name=at_daily]').val();
	data.at_division	= $(this).closest('tr').find('[name=at_division]').val();

	$.ajax({
		url: contextPath + '/breakdown/action/report',
		type: 'post',
		dataType: 'json',
		data: data,
		success: function(data) {
			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr>');
					ele.push('	<td>'+data.result[i].og_name+'</td>');
					ele.push('	<td>'+data.result[i].sys_seq+'</td>');
					ele.push('	<td>'+data.result[i].at_place+'</td>');
					ele.push('	<td>'+data.result[i].at_device+'</td>');
					ele.push('	<td>'+data.result[i].at_occur+'</td>');
					ele.push('	<td>'+data.result[i].at_receipt+'</td>');
					ele.push('	<td>'+data.result[i].at_history+'</td>');
					ele.push('	<td>'+data.result[i].at_finish+'</td>');
					ele.push('	<td>'+data.result[i].at_time+'</td>');
					ele.push('	<td>'+data.result[i].at_content+'</td>');
					ele.push('	<td>'+data.result[i].at_reason+'</td>');
					ele.push('	<td>'+data.result[i].at_repair+'</td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="12">검색된 데이터가 없습니다.</td></tr>');

				$('#failurea_report tbody').html(ele.join(''));

			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

});

//등록 / 상세팝업 열기
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');

	$('#failurea_log_view .btn_area a').hide();
	
	
	if (type == 'new'){
		$('[name=action_detail] input').val('');
		$('[name=action_detail] select option').prop('selected', false);
		$('[name=action_detail] .tbl_detail').hide();

		$('#failurea_log_view .btn_area .close').show();
		

	} else {
		$('#failurea_log_view .btn_area .btn_remove, #failurea_log_view .btn_area .xlsx').show();

		var data = new Array();

		var og_seq			= $(this).closest('tr').find('[name=og_seq]').val();
		var at_daily		= $(this).closest('tr').find('[name=at_daily]').val();
		var at_division		= $(this).closest('tr').find('[name=at_division]').val();

		detail(og_seq, at_daily, at_division);
	}

});


$(document).on('click', '.tbl_detail tr', function() {
	var seq = $(this).closest('tr').find('[name=seq]').val();

	$.ajax({
		url: contextPath + '/breakdown/action/detail',
		type: 'post',
		dataType: 'json',
		data: {'seq' : seq},
		success: function(data) {
			if (data.code == 1){
				$('[name=action_detail] [name=seq]').val(data.result[0].seq)
				$('[name=action_detail] [name=og_seq]').val(data.result[0].og_seq);
				$('[name=action_detail] [name=og_name]').val(data.result[0].og_name);
				$('[name=action_detail] [name=at_date]').val(length8(data.result[0].at_date, '-', 1));
				$('[name=action_detail] [name=at_division] option[value="'+data.result[0].at_division+'"]').prop('selected', true);
				$('[name=action_detail] [name=brc_seq] option[value="'+data.result[0].brc_seq+'"]').prop('selected', true);
				$('[name=action_detail] [name=at_place]').val(data.result[0].at_place);
				$('[name=action_detail] [name=sys_seq] option[value="'+data.result[0].sys_seq+'"]').prop('selected', true);
				$('[name=action_detail] [name=at_device]').val(data.result[0].at_device);
				$('[name=action_detail] [name=at_occur]').val(datetime_local(data.result[0].at_occur));
				$('[name=action_detail] [name=at_receipt]').val(datetime_local(data.result[0].at_receipt));
				$('[name=action_detail] [name=at_history]').val(data.result[0].at_history);
				$('[name=action_detail] [name=at_action] option[value="'+data.result[0].at_action+'"]').prop('selected', true);
				$('[name=action_detail] [name=prc_seq] option[value="'+data.result[0].prc_seq+'"]').prop('selected', true);
				$('[name=action_detail] [name=at_manager] option[value="'+data.result[0].at_manager+'"]').prop('selected', true);
				$('[name=action_detail] [name=at_start]').val(datetime_local(data.result[0].at_start));
				$('[name=action_detail] [name=at_finish]').val(datetime_local(data.result[0].at_finish));
				$('[name=action_detail] [name=at_content]').val(data.result[0].at_content);
				$('[name=action_detail] [name=at_part]').val(data.result[0].at_part);
				$('[name=action_detail] [name=at_reason]').val(data.result[0].at_reason);
				$('[name=action_detail] [name=at_repair]').val(data.result[0].at_repair);
				$('[name=action_detail] [name=at_repair_name]').val(data.result[0].at_repair_name);

			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			
		}
	});

});



$(document).on('click', '#team_sch .btn_area a.btn', function() {
	var og_seq = $('[name=action_detail] [name=og_seq]').val();
	item_branch_list(og_seq);
});



//삭제
$(document).on('click', '#failurea_log_view .btn_remove', function() {
	var seq	= $('[name=action_detail] [name=seq]').val();

	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/breakdown/action/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : seq},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 되었습니다.');
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
$(document).on('click', '#failurea_log_view .btn.xlsx ', function() {
	var seq = $('#failurea_log_view [name=seq]').val();
	window.location.href = contextPath +'/breakdown/action/detail/excel?seq='+seq;
});


//저장
$(document).on('click', '#failurea_log_view .btn_save', function() {
	var chk = '';
	$('[name=action_detail] input').each(function(i){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
			
		}
	});

	if (chk > 0) {
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	} 
	
	var params	= $('[name=action_detail]').serializeArray();
	var data	= new Array();

	params[1].value = '';
	params[20].value = '';

	for (var i=0; i < params.length; i++){
		var val = params[i].value;
		if (val != ''){
			data.push({'name': params[i].name, 'value': params[i].value});
		}
	}

	
	pop_confirm('저장 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/breakdown/action/edit',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(data) {
				if (data.code == 1){
					pop_alert('저장 되었습니다.');
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');

				} else {
					pop_alert('저장에 실패하였습니다.');
				}

			}, complete: function() {
				$('[name=action_search]')[0].reset();
				list();
			}
		});
	
	});
	
	
});


function list(){
	loader();

	var params	= $('[name=action_search]').serializeArray();
	params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});
	
	$.ajax({
		url: contextPath + '/breakdown/action/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr>');
					ele.push('	<td class="btn_add" data-type="modify" data-dialog="failurea_log_view">');
					ele.push('		<input type="hidden" name="og_seq" value="'+data.result[i].og_seq+'">');
					ele.push('		<input type="hidden" name="at_daily" value="'+data.result[i].at_daily+'">');
					ele.push('		<input type="hidden" name="at_division" value="'+data.result[i].at_division+'">');

					ele.push('	'+data.result[i].og_name+'</td>');
					ele.push('	<td class="btn_add" data-type="modify" data-dialog="failurea_log_view">'+length8(data.result[i].at_daily, '-', 1)+'</td>');
					ele.push('	<td class="btn_add" data-type="modify" data-dialog="failurea_log_view">'+process_name[ data.result[i].at_division ]+'</td>');
					ele.push('	<td class="btn_add" data-type="modify" data-dialog="failurea_log_view">'+data.result[i].total+'</td>');
					ele.push('	<td class="btn_add" data-type="modify" data-dialog="failurea_log_view">'+data.result[i].finish+'</td>');
					ele.push('	<td class="btn_add" data-type="modify" data-dialog="failurea_log_view">'+data.result[i].not_take+'</td>');
					ele.push('	<td><a data-dialog="failurea_report" class="btn_report" data-daily="'+data.result[i].at_daily+'" data-division="'+data.result[i].at_division+'"><i class="ri-draft-fill"></i></a></td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="7">검색된 데이터가 없습니다.</td></tr>');

				$('.action_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=action_search] [name=page]').val());
				

			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

}




function detail(og_seq, at_daily, at_division){

	$.ajax({
		url: contextPath + '/breakdown/action/detail',
		type: 'post',
		dataType: 'json',
		data: {'og_seq' : og_seq, 'at_daily' : at_daily, 'at_division' : at_division},
		success: function(data) {
			if (data.code == 1){
				var ele = new Array();

				$('[name=action_detail] input').val('');
				$('[name=action_detail] select option').prop('selected', false);

				for(var i=0; i <data.result2.length; i++){
					var action = '';
					switch(data.result2[i].at_action){
						case 1: action = '조치'; break;
						case 2: action = '미조치'; break;
					}
					ele.push('<tr>');
					ele.push('	<td><input type="hidden" name="seq" value="'+data.result2[i].seq+'">'+action+'</td>');

					ele.push('	<td>'+data.result2[i].og_name+'</td>');
					if(data.result2[i].sys_seq == ''){
						ele.push('	<td>'+ data.result2[i].sys_seq+'</td>');
					} else {
						ele.push('	<td>'+system_name[ data.result2[i].sys_seq ]+'</td>');
					}
					ele.push('	<td>'+data.result2[i].at_place+'</td>');
					ele.push('	<td>'+data.result2[i].at_device+'</td>');
					ele.push('	<td>'+length14(data.result2[i].at_receipt,'-', ':', 1)+'</td>');
					ele.push('	<td>'+data.result2[i].at_history+'</td>');
					ele.push('	<td>'+data.result2[i].at_content+'</td>');
					ele.push('	<td>'+data.result2[i].per_name+'</td>');
					ele.push('</tr>');

				}
				
				if(i == 0) ele.push('<tr><td colspan="9">검색된 데이터가 없습니다.</td></tr>');
				$('[name=action_detail] .tbl_detail tbody').html(ele.join(''));
				$('[name=action_detail] .tbl_detail').show();
				

			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});


}

