$(document).ready(function(){
	var date = $(location).attr('search').split('=')
	
	$('[name=call_work_list] [name=start_date]').val(date[1]);
	
	item_system_list();
	item_division_list();
	item_pay_list();
	call_work_list();
});

//검색버튼
$(document).on('click', '.search .btn_area .btn', function(){
	call_work_list();
});


//페이지 이동
$(document).on('click', '.work_management .paging a', function() {
	$('[name=call_work_list] [name=page]').val($(this).attr('data-page'));
	call_work_list();

});

$(document).on('change', '[name=row]', function() {
	call_work_list();
});



$(document).on('click', '.dialog .close', function() {
	call_work_list();
});

//정렬팝업, 최상위 div .cont의 개별 class 변경하여 사용바람
$(document).on('click', '.cont.work_management table thead th[data-order]', function(){
	call_work_list();//리스트 재호출
});
$(document).on('click', '[data-dialog="work_manag_report"]', function(){
	call_work_report( $(this).parent().parent().find('[name="seq"]').val() );
});

$(document).on('click', '[data-dialog="work_manag_view"]', function(){
	$('#work_manag_view .btn_area a').hide();

	if ($('[name=ag_seq]').val() == 3){ $('[name=wrk_confirm]').hide();
	} else { $('[name=wrk_confirm]').show(); }

	if (!$(this).parent().find('[name="seq"]').val()){
		$('#work_manag_view .btn_area a.close').show();
		$('[name=call_work_detail] input:not([name=wrk_date])').val('');
		$('[name=call_work_detail] [name=wrk_date]').addClass('on_date');
		$('[name=call_work_detail] textarea').val('1.시설명 : \n2.위치 : \n3.고장내역 : \n4.작업내역 :');
		$('[name=call_work_detail] select option').prop('selected', false);
		$('[name=call_work_detail] tbody tr').remove();
		add_list();
	} else {
		$('#work_manag_view .btn_area a.del, #work_manag_view .btn_area a.xlsx').show();
		call_work_detail( $(this).parent().find('[name="seq"]').val() );
	}
});



//점검팀 추가시 하위 소속팀 등록
$(document).on('click', '#person_sch .table.tb_scroll tbody > tr', function(){
	var target_tbl = $('#person_sch [name=user_list] [name=target_tbl]').val();
	var target_num = $('#person_sch [name=user_list] [name=target_num]').val();

	if (target_tbl == '' || target_num == '') return false;
	
	$('.'+target_tbl).find('a[data-num='+target_num+']').prev().val($(this).find('td:nth-child(5)').text().trim());
	$('.'+target_tbl).find('a[data-num='+target_num+']').prev().prev().val($(this).find('[name=per_id]').val().trim());
	$('.'+target_tbl).find('a[data-num='+target_num+']').closest('td').prev().find('.og_seq').val($(this).find('[name=seq]').val().trim());
	$('.'+target_tbl).find('a[data-num='+target_num+']').closest('td').prev().find('.og_name').val($(this).find('[name=per_team]').val().trim());
});

//근무일자 자동 입력
$(document).on('change', '[name=call_work_detail] [name=wrk_hour]', function(){
	var date = $(this).val().split('T');
	$('[name=call_work_detail] [name=wrk_date]').removeClass('on_date').val(date[0]);
});


//총근무 시간 계산
$(document).on('change', '[name=call_work_detail] .start_date, [name=call_work_detail] .finish_date', function(){
	var start = '', end = '', pay = '';

	if ($(this).hasClass('start_date')){
		start		= $(this).val();
		end			= $(this).parent().next().next().next().find('input').val();
	} else {
		start		= $(this).parent().prev().prev().prev().find('input').val();
		end			= $(this).val();
	}

	if (start == '' || end == '') return false;

	var date1 = dayjs(start);
	var date2 = dayjs(end);
	var tot_hour = date2.diff(date1, 'hour'); 

	if (Math.sign(tot_hour) == -1){
		pop_alert('총근무시간 산정이 불가능 합니다.<br/> 출발시간 완료시간을 확인해주세요.');
		return false;
	} else if ( Math.sign(tot_hour) == 0){
		tot_hour	= 0;
	}
	
	if (tot_hour <= 0){
		pay = 0;
	} else if(tot_hour <= 4){
		pay = 50000;
	} else if (tot_hour <= 6){
		pay = 70000;
	} else if (tot_hour <= 8){
		pay = 90000;
	} else if (tot_hour > 8){
		pay = 110000;
	}

	$(this).closest('tr').find('.wkd_total').val(number_format(tot_hour));
	$(this).closest('tr').find('.wkd_amount').val(number_format(pay));
});


$(document).on('click', '#error_num_sch .table.tb_scroll tbody > tr', function(){
	$('[name="' + $('#error_num_sch [name="target"]').val()+ '"]').val( $(this).find('[name="seq"]').val()  ).next().val( $(this).find('[name=bk_code]').val());
	$('[name=call_work_detail] [name=wrk_repair]').val(length8($(this).find('[name=bk_receipt]').val(), '-', 1));
});

//팝업 하단 리스트 추가
$(document).on('click', '[name="call_work_detail"] table thead th.tb_btn .btn.add_btn', function(){
	var seq	= $('[name="call_work_detail"] [name=per_seq]').val();
	var team= $('[name="call_work_detail"] [name=per_team]').val();
	add_list(seq, team);
});

//팝업 하단 리스트 삭제
$(document).on('click', '[name="call_work_detail"] table tbody td.tb_btn .btn.del_btn', function(){
	$(this).parent().parent().remove();
});

//엑셀다운
$(document).on('click', '[name=call_work_detail] .btn.xlsx ', function() {
	var seq = $('[name=call_work_detail] [name=seq]').val();
	window.location.href = contextPath +'/call/work/detail/excel?seq='+seq;
});

$(document).on('click', '[name=call_work_detail] .btn_save', function(){
	var chk = '';
	$('[name=call_work_detail] input, [name=call_work_detail] select').each(function(i){
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
		call_work_edit();
	});
	
})

$(document).on('click', '[name=call_work_detail] .btn_remove', function(){
	var seq = $('[name=call_work_detail] [name=seq]').val();

	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/call/work/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : seq},
			success: function(data) {
				if(data.code == 1) {
					pop_alert('삭제 되었습니다.');
					call_work_list();
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제 실패하였습니다.');
				}
			}
		});
	});
});



function call_work_edit(){
	var data = $('[name="call_work_detail"]').serializeArray();
		data.push({ 'name' : 'wrk_date', 'value' : $('[name="call_work_detail"] [name=wrk_date]').val()});

		data = commatoint(data);

	$.ajax({
		url: contextPath + '/call/work/edit',
		type: 'post',
		dataType: 'json',
		data: data,
		success: function(data) {
			if(data.code == 1) {
				pop_alert('저장되었습니다.');
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {pop_alert('저장에 실패하였습니다.');}
		}, complete: function(){
			$('.search [name=call_work_list]')[0].reset();
			call_work_list();
		}
	});


}
//근무관리팝업
function call_work_detail(seq){

	var html = new Array();
	$.ajax({
		url: contextPath + '/call/work/detail',
		type: 'post',
		dataType: 'json',
		data: { seq: seq },
		success: function(data) {
			if(data.code == 1) {
				if(data.result.length > 0) {
					$('[name="call_work_detail"] [name="seq"]').val( data.result[0].seq );
					$('[name="call_work_detail"] [name="wrk_date"]').removeClass('on_date').val( length8(data.result[0].wrk_date, '-', 1) );
					$('[name="call_work_detail"] [name="wrk_check"]').val( data.result[0].wrk_check );
					$('[name="call_work_detail"] [name="check_name"]').val( data.result[0].check_name );
					$('[name="call_work_detail"] [name="wrk_group"]').val( data.result[0].wrk_group );
					$('[name="call_work_detail"] [name="group_name"]').val( data.result[0].group_name );
					$('[name="call_work_detail"] [name="sys_seq"]').val( data.result[0].sys_seq );
					$('[name="call_work_detail"] [name="bk_seq"]').val( data.result[0].bk_seq );
					$('[name="call_work_detail"] [name="bk_seq_name"]').val( data.result[0].bk_seq_name );
					$('[name="call_work_detail"] [name="wrk_repair"]').val( length8(data.result[0].wrk_repair, '-', 1) );
					$('[name="call_work_detail"] [name="wrk_history"]').val( data.result[0].wrk_history );
					$('[name="call_work_detail"] [name="wrk_confirm"] [value="'+data.result[0].wrk_confirm +'"]').prop('selected', true);
					$('[name="call_work_detail"] [name="wrk_hour"]').val( datetime_local(data.result[0].wrk_hour) );
					$('[name="call_work_detail"] [name="wrk_end"]').val( datetime_local(data.result[0].wrk_end) );
					$('[name="call_work_detail"] [name="wd_seq"]').val( data.result[0].wd_seq );
					$('[name="call_work_detail"] [name="per_seq"]').val( data.result[0].per_seq );
					$('[name="call_work_detail"] [name="per_name"]').val( data.result[0].per_name );
					$('[name="call_work_detail"] [name="wrk_work"]').val( data.result[0].wrk_work );
				} else {
					$('[name="call_work_detail"]')[0].reset();//폼 초기화
					$('[name="call_work_detail"]').find('[name=wrk_date]').val(date);
				}

				for(var i=0;i<data.result2.length;i++){
					html.push('<tr>');
					html.push('	<td>');
					html.push('		<input type="hidden" name="wkd_seq[]" value="'+data.result2[i].wkd_seq+'">');
					html.push('	<input type="hidden" name="wrk_seq[]" value="'+data.result2[i].wrk_seq+'">');
					//html.push('		<div class="sch_inp">');
					html.push('			<input type="hidden" name="og_seq[]" class="og_seq" value="'+data.result2[i].og_seq+'">');
					html.push('			<input type="text" name="og_name[]" class="og_name" value="'+data.result2[i].og_name+'" readonly>');
					//html.push('			<a class="btn" data-dialog="team_sch" data-num='+i+'><i class="ri-search-line"></i></a>');
					//html.push('		</div>');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<div class="sch_inp">');
					html.push('			<input type="hidden" name="per_seq2[]" value="'+data.result2[i].per_seq2+'">');
					html.push('			<input autocomplete="off" type="text" name="per_seq2_text[]" value="'+data.result2[i].per_name+'" readonly>');
					html.push('			<a class="btn" data-dialog="person_sch" data-num='+i+'><i class="ri-search-line"></i></a>');
					html.push('		</div>');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="datetime-local" name="wkd_start[]" class="start_date" value="'+datetime_local(data.result2[i].wkd_start)+'">');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="datetime-local" name="wkd_work[]" value="'+datetime_local(data.result2[i].wkd_work)+'">');
					html.push('	</td>');
					html.push('	<td>');
					html.push('<input type="datetime-local" name="wkd_end[]" value="'+datetime_local(data.result2[i].wkd_end)+'">');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="datetime-local" name="wkd_finish[]" class="finish_date" value="'+datetime_local(data.result2[i].wkd_finish)+'">');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="text" name="wkd_total[]" class="wkd_total" value="'+number_format(data.result2[i].wkd_total)+'" readonly>');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<input type="text" name="wkd_amount[]" class="wkd_amount" value="'+number_format(data.result2[i].wkd_amount)+'" readonly>');
					html.push('	</td>');
					html.push('	<td class="tb_btn">');
					html.push('		<a class="btn del_btn">-</a>');
					html.push('	</td>');
					html.push('</tr>');
				}
				if(i==0) html.push('<tr class="empty"><td colspan="8">조회된 데이터가 없습니다.</td></tr>');
				$('[name="call_work_detail"] .tb table tbody').html( html.join('') );

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패 하였습니다.');
			}
		}

	});
}


//근무관리일지 - 보고서
function call_work_report(seq){
	var html = new Array();
	$('#work_manag_report .info_date span').text('');
	$('#work_manag_report .worker span').text('' );
	$('#work_manag_report .tb table tbody').html('');
	$.ajax({
		url: contextPath + '/call/work/report',
		type: 'post',
		dataType: 'json',
		data: { seq: seq },
		success: function(data) {
			if(data.code == 1) {
				for(var i=0;i<data.result2.length;i++){ 
					html.push('<tr>');
					html.push('	<td>'+data.result2[i].og_name+'</td>');
					html.push('	<td>'+data.result2[i].jg_seq+'</td>');
					html.push('	<td>'+data.result2[i].per_name+'</td>');
					html.push('	<td class="work_time">');
					html.push('		<div>'+time2(data.result2[i].wkd_start, 3)+' ~</div>');
					html.push('		<div>'+time2(data.result2[i].wkd_finish, 3)+'</div>');
					html.push('	</td>');
					html.push('	<td>'+data.result2[i].wkd_job+'/'+data.result2[i].wkd_move+'</td>');
					html.push('	<td>'+number_format(data.result2[i].wkd_amount)+'</td>');
					if(i == 0){
						html.push('	<td rowspan="1" class="wrk_work">');
						html.push('		<div></div>');
						html.push('	</td>');
						html.push('	<td rowspan="1" class="wrk_td"></td>');
					}
					html.push('</tr>');
				}
				if(i==0) html.push('<tr><td colspan="8">표시할 내역이 없습니다.</tr>');

				$('#work_manag_report .tb table tbody').html( nl2br(html.join('')) );
				if(data.result.length > 0) {
					$('#work_manag_report .info_date span').text( data.result[0].wrk_date );
					$('#work_manag_report .wrk_work').attr('rowspan', i).find('div').text( data.result[0].wrk_work );
					$('#work_manag_report .wrk_td').attr('rowspan', i).text( data.result[0].wrk_td );
					$('#work_manag_report .worker span').text( data.result[0].per_name );
				}

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
		}
	});
}
//list
function call_work_list(){
	loader();

	var html = new Array();
	var data = new Array();
	var data2 = $('[name="call_work_list"]').serializeArray();
		data2.push({ 'name' : 'row', 'value' : $('[name="row"] option:selected').val()});

	$.ajax({
		url: contextPath + '/call/work/list',
		type: 'post',
		dataType: 'json',
		data: data2,
		success: function(data) {
			close_loader();

			if(data.code == 1) {
				for(var i=0;i<data.result.length;i++){ 
					html.push('<tr>');
					html.push('	<input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					html.push('	<input type="hidden" name="wrk_group" value="'+data.result[i].wrk_group+'">');
					html.push('	<input type="hidden" name="wrk_check" value="'+data.result[i].wrk_check+'">');
					html.push('	<td data-dialog="work_manag_view">'+data.result[i].seq+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+length8(data.result[i].wrk_date, '-', 2)+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+data.result[i].group_name+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+data.result[i].check_name+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+division_name[ data.result[i].wd_seq ]+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+time2(data.result[i].wrk_hour, 3)+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+time2(data.result[i].wrk_end, 3)+'</td>');
					html.push('	<td data-dialog="work_manag_view">'+String(data.result[i].wrk_confirm).replace('1','확인중').replace('2','승인불가').replace('3','확인완료')+'</td>');
					html.push('	<td>');
					html.push('		<a data-dialog="work_manag_report"><i class="ri-draft-fill"></i></a>');
					html.push('	</td>');
					html.push('</tr>');
				}
				if(i==0) html.push('<tr><td colspan="9">검색된 데이터가 없습니다.</tr>');

				$('.tb_scroll tbody').html( html.join('') );

				paging(data.total, $('[name=row] option:selected').val(), $('[name=page]').val());
				$('.cont.work_management .count > p > span').text( number_format( data.total ) );
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}

		}
	});

}

function add_list(seq, team){

	if (typeof seq == ''|| seq == 'undefined' || seq == null) {seq =''; team = ''};

	$('[name="call_work_detail"] .tb table tbody tr.empty').remove();
	var length = $('[name="call_work_detail"] tbody tr').length;
	var html = new Array();
	
	html.push('<tr>');
	html.push('	<td>');
	html.push('		<input type="hidden" name="wrk_seq[]" value="">');
	html.push('		<input type="hidden" name="wkd_seq[]" value="">');
	//html.push('		<div class="sch_inp">');
	html.push('			<input type="hidden" name="og_seq[]" class="og_seq" value='+seq+'"">');
	html.push('			<input type="text" name="og_name[]" class="og_name" value="'+team+'" placeholder="자동입력" readonly/>');
	//html.push('			<a class="btn" data-dialog="team_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
	//html.push('		</div>');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<div class="sch_inp">');
	html.push('			<input type="hidden" name="per_seq2[]" value="">');
	html.push('			<input type="text" name="per_name[]" value="" placeholder="검색하기" readonly/>');
	html.push('			<a class="btn" data-dialog="person_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
	html.push('		</div>');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="datetime-local" name="wkd_start[]" class="start_date" value="" placeholder="일자 선택" />');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="datetime-local" name="wkd_work[]" value="" placeholder="일자 선택" />');
	html.push('	</td>');
	html.push('	<td>');
	html.push('<input type="datetime-local" name="wkd_end[]" value="" placeholder="일자 선택" />');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="datetime-local" name="wkd_finish[]" class="finish_date" value="" placeholder="일자 선택" />');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="text" name="wkd_total[]" class="wkd_total" value="" placeholder="자동계산" readonly>');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<input type="text" name="wkd_amount[]" class="wkd_amount" value="" placeholder="자동계산" readonly>');
	html.push('	</td>');
	html.push('	<td class="tb_btn">');
	html.push('		<a class="btn del_btn">-</a>');
	html.push('	</td>');
	html.push('</tr>');

	$('[name="call_work_detail"] .tb table tbody').append( html.join('') );
}