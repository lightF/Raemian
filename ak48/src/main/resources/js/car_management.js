$(document).ready(function(){

	item_system_list();
	item_fuel_list();


	car_vehicle_list();

	// has_next_dep
	$('.has_next_dep>p').click(function () {
		$(this).parent().toggleClass('on');
	});
	
	$('[name="row"]').change(function(){
		car_vehicle_list();
	});
	$('[name="car_man_search"] .btn_area .btn').click(function(){
		car_vehicle_list();


	});
});

//페이지 이동
$(document).on('click', '.car_management .pagination a', function() {
	$('[name=car_man_search] [name=page]').val($(this).attr('data-page'));
	car_vehicle_list();

});

$(document).on('click', '[data-dialog="car_manag_view"]', function () {
	
	$('#car_manag_view .btn_area a').hide();
	if(!$(this).find('[name="seq"]').val()){
		$('#car_manag_view .top span').text('차량 등록');
		$('#car_manag_view input').val('');
		$('#car_manag_view select option').prop('selected', false);
		$('#car_manag_view .input_file').removeClass('upload');
		$('#car_manag_view .img_view, #car_manag_view .file_del').remove();
		$('#car_manag_view .table tbody tr:not(:first)').remove();
		$('#car_manag_view .close').show();
		

	} else {
		$('#car_manag_view .top span').text('차량 상세보기');
		$('#car_manag_view .xlsx, #car_manag_view .del').show();
		car_vehicle($(this).find('[name="seq"]').val());
	}
});


//수임자 팝업
$(document).on('click', '#car_manag_view [data-dialog="person_sch"]', function(){
	//작성자, 수임자 구분필요
	if( $(this).prev().attr('name') == 've_delegate') {//수임자
		$('#person_sch .top.comm > p > span').text('수임자 선택');
	} else {
		$('#person_sch .top.comm > p > span').text('작성자 선택');
	}
});
//정렬팝업, 최상위 div .cont의 개별 class 변경하여 사용바람
$(document).on('click', '.cont.car_management table thead th[data-order]', function(){
	car_vehicle_list();//리스트 재호출
});

//리스트 엑셀다운
$(document).on('click', '.car_management .list_xlsx ', function() {
	var page = $('[name=car_man_search] [name=page]').val();
	var row = $('[name=row] option:selected').val();
	
	console.log(contextPath +'/car/vehicle/list/excel?row='+row+'&page='+page);
	window.location.href = contextPath +'/car/vehicle/list/excel?row='+row+'&page='+page;
});

//팝업 엑셀다운
$(document).on('click', '[name=car_vehicle_detail] .btn.xlsx ', function() {
	var seq = $('[name=car_vehicle_detail] [name=seq]').val();
	window.location.href = contextPath +'/car/vehicle/detail/excel?seq='+seq;
});

//저장하시겠습니까? : 예
$(document).on('click', '[name=car_vehicle_detail] .btn_save', function(e){
	var chk = 0;

	$('#car_vehicle_detail input, #car_vehicle_detail select').each(function(){
		if($(this).prop('required') === true && $(this).val() == '') {
			chk++;
		}
	});

	if(chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}
	car_vehicle_detail();
});


//게시물삭제
$(document).on('click', '[name=car_vehicle_detail] .btn_remove', function(){
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/car/vehicle/delete',
			type: 'post',
			data: { seq: $('[name="car_vehicle_detail"] [name="seq"]').val() },
			dataType: 'json',
			success: function(data) {
				if(data.code == 1) {
					pop_alert('삭제 되었습니다.');
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제에 실패하였습니다.');
				}
			}, complete: function(){
				car_vehicle_list();
			}
		});
	
	});
	
});

function car_vehicle_detail(){
	$('#car_vehicle_detail').ajaxSubmit({
		url: contextPath + '/car/vehicle/edit',
		type: 'post',
		dataType: 'json',
		enctype : 'multipart/form-data',
		resetForm : true,
		success: function(data){
			if(data.code == 1) {
				pop_alert('저장되었습니다.');
				car_vehicle_list();
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('저장에 실패하였습니다.');
			}
		}, error: function(data, status, err) {
			pop_alert('데이터 로드에 실패하였습니다.');
		}, complete: function(){
			$('[name=car_man_search]')[0].reset();
		}
	});

}
//팝업
function car_vehicle( seq ){
	$.ajax({
		url: contextPath + '/car/vehicle/detail',
		type: 'post',
		data: { seq: seq },
		dataType: 'json',
		success: function(data) {
			if (data.code == 1){
				$('#car_manag_view [name="f_seq[]"]').val('');
				$('#car_manag_view [name="f_del[]"]').val('1');
				if(data.result.length > 0){
					$('#car_manag_view [name="car_vehicle_detail"] [name="seq"]').val( data.result[0].seq );
					$('#car_manag_view [name="car_vehicle_detail"] [name="og_seq"]').val(data.result[0].og_seq);
					$('#car_manag_view [name="car_vehicle_detail"] [name="og_name"]').val(data.result[0].og_name);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_number"]').val( data.result[0].ve_number );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_name"]').val( data.result[0].ve_name );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_model"] [value="'+ data.result[0].ve_model +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_year"]').val( data.result[0].ve_year );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_identify"]').val( data.result[0].ve_identify );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_check"]').val( data.result[0].ve_check );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_check_name"]').val( data.result[0].ve_check_name );
					$('#car_manag_view [name="car_vehicle_detail"] [name="check_date"]').val( length8(data.result[0].check_date, '-', 1) );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_delegate"]').val( data.result[0].ve_delegate );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_delegate_name"]').val( data.result[0].ve_delegate_name );
					$('#car_manag_view [name="car_vehicle_detail"] [name="delegate_date"]').val( length8(data.result[0].delegate_date, '-', 1) );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_expiry"]').val( length8(data.result[0].ve_expiry, '-', 1) );
					$('#car_manag_view [name="car_vehicle_detail"] [name="sys_seq"] [value="' + data.result[0].sys_seq +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_drive"]').val( number_format(data.result[0].ve_drive) );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_project"]').val( data.result[0].ve_project );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_fuel"] [value="'+ data.result[0].ve_fuel +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_buy"]').val( length8(data.result[0].ve_buy, '-', 1) );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_type"] [value="'+ data.result[0].ve_type +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_use"]').val( data.result[0].ve_use );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_free"]').val( data.result[0].ve_free );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_pass"]').val( data.result[0].ve_pass );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_urgent"]').val( data.result[0].ve_urgent );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_appoint"]').val( length8(data.result[0].ve_appoint, '-', 1) );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_lightbar"] [value="'+ data.result[0].ve_lightbar +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_police"]').val( data.result[0].ve_police );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_recorder"] [value="'+ data.result[0].ve_recorder +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="recorder_num"]').val( data.result[0].recorder_num );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_gps"] [value="'+ data.result[0].ve_gps +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="gps_num"]').val( data.result[0].gps_num );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_lift"] [value="'+ data.result[0].ve_lift +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_status"] [value="'+ data.result[0].ve_status +'"]').prop('selected', true);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_note"]').val( data.result[0].ve_note );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_creater"]').val( per_seq );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer1"]').val( data.result[0].ve_writer1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer1_name"]').val( data.result[0].ve_writer1_name );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer2"]').val( data.result[0].ve_writer2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer2_name"]').val( data.result[0].ve_writer2_name );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer3"]').val( data.result[0].ve_writer3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer3_name"]').val( data.result[0].ve_writer3_name );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer4"]').val( data.result[0].ve_writer4 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_writer4_name"]').val( data.result[0].ve_writer4_name);
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_seq1"]').val( data.result[0].f_seq1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_seq2"]').val( data.result[0].f_seq2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_seq3"]').val( data.result[0].f_seq3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_original1"]').val( data.result[0].f_original1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_original2"]').val( data.result[0].f_original2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_original3"]').val( data.result[0].f_original3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_unique1"]').val( data.result[0].f_unique1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_unique2"]').val( data.result[0].f_unique2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_unique3"]').val( data.result[0].f_unique3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_resize1"]').val( data.result[0].f_resize1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_resize2"]').val( data.result[0].f_resize2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_resize3"]').val( data.result[0].f_resize3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_code1"]').val( data.result[0].f_code1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_code2"]').val( data.result[0].f_code2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_code3"]').val( data.result[0].f_code3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_path1"]').val( data.result[0].f_path1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_path2"]').val( data.result[0].f_path2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_path3"]').val( data.result[0].f_path3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_repath1"]').val( data.result[0].f_repath1 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_repath2"]').val( data.result[0].f_repath2 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="f_repath3"]').val( data.result[0].f_repath3 );
					$('#car_manag_view [name="car_vehicle_detail"] [name="vl_seq"]').val( data.result[0].vl_seq );
					$('#car_manag_view [name="car_vehicle_detail"] [name="vl_divide"]').val( data.result[0].vl_divide );
					$('#car_manag_view [name="car_vehicle_detail"] [name="vl_update"]').val( data.result[0].vl_update );
					$('#car_manag_view [name="car_vehicle_detail"] [name="vl_change"]').val( data.result[0].vl_change );
					$('#car_manag_view [name="car_vehicle_detail"] [name="vl_basis"]').val( data.result[0].vl_basis );

					$('#car_manag_view .input_file').removeClass('upload');
					$('#car_manag_view .img_view, #car_manag_view .file_del').remove();

					if(data.result3.length > 0){
						for(var i=0;i<data.result3.length;i++) {
							//이미지업로드
							if(data.result3[i].f_repath && data.result3[i].f_resize) {
								var html3 = new Array();
								$('#car_manag_view #f_seq'+(i+1)).next().next().next().val(data.result3[i].f_seq);
								$('#car_manag_view #f_seq'+(i+1)).next().next().next().next().val(1);
								html3.push('<a class="img_view" href="'+resourcePath+ data.result3[i].f_path+data.result3[i].f_original+'" target="_blank">');
								html3.push('<img src="'+resourcePath+ data.result3[i].f_repath+data.result3[i].f_resize+'"/></a>');
								html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

								$('#car_manag_view #f_seq'+(i+1)).parent().append( html3.join('') );
							}
						}
					} 

					//차량 변경사항
					$('[name="car_vehicle_detail"] .tb table tbody').html( '' );
					var html = new Array();
					var i=0;
					for(i=0;i<data.result2.length;i++){
						html.push('<tr>');
						html.push('	<input type="hidden" name="vi_seq[]" value="'+data.result2[i].ve_seq+'">');
						html.push('	<td><div>'+(i+1)+'</div></td>');
						html.push('	<td>');
						html.push('		<div>');
						html.push('			<select name="vl_divide[]" readonly>');
						html.push('				<option value=""');
						if(data.result2[i].vl_divide == 0) html.push(' selected');
						html.push('>선택</option>');
						html.push('				<option value="1"');
						if(data.result2[i].vl_divide == 1) html.push(' selected');
						html.push('>이관</option>');
						html.push('				<option value="2"');
						if(data.result2[i].vl_divide == 2) html.push(' selected');
						html.push('>수임</option>');
						html.push('				<option value="3"');
						if(data.result2[i].vl_divide == 3) html.push(' selected');
						html.push('>불용</option>');
						html.push('			</select>');
						html.push('		</div>');
						html.push('	</td>');
						html.push('	<td><div><input type="date" name="vl_update[]" value="'+length8(data.result2[i].vl_update, '-', 1)+'" readonly></div></td>');
						html.push('	<td><div><input type="text" name="vl_change[]" value="'+data.result2[i].vl_change+'" readonly></div></td>');
						html.push('	<td>');
						html.push('		<input type="text" name="vl_basis[]"	value="'+data.result2[i].vl_basis+'" placeholder="입력하세요."/>');
						html.push('	</td>');
						html.push('</tr>');
					}
					if(i ==0) html.push('<tr><td colspan="5">조회된 데이터가 없습니다.</td></tr>');

					$('[name="car_vehicle_detail"] .tb table tbody').html( html.join('') );

				} else {
					//신규작성시 초기화
					$('#car_manag_view [name="car_vehicle_detail"] input').val('');
					$('#car_manag_view [name="car_vehicle_detail"] select option').prop('selected', false);
					$('#car_manag_view [name="car_vehicle_detail"] [name="ve_creater"]').val( per_seq );//작성자 예외
					$('#car_manag_view .input_file').removeClass('upload');
					$('#car_manag_view .img_view, #car_manag_view .file_del').remove();

					var ele = new Array();
					ele.push('<tr>');
					ele.push('	<input type="hidden" name="vi_seq[]">');
					ele.push('	<td><div>자동작성</div></td><td><div>자동작성</div></td><td><div>자동작성</div></td><td><div>자동작성</div></td>');
					ele.push('	<td><input type="text" name="vl_basis[]" value="" placeholder="입력하세요."/></td>');
					ele.push('</tr>');

					$('#car_manag_view [name="car_vehicle_detail"] tbody').html(ele.join(''));
				}
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

			
		}
	});
}

function car_vehicle_list(){
	loader();
	var html = new Array();
	var data = new Array();
	var data2 = $('[name="car_man_search"]').serializeArray();

	data2.push({ 'name' : 'row', 'value' : $('.car_management [name="row"] option:selected').val()});

	//빈값 제거
	for(var i=0;i<data2.length;i++) {
		if(data2[i].value != '') data.push(data2[i]);
	}
	$('.car_management .tb tbody').html('');
	$.ajax({
		url: contextPath + '/car/vehicle/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			close_loader();

			if (data.code == 1){
				for(var i=0;i<data.result.length;i++){
					html.push('<tr data-dialog="car_manag_view"><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					html.push('	<td>'+data.result[i].group_name+'</td>');
					html.push('	<td>'+data.result[i].check_name+'</td>');
					html.push('	<td>'+String(data.result[i].ve_model).replace('1', '승용').replace('2', '승합').replace('3', '화물').replace('4', '기타')+'</td>');
					html.push('	<td>'+data.result[i].ve_name+'</td>');
					html.push('	<td>'+data.result[i].ve_number+'</td>');
					html.push('	<td>'+length8(data.result[i].update_date, '-', 2)+'</td>');
					html.push('	<td>'+data.result[i].ve_year+'</td>');
					html.push('	<td>'+String(data.result[i].ve_type).replace('1', '법인').replace('2', '임차').replace('3', '동원')+'</td>');
					html.push('	<td>'+String(data.result[i].ve_yn).replace('1', '유').replace('2', '무')+'</td>');
					html.push('</tr>');
				}
				if( i == 0) html.push('<tr><td colspan="9">조회된 데이터가 없습니다.</td></tr>');
				paging(data.total, 20, $('[name="page"]').val() );
				$('.car_management .count span').text( number_format(data.total) );
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}, complete: function(){
			$('.car_management .tb tbody').html( html.join('') );
		}
	});

}

