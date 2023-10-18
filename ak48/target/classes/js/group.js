$(document).ready(function() {
	list();
});

$(document).on('click', '[name=org_search] .btn_search', function() {
	list();
});


$(document).on('click', '.btn_add', function() {
	$('#group_re .top p').text('하위조직등록');
	$('[name=org_detail] .btn_area .btn.del').hide();

	$('[name=org_detail] input').val('');
	$('[name=org_detail] select option').prop('selected', false);

	$('[name=org_detail] [name=og_code]').val($(this).closest('tr').find('[name=og_code]').val());
	$('[name=org_detail] [name=og_pcode]').val($(this).closest('tr').find('[name=og_pcode]').val());
});

$(document).on('click', '.org_list .btn_modify', function() {

	$('#group_re .top p').text('하위조직수정');
	$('[name=org_detail] .btn_area .btn.del').show();
	
	$('[name=org_detail] [name=og_code]').val($(this).closest('tr').find('[name=og_code]').val());
	$('[name=org_detail] [name=og_pcode]').val($(this).closest('tr').find('[name=og_pcode]').val());

	$.ajax({
		url: contextPath + '/org/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : $(this).closest('tr').attr('data-seq')},
		success: function(data) {

			if (data.code == 1){
				$('[name=org_detail] [name=seq]').val(data.result[0].seq);
				$('[name=org_detail] [name=og_name]').val(data.result[0].og_name);
				$('[name=org_detail] [name=og_date]').val(length8(data.result[0].og_date, '-', 1));
				$('[name=org_detail] select[name=og_status] option[value="'+data.result[0].og_status+'"]').prop('selected', true);
				if (data.result[0].og_group == 1){
					$('[name=org_detail] [name=og_group]').prop('checked', true);
				} else {
					$('[name=org_detail] [name=og_group]').prop('checked', false);
				}
				
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

});

//리스트 엑셀다운
$(document).on('click', '.group .list_xlsx ', function() {
	var page = $('[name=org_search] [name=page]').val();
	var row = $('[name=row] option:selected').val();

	console.log(contextPath +'/car/vehicle/list/excel?row='+row+'&page='+page);
	window.location.href = contextPath +'/org/list/excel?row='+row+'&page='+page;
});

//조직보기
$(document).on('click', '.org_list .btn_org', function() {
	var seq = $(this).closest('tr').attr('data-seq');
	$('[name=org_person_list] [name=seq]').val(seq);
	
	person_list('table');
});

$(document).on('change', '[name=org_person_list] [name=group]', function() {
	var active = $('[name=org_person_list] .search a.none').attr('data-active');

	person_list(active);
});

$(document).on('click', '[name=org_person_list] .search a', function() {
	var active = $(this).attr('data-active');
	$('[name=org_person_list] .search a').removeClass('none');
	$(this).addClass('none');
	
	person_list(active);
});

$(document).on('click', '#group_mb .paging a', function() {
	
	var page = $(this).attr('data-page');
	
	$('[name=org_person_list] [name=page]').val(page);
	var active = $('.search a.none').attr('data-active');

	person_list(active);
});

$(document).on('change', '[name=row]', function() {
	var active = $('.search a.none').attr('data-active');
	person_list(active);
});


//조직 등록
$(document).on('click', '[name=org_detail] .btn_save', function() {
	var og_group = '';
	if ($('[name=org_detail] [name=og_group]').is(':checked') == true){
		og_group = 1;
	} else {
		og_group = 2;
	}
		 
	var params	= $('[name=org_detail]').serializeArray();
		params[6] = {'name' : 'og_group', 'value' : og_group}
		
	$.ajax({
		url: contextPath + '/org/edit',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			if (data.code == 1){
				pop_alert('등록 되었습니다.');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('등록에 실패하였습니다.');
			}
		}, complete: function(){
			$('[name=org_search]')[0].reset();
		}
	});
	
});

//조직 등록
$(document).on('click', '[name=org_detail] .btn_remove', function() {
	var seq = $('[name=org_detail] [name=seq]').val();
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/org/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : seq},
			success: function(data) {
				if (data.code == 1){
					if (data.status_code == 1001){
						pop_alert('삭제 되었습니다.');
						list();
					} else {
						pop_alert('삭제에 실패하였습니다.<br/>관리자에 문의 하세요.<br/>code : ' +data.status_code);
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

function list(){
	loader();

	var params	= $('[name=org_search]').serializeArray();

	$.ajax({
		url: contextPath + '/org/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				
				for(var i=0; i < data.result.length; i++){
					var state = data.result[i].og_status;

					switch( data.result[i].og_status){
						case 1 : state = '활성'; break;
						case 2 : state = '비활성'; break;
					}
		
					ele.push('<tr data-seq="'+data.result[i].seq+'">');
					ele.push('	<td class="btn_modify" data-dialog="group_re">');
					ele.push('		<input type="hidden" name="og_code" value="'+data.result[i].og_code+'">');
					ele.push('		<input type="hidden" name="og_pcode" value="'+data.result[i].og_pcode+'">');
					ele.push('		'+data.result[i].og_level+'</td>');
					ele.push('	<td class="group_name">');
					ele.push('		<div>');
					ele.push('			<p dclass="btn_modify" ata-dialog="group_re" class="depth'+data.result[i].og_level+'">'+data.result[i].og_name+'</p>');
					if (data.result[i].og_level < 4){
						ele.push('			<a class="btn_add" data-dialog="group_re">');
						ele.push('				<input type="hidden" name="" value="">');
						ele.push('				<input type="hidden" name="" value="">');
						ele.push('				<input type="hidden" name="" value="">');
						ele.push('			<i class="ri-add-line"></i>하위조직추가</a>');
					}
					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('	<td class="member">');
					ele.push('		<div>');
					ele.push('			<p class="btn_modify" data-dialog="group_re">'+data.result[i].og_name+'</p>');
					ele.push('			<a class="btn_org" data-dialog="group_mb">전체보기</a>');
					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('	<td class="btn_modify" data-dialog="group_re">'+length8(data.result[i].og_date, '-', 1)+'</td>');
					ele.push('	<td class="btn_modify" data-dialog="group_re">'+state+'</td>');
					ele.push('</tr>');
				}
				
				if (i==0) ele.push('<tr><td colspan="5">검색된 데이터가 없습니다.</td></tr>')
				$('.org_list tbody').html(ele.join(''));
				
				
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

}

function person_list(active){
	item_position_list();
	item_job_list();

	var params	= $('[name=org_person_list]').serializeArray();
	params.push(
		{'name' : 'row', 'value' : $('#group_mb select[name=row] option:selected').val()},
		{'name' : 'section', 'value' : $('[name=org_person_list] [name=group]:checked').val()}
	);

	$.ajax({
		url: contextPath + '/org/person/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {

			if (data.code == 1){
				var ele = new Array();

				if (active == 'table'){
					for(var i=0; i < data.result.length; i++){
					
						ele.push('<tr>');
						ele.push('	<td>'+data.result[i].per_id+'</td>');
						ele.push('	<td>'+data.result[i].per_name+'</td>');
						if (data.result[i].pos_seq != ''){
							ele.push('	<td>'+position_name[ data.result[i].pos_seq ]+'</td>');
						} else {
							ele.push('	<td>'+data.result[i].pos_seq+'</td>');
						}

						if (data.result[i].j_seq != ''){
							ele.push('	<td>'+job_name[ data.result[i].j_seq ]+'</td>');
						} else {
							ele.push('	<td>'+data.result[i].j_seq+'</td>');
						}
						ele.push('</tr>');
					}

					$('#group_mb .photo').hide();
					$('#group_mb .group_mb_tb').show();

					if (i==0) ele.push('<tr><td colspan="4">검색된 데이터가 없습니다.</td></tr>');
					$('#group_mb .group_mb_tb tbody').html(ele.join(''));

				} else {
					for(var i=0; i < data.result.length; i++){
						ele.push('<li>');
						ele.push(' <input type="hidden" name="f_resize" value="'+data.result[i].f_resize+'">');
						ele.push('	<div class="img">');
						if (data.result[i].f_repath){
							ele.push('	<img src="'+resourcePath+ data.result[i].f_repath+data.result[i].f_resize+'">');
						}
						ele.push('	</div>');
						ele.push('	<div class="info">');
						if (data.result[i].j_seq != ''){
							ele.push('		<p>'+job_name[ data.result[i].j_seq ]+'</p>');
						} else {
							ele.push('		<p>'+data.result[i].j_seq+'</p>');
						}

						if (data.result[i].pos_seq != ''){
							ele.push('		<p>'+position_name[ data.result[i].pos_seq ]+'</p>');
						} else {
							ele.push('		<p>'+data.result[i].pos_seq+'</p>');
						}
						ele.push('		<p>'+data.result[i].per_name+'</p>');
						ele.push('	</div>');
						ele.push('</li>');
					}
					
					$('#group_mb .group_mb_tb').hide();
					$('#group_mb .photo').show();

					if (i==0) ele.push('<li>검색된 데이터가 없습니다.</tr>');
					$('#group_mb .photo ul').html(ele.join(''));
				}
				
				paging(data.total, data.row, $('[name=org_person_list] [name=page]').val());
				$('#group_mb .count_total').text(data.total);

				
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}
	});
}






