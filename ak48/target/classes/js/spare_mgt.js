$(document).ready(function() {
	item_system_list();
	item_budget_list();

	list();
});

$(document).on('click', '.btn_search', function() {
	list();
});

//리스트 정렬
$(document).on('click', '.part_list th[data-order]', function(){
	list();
});


//페이지 이동
$(document).on('click', '.spare .paging a', function() {
	$('[name=part_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});


$(document).on('click', '.dialog .close', function() {
	list();
});


//등록, 상세페이지 팝업
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
		
	$('[name=part_detail] .btn_area a').hide();

	if (type == 'new'){
		$('[name=part_detail] input').val('');
		$('[name=part_detail] select option').prop('selected', false);
		$('[name=part_detail] .btn_area .close').show();
		$('[name=part_detail] .detail_list tbody tr').remove();
		$('[name=part_detail] .input_file').removeClass('upload');
		$('[name=part_detail] .img_view, [name=part_detail] .file_del').remove();

		add_list();
	} else {
		var seq = $(this).attr('data-seq');

		$('[name=part_detail] [name=seq]').val(seq);
		$('[name=part_detail] .btn_area .btn_down, [name=part_detail] .btn_area .btn_remove').show();
		
		detail(seq);
		
	}
});

//상세 추가 부품 추가
$(document).on('click', '[name=part_detail] .add_btn', function() {
	add_list();

});

//상세 추가 부품 삭제
$(document).on('click', '[name=part_detail] .detail_list .del_btn', function() {
	$(this).closest('tr').remove();

});


//부품 삭제
$(document).on('click', '.spare_pop .btn_remove', function() {
	var seq = $('[name=part_detail] [name=seq]').val();

	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/part/delete',
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
					pop_alert('삭제 실패하였습니다.');
				
				}
			}
		});
	});
	
});

//엑셀다운
$(document).on('click', '[name=part_detail] .btn_down.xlsx ', function() {
	var seq = $('[name=part_detail] [name=seq]').val();
	window.location.href = contextPath +'/part/detail/excel?seq='+seq;
});


//저장하기
$(document).on('click', '.spare_pop .btn_save', function() {
	var chk = '';
	$('[name=part_detail] input').each(function(i){
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

	var params	= $('[name=part_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/part/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();

				for(var i=0; i < data.result.length; i++){
					var order = '';
					switch (data.result[i].pt_operate){
						case 1: order = '예'; break;
						case 2: order = '아니오'; break;
					}
			
					ele.push('<tr class="btn_add" data-seq="'+data.result[i].seq+'" data-dialog="emp_re" data-type="modify">');
					ele.push('	<td>'+data.result[i].pt_code+'</td>');
					ele.push('	<td>'+(data.result[i].bg_seq == '' ? data.result[i].bg_seq : budget_name[ data.result[i].bg_seq ])+'</td>');
					ele.push('	<td>'+(data.result[i].sys_seq == '' ? data.result[i].sys_seq : system_name[ data.result[i].sys_seq ])+'</td>');
					ele.push('	<td>'+data.result[i].ds_name+'</td>');
					ele.push('	<td>'+data.result[i].act_company+'</td>');
					ele.push('	<td>'+data.result[i].pt_name+'</td>');
					ele.push('	<td>'+data.result[i].pt_spec+'</td>');
					ele.push('	<td>'+data.result[i].act_company+'</td>');
					ele.push('	<td>'+order+'</td>');
					ele.push('</tr>');
				}

				if(i == 0) ele.push('<tr><td colspan="9">검색된 데이터가 없습니다.</td></tr>');

				$('.part_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, $('[name=row] option:selected').val(), $('[name=page]').val());
				
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
		url: contextPath + '/part/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item	= data.result[0];
				var list	= data.result2;
				var ele		= new Array();
				
				$('[name=part_detail] [name=sys_seq] option[value="'+item.sys_seq+'"]').prop('selected', true);
				$('[name=part_detail] [name=ds_seq]').val(item.ds_seq);
				$('[name=part_detail] [name=ds_seq_name]').val( item.ds_seq_name );

				$('[name=part_detail] [name=pt_operate] option[value="'+item.pt_operate+'"]').prop('selected', true);
				$('[name=part_detail] [name=pt_years]').val(item.pt_years);
				$('[name=part_detail] [name=act_device]').val(item.act_device);
				$('[name=part_detail] [name=act_device_text]').val(item.act_device);
				$('[name=part_detail] [name=pt_code').val(item.pt_code);
				$('[name=part_detail] [name=bg_seq] option[value="'+item.bg_seq+'"]').prop('selected', true);
				$('[name=part_detail] [name=pt_name]').val(item.pt_name);
				$('[name=part_detail] [name=pt_spec]').val(item.pt_spec);
				$('[name=part_detail] [name=act_unit]').val(item.act_unit);
				$('[name=part_detail] [name=act_unit_text]').val(item.act_unit);
				$('[name=part_detail] [name=pt_unit]').val(item.pt_unit);
				$('[name=part_detail] [name=pt_main]').val(item.pt_main);
				$('[name=part_detail] [name=pt_defect]').val(number_format(item.pt_defect));
				$('[name=part_detail] [name=pt_sn] option[value="'+item.pt_sn+'"]').prop('selected', true);
				$('[name=part_detail] [name=pt_part] option[value="'+item.pt_part+'"]').prop('selected', true);
				$('[name=part_detail] [name=pt_contract] option[value="'+item.pt_contract+'"]').prop('selected', true);
				$('[name=part_detail] [name=pt_test] option[value="'+item.pt_test+'"]').prop('selected', true);

				$('[name=part_detail][name=f_seq1]').val(item.f_seq1);
				$('[name=part_detail][name=f_seq2]').val(item.f_seq2);
				$('[name=part_detail][name=f_seq3]').val(item.f_seq3);
				$('[name=part_detail][name=f_seq4]').val(item.f_seq4);
				
				$('[name=part_detail] .input_file').removeClass('upload');
				$('[name=part_detail] .img_view, [name=part_detail] .file_del').remove();
				if(data.result3.length > 0){
					for(var i=0;i<data.result3.length;i++) {
						//이미지업로드
						if(data.result3[i].f_repath && data.result3[i].f_resize) {
							var html3 = new Array();
							$('[name=part_detail] #s_seq'+(i+1)).closest('.input_file').addClass('upload');
							$('[name=part_detail] #s_seq'+(i+1)).next().next().next().val(data.result3[i].f_seq);
							$('[name=part_detail] #s_seq'+(i+1)).next().next().next().next().val(1);
							html3.push('<a class="img_view" href="'+resourcePath+ data.result3[i].f_path+data.result3[i].f_original+' target="_blank">');
							html3.push('<img src="'+resourcePath+ data.result3[i].f_repath+data.result3[i].f_resize+'"/></a>');
							html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

							$('[name=part_detail] #s_seq'+(i+1)).parent().append( html3.join('') );
						}
					}
				} 

				for(var i=0; i < list.length; i ++){
					ele.push('<tr>');
					ele.push('	<td>');
					ele.push('		<input type="hidden" name="sp_seq[]" value="'+list[i].sp_seq+'">');
					ele.push('		<input type="text" name="sp_name[]" value="'+list[i].sp_name+'" placeholder="입력하세요.">');
					ele.push('	</td>');
					ele.push('	<td><input type="text" name="sp_value[]" value="'+number_format(list[i].sp_value)+'" placeholder="입력하세요." ></td>');
					ele.push('	<td><input type="text" name="sp_unit[]" value="'+number_format(list[i].sp_unit)+'" placeholder="입력하세요."></td>');
					ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					ele.push('</tr>');
				}
				if (i == 0) ele.push('<tr class="empty"><td colspan="4">조회된 데이터가 없습니다.</td></tr>');
				$('.detail_list tbody').html(ele.join(''));
				
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}
	});


}

function save(){
	
	pop_confirm('저장 하시겠습니까?', function(){
		$('[name=part_detail]').ajaxSubmit({
			url: contextPath + '/part/edit',
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
				$('[name=part_search]')[0].reset();
				list();
			}, error: function(data, status, err) {
				//이미지초기화
				$('.img_view, .file_del').remove();

			}
		});
	});
	

}

function add_list(){
	var ele = new Array();
	$('[name=part_detail] .detail_list tbody tr.empty').remove();

	ele.push('<tr>');
	ele.push('	<td>');
	ele.push('		<input type="hidden" name="sp_seq[]">');
	ele.push('		<input type="text" name="sp_name[]" placeholder="입력하세요.">');
	ele.push('	</td>');
	ele.push('	<td><input type="text" name="sp_value[]" class="input_number" placeholder="입력하세요."></td>');
	ele.push('	<td><input type="text" name="sp_unit[]" class="input_number" placeholder="입력하세요."></td>');
	ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
	ele.push('</tr>');

	$('[name=part_detail] .detail_list tbody').append(ele.join(''));
}