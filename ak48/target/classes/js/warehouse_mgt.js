$(document).ready(function() {
	org_list();
	list();
});
	

$(document).on('click', '.btn_search', function() {
	list();
});


//리스트 정렬
$(document).on('click', '.storage_list th[data-order]', function() {
	list();
});

//페이지 이동
$(document).on('click', '.warehouse .paging a', function() {
	$('[name=storage_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});

$(document).on('click', '.dialog .close', function() {
	list();
});


//등록 / 상세 팝업
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');

	$('[name=storage_detail] .wrap1 li.add').remove();
	$('[name=storage_detail] .btn_area a').hide();
	if (type == 'new'){
		$('#wahs_re .top p > span').text('창고등록') ;
		$('[name=storage_detail] input').val('') ;
		$('[name=storage_detail] .btn_area .close').show();

	} else {
		$('#wahs_re .top p > span').text('창고상세') ;
		$('[name=storage_detail] .btn_area .btn.xlsx, [name=storage_detail] .btn_area .btn_remove').show();
		detail($(this).closest('tr').attr('data-seq'));
	}
});

/*창고 관리부서 추가
$(document).on('click', '#team_sch .btn_area .btn', function() {
	var og_seq	= $('.storage_org [name=og_seq]').val();
	var og_name	= $('.storage_org [name=og_seq]').next('input').val();

	var ele = new Array();
	ele.push('<li class="add">');
	ele.push('	<div class="sch_inp">');
	ele.push('		<input type="hidden" name="sg_seq[]" value="0">');
	ele.push('		<input type="hidden" name="og_seq[]" value="'+og_seq+'">');
	ele.push('		<input type="text" name="og_name[]"value="" placeholder="'+og_name+'">');
	ele.push('		<a class="btn del_btn">-</a>');
	ele.push('	</div>');
	ele.push('</li>');
	
	$('[name=storage_detail] .wrap1').append(ele.join(''));

	$('.storage_org [name=og_seq]').val('');
	$('.storage_org [name=og_seq]').next('input').val('');

});
*/


//창고 관리 부서 삭제
$(document).on('click', '[name=storage_detail] .sch_inp .del_btn', function() {
	$(this).closest('li').remove();
});


//창고 삭제
$(document).on('click', '[name=storage_detail] .btn_remove', function() {
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/part/storage/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : $('[name=storage_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					$('.wahs_pop').removeClass('dialog_open');
					pop_alert('삭제 되었습니다.');
					list();

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
$(document).on('click', '[name=storage_detail] .btn.xlsx ', function() {
	var seq = $('[name=storage_detail] [name=seq]').val();
	window.location.href = contextPath +'/part/storage/detail/excel?seq='+seq;
});


//창고 저장
$(document).on('click', '[name=storage_detail] .btn_save', function() {
	var params	= $('[name=storage_detail]').serializeArray();
	var chk = '';
	$('[name=storage_detail] input, [name=storage_detail] select').each(function(i){
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
		$.ajax({
			url: contextPath + '/part/storage/edit',
			type: 'post',
			dataType: 'json',
			data: params,
			success: function(data) {
				if (data.code == 1){
					pop_alert('저장 되었습니다.');

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}
				
			}, complete: function() {
				$('[name=storage_search]')[0].reset();
				list();
			}
		});

	});

});


function list(){
	loader();
	var params	= $('[name=storage_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});
	
	/*
	var data	= new Array();
	for (var i=0; i < params.length; i++){
		var val = params[i].value;
		if (val != ''){
			data.push({'name': params[i].name, 'value': params[i].value});
		}
	}
	*/

	$.ajax({
		url: contextPath + '/part/storage/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();
			if (data.code == 1){
				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					var type = data.result[i].sr_type;

					switch (type){
						case 1: type = '창고'; break;
						case 2: type = '캐비닛'; break;
						case 3: type = '차량'; break;
					}

					ele.push('<tr class="btn_add" data-type="modify" data-dialog="wahs_re" data-seq="'+data.result[i].seq+'" >');
					ele.push('	<td>'+data.result[i].seq+'</td>');
					ele.push('	<td>'+data.result[i].sr_name+'</td>');
					ele.push('	<td>'+data.result[i].sr_division+'</td>');
					ele.push('	<td>'+type+'</td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="4">검색된 데이터가 없습니다.</td></tr>');

				$('.storage_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=storage_search] [name=page]').val());

				

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
		url: contextPath + '/part/storage/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result[0];
				var list = data.result2;
				
				$('[name=storage_detail] [name=seq]').val(item.seq);
				$('[name=storage_detail] [name=sr_name]').val(item.sr_name);
				
				$('[name=storage_detail] [name=sr_type] option[value="'+item.sr_type+'"]').prop('selected', true);
				$('[name=storage_detail] [name=per_team]').val(list.og_seq);
				$('[name=storage_detail] [name=per_team_name]').val(list.og_name);
				
				if (list){
					var ele = new Array();
					$('[name=storage_detail] .wrap1 li.add').remove();

					for (var i=0; i < list.length; i++){
						ele.push('<li class="add">');
						ele.push('	<div class="sch_inp">');
						ele.push('		<input type="hidden" name="sg_seq[]" value="'+list[i].sg_seq+'" >');
						ele.push('		<input type="hidden" name="og_seq[]" value="'+list[i].og_seq+'" >');
						ele.push('		<input type="text" name="og_name[]" value="'+list[i].og_name+'" >');
						ele.push('		<a class="btn del_btn">-</a>');
						ele.push('	</div>');
						ele.push('</li>');

					}
					
					$('.wrap1').append(ele.join(''));
				}
				
				

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}
	});
}


