$(document).ready(function() {
	org_list();
	item_system_list();
	item_process_list();
	item_safe_list();
	list();
	
});


$(document).on('click', '.btn_search', function() {
	list();
});


//리스트 정렬
$(document).on('click', '.safety_list th[data-order]', function() {
	list();
});


//페이지 이동
$(document).on('click', '.safe_management .paging a', function() {
	$('[name=safety_search] [name=page]').val($(this).attr('data-page'));
	list();
});

//등록 / 상세팝업 열기
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
	
	$('[name=measure_safety_detail] .btn_area a').hide();
	if (type=='new'){
		$('.detail_tit').text('안전용품 등록');
		$('[name=measure_safety_detail] input').val('');
		$('[name=measure_safety_detail] select option').prop('selected', false);
		$('[name=measure_safety_detail] .btn_area .close').show();
		$('[name=measure_safety_detail] tbody tr').remove();
		add_list();

	} else {
		$('.detail_tit').text('안전용품 상세정보');
		$('[name=measure_safety_detail] .btn_area .btn_remove, [name=measure_safety_detail] .btn_area .xlsx').show();
		detail($(this).closest('tr').find('[name=seq]').val());
	}
	
});

//안전용품 상세 추가
$(document).on('click', '.safety_detail_list .add_btn', function(){
	add_list();
});

//안전용품 상세 추가
$(document).on('click', '.safety_detail_list .del_btn', function(){

	if ($(this).closest('tbody').find('tr').length <= 1){
		pop_alert('첫 행은 삭제 불가능 합니다.');
	} else {
		$(this).closest('tr').remove();
	}

});

//리스트 엑셀다운
$(document).on('click', '.safe_management .list_xlsx', function() {
	window.location.href = contextPath +'/measure/safety/list/excel';
});

//팝업 엑셀다운
$(document).on('click', '[name=measure_safety_detail] .btn.xlsx ', function() {
	var seq = $('[name=measure_safety_detail] [name=seq]').val();
	window.location.href = contextPath +'/measure/safety/detail/excel?seq='+seq;
});


//안전용품 저장
$(document).on('click', '[name=measure_safety_detail] .btn_save', function(){
	var chk = '';
	
	$('[name=measure_safety_detail] input, [name=measure_safety_detail] select').each(function(i){
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
		var params = $('[name=measure_safety_detail]').serializeArray();
		$.ajax({
			url: contextPath + '/measure/safety/edit',
			type: 'post',
			dataType: 'json',
			data: params,
			success: function(data) {
				if (data.code == 1){
					pop_alert('저장 하였습니다.');

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}
				
			},complete: function(){
				$('[name=safety_search]')[0].reset();
				list();
			}
		});
	
	});
	
});

//안전용품 삭제
$(document).on('click', '[name=measure_safety_detail] .btn_remove', function(){
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/measure/safety/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : $('[name=measure_safety_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 하였습니다.');
					list();

				} else if(data.code == 3) {
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
	
	var params	= $('[name=safety_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/measure/safety/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr class="btn_add" data-type="modify" data-dialog="safe_manag_view">');
					ele.push('	<input type="hidden" name="seq" value="'+ data.result[i].seq+'">');
					ele.push('	<td>'+ data.result[i].group_name+'</td>');
					ele.push('	<td>'+ data.result[i].check_name+'</td>');

					if (data.result[i].sys_seq == '') {
						ele.push('	<td></td>');
					} else {
						ele.push('	<td>'+ system_name[ data.result[i].sys_seq ]+'</td>');
					}


					if (data.result[i].sd_product == 0){
						ele.push('	<td></td>');
					} else {
						ele.push('	<td>'+ safe_name[ data.result[i].sd_product ]+'</td>');
					}
					ele.push('	<td>'+ data.result[i].sf_amount+'</td>');
					ele.push('	<td>'+ length8(data.result[i].sf_date, '-', 1)+'</td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="6">검색된 데이터가 없습니다.</td></tr>');

				$('.safety_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=safety_search] [name=page]').val());

			} else if(data.code == 3) {
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


function detail(seq){
	$.ajax({
		url: contextPath + '/measure/safety/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result[0];
				var list = data.result2;
				
				$('[name=measure_safety_detail] [name=seq]').val(item.seq);
				$('[name=measure_safety_detail] [name=sf_group]').val(item.sf_group);
				$('[name=measure_safety_detail] [name=sf_group_name]').val(item.sf_group_name);
				$('[name=measure_safety_detail] [name=sf_check]').val(item.sf_check);
				$('[name=measure_safety_detail] [name=sf_check_name]').val(item.sf_check_name);
				$('[name=measure_safety_detail] [name=sd_product]').val(item.sd_product);
				$('[name=measure_safety_detail] [name=sys_seq]').val(item.sys_seq);
				$('[name=measure_safety_detail] [name=sf_amount]').val(number_format(item.sf_amount));
				$('[name=measure_safety_detail] [name=sf_update]').val(item.sf_update);
				

				var ele = new Array();
				for(var i=0; i < list.length; i++){
					ele.push('<tr>');
					ele.push('	<td><input type="hidden" name="sd_seq[]" value="'+list[i].sd_seq+'" ><div>'+(i+1)+'</div></td>');
					ele.push('	<td><input type="date" name="sd_date[]" value="'+date2(list[i].sd_date)+'"></td>');
					ele.push('	<td><div class="sch_inp">');
					ele.push('		<input type="hidden" name="sd_seq1[]" value="'+list[i].sd_seq1+'">');
					ele.push('		<input type="text" name="sd_input[]" value="'+list[i].sd_input+'" readonly placeholder="부서검색">');
					ele.push('		<a class="btn" data-dialog="team_sch" data-num="sdi_'+i+'"><i class="ri-search-line"></i></a>');
					ele.push('	</div></td>');
					ele.push('	<td><input type="text" name="input_ea[]" value="'+number_format(list[i].input_ea)+'"></td>');
					ele.push('	<td><div class="sch_inp">');
					ele.push('		<input type="hidden" name="sd_seq2[]" value="'+list[i].sd_seq2+'">');
					ele.push('		<input type="text" name="sd_output[]" value="'+list[i].sd_output+'" readonly placeholder="부서검색">');
					ele.push('		<a class="btn" data-dialog="team_sch" data-num="sdo_'+i+'"><i class="ri-search-line"></i></a>');
					ele.push('	</div></td>');
					ele.push('	<td><input type="text" name="output_ea[]" value="'+number_format(list[i].output_ea)+'"></td>');
					ele.push('	<td><input type="text" name="sd_note[]" value="'+list[i].sd_note+'"></td>');
					ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					ele.push('</tr>');
				}
				if (i == 0) ele.push('<tr class="empty"><td colspan="8">조회된 데이터가 없습니다.</td></tr>');
				$('.safety_detail_list tbody').html(ele.join(''));

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			
		}
	});
}



function add_list(){
	$('.safety_detail_list tbody tr.empty').remove();

	var num = $('.safety_detail_list tbody tr').length;
	var ele = new Array();

	ele.push('<tr>');
	ele.push('	<td><input type="hidden" name="sd_seq[]" ></td>');
	ele.push('	<td><input type="date" name="sd_date[]" placeholder="일자 선택"></td>');
	ele.push('	<td><div class="sch_inp">');
	ele.push('		<input type="hidden" name="sd_seq1[]" >');
	ele.push('		<input type="text" name="sd_input[]" readonly placeholder="부서검색">');
	ele.push('		<a class="btn" data-dialog="team_sch" data-num="sdi_'+num+'"><i class="ri-search-line"></i></a>');
	ele.push('	</div></td>');
	ele.push('	<td><input type="text" name="input_ea[]" class="input_number" placeholder="입력하세요."></td>');
	ele.push('	<td><div class="sch_inp">');
	ele.push('		<input type="hidden" name="sd_seq2[]" >');
	ele.push('		<input type="text" name="sd_output[]" readonly placeholder="부서검색">');
	ele.push('		<a class="btn" data-dialog="team_sch" data-num="sdo_'+num+'"><i class="ri-search-line"></i></a>');
	ele.push('	</div></td>');
	ele.push('	<td><input type="text" name="output_ea[]" class="input_number" placeholder="입력하세요."></td>');
	ele.push('	<td><input type="text" name="sd_note[]" placeholder="입력하세요."></td>');
	ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
	ele.push('</tr>');

	$('.safety_detail_list tbody').append(ele.join(''));
}