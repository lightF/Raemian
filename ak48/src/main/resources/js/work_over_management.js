$(document).ready(function() {
	item_branch_list();
	item_process_list();
	list();
});
	

$(document).on('click', '.btn_search', function() {
	list();
});

//리스트 정렬
$(document).on('click', '.overtime_list th[data-order]', function() {
	list();
});

//페이지 이동
$(document).on('click', '.work_over_management .paging a', function() {
	$('[name=overtime_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});


$(document).on('click', '.dialog .close', function() {
	list();
});


$(document).on('click', '[data-dialog="work_over_view"]', function(){
	var seq = $(this).parent().find('[name="seq"]').val();

	$('[name=call_overtime_detail] .btn_area a').hide();

	if ($('[name=ag_seq]').val() == 3){ $('[name=ot_confirm]').hide();
	} else { $('[name=ot_confirm]').show(); }

	if (!seq){
		$('[name=call_overtime_detail] .detail_text').text('연장근무 등록');
		$('[name=call_overtime_detail] input').val('');
		$('[name=call_overtime_detail] select option').prop('selected', false);
		$('[name=call_overtime_detail] .table_btn tbody tr:not(:first)').remove();
		$('[name=call_overtime_detail] .btn_area a.close').show();
	} else {
		$('[name=call_overtime_detail] .detail_text').text('연장근무 상세보기');
		$('[name=call_overtime_detail] .btn_area a.xlsx, [name=call_overtime_detail] .btn_area a.del').show();
		call_overtime_detail(seq);
	}
});

//총근무 시간 계산
$(document).on('change', '[name=call_overtime_detail] [name=ot_start], [name=call_overtime_detail] [name=ot_end]', function(){
	var name = $(this).attr('name');
	var start		= $('[name=call_overtime_detail] [name=ot_start]').val();
	var end			= $('[name=call_overtime_detail] [name=ot_end]').val();
		
	if (start == '' || end == '') return false;

	start		= start.replace('-', ',');
	end			= end.replace('-', ',');

	start			= new Date(start);		
	end		= new Date(end);

	var btms	= end.getTime() - start.getTime();
	var tot_day = btms / (1000*60*60*24) ;

	$('[name=call_overtime_detail] [name=ot_days]').val(tot_day);
	
});


$(document).on('click', '[data-dialog="work_over_report"]', function(){
	call_overtime_report( $(this).parent().parent().find('[name="seq"]').val() );
});


$(document).on('click', '[name=call_overtime_detail] .btn_save', function(e){
	var chk = '';
	$('[name=call_overtime_detail] input, [name=call_overtime_detail] select').each(function(i){
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
		call_overtime_edit();
	});
	
})

$(document).on('click', '#delete_pop .btn_area .btn.point', function(e){
	call_overtime_delete();
	
});

//엑셀다운
$(document).on('click', '[name=call_overtime_detail] .btn.xlsx ', function() {
	var seq = $('[name=call_overtime_detail] [name=seq]').val();
	window.location.href = contextPath +'/call/overtime/detail/excel?seq='+seq;
});

//팝업 하단 리스트 삭제
$(document).on('click', '[name="call_overtime_detail"] table tbody td.tb_btn .btn.del_btn', function(){
	$(this).parent().parent().remove();
});

//팝업 하단 리스트 추가
$(document).on('click', '[name="call_overtime_detail"] table thead th.tb_btn .btn.add_btn', function(){
	add_list();
});

function call_overtime_delete(){
	$.ajax({
		url: contextPath + '/call/overtime/delete',
		type: 'post',
		dataType: 'json',
		data: {seq : $('[name="call_overtime_detail"] [name="seq"]').val() },
		success: function(data) {
			if(data.code == 1) {
				pop_alert('삭제되었습니다.');
				list();
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {pop_alert('삭제에 실패하였습니다.');}
		}
	});
}
function call_overtime_edit(){
	var data = $('[name="call_overtime_detail"]').serializeArray();
	data[1] = {'name' : 'ot_date', 'value':$('[name="call_overtime_detail"] [name="ot_date"]').val() +'-01'};
	$('[name="car_search"] [name="date"]').val() +'-01'
	$.ajax({
		url: contextPath + '/call/overtime/edit',
		type: 'post',
		dataType: 'json',
		data: data,
		success: function(data) {
			if(data.code == 1) {
				pop_alert('저장되었습니다.');
				list();
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('저장에 실패하였습니다.');
			}
		}, complete: function(){
			$('.search [name=overtime_search]')[0].reset();
			list();
		}
	});


}

function call_overtime_detail(seq){

	var html = new Array();
	$.ajax({
		url: contextPath + '/call/overtime/detail',
		type: 'post',
		dataType: 'json',
		data: { seq: seq },
		success: function(data) {
			if(data.code == 1) {
				if(data.result.length > 0 ){
					$('[name="call_overtime_detail"] [name="seq"]').val( data.result[0].seq );
					$('[name="call_overtime_detail"] [name="ot_date"]').val( date3(data.result[0].ot_date) );
					$('[name="call_overtime_detail"] [name="brc_seq"]').val( data.result[0].brc_seq ).prop('selected', true);
					$('[name="call_overtime_detail"] [name="ot_group"]').val( data.result[0].ot_group );
					$('[name="call_overtime_detail"] [name="ot_group_name"]').val( data.result[0].ot_group_name);

					$('[name="call_overtime_detail"] [name="ot_check"]').val( data.result[0].ot_check );
					$('[name="call_overtime_detail"] [name="ot_check_name"]').val( data.result[0].ot_check_name);

					$('[name="call_overtime_detail"] [name="ot_relate"]').val( data.result[0].ot_relate );
					$('[name="call_overtime_detail"] [name="ot_confirm"]').val(data.result[0].ot_confirm).prop('selected', true);

					$('[name="call_overtime_detail"] [name="ot_person"]').val( data.result[0].ot_person );
					$('[name="call_overtime_detail"] [name="ot_person_name"]').val( data.result[0].ot_person_name);
					$('[name="call_overtime_detail"] [name="ot_reason"]').val( data.result[0].ot_reason );
					$('[name="call_overtime_detail"] [name="ot_start"]').val( date2(data.result[0].ot_start) );
					$('[name="call_overtime_detail"] [name="ot_end"]').val( date2(data.result[0].ot_end ) );
					$('[name="call_overtime_detail"] [name="ot_days"]').val( data.result[0].ot_days );
					$('[name="call_overtime_detail"] [name="ot_note"]').val( data.result[0].ot_note );
				} else {
					$('[name="call_overtime_detail"]')[0].reset();//폼 초기화
				}

				for(var i=0; i<data.result2.length; i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="od_seq" value="'+data.result2[i].od_seq+'">');
					html.push('	<td>');
					html.push('		<div class="sch_inp">');
					html.push('			<input type="hidden" name="per_seq" value="'+data.result2[i].per_seq+'">');
					html.push('			<input type="text" name="per_seq_tmp" value="'+ data.result2[i].per_name +'" readonly>');
					html.push('			<a class="btn" data-dialog="person_sch" data-num="'+i+'"><i class="ri-search-line"></i></a>');
					html.push('		</div>');
					html.push('	</td>');
					html.push('	<td><div>연장근무</div></td>');
					html.push('	<td>');
					html.push('		<input type="datetime-local" name="od_start" value="'+datetime_local(data.result2[i].od_start)+'" placeholder="일자 선택">');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="datetime-local" name="od_end" value="'+datetime_local(data.result2[i].od_end)+'" placeholder="일자 선택">');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="text" name="od_history" value="'+data.result2[i].od_history+'" placeholder="입력하세요.">');
					html.push('	</td>');
					html.push('	<td class="tb_btn">');
					html.push('		<a class="btn del_btn">-</a>');
					html.push('	</td>');
					html.push('</tr>');
				}
				if (i == 0) html.push('<tr class="empty"><td colspan="6">조회할 데이터가 없습니다.</td></tr>');

				$('[name="call_overtime_detail"] .tb table tbody').html( html.join('') );
				

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
		}
	});
}
function list(){
	loader();

	var params	= $('[name=overtime_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});
	
	var data	= new Array();
	for (var i=0; i < params.length; i++){
		var val = params[i].value;
		if (val != ''){
			data.push({'name': params[i].name, 'value': params[i].value});
		}
	}

	$.ajax({
		url: contextPath + '/call/overtime/list',
		type: 'post',
		dataType: 'json',
		data: data,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr>');
					ele.push('<input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					ele.push('	<td data-dialog="work_over_view">'+data.result[i].seq+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+length8(data.result[i].ot_date, '-', 2)+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+data.result[i].group_name+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+data.result[i].check_name+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+(data.result[i].brc_seq == '' ? data.result[i].brc_seq : branch_name[ data.result[i].brc_seq ])+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+data.result[i].ot_reason+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+data.result[i].per_name+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+length8(data.result[i].ot_days, '-', 1)+'</td>');
					ele.push('	<td data-dialog="work_over_view">'+(data.result[i].ot_confirm == 1 ? '<a class="wait">확인중</a>' : '<a>확인완료</a>')+'</td>');
					ele.push('	<td><a data-dialog="work_over_report"><i class="ri-draft-fill"></i></a></td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="10">검색된 데이터가 없습니다.</td></tr>');

				$('.overtime_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=overtime_search] [name=page]').val());
				

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

}



function call_overtime_report(seq){
	var html = new Array();
	$.ajax({
		url: contextPath + '/call/overtime/report',
		type: 'post',
		dataType: 'json',
		data: { seq: seq },
		success: function(data) {
			if(data.code == 1) {
				if(data.result.length > 0 ){
					$('#work_over_report .tb1 tbody td:nth-child(1)').text( data.result[0].check_name );
					$('#work_over_report .tb1 tbody td:nth-child(2)').text( data.result[0].per_name );
					$('#work_over_report .tb1 tbody td:nth-child(3) span:nth-child(1)').text( data.result[0].ot_start );
					$('#work_over_report .tb1 tbody td:nth-child(3) span:nth-child(3)').text( data.result[0].ot_end );
					$('#work_over_report .tb1 tbody td:nth-child(4)').text( data.result[0].ot_reason );
					$('#work_over_report .tb1 tbody td:nth-child(5)').text( data.result[0].ot_hour );
					$('#work_over_report .tb1 tbody td:nth-child(6)').text( data.result[0].ot_relate );
				}
				for(var i=0;i<data.result3.length;i++) {
					html.push('<tr>');
					html.push('	<td>'+data.result3[i].og_name+'</td>');
					html.push('	<td>'+data.result3[i].per_name+'</td>');
					html.push('	<td>'+date2(data.result3[i].od_start)+'</td>');
					html.push('	<td>'+time2(data.result3[i].od_start, 3)+' ~ '+time2(data.result3[i].od_end, 3)+'</td>');
					html.push('	<td>'+data.result3[i].od_hour+'</td>');
					html.push('	<td>'+data.result3[i].od_history+'</td>');
					html.push('</tr>');
				}
				$('#work_over_report .tb2 tbody').html( html.join('') );
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
		}
	});
}

function add_list(){
	$('[name="call_overtime_detail"] .tb table tbody tr.empty').remove();
	var length = $('[name="call_overtime_detail"] .tb table tbody tr').length;
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="od_seq" value="">');
	html.push('	<td>');
	html.push('		<div class="sch_inp">');
	html.push('			<input type="hidden" name="per_seq" value="">');
	html.push('			<input type="text" name="per_seq_tmp" placeholder="검색하기" readonly>');
	html.push('			<a class="btn" data-dialog="person_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
	html.push('		</div>');
	html.push('	</td>');
	html.push('	<td><div>연장근무</div></td>');
	html.push('	<td>');
	html.push('		<input type="datetime-local" name="od_start" placeholder="일자 선택">');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="datetime-local" name="od_end" placeholder="일자 선택">');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="text" name="od_history" placeholder="입력하세요.">');
	html.push('	</td>');
	html.push('	<td class="tb_btn">');
	html.push('		<a class="btn del_btn">-</a>');
	html.push('	</td>');
	html.push('</tr>');
	$('[name="call_overtime_detail"] .tb table tbody').append( html.join('') );
}