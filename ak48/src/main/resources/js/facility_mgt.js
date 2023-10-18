$(document).ready(function() {

	facility_standard1_list();
	facility_standard2_list();

	list();
	
});

$(document).on('click', '.btn_search', function() {
	list();
});

$(document).on('click', '.facility_list th[data-order]', function() {
	list();
});


$(document).on('click', '.facility .paging a', function() {
	$('[name=device_search] [name=page]').val($(this).attr('data-page'));
	list();

});


$(document).on('change', '[name=row]', function() {
	list();
});

$(document).on('click', '.dialog .close', function() {
	list();
});

//기기 등록 / 상세 팝업
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
	
	$('[name=device_detail] .btn_area a').hide();

	if (type == 'new'){
		$('[name=device_detail] input').val('');
		$('[name=device_detail] select').prop('selected', false);
		$('[name=device_detail] .btn_area .close').show();
		$('[name=device_detail] tbody tr').remove();
		$('[name=device_detail] .img .img_view, [name=device_detail] .img .file_del').remove();

		add_list();
		
	} else {

		$('[name=device_detail] .btn_area .btn_down, [name=device_detail] .btn_area .btn_remove').show();
		
		detail($(this).attr('data-seq'));
	}
});


//이전 및 철거기록 추가
$(document).on('click', '[name=device_detail] .add_btn', function() {
	add_list();

});

//이전 및 철거기록 삭제
$(document).on('click', '[name=device_detail] .del_btn', function() {
	$(this).closest('tr').remove();

});

//기기 삭제
$(document).on('click', '[name=device_detail] .btn_remove', function() {
	var seq = $('[name=device_detail] [name=seq]').val();

	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/facility/device/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : seq},
			success: function(data) {
				if (data.code == 1){
					if (data.status_code == 1001){
						pop_alert('삭제 되었습니다.');
						list();
					} else {
						pop_alert('사용중인 항목으로 삭제가 불가능 합니다.');
					}
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
$(document).on('click', '[name=device_detail] .btn_down.xlsx ', function() {
	var seq = $('[name=device_detail] [name=seq]').val();
	window.location.href = contextPath +'/facility/device/detail/excel?seq='+seq;
});


//기기 저장
$(document).on('click', '[name=device_detail] .btn_save', function() {

	var chk = '';
	$('[name=device_detail] input, [name=device_detail] select').each(function(i){
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


function list() {
	loader();
	
	var params	= $('[name=device_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/facility/device/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			$('.facility_list tbody').html('');

			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr class="btn_add" data-dialog="facility_view" data-seq='+data.result[i].seq+' data-type="modify">');
					ele.push('	<td>'+ data.result[i].dc_position +'</td>');
					ele.push('	<td>'+ data.result[i].seq +'</td>');
					//ele.push('	<td>'+ data.result[i].dc_location +'</td>');
					ele.push('	<td>'+ data.result[i].dc_name +'</td>');
					ele.push('	<td>'+ data.result[i].ds_name +'</td>');
					ele.push('	<td>'+ data.result[i].dc_team +'</td>');
					ele.push('	<td>'+ length8(data.result[i].dc_current, '-', 2) +'</td>');
					ele.push('</tr>');
				}

				$('.count_total').text(number_format(data.total));
					
				if(i == 0) ele.push('<tr><td colspan="6">검색된 데이터가 없습니다.</td></tr>');
				
				$('.facility_list tbody').html(ele.join(''));

				paging(data.total, data.row, $('[name=device_search] [name=page]').val());

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


//상세 리스트
function detail(seq) {
	
	$.ajax({
		url: contextPath + '/facility/device/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result;
				
				$('[name=device_detail] [name=dc_name]').val(item[0].dc_name);
				$('[name=device_detail] [name=ds_seq1]').val(item[0].ds_seq1);
				$('[name=device_detail] [name=ds_seq2]').val(item[0].ds_seq2);

				if (item[0].ds_seq1 != '') {
					$('[name=device_detail] [name=ds_seq1_text]').val(standard1_name[ item[0].ds_seq1 ]);
				} else {
					$('[name=device_detail] [name=ds_seq1_text]').val('');
				}
				if (item[0].ds_seq2 != '') {
					$('[name=device_detail] [name=ds_seq2_text]').val(standard2_name[ item[0].ds_seq2 ]);
				} else {
					$('[name=device_detail] [name=ds_seq2_text]').val('');
				}

				$('[name=device_detail] [name=dc_device]').val(item[0].dc_device);
				$('[name=device_detail] [name=dc_position]').val(item[0].dc_position);
				$('[name=device_detail] [name=dc_install]').val(item[0].dc_install);
				$('[name=device_detail] [name=dc_install_name]').val(item[0].dc_install_name);

				$('[name=device_detail] [name=dc_location]').val(item[0].dc_location);
				
				$('[name=device_detail] [name=dc_produce]').val(item[0].dc_produce);
				$('[name=device_detail] [name=dc_produce_name]').val(item[0].dc_produce_name);

				$('[name=device_detail] [name=dc_first]').val(date2(item[0].dc_first));

				$('[name=device_detail] [name=dc_supply]').val(item[0].dc_supply);
				$('[name=device_detail] [name=dc_supply_name]').val(item[0].dc_supply_name);
				$('[name=device_detail] [name=dc_number]').val(date2(item[0].dc_number));
				$('[name=device_detail] [name=dc_create]').val(date2(item[0].dc_create));

				$('[name=device_detail] [name=dc_control]').val(item[0].dc_control);
				$('[name=device_detail] [name=dc_take]').val(date2(item[0].dc_take));
				$('[name=device_detail] [name=dc_years]').val(item[0].dc_years);

				$('[name=device_detail] [name=dc_defect]').val(item[0].dc_defect);
				$('[name=device_detail] [name=dc_expiry]').val(date2(item[0].dc_expiry));
				$('[name=device_detail] [name=dc_model]').val(item[0].dc_model);

				$('[name=device_detail] [name=dc_data]').val(item[0].dc_data);
				$('[name=device_detail] [name=dc_volt]').val(item[0].dc_volt);
				$('[name=device_detail] [name=dc_price]').val(item[0].dc_price);

				$('[name=device_detail] [name=dc_team]').val(item[0].dc_team);
				$('[name=device_detail] [name=dc_team_name]').val(item[0].dc_name);


				$('[name=device_detail] [name=dc_current]').val(date2(item[0].dc_current));
				$('[name=device_detail] [name=dc_norm]').val(item[0].dc_norm);
			
				$('[name=device_detail] select[name=dc_remove] option[value="'+item[0].dc_remove+'"]').prop('selected', true);
				$('[name=device_detail] [name=dc_note]').val(item[0].dc_note);
				
				$('[name=device_detail] .img_view, [name=device_detail] .file_del').remove();
				if(data.result3.length > 0){
					//이미지업로드
					if(data.result3[0].f_repath && data.result3[0].f_resize) {
						var html3 = new Array();
						$('[name=device_detail] #fa_file').next().next().next().val(data.result3[0].f_seq);
						$('[name=device_detail] #fa_file').next().next().next().next().val(1);
						html3.push('<a class="img_view" href="'+resourcePath+ data.result3[0].f_path+data.result3[0].f_unique+'" target="_blank">');
						html3.push('<img src="'+resourcePath+ data.result3[0].f_repath+data.result3[0].f_resize+'" alt="'+resourcePath+ data.result3[0].f_path+data.result3[0].f_original+'"></a>');
						html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');
						$('[name=device_detail] #fa_file').parent().append( html3.join('') );
					}

				} 

				var list = data.result2;
				var ple = new Array();
				for (var i=0; i < list.length; i++){
					ple.push('<tr>');
					ple.push('	<td>');
					ple.push('		<input type="hidden" name="dh_seq[]" value="'+ list[i].dh_seq +'">');
					ple.push('		<input type="hidden" name="dc_seq[]" value="'+ list[i].dc_seq +'">');
					ple.push('		<input type="text" name="dh_date[]" value="'+ length8(list[i].dh_date, '-', 2) +'" placeholder="이전일">');
					ple.push('	</td>');
					ple.push('	<td><input type="text" name="dh_location[]" value="'+ list[i].dh_location +'" placeholder="이전위치"></td>');
					ple.push('	<td><input type="text" name="dh_install[]" value="'+ list[i].dh_install +'" placeholder="설치위치"></td>');


					ple.push('	<td>');
					ple.push('		<select name="dh_division[]">');
					if (list[i].dh_division == 1){
						ple.push('			<option value="1" selected>신규</option>');
						ple.push('			<option value="2">철거</option>');
						ple.push('			<option value="3">이동</option>');
					} else if(list[i].dh_division == 2) {
						ple.push('			<option value="1">신규</option>')
						ple.push('			<option value="2" selected> 철거</option>');
						ple.push('			<option value="3">이동</option>');
					} else {
						ple.push('			<option value="1">신규</option>')
						ple.push('			<option value="2"> 철거</option>');
						ple.push('			<option value="3" selected>이동</option>');
					}
					ple.push('	</td>');
					ple.push('	<td>');
					ple.push('		<select name="dh_approve[]">');
					if (list[i].dh_approve == 1){
						ple.push('			<option value="1" selected>미승인</option>');
						ple.push('			<option value="2">승인</option>');
					} else {
						ple.push('			<option value="1">미승인</option>')
						ple.push('			<option value="2" selected> 승인</option>');
					}
					ple.push('		</select>');
					ple.push('	</td>');
					ple.push('	<td><input type="text" name="dh_man[]" value="'+ list[i].dh_man +'" placeholder="설치자"></td>');
					ple.push('	<td><input type="text" name="dh_team[]" value="'+ list[i].dh_team +'" placeholder="설치부서"></td>');
					ple.push('	<td><input type="text" name="dh_state[]" value="'+ list[i].dh_state +'" placeholder="진행상황"></td>');
					ple.push('	<td><input type="text" name="dh_case[]" value="'+ list[i].dh_case +'" placeholder="설치건명"></td>');
					ple.push('	<td class="tb_btn">');
					ple.push('		<a class="btn del_btn">-</a>');
					ple.push('	</td>');
					ple.push('</tr>');
		
				}

				if(i == 0) ple.push('<tr class="empty"><td colspan="9">조회된 데이터가 없습니다.</td></tr>');
				$('.pop_facility tbody').html(ple.join(''));

				
				$('[name=device_detail] [name=seq]').val(seq);
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
		}, complete: function() {
			
		}
	});
	

}

function save(){

	pop_confirm('저장 하시겠습니까?', function(){
		$('[name=device_detail]').ajaxSubmit({
			url: contextPath + '/facility/device/edit',
			type: 'post',
			dataType: 'json',
			enctype: 'multipart/form-data',
			resetForm : true,
			beforeSubmit: function(data) {
				data = commatoint(data);
			},
			success: function(data) {
				if (data.code == 1) {
					pop_alert('저장 되었습니다.');
					//$('[name=device_search]')[0].reset();
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}

			},error: function(data, status, err) {
				//이미지초기화
				$('.img_view, .file_del').remove();

			}, complete: function () {
				list();
			}
		});
	
	});
	
	

}

function add_list(){
	var ele = new Array();

	$('[name=device_detail] tbody tr.empty').remove();

	ele.push('<tr>');
	ele.push('	<td>');
	ele.push('		<input type="hidden" name="dh_seq[]" value="">');
	ele.push('		<input type="hidden" name="dc_seq[]" value="">');
	ele.push('		<input type="text" name="dh_date[]" placeholder="이전일" value="">');
	ele.push('	</td>');
	ele.push('	<td><input type="text" name="dh_location[]" placeholder="이전위치" value=""></td>');
	ele.push('	<td><input type="text" name="dh_install[]" placeholder="설치위치" value=""></td>');
	ele.push('	<td>');
	ele.push('		<select name="dh_division[]">');
	ele.push('			<option value="">선택</option>');
	ele.push('			<option value="1">신규</option>');
	ele.push('			<option value="2">철거</option>');
	ele.push('			<option value="3">이동</option>');
	ele.push('		</select>');
	ele.push('	</td>');
	ele.push('	<td>');
	ele.push('		<select name="dh_approve[]">');
	ele.push('			<option value="1">미승인</option>');
	ele.push('			<option value="2">승인</option>');
	ele.push('		</select>');
	ele.push('	</td>');
	ele.push('	<td><input type="text" name="dh_man[]" placeholder="설치자" value="'+per_name+'"></td>');
	ele.push('	<td><input type="text" name="dh_team[]" placeholder="설치부서" value=""></td>');
	ele.push('	<td><input type="text" name="dh_state[]" placeholder="진행상황" value=""></td>');
	ele.push('	<td><input type="text" name="dh_case[]" placeholder="설치건명" value=""></td>');
	ele.push('	<td class="tb_btn">');
	ele.push('		<a class="btn del_btn">-</a>');
	ele.push('	</td>');
	ele.push('</tr>');

	$('[name=device_detail] tbody').append(ele.join(''));
}