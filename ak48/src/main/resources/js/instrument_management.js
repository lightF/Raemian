$(document).ready(function() {
	item_process_list();
	item_model_list();
	item_system_list();
	list();
	
});
	

$(document).on('click', '.btn_search', function() {
	list();
});


//리스트 정렬
$(document).on('click', '.measure_list th[data-order]', function() {
	list();
});


//페이지 이동
$(document).on('click', '.instrument_management .paging a', function() {
	$('[name=measure_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('click', '.dialog .close', function() {
	list();
});

//등록 / 상세팝업
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
	
	$('[name=measure_detail] .btn_area a').hide();
	if (type == 'new'){
		$('[name=measure_detail] input').val('');
		$('[name=measure_detail] select option').prop('selected', false);
		$('[name=measure_detail] .detail_txt').text('계측기 등록');
		$('[name=measure_detail] .btn_area a.close').show();
		$('[name=measure_detail] .input_file .img_view').remove();
		$('[name=measure_detail] .table tbody tr').remove();
		$('[name=measure_detail] .input_file').removeClass('upload');
		$('[name=measure_detail] .img_view, [name=device_detail] .file_del').remove();
		add_list($('.tbl_list1'), 1);
		add_list($('.tbl_list2'), 2);
	} else {
		$('[name=measure_detail] .detail_txt').text('계측기 상세');
		$('[name=measure_detail] .btn_area a.xlsx, [name=measure_detail] .btn_area a.btn_remove').show();

		detail($(this).closest('tr').find('[name=seq]').val());
	}
});



$(document).on('click', 'table .add_btn', function() {
	var target	= $(this).closest('table');
	var type	= $(this).attr('data-addlist');

	add_list(target, type);
});

//추가항목 행삭제
$(document).on('click', 'table .del_btn', function() {
	$(this).closest('tr').remove();
});


$(document).on('click', '.btn_report', function() {
	var seq = $(this).closest('tr').find('[name=seq]').val();
	report(seq);
});


//리스트 엑셀다운
$(document).on('click', '.instrument_management .list_xlsx', function() {
	window.location.href = contextPath +'/measure/list/excel';
});


//팝업 엑셀다운
$(document).on('click', '[name=measure_detail] .btn.xlsx', function() {
	var seq = $('[name=measure_detail] [name=seq]').val();
	window.location.href = contextPath +'/measure/detail/excel?seq='+seq;
});

$(document).on('click', '[name=measure_detail] .btn_save', function() {
	var chk = '';
	$('[name=measure_detail] input').each(function(i){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
		}
	});
	
	if(chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}
	save();
});

$(document).on('click', '[name=measure_detail] .btn_remove', function() {

	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/measure/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : $('[name=measure_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 하였습니다.');
					list();
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제에 실패하였습니다.');
				}
			}
		});
		
	});


});

function list(){
	loader(); 
	var params	= $('[name=measure_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/measure/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			if (data.code == 1){
				close_loader();

				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify"><input type="hidden" name="seq" value="'+data.result[i].seq+'">'+ data.result[i].ms_manage+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ model_name[ data.result[i].md_seq ]+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ String(data.result[i].ms_division).replace('1', '고정자산').replace('2', '부외자산').replace('3', '소모품구분')+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ data.result[i].ms_model+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ data.result[i].act_company+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ data.result[i].group_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ data.result[i].check_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ data.result[i].ms_asset+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ data.result[i].ms_project+'</td>');
					ele.push('	<td class="btn_add" data-dialog="instrument_view" data-type="modify">'+ String(data.result[i].ms_cycle).replace('1', '없음').replace('2', '1년').replace('3', '2년').replace('4', '3년').replace('5', '4년').replace('6', '5년')+'</td>');
					ele.push('	<td><a class="btn_report" data-dialog="instrument_report"><i class="ri-draft-fill"></i></a></td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="11">검색된 데이터가 없습니다.</td></tr>');

				$('.measure_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=measure_search] [name=page]').val());


			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			
		}
	});

}

function detail(seq){
	$.ajax({
		url: contextPath + '/measure/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item	= data.result[0];
				var ele		= new Array();
				var ele2	= new Array();

				$('[name=measure_detail] [name=seq]').val(item.seq);
				$('[name=measure_detail] [name=ms_manage]').val(item.ms_manage);
				$('[name=measure_detail] [name=seq] option[value="'+item.seq+'"]').prop('selected', true);
				$('[name=measure_detail] [name=md_seq]').val(item.md_seq);
				$('[name=measure_detail] [name=ms_stand1]').val(item.ms_stand1);
				$('[name=measure_detail] [name=ms_model]').val(item.ms_model);
				$('[name=measure_detail] [name=act_seq]').val(item.act_seq);
				$('[name=measure_detail] [name=act_name]').val(item.act_name);
				$('[name=measure_detail] [name=ms_create]').val(length8(item.ms_create, '-', 1));
				$('[name=measure_detail] [name=ms_unuse]').val(length8(item.ms_unuse, '-', 1));
				$('[name=measure_detail] [name=ms_buy]').val(length8(item.ms_buy, '-', 1));
				$('[name=measure_detail] [name=sys_seq] option[value="'+item.sys_seq+'"]').prop('selected', true);
				$('[name=measure_detail] [name=ms_group]').val(item.ms_group);
				$('[name=measure_detail] [name=ms_group_name]').val(item.ms_group_name);
				$('[name=measure_detail] [name=ms_check]').val(item.ms_check);
				$('[name=measure_detail] [name=ms_check_name]').val(item.ms_check_name);
				$('[name=measure_detail] [name=ms_stand2]').val(item.ms_stand2);
				$('[name=measure_detail] [name=ms_access]').val(item.ms_access);
				$('[name=measure_detail] [name=ms_years]').val(item.ms_years);
				$('[name=measure_detail] [name=ms_error]').val(item.ms_error);
				$('[name=measure_detail] [name=ms_account] option[value="'+item.ms_account+'"]').prop('selected', true);
				$('[name=measure_detail] [name=ms_acq]').val(number_format(item.ms_acq));
				$('[name=measure_detail] [name=ms_range]').val(item.ms_range);
				$('[name=measure_detail] [name=ms_division] option[value="'+item.ms_division+'"]').prop('selected', true);
				$('[name=measure_detail] [name=ms_cycle] option[value="'+item.ms_cycle+'"]').prop('selected', true);
				$('[name=measure_detail] [name=ms_etc]').val(item.ms_etc);
				$('[name=measure_detail] [name=ms_asset]').val(item.ms_asset);
				$('[name=measure_detail] [name=ms_project]').val(item.ms_project);
				
				
				$('[name=measure_detail] .img_view, [name=device_detail] .file_del').remove();
				if(data.result2.length > 0){
					for(var k=0; k<data.result2.length; k++) {
						//이미지업로드
						if(data.result2[k].f_repath && data.result2[k].f_resize) {
							var html3 = new Array();
							$('[name=measure_detail] #i_seq'+(k+1)).next().next().next().val(data.result2[k].f_seq);
							$('[name=measure_detail] #i_seq'+(k+1)).next().next().next().next().val(1);
							html3.push('<a class="img_view" href="'+resourcePath+ data.result2[k].f_path+data.result2[k].f_unique+'" target="_blank">');
							html3.push('<img src="'+resourcePath+ data.result2[k].f_repath+data.result2[k].f_resize+'" alt="'+resourcePath+ data.result2[k].f_repath+data.result2[k].f_original+'"></a>');
							html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

							$('[name=measure_detail] #i_seq'+(k+1)).parent().append( html3.join('') );
						}
					}
				} 
		
				for(var i=0; i<data.result3.length; i++){

					ele.push('<tr>');
					ele.push('	<td><div>'+data.result3[i].ms_seq+'</div></td>');
					ele.push('	<td><input type="number" name="msd_seq[]" value="'+data.result3[i].msd_seq+'" readonly></td>');
					ele.push('	<td><input type="text" name="msd_item[]" value="'+data.result3[i].msd_item+'"></td>');
					ele.push('	<td><input type="date" name="msd_date[]" value="'+length8(data.result3[i].msd_date, '-', 1)+'"></td>');
					ele.push('	<td><input type="text" name="msd_agency[]" value="'+data.result3[i].msd_agency+'"></td>');
					ele.push('	<td><input type="date" name="msd_next[]" value="'+length8(data.result3[i].msd_next, '-', 1)+'"></td>');
					ele.push('	<td>');
					ele.push('		<div>');
					ele.push('			<select name="msd_judge[]">');
					ele.push('				<option value="">선택</option>');
					ele.push('				<option value="1" '+(data.result3[i].msd_judge == 1 ? 'selected' : '')+' >합격</option>');
					ele.push('				<option value="2" '+(data.result3[i].msd_judge == 2 ? 'selected' : '')+' >불합격</option>');
					ele.push('			</select>');
					ele.push('		</div>');
					ele.push('	</td>')
					ele.push('	<td>');
					ele.push('		<div>');
					ele.push('			<select name="msd_action[]">');
					ele.push('				<option value="">선택</option>');
					ele.push('				<option value="1" '+(data.result3[i].msd_action == 1 ? 'selected' : '')+'>수리</option>');
					ele.push('				<option value="2" '+(data.result3[i].msd_action == 2 ? 'selected' : '')+'>재교정</option>');
					ele.push('				<option value="3" '+(data.result3[i].msd_action == 3 ? 'selected' : '')+'>폐기</option>');
					ele.push('			</select>');
					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('	<td><input type="text" name="msd_note[]" value="'+data.result3[i].msd_note+'"></td>');
					ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					ele.push('</tr>');
				}

				if(i == 0) ele.push('<tr class="empty"><td colspan="10">조회된 데이터가 없습니다.</td></tr>');
				$('[name=measure_detail] .tbl_list1 tbody').html(ele.join(''));

				for(var j=0; j<data.result4.length; j++){
					ele2.push('<tr>');
					ele2.push('	<td>'+data.result4[j].mss_seq+'</td>');
					ele2.push('	<td><input type="text" name="mss_change[]" value="'+data.result4[j].mss_change+'"></td>');
					ele2.push('	<td><input type="date" name="mss_date[]" value="'+length8(data.result4[j].mss_date, '-', 1)+'"></td>');
					ele2.push('	<td><input type="text" name="mss_over[]" value="'+data.result4[j].mss_over+'"></td>');
					ele2.push('	<td><input type="text" name="mss_take[]" value="'+data.result4[j].mss_take+'"></td>');
					ele2.push('	<td><input type="text" name="mss_reason[]" value="'+data.result4[j].mss_reason+'"></td>');
					ele2.push('	<td colspan="3"><input type="text" name="mss_sale[]" value="'+data.result4[j].mss_sale+'"></td>');
					ele2.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					ele2.push('</tr>');

				}
				
				if(j == 0) ele2.push('<tr class="empty"><td colspan="8">조회된 데이터가 없습니다.</td></tr>');
				$('[name=measure_detail] .tbl_list2 tbody').html(ele2.join(''));

				

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});
}

function add_list(target, type){
	target.find('tbody tr.empty').remove();
	var ele = new Array;
	if (type == 1){
		ele.push('<tr>');
		ele.push('	<td></td>');
		ele.push('	<td><input type="number" name="msd_seq[]" placeholder="" readonly=""></td>');
		ele.push('	<td><input type="text" name="msd_item[]" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="date" name="msd_date[]" placeholder="일자 선택"></td>');
		ele.push('	<td><input type="text" name="msd_agency[]" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="date" name="msd_next[]" placeholder="일자 선택"></td>');
		ele.push('	<td><select name="msd_judge[]"><option value="">선택</option><option value="1">합격</option><option value="2">불합격</option></select></td>');
		ele.push('	<td><select name="msd_action[]"><option value="">선택</option><option value="1">수리</option><option value="2">재교정</option><option value="3">폐기</option></select></td>');
		ele.push('	<td><input type="text" name="msd_note[]" placeholder="입력하세요."></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');

	} else {
		ele.push('<tr>');
		ele.push('	<td><input type="hidden" name="mss_seq[]" value=""></td>');
		ele.push('	<td><input type="text" name="mss_change[]" value="" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="date" name="mss_date[]" value="" placeholder="변경일"></td>');
		ele.push('	<td><input type="text" name="mss_over[]" value="" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="mss_take[]" value="" placeholder="입력하세요."></td>');
		ele.push('	<td><input type="text" name="mss_reason[]" value="" placeholder="입력하세요."></td>');
		ele.push('	<td colspan="3"><input type="text" name="mss_sale[]" value="" placeholder="입력하세요."></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');

	}

	target.find('tbody').append(ele.join(''));
}

function save(){

	pop_confirm('저장하시겠습니까?', function(){
		$('[name=measure_detail]').ajaxSubmit({
			url: contextPath + '/measure/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			traditional : true,
			resetForm : true,
			beforeSubmit: function(data) {
				data = commatoint(data);
			},
			success: function(data){
				if(data.code == 1) {
					pop_alert('저장 되었습니다.');
				} else if (data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}
			},
			error: function(data, status, err) {
				alert(data.responseText);
			},
			complete: function(){
				//이미지초기화
				$('.img_view, .file_del').remove();
				$('[name=measure_search]')[0].reset();
				list();
			}
		});

	
	});
}


function report(seq){

	$.ajax({
		url: contextPath + '/measure/report',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item	= data.result[0];
				var ele		= new Array();
				var ele2	= new Array();

				$('#instrument_report .ms_manage').text(item.ms_manage);
				$('#instrument_report .md_name').text(item.md_name);
				$('#instrument_report .ms_stand1').text(item.ms_stand1);
				$('#instrument_report .ms_model').text(item.ms_model);
				$('#instrument_report .act_company').text(item.act_company);
				$('#instrument_report .ms_create').text(item.ms_create);
				$('#instrument_report .seq').text(item.seq);
				$('#instrument_report .ms_access').text(item.ms_access);
				$('#instrument_report .ms_years').text(item.ms_years);
				$('#instrument_report .check_name').text(item.check_name);
				$('#instrument_report .ms_account').text(item.ms_account);
				$('#instrument_report .ms_buy').text(length8(item.ms_buy, '-',1));
				$('#instrument_report .ms_acq').text(number_format(item.ms_acq));
				$('#instrument_report .ms_etc').text(item.ms_etc);
				$('#instrument_report .ms_cycle').text(item.ms_cycle);
				$('#instrument_report .ms_error').text(item.ms_error);
				$('#instrument_report .ms_asset').text(item.ms_asset);
				$('#instrument_report .ms_range').text(item.ms_range);
				$('#instrument_report .ms_project').text(item.ms_project);
				$('#instrument_report .inner_img img').remove();

				if (data.result2.length > 0){
					$('#instrument_report .inner_img').append('<img src="'+resourcePath+ data.result2[0].f_path + data.result2[0].f_unique+'">');
				}


				for (var i=0; i < data.result3.length; i++){
					ele.push('<tr>');
					ele.push('	<td>'+length8(data.result3[i].msd_date, '-', 1)+'</td>');
					ele.push('	<td>'+data.result3[i].msd_agency+'</td>');
					ele.push('	<td>'+data.result3[i].msd_action+'</td>');
					ele.push('	<td>'+data.result3[i].msd_judge+'</td>');
					ele.push('	<td>'+data.result3[i].msd_note+'</td>');
					ele.push('</tr>');
				}

				$('#instrument_report .tlb_list1 tbody').html(ele.join(''));


				for (var j=0; j < data.result4.length; j++){
					ele2.push('<tr>');
					ele2.push('	<td>'+data.result4[j].mss_change+'</td>');
					ele2.push('	<td>'+length8(data.result4[j].mss_date, '-', 1)+'</td>');
					ele2.push('	<td>'+data.result4[j].mss_over+'</td>');
					ele2.push('	<td>'+data.result4[j].mss_take+'</td>');
					ele2.push('	<td>'+data.result4[j].mss_reason+'</td>');
					ele2.push('	<td>'+data.result4[j].mss_sale+'</td>');
					ele2.push('</tr>');
				}

				$('#instrument_report .tlb_list2 tbody').html(ele2.join(''));



				

			} else {
				
			}
			

		}
	});

}