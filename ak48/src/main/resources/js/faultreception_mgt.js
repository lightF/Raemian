$(document).ready(function() {
	item_system_list();
	list();
});
	

$(document).on('click', '.btn_search', function() {
	list();
});

//리스트 정렬
$(document).on('click', '.breakdown_list th[data-order]', function() {
	list();
});

//페이지 이동
$(document).on('click', '.faul_mgt .paging a', function() {
	$('[name=breakdown_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});



$(document).on('click', '.dialog .close', function() {
	list();
});

$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');

	$('[name=breakdown_detail] .btn_area a').hide();
	if (type == 'new'){
		$('[name=breakdown_detail] .detail_tit').text('고장등록');
		$('[name=breakdown_detail] input').val('');
		$('[name=breakdown_detail] .btn_area .close').show();
		$('[name=breakdown_detail] .input_file').removeClass('upload');
		$('[name=breakdown_detail] .img_view, [name=breakdown_detail] .file_del').remove();
		$('[name=breakdown_detail] .tb tbody tr').remove();
		add_list($('[name=breakdown_detail] .tbl_worker'), 1);
		add_list($('[name=breakdown_detail] .tbl_composition'), 2);
		add_list($('[name=breakdown_detail] .tbl_save'), 3);
		add_list($('[name=breakdown_detail] .tbl_spare'), 4);

	} else {
		$('[name=breakdown_detail] .detail_tit').text('상세 고장접수관리');
		$('[name=breakdown_detail] .btn_area .btn_remove, [name=breakdown_detail] .xlsx, [name=breakdown_detail] .btn_save').show();
		detail($(this).closest('tr').find('[name=seq]').val());
		$('[name=breakdown_detail] .tb').show();
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



//상세팝업 table 행 추가
$(document).on('click', '[name=breakdown_detail] table .add_btn', function() {
	var target	= $(this).closest('table');
	var type	= $(this).attr('data-addlist');

	add_list(target, type);
});


//상세팝업 table 행 삭제
$(document).on('click', '[name=breakdown_detail] table .del_btn', function() {
	$(this).closest('tr').remove();
});


$(document).on('click', 'a[data-dialog="spare_order"]', function() {
	var num = $(this).closest('tr').attr('data-num');

	$('[name=breakdown_part_list2]').append('<input type="hidden" name="tr_num" value="'+num+'">');
});


$(document).on('click', '#spare_order .table.tb_scroll tbody > tr', function(){
	var tr_num = $('[name=breakdown_part_list2] [name=tr_num]').val();

	$('.tbl_save tr[data-num="'+tr_num+'"]').find('[name="' + $('#spare_order [name="target"]').val()+ '"]').val( $(this).find('[name="pt_seq"]').val()  ).next().val( $(this).find('td:nth-child(3)').text());
	$('[name=breakdown_part_list2] [name=tr_num]').remove();
});


//엑셀다운
$(document).on('click', '[name=breakdown_detail] .btn.xlsx ', function() {
	var seq = $('[name=breakdown_detail] [name=seq]').val();
	window.location.href = contextPath +'/breakdown/detail/excel?seq='+seq;
});




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
			success: function(data){
				if (data.code == 1){
					detail(data.seq);

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패 하였습니다.');
				}

				

			}, error: function(data, status, err) {
				pop_alert('저장에 실패 하였습니다.');
			}
		});
	}
});

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
					list();

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제 실패하였습니다.');
				}
				
			}
		});
	
	});
});

function list(){
	loader();

	var params	= $('[name=breakdown_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/breakdown/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					var standard = data.result[i].bk_standard;
					switch(standard){
						case 1: standard = '단순정비'; break;
						case 2: standard = '경정비'; break;
						case 3: standard = '중정비'; break;
						case 4: standard = '입고수리'; break;
						case 5: standard = '원상복귀'; break;
					}
					ele.push('<tr class="btn_add" data-dialog="faul_mgt_re" data-type="modify">');
					ele.push('	<td><input type="hidden" name="seq" value="'+data.result[i].seq+'">'+data.result[i].bk_code+'</td>');
					ele.push('	<td>'+standard+'</td>');
					ele.push('	<td>'+length8(data.result[i].bk_receipt, '-', 1)+'</td>');
					ele.push('	<td>'+length14(data.result[i].bk_start, '-', ':', 1)+'</td>');
					ele.push('	<td>'+number_format(data.result[i].bk_hour)+'</td>');
					ele.push('	<td>'+data.result[i].dc_name+'</td>');
					ele.push('	<td>'+data.result[i].dc_location+'</td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="7">검색된 데이터가 없습니다.</td></tr>');

				$('.breakdown_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=breakdown_search] [name=page]').val());

				

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
		url: contextPath + '/breakdown/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				
				var item = data.result[0];
				var wle = new Array();
				var cle = new Array();
				var sle = new Array();
				var sle2 = new Array();

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
				$('[name=breakdown_detail] [name=bk_cost]').val(item.bk_cost);
				$('[name=breakdown_detail] [name=bk_work] option[value="'+item.bk_work+'"]').prop('selected', true);
				$('[name=breakdown_detail] [name=bk_standard] option[value="'+item.bk_standard+'"]').prop('selected', true);
				$('[name=breakdown_detail] [name=bk_process] option[value="'+item.bk_process+'"]').prop('selected', true);
				$('[name=breakdown_detail] [name=per_seq]').val(item.per_seq);
				$('[name=breakdown_detail] [name=per_name]').val(item.per_name);

				$('[name=breakdown_detail] .img_view, [name=breakdown_detail] .file_del').remove();
				if(data.result2.length > 0){
					for(var i=0;i<data.result2.length;i++) {
						//이미지업로드
						if(data.result2[i].f_repath && data.result2[i].f_resize) {
							var html3 = new Array();
							$('[name=breakdown_detail] #f_seq'+(i+1)).closest('.input_file').addClass('upload');
							$('[name=breakdown_detail] #f_seq'+(i+1)).next().next().next().val(data.result2[i].f_seq);
							$('[name=breakdown_detail] #f_seq'+(i+1)).next().next().next().next().val(1);
							html3.push('<a class="img_view" href="'+resourcePath+ data.result2[i].f_path+data.result2[i].f_original+' target="_blank">');
							html3.push('<img src="'+resourcePath+ data.result2[i].f_repath+data.result2[i].f_resize+'"/></a>');
							html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

							$('[name=breakdown_detail] #f_seq'+(i+1)).parent().append( html3.join('') );
						}
					}

				}
				
				for (var i=0; i < data.result3.length; i++){
					wle.push('<tr>');
					wle.push('	<td>');
					wle.push('		<input type="hidden" name="bw_seq[]" value="'+item.seq+'">');
					wle.push('		<div class="sch_inp">');
					wle.push('			<input type="hidden" name="per_seq2[]" value="'+data.result3[i].per_seq+'" required>');
					wle.push('			<input type="text" name="per_seq2_name[]" value="'+data.result3[i].per_seq2_name+'" readonly>');
					wle.push('			<a class="btn" data-dialog="person_sch"><i class="ri-search-line"></i></a>');
					wle.push('		</div>');
					wle.push('	</td>');
					wle.push('	<td><input type="text" name="bw_note[]" value="'+data.result3[i].bw_note+'"></td>');
					wle.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					wle.push('</tr>');
				}

				if (i==0) wle.push('<tr class="empty"><td colspan="4">조회할 데이터가 없습니다.</td></tr>');
				$('.tbl_worker tbody').html(wle.join(''));
				
				for (var j=0; j < data.result4.length; j++){
					cle.push('<tr>');
					cle.push('	<td><input type="hidden" name="bc_seq[]" value="'+data.result4[j].bc_seq+'">');
					cle.push('	<input type="text" name="bc_compose[]" value="'+data.result4[j].bc_compose+'"></td>');
					cle.push('	<td><input type="text" name="bc_status[]" value="'+data.result4[j].bc_status+'"></td>');
					cle.push('	<td><input type="text" name="bc_cause[]" value="'+data.result4[j].bc_cause+'"></td>');
					cle.push('	<td><input type="text" name="bc_result[]" value="'+data.result4[j].bc_result+'"></td>');
					cle.push('	<td><input type="text" name="bc_note[]" value="'+data.result4[j].bc_note+'"></td>');
					cle.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					cle.push('</tr>');
				}
				if (j==0) cle.push('<tr class="empty"><td colspan="6">조회할 데이터가 없습니다.</td></tr>');
				$('.tbl_composition tbody').html(cle.join(''));
				

				//저장품
				for (var k=0; k < data.result5.length; k++){
					sle.push('<tr data-num="'+k+'">');
					sle.push('	<td>');
					sle.push('		<input type="hidden" name="bs_seq1[]" value="'+data.result5[k].bs_seq1+'">');
					sle.push('		<select name="bc_seq1[]" class="bs_sel">');

						for(var l=0; l < data.result7.length; l++){
							if (data.result5[k].bc_seq1 == data.result7[l].bc_seq){
								sle.push('	<option value="'+data.result7[l].bc_seq+'" selected>'+data.result7[l].bc_compose+'</option>');
							} else {
								sle.push('	<option value="'+data.result7[l].bc_seq+'">'+data.result7[l].bc_compose+'</option>');
							}
						}
					
					sle.push('		</select>');
					sle.push('	</td>');
					sle.push('	<td><select name="bs_process1[]">');
					sle.push('		<option value="">선택</option>');
					sle.push('		<option value="1" '+(data.result5[k].bs_process1 == 1 ? 'selected' : '')+'>유상</option>');
					sle.push('		<option value="2" '+(data.result5[k].bs_process1 == 2 ? 'selected' : '')+'>무상</option>');
					sle.push('	</select></td>');
					sle.push('	<td><input type="text" name="bs_old1[]" value="'+number_format(data.result5[k].bs_old1)+'" ></td>');
					sle.push('	<td><input type="text" name="bs_new1[]" value="'+number_format(data.result5[k].bs_new1)+'"></td>');
					sle.push('	<td>');
					sle.push('		<div class="sch_inp">');
					sle.push('			<input type="hidden" name="pt_seq1[]" value="'+data.result5[k].pt_seq1+'">');
					sle.push('			<input type="text" name="pt_seq1_name[]" value="'+data.result5[k].pt_seq1_name+'">');
					sle.push('			<a class="btn" data-dialog="storage_order" data-num="'+k+'" ><i class="ri-search-line"></i></a>');
					sle.push('		</div>');
					sle.push('	</td>');
					sle.push('	<td><input type="text" name="bs_count1[]" value="'+number_format(data.result5[k].bs_count1)+'"></td>');
					sle.push('	<td><input type="text" name="bs_price1[]" value="'+number_format(data.result5[k].bs_price1)+'"></td>');
					sle.push('	<td><input type="text" name="bs_note1[]" value="'+data.result5[k].bs_note1+'"></td>');
					sle.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					sle.push('</tr>');

			
				}
				
				if (k==0) sle.push('<tr class="empty"><td colspan="9">조회할 데이터가 없습니다.</td></tr>');
				$('.tbl_save tbody').html(sle.join(''));
				
				//예비품
				
				for (var p=0; p < data.result6.length; p++){
					sle2.push('<tr data-num="'+p+'">');
					sle2.push('	<td>');
					sle2.push('		<input type="hidden" name="bs_seq2[]" value="'+data.result6[p].bs_seq2+'">');
					sle2.push('		<select name="bc_seq2[]" class="bs_sel">');
					for(var s=0; s < data.result7.length; s++){
						if (data.result6[p].bc_seq2 == data.result7[s].bc_seq){
							sle2.push('	<option value="'+data.result7[s].bc_seq+'" selected>'+data.result7[s].bc_compose+'</option>');
						} else {
							sle2.push('	<option value="'+data.result7[s].bc_seq+'">'+data.result7[s].bc_compose+'</option>');
						}
					}
					sle2.push('		</select>');
					sle2.push('	</td>');
					sle2.push('	<td><select name="bs_process2[]">');
					sle2.push('		<option value="">선택</option>');
					sle2.push('		<option value="1" '+(data.result6[p].bs_process2 == 1 ? 'selected' : '')+'>유상</option>');
					sle2.push('		<option value="2" '+(data.result6[p].bs_process2 == 2 ? 'selected' : '')+'>무상</option>');
					sle2.push('	</select></td>');
					sle2.push('	<td><input type="text" name="bs_old2[]" value="'+number_format(data.result6[p].bs_old2)+'"></td>');
					sle2.push('	<td><input type="text" name="bs_new2[]" value="'+number_format(data.result6[p].bs_new2)+'"></td>');
					sle2.push('	<td>');
					sle2.push('		<div class="sch_inp">');
					sle2.push('			<input type="hidden" name="pt_seq2[]" value="'+data.result6[p].pt_seq2+'">');
					sle2.push('			<input type="text" name="pt_seq2_name[]" value="'+(typeof data.result6[p].pt_seq2_name == 'undefined' ? '' : data.result6[p].pt_seq2_name)+'">');
					sle2.push('			<a class="btn" data-dialog="spare_order" data-num="'+p+'"><i class="ri-search-line"></i></a>');
					sle2.push('		</div>');
					sle2.push('	</td>');
					sle2.push('	<td><input type="text" name="bs_count2[]" value="'+number_format(data.result6[p].bs_count2)+'"></td>');
					sle2.push('	<td><input type="text" name="bs_price2[]" value="'+number_format(data.result6[p].bs_price2)+'"></td>');
					sle2.push('	<td><input type="text" name="bs_note2[]" value="'+data.result6[p].bs_note2+'"></td>');
					sle2.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					sle2.push('</tr>');
				}
				if (p == 0) sle2.push('<tr class="empty"><td colspan="9">조회할 데이터가 없습니다.</td></tr>');
				$('.tbl_spare tbody').html(sle2.join(''));
				
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}, complete: function () {
		 
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
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패 하였습니다.');
				}

			}, complete: function() {
				$('[name=breakdown_search]')[0].reset();
				list();
			}, error: function(data, status, err) {
				pop_alert('저장에 실패 하였습니다.');
			}
		});
	
	});

}



function add_list(target, type){
	target.find('tr.empty').remove();
	var seq		= $('[name=breakdown_detail] [name=seq]').val();
	
	var length	= target.find('tr').length;
	var ele = new Array();

	if (type == 1){
		ele.push('<tr>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="bw_seq[]" value="'+seq+'">');
		ele.push('			<input type="hidden" name="per_seq2[]" value="" required>');
		ele.push('			<input type="text" name="per_seq2_name[]" placeholder="검색하기">');
		ele.push('			<a class="btn" data-dialog="person_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="bw_note[]" placeholder="입력하세요"></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');

	} else if (type == 2){
		ele.push('<tr>');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="bc_seq[]" value="">');
		ele.push('		<input type="text" name="bc_compose[]" placeholder="입력하세요.">');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="bc_status[]" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bc_cause[]" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bc_result[]" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bc_note[]" placeholder="입력하세요."></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');

	} else if (type == 3){
		ele.push('<tr class="add_'+length+'">');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="tr_num" value="'+length+'">');
		ele.push('		<input type="hidden" name="bs_seq1[]" value="">');
		ele.push('		<select name="bc_seq1[]" class="bs_sel"></select>');
		ele.push('	</td>');
		ele.push('	<td>');
		ele.push('		<select name="bs_process1[]">');
		ele.push('			<option value="">선택</option>');
		ele.push('			<option value="1">유상</option>');
		ele.push('			<option value="2">무상</option>');
		ele.push('		</select>');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="bs_old1[]" class="input_number" placeholder="입력하세요." ></td>');
		ele.push('	<td><input type="text" name="bs_new1[]" class="input_number" placeholder="입력하세요." ></td>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="pt_seq1[]" >');
		ele.push('			<input type="text" name="pt_seq1_name[]" placeholder="검색하세요" value="">');
		ele.push('			<a class="btn" data-dialog="storage_order" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="bs_count1[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bs_price1[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bs_note1[]" placeholder="입력하세요."></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');
		


	} else {
		
		ele.push('<tr class="add_'+length+'">');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="bs_seq2[]" value="">');
		ele.push('		<select name="bc_seq2[]" class="bs_sel"></select>');
		ele.push('	</td>');
		ele.push('	<td>');
		ele.push('		<select name="bs_process2[]"">');
		ele.push('			<option value="">선택</option>');
		ele.push('			<option value="1">유상</option>');
		ele.push('			<option value="2">무상</option>');
		ele.push('		</select>');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="bs_old2[]" class="input_number" placeholder="입력하세요." value=""></td>');
		ele.push('	<td><input type="text" name="bs_new2[]" class="input_number" placeholder="입력하세요." value=""></td>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="pt_seq2[]" placeholder="">');
		ele.push('			<input type="text" name="pt_seq2_name[]" placeholder="검색결과" value="" >');
		ele.push('			<a class="btn" data-dialog="spare_order" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="bs_count2[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bs_price2[]" class="input_number" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="bs_note2[]" placeholder="입력하세요."></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');
		
	}

	target.find('tbody').append(ele.join(''));
	compose_list(seq, target.find('tr.add_'+length+''));
	
}


var compose_name = new Array();
function compose_list(seq, target){
	
	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/breakdown/compose/list',
		type: 'post',
		data : {seq : seq},
		dataType: 'json',
		success: function(data) {
			if(data.code == 1) {
				for(var i=0;i<data.result.length;i++) {
					html.push('<option value="'+data.result[i].bc_seq+'">'+data.result[i].bc_compose+'</option>');	
					compose_name[ data.result[i].bc_seq ] = data.result[i].bc_compose;
				}

				target.find('.bs_sel').html( html.join('') );
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}

	});
}

