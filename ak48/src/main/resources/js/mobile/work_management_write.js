$(document).ready(function() {
	item_division_list();
	item_system_list();
	
	
	var path = location.search.split('&');
	var type = path[0].split('=');
	
	$('.top_area .back, .m_cont .btn_area a').hide();

	if ($('[name=ag_seq]').val() == 3){
		$('[name=wrk_confirm]').hide();
	} else {
		$('[name=wrk_confirm]').show();
	}

	if (type[1] == 'new'){
		$('.top_tit span').text('근무등록');
		$('.m_cont .btn_area .close').show();
		$('[name=call_work_detail] input:not([name=wrk_date])').val('');
		$('[name=call_work_detail] [name=wrk_date]').addClass('on_date');
		$('[name=call_work_detail] textarea').val('1.시설명 : \n2.위치 : \n3.고장내역 : \n4.작업내역 :');
		$('[name=call_work_detail] select option').prop('selected', false);
		$('[name=call_work_detail] .tb_1 tbody tr').remove();
		
		add_list();

	} else {
		var seq	= path[1].split('=');
			seq	= seq[1];

		$('.top_tit span').text('근무 상세보기');
		$('.top_area .back, .m_cont .btn_area .btn_remove').show();

		detail(seq);
	}
});

//추가항목 추가
$(document).on('click', '[name=call_work_detail] .add_btn', function() {
	add_list();
	
});

//추가항목 삭제
$(document).on('click', '.tb_1 .del_btn', function() {
	var tr_num = $(this).closest('tr').attr('data-row');
	$('.tb_1 tr[data-row="'+tr_num+'"]').remove();
});

//점검팀 추가시 하위 소속팀 등록
$(document).on('click', '#person_sch .table.tb_scroll tbody > tr', function(){
	var target_tbl = $('#person_sch [name=user_list] [name=target_tbl]').val();
	var target_num = $('#person_sch [name=user_list] [name=target_num]').val();

	if (target_tbl == '' || target_num == '') return false;
	
	$('.'+target_tbl).find('a[data-num='+target_num+']').prev().val($(this).find('td:nth-child(5)').text().trim());
	$('.'+target_tbl).find('a[data-num='+target_num+']').prev().prev().val($(this).find('[name=per_id]').val().trim());
	$('.'+target_tbl).find('a[data-num='+target_num+']').closest('tr').prev().find('.og_seq').val($(this).find('[name=seq]').val().trim());
	$('.'+target_tbl).find('a[data-num='+target_num+']').closest('tr').prev().find('.og_name').val($(this).find('[name=per_team]').val().trim());
});

//근무일자 자동 입력
$(document).on('change', '[name=call_work_detail] [name=wrk_hour]', function(){
	var date = $(this).val().split('T');
	$('[name=call_work_detail] [name=wrk_date]').removeClass('on_date').val(date[0]);
});

//총근무 시간 계산
$(document).on('change', '[name=call_work_detail] .start_date, [name=call_work_detail] .finish_date', function(){
	var start = '', end = '', pay = '';
	var row	= $(this).closest('tr').attr('data-row');

	if ($(this).hasClass('start_date')){
		start		= $(this).val();
		end			= $(this).closest('tr').next().next().next().find('input').val();
	} else {
		start		= $(this).closest('tr').prev().prev().prev().find('input').val();
		end			= $(this).val();
	}
	
	console.log(start, end);
	if (start == '' || end == '') return false;

	var date1 = dayjs(start);
	var date2 = dayjs(end);
	var tot_hour = date2.diff(date1, 'hour'); 
	console.log(tot_hour);

	if (Math.sign(tot_hour) == -1){
		pop_alert('총근무시간 산정이 불가능 합니다.<br/> 출발시간 완료시간을 확인해주세요.');
		return false;
	} else if ( Math.sign(tot_hour) == 0){tot_hour	= 0;}
	
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

	$(this).closest('table.tb_1').find('tr[data-row="'+row+'"]').find('.wrd_total').val(number_format(tot_hour));
	$(this).closest('table.tb_1').find('tr[data-row="'+row+'"]').find('.wrd_amount').val(number_format(pay));
	
});

//저장
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
		var data = $('[name="call_work_detail"]').serializeArray();
		$.ajax({
			url: contextPath + '/call/work/edit',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(data) {
				if(data.code == 1) {
					pop_alert('저장되었습니다.');
					setTimeout(function(){
						location.href = '/DBCS/work_management';
					}, 1000);

				} else pop_alert('저장에 실패하였습니다.');
			}
		});
	});
	
})

//삭제
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
					location.href = '/DBCS/work_management';
				}else {
					pop_alert('삭제 실패하였습니다.');
				}
			}
		});
	
	});


});

function detail(seq){
	$.ajax({
		url: contextPath + '/call/work/detail',
		type: 'post',
		dataType: 'json',
		data: { seq: seq },
		success: function(data) {
			if(data.code == 1) {
				var ele = new Array();
				$('[name="call_work_detail"] [name="seq"]').val( data.result[0].seq );
				$('[name="call_work_detail"] [name="wrk_date"]').val( length8(data.result[0].wrk_date, '-', 1) ).removeClass('on_date');
				$('[name="call_work_detail"] [name="wrk_check"]').val( data.result[0].wrk_check );
				$('[name="call_work_detail"] [name="check_name"]').val( data.result[0].check_name );
				$('[name="call_work_detail"] [name="wrk_group"]').val( data.result[0].wrk_group );
				$('[name="call_work_detail"] [name="group_name"]').val( data.result[0].group_name );
				$('[name="call_work_detail"] [name="sys_seq"]').val( data.result[0].sys_seq );
				$('[name="call_work_detail"] [name="bk_seq"]').val( data.result[0].bk_seq );
				$('[name="call_work_detail"] [name="bk_seq_text"]').val( data.result[0].bk_seq_name );
				$('[name="call_work_detail"] [name="wrk_repair"]').val( length8(data.result[0].wrk_repair, '-', 1) );
				$('[name="call_work_detail"] [name="wrk_history"]').val( data.result[0].wrk_history );
				$('[name="call_work_detail"] [name="wrk_confirm"] [value="'+data.result[0].wrk_confirm +'"]').prop('selected', true);
				$('[name="call_work_detail"] [name="wrk_hour"]').val( datetime_local(data.result[0].wrk_hour) );
				$('[name="call_work_detail"] [name="wrk_end"]').val( datetime_local(data.result[0].wrk_end) );
				$('[name="call_work_detail"] [name="wd_seq"] option[value="'+data.result[0].wd_seq+'"]').prop('selected', true);
				$('[name="call_work_detail"] [name="per_seq"]').val( data.result[0].per_seq );
				$('[name="call_work_detail"] [name="per_name"]').val( data.result[0].per_name);
				$('[name="call_work_detail"] [name="wrk_work"]').val( data.result[0].wrk_work );
				
				for(var i=0; i<data.result2.length; i++){
					ele.push('<tr>');
					ele.push('	<th>소속</th>');
					ele.push('	<td>');
					ele.push('		<div>');
					ele.push('			<input type="hidden" name="wkd_seq[]" value="'+data.result2[i].wkd_seq+'">');
					ele.push('			<input type="hidden" name="wrk_seq[]" value="'+data.result2[i].wrk_seq+'">');
					ele.push('			<input type="hidden" name="og_seq[]" class="og_seq" value="'+data.result2[i].og_seq+'">');
					ele.push('			<input type="text" name="og_name[]" class="og_name" value="'+data.result2[i].og_name+'" placeholder="근무자 선택시 자동입력" readonly>');
					//ele.push('			<a class="btn" data-dialog="team_sch"><i class="ri-search-line"></i></a>');
					ele.push('		</div>');
					ele.push('	</td>')
					ele.push('	<td rowspan="8"><a class="del_btn">-</a></td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>근무자</th>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp">');
					ele.push('			<input type="hidden" name="per_seq2[]" value="'+data.result2[i].per_seq2+'"">');
					ele.push('			<input type="text" name="per_seq2_text[]" value="'+data.result2[i].per_name+'" placeholder="검색하기" readonly>');
					ele.push('			<a class="btn" data-dialog="person_sch" data-num="'+i+'"><i class="ri-search-line"></i></a>');
					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>콜근무출발</th>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp"><input type="datetime-local" name="wkd_start[]" class="start_date" value="'+datetime_local(data.result2[i].wkd_start)+'"></div>');
					ele.push('	</td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>작업시작</th>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp"><input type="datetime-local" name="wkd_work[]" value="'+datetime_local(data.result2[i].wkd_work)+'"></div>');
					ele.push('	</td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>작업종료</th>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp"><input type="datetime-local" name="wkd_end[]" value="'+datetime_local(data.result2[i].wkd_end)+'"></div>');
					ele.push('	</td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>콜근무완료</th>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp"><input type="datetime-local" name="wkd_finish[]" class="finish_date" value="'+datetime_local(data.result2[i].wkd_finish)+'"></div>');
					ele.push('	</td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>총근무시간</th>');
					ele.push('	<td><input type="text" name="wkd_total[]" class="wkd_total" value="'+data.result2[i].wkd_total+'"></td>');
					ele.push('</tr>');
					ele.push('<tr>');
					ele.push('	<th>지급액</th>');
					ele.push('	<td><input type="text" name="wkd_amount[]" class="wkd_amount" value="'+number_format(data.result2[i].wkd_amount)+'" ></td>');
					ele.push('<tr>');
				}
				if (i == 0) ele.push('<tr class="empty"><td class="colspan="3"">조회할 데이터가 없습니다.</td></tr>');

				$('[name=call_work_detail] .tb_1 tbody').html(ele.join(''));
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}
	});

}

function add_list(){
	$('.tb_1 tr.empty').remove();
	
	var length	= $('.tb_1').find('tr').length / 8;
	var ele = new Array();

	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>소속</th>');
	ele.push('	<td>');
	ele.push('		<div>');
	//ele.push('			<input type="hidden" name="wrk_seq[]" value="">');
	ele.push('			<input type="hidden" name="wkd_seq[]" value="">');
	ele.push('			<input type="hidden" name="og_seq[]" class="og_seq" value="">');
	ele.push('			<input type="text" name="og_name[]" class="og_name" placeholder="근무자 선택시 자동입력" readonly>');
	//ele.push('			<a class="btn" data-dialog="team_sch"><i class="ri-search-line"></i></a>');
	ele.push('		</div>');
	ele.push('	</td>');
	ele.push('	<td rowspan="8"><a class="del_btn">-</a></td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>근무자</th>');
	ele.push('	<td>');
	ele.push('		<div class="sch_inp">');
	ele.push('			<input type="hidden" name="per_seq2[]" value="">');
	ele.push('			<input type="text" name="per_name[]" placeholder="검색하기" readonly>');
	ele.push('			<a class="btn" data-dialog="person_sch"><i class="ri-search-line"></i></a>');
	ele.push('		</div>');
	ele.push('	</td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>콜근무출발</th>');
	ele.push('	<td>');
	ele.push('		<div class="sch_inp"><input type="datetime-local" name="wrd_start[]" class="start_date" placeholder="일자 선택"></div>');
	ele.push('	</td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>작업시작</th>');
	ele.push('	<td>');
	ele.push('		<div class="sch_inp"><input type="datetime-local" name="wrd_work[]" placeholder="일자 선택"></div>');
	ele.push('	</td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>작업종료</th>');
	ele.push('	<td>');
	ele.push('		<div class="sch_inp"><input type="datetime-local" name="wrd_end[]" placeholder="일자 선택"></div>');
	ele.push('	</td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>콜근무완료</th>');
	ele.push('	<td>');
	ele.push('		<div class="sch_inp"><input type="datetime-local" name="wrd_finish[]" class="finish_date" placeholder="일자 선택"></div>');
	ele.push('	</td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>총근무시간</th>');
	ele.push('	<td><input type="text" name="wrd_total[]" class="wrd_total" placeholder="자동계산"></td>');
	ele.push('</tr>');
	ele.push('<tr data-row="'+length+'">');
	ele.push('	<th>지급액</th>');
	ele.push('	<td><input type="text" name="wrd_amount[]" class="wrd_amount" placeholder="자동계산"></td>');
	ele.push('</tr>');

	$('[name=call_work_detail] .tb_1 tbody').append(ele.join(''));
}