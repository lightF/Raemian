$(document).ready(function() {
	item_system_list();

	var path = location.search.split('&');
	var	type = path[0].split('=');
	
	$('.top_tit .back, .btn_area a').hide();
	if (type[1] == 'new'){
		$('.top_tit span').text('고장등록');
		$('.btn_area .close').show();
		$('[name=breakdown_detail] input').val('');
		$('[name=breakdown_detail] select option').prop('selected', false);

		add_list($('[name=breakdown_detail] .tb_1'), 1);
		add_list($('[name=breakdown_detail] .tb_2'), 2);
		add_list($('[name=breakdown_detail] .tb_3'), 3);
		add_list($('[name=breakdown_detail] .tb_4'), 4);

	} else {
		var seq	= path[1].split('=');
			seq	= seq[1];

		$('.top_tit span').text('상세보기');
		$('.top_tit .back, .btn_area .btn_remove').show();

		detail(seq);
	}
});


$(document).on('change', '[name=breakdown_detail] [name=bk_receipt], [name=breakdown_detail] [name=bk_finish]', function() {
	var start	= $('[name=breakdown_detail] [name=bk_receipt]').val();
	var end		= $('[name=breakdown_detail] [name=bk_finish]').val();

	if (start == '' || end == '') return false;

	var date1 = dayjs(start);
	var date2 = dayjs(end);
	var minutes = date2.diff(date1, 'minutes'); 

	$('[name=breakdown_detail] [name=bk_hour]').val(number_format(minutes));

});


//추가항목 추가
$(document).on('click', '[name=breakdown_detail] .add_btn', function() {
	var target	= $(this).next('.tb').find('table');
	var type	= $(this).attr('data-type');

	add_list(target, type);

});

//추가항목 삭제
$(document).on('click', 'table .del_btn', function() {
	var tr_num = $(this).closest('tr').attr('data-row');
	$('.table').find('tr[data-row="'+tr_num+'"]').remove();

});


//삭제
$(document).on('click', '[name=breakdown_detail] .btn_remove', function() {
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/breakdown/delete',
			type: 'post',
			dataType: 'json',
			data: {'seq' : $('[name=breakdown_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 되었습니다.');
					location.href = '/DBCS/faultreception_mgt';

				} else {
					pop_alert('삭제 실패하였습니다.');
				}
				

			}
		});
	
	});
});


//저장
$(document).on('click', '[name=breakdown_detail] .btn_save', function() {
	var chk = '';
	var save_state = $(this).attr('data-save');

	$('[name=breakdown_detail] input').each(function(i){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
		}
	});
	
	if(chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}

	if (save_state == 'save'){
		save();
	} else if (save_state == 'tmp'){
		$('[name=breakdown_detail]').ajaxSubmit({
			url: contextPath + '/breakdown/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			beforeSubmit: function(data) {
				data = commatoint(data);
			},
			success: function(data){
				if (data.code == 1){
					detail(data.seq);

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} 
				

			}, error: function(data, status, err) {
				pop_alert('저장에 실패 하였습니다.');
			}
		});
	} 

});

function detail(seq){
	
	$.ajax({
		url: contextPath + '/breakdown/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result[0];
				var ele	 = new Array();
				var ele2 = new Array();
				var ele3 = new Array();
				var ele4 = new Array();

				$('[name=breakdown_detail] [name=seq]').val(item.seq);
				$('[name=breakdown_detail] [name=bk_code]').val(item.bk_code);
				$('[name=breakdown_detail] [name=bk_number]').val(item.bk_number);
				$('[name=breakdown_detail] [name=dc_seq]').val(item.dc_seq);
				$('[name=breakdown_detail] [name=dc_name]').val(item.dc_name);
				$('[name=breakdown_detail] [name=dc_location]').val(item.dc_location);
				$('[name=breakdown_detail] [name=bk_faulty]').val(datetime_local(item.bk_faulty));
				$('[name=breakdown_detail] [name=bk_receipt]').val(datetime_local(item.bk_receipt));
				$('[name=breakdown_detail] [name=bk_start]').val(datetime_local(item.bk_start));
				$('[name=breakdown_detail] [name=bk_finish]').val(datetime_local(item.bk_finish));
				$('[name=breakdown_detail] [name=bk_hour]').val(number_format(item.bk_hour));
				$('[name=breakdown_detail] [name=bk_cost]').val(number_format(item.bk_cost));
				$('[name=breakdown_detail] [name=bk_work] option[value="'+item.bk_work+'"]').prop('selected', true);
				$('[name=breakdown_detail] [name=bk_standard] option[value="'+item.bk_standard+'"]').prop('selected', true);
				$('[name=breakdown_detail] [name=bk_process] option[value="'+item.bk_process+'"]').prop('selected', true);
				$('[name=breakdown_detail] [name=per_seq]').val(item.per_seq);
				$('[name=breakdown_detail] [name=per_name]').val(item.per_name);
				
				$('[name=breakdown_detail] #i_seq').closest('.input_file').removeClass('upload');
				$('[name=breakdown_detail] img_view, [name=breakdown_detail] .file_del').remove();
				if(data.result2.length > 0){
					for(var i=0;i<data.result2.length;i++) {
						//이미지업로드
						if(data.result2[i].f_repath && data.result2[i].f_resize) {
							var html3 = new Array();
							$('[name=breakdown_detail] #i_seq'+(i+1)).next().next().next().val(data.result2[i].f_seq);
							$('[name=breakdown_detail] #i_seq'+(i+1)).next().next().next().next().val(1);
							html3.push('<a class="img_view" href="'+resourcePath+ data.result2[i].f_path+data.result2[i].f_original+' target="_blank">');
							html3.push('<img src="'+resourcePath+ data.result2[i].f_repath+data.result2[i].f_resize+'"/></a>');
							html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

							$('[name=breakdown_detail] #i_seq'+(i+1)).parent().append( html3.join('') );
						}
					}

				}

				//작업자
				for (var i=0; i < data.result3.length; i++){
					ele.push('<tr data-row="'+data.result3[i].per_seq+'">');
					ele.push('	<th class="required">작업자<span class="ess"></span></th>');
					ele.push('	<td>');
					ele.push('		<div class="sch_inp">');
					ele.push('			<input type="hidden" name="bw_seq[]" value="'+item.seq+'">');
					ele.push('			<input type="hidden" name="per_seq2[]" value="'+data.result3[i].per_seq+'" required>');
					ele.push('			<input type="text" name="per_seq2_name[]" placeholder="검색하기" readonly value="'+data.result3[i].per_seq2_name+'">');
					ele.push('			<a class="btn" data-dialog="person_sch" data-num="'+i+'"><i class="ri-search-line"></i></a>');
					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('	<td rowspan="2"><a class="del_btn" data-type="1">-</a></td>');
					ele.push('</tr>');
					ele.push('<tr data-row="'+data.result3[i].per_seq+'">');
					ele.push('	<th>비고</th>');
					ele.push('	<td><input type="text" name="bw_note[]" value="'+data.result3[i].bw_note+'"></td>');
					ele.push('</tr>');
				}

				if (i == 0) ele.push('<tr class="empty"><td colspan="3">조회된 데이터가 없습니다.</td></tr>');
				$('[name=breakdown_detail] .tb_1 tbody').html(ele.join(''));
			
				
				//구성부
				for (var j=0; j < data.result4.length; j++){
					ele2.push('<tr data-row="'+data.result4[j].bc_seq+'">');
					ele2.push('		<th class="required">구성부</th>');
					ele2.push('		<td>');
					ele2.push('			<input type="hidden" name="bc_seq[]" value="'+data.result4[j].bc_seq+'">');
					ele2.push('			<input type="text" name="bc_compose[]" value="'+data.result4[j].bc_compose+'">');
					ele2.push('		</td>');
					ele2.push('		<td rowspan="5"><a class="del_btn" data-type="2">-</a></td>');
					ele2.push('</tr>');
					ele2.push('<tr data-row="'+data.result4[j].bc_seq+'">');
					ele2.push('		<th class="required">현상</th>');
					ele2.push('		<td><input type="text" name="bc_status[]" value="'+data.result4[j].bc_status+'"></td>');
					ele2.push('</tr>');
					ele2.push('<tr data-row="'+data.result4[j].bc_seq+'">');
					ele2.push('		<th class="required">원인</th>');
					ele2.push('		<td><input type="text" name="bc_cause[]" value="'+data.result4[j].bc_cause+'"></td>');
					ele2.push('</tr>');
					ele2.push('<tr data-row="'+data.result4[j].bc_seq+'">');
					ele2.push('		<th class="required">조치결과</th>');
					ele2.push('		<td><input type="text" name="bc_result[]" value="'+data.result4[j].bc_result+'"></td>');
					ele2.push('</tr>');
					ele2.push('<tr data-row="'+data.result4[j].bc_seq+'">');
					ele2.push('		<th>비고</th>');
					ele2.push('		<td><input type="text" name="bc_note[]" value="'+data.result4[j].bc_note+'"></td>');
					ele2.push('</tr>');
					
				}
				if (j == 0) ele2.push('<tr class="empty"><td colspan="5">조회할 데이터가 없습니다.</td></tr>');
				$('[name=breakdown_detail] .tb_2 tbody').html(ele2.join(''));
				
				
				//저장폼내역
				for (var k=0; k < data.result5.length; k++){
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th class="required">구성부</th>');
					ele3.push('		<td>');
					ele3.push('			<input type="hidden" name="bs_seq1[]" value="'+data.result5[k].bs_seq1+'">');
					ele3.push('			<select name="bc_seq1[]" class="bs_sel">');
					for(var l=0; l < data.result7.length; l++){
						if (data.result5[k].bc_seq1 == data.result7[l].bc_seq){
							ele3.push('	<option value="'+data.result7[l].bc_seq+'" selected>'+data.result7[l].bc_compose+'</option>');
						} else {
							ele3.push('	<option value="'+data.result7[l].bc_seq+'">'+data.result7[l].bc_compose+'</option>');
						}
					}
					ele3.push('		</select>');
					ele3.push('		</td>');
					ele3.push('		<td rowspan="8"><a class="del_btn" data-type="3">-</a></td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th class="required">처리구분</th>');
					ele3.push('		<td><select name="bs_process1[]">');
					ele3.push('		<option value="">선택</option>');
					ele3.push('		<option value="1" '+(data.result5[k].bs_process1 == 1 ? 'selected' : '')+' >유상</option>');
					ele3.push('		<option value="2" '+(data.result5[k].bs_process1 == 2 ? 'selected' : '')+'>무상</option>');
					ele3.push('	</select></td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th>Unit Count(구)</th>');
					ele3.push('		<td><input type="text" name="bs_old1[]" class="input_number" value="'+number_format(data.result5[k].bs_old1)+'"></td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th>Unit Count(신)</th>');
					ele3.push('		<td><input type="text" name="bs_new1[]" class="input_number" value="'+number_format(data.result5[k].bs_new1)+'"></td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th class="required">부품 및 창고위치</th>');
					ele3.push('		<td>');
					ele3.push('			<div class="sch_inp">');
					ele3.push('				<input type="hidden" name="pt_seq1[]" value="'+data.result5[k].pt_seq1+'">');
					ele3.push('				<input type="text" name="pt_seq1_name[]" value="'+data.result5[k].pt_seq1_name+'">');
					ele3.push('				<a class="btn" data-dialog="storage_order" data-num="'+k+'"><i class="ri-search-line"></i></a>');
					ele3.push('			</div>');
					ele3.push('		</td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th class="required">수량</th>');
					ele3.push('		<td><input type="text" name="bs_count1[]" class="input_number" value="'+number_format(data.result5[k].bs_count1)+'"></td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th class="required">단가</th>');
					ele3.push('		<td><input type="text" name="bs_price1[]" class="input_number"  value="'+number_format(data.result5[k].bs_price1)+'"></td>');
					ele3.push('</tr>');
					ele3.push('<tr data-row="'+data.result5[k].bs_seq1+'">');
					ele3.push('		<th>비고</th>');
					ele3.push('		<td><input type="text" name="bs_note1[]" value="'+data.result5[k].bs_note1+'"></td>');
					ele3.push('</tr>');
				}
				
				if (k == 0) ele3.push('<tr class="empty"><td colspan="8">조회할 데이터가 없습니다.</td></tr>');
				$('[name=breakdown_detail] .tb_3 tbody').html(ele3.join(''));
				
				
				//예비폼내역
				for (var p=0; p < data.result6.length; p++){
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<input type="hidden" name="bs_seq2[]" value="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th class="required">구성부</th>');
					ele4.push('		<td><select name="bc_seq2[]" >');
					for(var t=0; t < data.result7.length; t++){
						if (data.result6[p].bc_seq2 == data.result7[t].bc_seq){
							ele4.push('	<option value="'+data.result7[t].bc_seq+'" selected>'+data.result7[t].bc_compose+'</option>');
						} else {
							ele4.push('	<option value="'+data.result7[t].bc_seq+'">'+data.result7[t].bc_compose+'</option>');
						}
					}
					ele4.push('		</select></td>');
					ele4.push('		<td rowspan="8"><a class="del_btn" data-type="2">-</a></td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th class="required">처리구분</th>');
					ele4.push('		<td><select name="bs_process2[]">');
					ele4.push('		<option value="">선택</option>');
					ele4.push('		<option value="1" '+(data.result6[p].bs_process2 == 1 ? 'selected' : '')+' >유상</option>');
					ele4.push('		<option value="2" '+(data.result6[p].bs_process2 == 2 ? 'selected' : '')+' >무상</option>');

					ele4.push('		</td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'" >');
					ele4.push('		<th>Unit Count(구)</th>');
					ele4.push('		<td><input type="text" name="bs_old2[]" class="input_number" value="'+number_format(data.result6[p].bs_old2)+'"></td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th>Unit Count(신)</th>');
					ele4.push('		<td><input type="text" name="bs_new2[]" class="input_number" value="'+number_format(data.result6[p].bs_new2)+'"></td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th class="required">부품 및 창고위치</th>');
					ele4.push('		<td>');
					ele4.push('			<div class="sch_inp">');
					ele4.push('				<input type="hidden" name="pt_seq2[]" value="'+data.result6[p].pt_seq2+'">');
					ele4.push('				<input type="text" name="per_seq2_name[]" value="'+data.result6[p].pt_seq2_name+'">');
					ele4.push('				<a class="btn" data-dialog="storage_order" data-num="'+p+'"><i class="ri-search-line"></i></a>');
					ele4.push('			</div>');
					ele4.push('		<td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th class="required">수량</th>');
					ele4.push('		<td><input type="text" name="bs_count2[]" class="input_number" value="'+number_format(data.result6[p].bs_count2)+'"></td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th class="required">단가</th>');
					ele4.push('		<td><input type="text" name="bs_price2[]" class="input_number" value="'+number_format(data.result6[p].bs_price2)+'""></td>');
					ele4.push('</tr>');
					ele4.push('<tr data-row="'+data.result6[p].bs_seq2+'">');
					ele4.push('		<th>비고</th>');
					ele4.push('		<td><input type="text" name="bs_note2[]" value="'+data.result6[p].bs_note2+'"></td>');
					ele4.push('</tr>');
					
				}
				if (p == 0) ele4.push('<tr class="empty"><td colspan="8">조회할 데이터가 없습니다.</td></tr>');
				
				$('[name=breakdown_detail] .tb_4 tbody').html(ele4.join(''));

				
				
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}
	});
}


function add_list(target, type){
	target.find('tr.empty').remove();
	var seq		= $('[name=breakdown_detail] [name=seq]').val();
	var length	= '';
	var ele = new Array();
	
	if (type == 1){
		length = target.find('tr').length / 2;

		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">작업자<span class="ess"></span></th>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="bw_seq[]" value="'+seq+'">');
		ele.push('			<input type="hidden" name="per_seq2[]" required>');
		ele.push('			<input type="text" name="per_seq2_name[]" placeholder="검색하기" readonly>');
		ele.push('			<a class="btn" data-dialog="person_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('	<td rowspan="2"><a class="del_btn" data-type="1">-</a></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>비고</th>');
		ele.push('	<td><input type="text" name="bw_note[]" placeholder="입력하세요."></td>');		
		ele.push('</tr>');

	} else if (type == 2){
		length = target.find('tr').length / 5;

		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">구성부</th>');
		ele.push('	<td> <input type="hidden" name="bc_seq[]">');
		ele.push('		<input type="text" name="bc_compose[]" placeholder="입력하세요."></td>');
		ele.push('	<td rowspan="5"><a class="del_btn" data-type="2">-</a></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">현상</th>');
		ele.push('	<td><input type="text" name="bc_status[]" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">원인</th>');
		ele.push('	<td><input type="text" name="bc_cause[]" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">조치결과</th>');
		ele.push('	<td><input type="text" name="bc_result[]" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>비고</th>');
		ele.push('	<td><input type="text" name="bc_note[]" placeholder="입력하세요."></td>');
		ele.push('</tr>');


	} else if (type == 3){
		length = target.find('tr').length / 8;
		ele.push('<tr data-row="'+length+'" class="add_'+length+'">');
		ele.push('	<th class="required">구성부</th>');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="tr_num" value="'+length+'">');
		ele.push('		<input type="hidden" name="bs_seq1[]">');
		ele.push('		<select name="bc_seq1[]" class="bs_sel"></select>');
		ele.push('	</td>');
		ele.push('	<td rowspan="8"><a class="del_btn" data-type="3">-</a></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">처리구분</th>');
		ele.push('	<td>');
		ele.push('		<select name="bs_process1[]">');
		ele.push('			<option value="">선택</option>');
		ele.push('			<option value="1">유상</option>');
		ele.push('			<option value="2">무상</option>');
		ele.push('		</select>');
		ele.push('	</td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>Unit Count(구)</th>');
		ele.push('	<td><input type="text" name="bs_old1[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>Unit Count(신)</th>');
		ele.push('	<td><input type="text" name="bs_new1[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">부품 및 창고위치</th>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="pt_seq1[]">');
		ele.push('			<input type="text" name="pt_seq1_name[]" placeholder="검색하기">');
		ele.push('			<a class="btn" data-dialog="storage_order" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">수량</th>');
		ele.push('	<td><input type="text" name="bs_count1[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">단가</th>');
		ele.push('	<td><input type="text" name="bs_price1[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>비고</th>');
		ele.push('	<td><input type="text" name="bs_note1[]" placeholder="입력하세요."></td>');
		ele.push('</tr>');
	} else {
		length = target.find('tr').length / 8;

		ele.push('<tr data-row="'+length+'" class="add_'+length+'">');
		ele.push('	<th class="required">구성부</th>');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="bs_seq2[]">');
		ele.push('		<select name="bc_seq2[]"></select>');
		ele.push('	</td>');
		ele.push('	<td rowspan="8"><a class="del_btn">-</a></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">처리구분</th>');
		ele.push('	<td>');
		ele.push('		<select name="bs_process2[]">');
		ele.push('			<option value="">선택</option>');
		ele.push('			<option value="1">유상</option>');
		ele.push('			<option value="2">무상</option>');
		ele.push('		</select>');
		ele.push('	</td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>Unit Count(구)</th>');
		ele.push('	<td><input type="text" name="bs_old2[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>Unit Count(신)</th>');
		ele.push('	<td><input type="text" name="bs_new2[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">부품 및 창고위치</th>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="pt_seq2[]">');
		ele.push('			<input type="text" name="pt_seq2_name[]" placeholder="검색하기" readonly>');
		ele.push('			<a class="btn" data-dialog="storage_order" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">수량</th>');
		ele.push('	<td><input type="text" name="bs_count2[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th class="required">단가</th>');
		ele.push('	<td><input type="text" name="bs_price2[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		ele.push('<tr data-row="'+length+'">');
		ele.push('	<th>비고</th>');
		ele.push('	<td><input type="text" name="bs_note2[]" placeholder="입력하세요."></td>');
		ele.push('</tr>');
		
	}

	target.find('tbody').append(ele.join(''));
	compose_list(seq, target.find('tr.add_'+length+''));
}


var compose_name = new Array();
function compose_list(seq){
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/breakdown/compose/list',
		type: 'post',
		data : {seq : seq},
		dataType: 'json',
		success: function(data) {
			if(data.code == 0) alert('데이터 로드에 실패하였습니다.');
			for(var i=0;i<data.result.length;i++) {
				html.push('<option value="'+data.result[i].bk_seq+'">'+data.result[i].bc_compose+'</option>');	
				compose_name[ data.result[i].bk_seq ] = data.result[i].bc_compose;
			}
			$('[name="bc_seq1[]"], [name="bc_seq2[]"]').html( html.join('') );
		}

	});
}


function save(){
	pop_confirm('저장하시겠습니까?', function(){

		$('[name=breakdown_detail]').ajaxSubmit({
			url: contextPath + '/breakdown/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			beforeSubmit: function(data) {
				data = commatoint(data);
			},
			success: function(data){
				if(data.code == 1) {
					pop_alert('저장 되었습니다.');
					
					setTimeout(function(){
						location.href = '/DBCS/faultreception_mgt';
					}, 1000);
					
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패 하였습니다.');
				}

			}, error: function(data, status, err) {
				pop_alert('저장에 실패 하였습니다.');
			}
		});	
	});

}