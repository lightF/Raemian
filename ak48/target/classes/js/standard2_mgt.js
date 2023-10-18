$(document).ready(function() {
	list();	
});

$(document).on('click', '.btn_search', function() {
	if($('[name="ds_name"]').val()) {
		$('.tbl_standard2 tbody tr').css('display', 'none');
		$('.tbl_standard2 tbody tr:contains("'+$('[name="ds_name"]').val()+'")').css('display', '');
	} else {
		$('.tbl_standard2 tbody tr').css('display', '');
	}
});


//추가
$(document).on('click', '.btn_add', function() {
	var state	= $(this).attr('data-state');
	var seq		= '';
	var pcode	= '';

	if (state != 'new'){	
		seq		= $(this).closest('tr').attr('data-seq');
		pcode	= $(this).closest('tr').attr('data-dscode');
	}

	$('#tree_write2 [name=state]').val(state);
	$('#tree_write2 [name=seq]').val(seq);
	$('#tree_write2 [name=ds_name]').val('');
	$('#tree_write2 [name=ds_pcode]').val(pcode);

	$('#tree_write2 .btn_close').removeClass('btn_remove');
	$('#tree_write2 .btn_close span').text('취소');

	$('#tree_write2').addClass('dialog_open');

});


//상세보기
$(document).on('click', '.btn_modify', function() {
	var seq		= $(this).closest('tr').attr('data-seq');

	$('#tree_write2 [name=state]').val('modify');
	$('#tree_write2 .btn_close').addClass('btn_remove');
	$('#tree_write2 .btn_close span').text('삭제');

	$.ajax({
		url: contextPath + '/facility/standard2/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result[0];

				$('#tree_write2 [name=seq]').val(item.seq);
				$('#tree_write2 [name=ds_name]').val(item.ds_name);
				$('#tree_write2 [name=ds_pcode]').val(item.ds_pcode);
				$('#tree_write2').addClass('dialog_open');

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert(data.msg);
			}
		}
	});
});

$(document).on('change', '#tree_write [name=ds_khc], #tree_write [name=ds_cne]', function() {
	var chk = $(this).is(':checked');
		chk == true ? $(this).val(1) : $(this).val(2);
});

//저장
$(document).on('click', '#tree_write2 .btn_save', function() {
	var state	= $('#tree_write2 [name=state]').val();
	var seq		= $('#tree_write2 [name=seq]').val();
	var name	= $('#tree_write2 [name=ds_name]').val();
	var pcode	= $('#tree_write2 [name=ds_pcode]').val();

	var data = '';

	if (name == ''){
		pop_alert('표준명을 입력해 주세요.');
		return false;
	}
	
	if (state == 'new'){//신규 등록
		data = {'ds_name' : name};
		
	} else if (state == 'add') {//하위 요소 추가
		data = {
			'ds_name' : name,
			'ds_pcode' : pcode,
		};
	} else if (state == 'modify'){ //수정
		data = {
			'seq' : seq,
			'ds_name' : name,
		};
	}

	$.ajax({
		url: contextPath + '/facility/standard2/edit',
		type: 'post',
		dataType: 'json',
		data: data,
		success: function(data) {
			if (data.code == 1){
				pop_alert('저장 되었습니다.');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('저장에 실패하였습니다.');
			}
		}, complete: function() {
			$('.standard .search form')[0].reset();
			list();
		}
	});

});


//삭제
$(document).on('click', '#tree_write2 .btn_remove', function() {
	
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/facility/standard2/delete',
			type: 'post',
			dataType: 'json',
			data: {	seq : $('#tree_write2 [name=seq]').val()},
			success: function(data) {
				if (data.code == 1 && data.status_code == 1001){
					pop_alert('삭제 되었습니다.');
					list();

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제에 실패하였습니다.<br/><br/>status_code='+data.status_code);
				}
				
			}
		});
	});
	
});


function list() {
	loader();

	$.ajax({
		url: contextPath + '/facility/standard2/list',
		type: 'post',
		dataType: 'json',
		data: {
			ds_level : $('select[name=level] option:selected').val(),
			ds_name : $('[name=name]').val()
        },
		success: function(data) {
			close_loader();

			$('.tbl_standard2 tbody').html('');
			
			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr data-seq='+data.result[i].seq+' data-dscode='+data.result[i].ds_code+' data-dspcode="'+data.result[i].ds_pcode+'">');
					ele.push('	<td>'+ data.result[i].ds_level +'</td>');
					ele.push('	<td class="group_name">');
					ele.push('		<div>');
					ele.push('			<p class="depth'+data.result[i].ds_level+'"><a class="btn_modify">'+data.result[i].ds_name+'</p></a>');

					if (data.result[i].ds_level < 6){ //등급 6이 아닐때만 하위 조직 추가 가능
						ele.push('			<a class="btn_add" data-state="add"><i class="ri-add-line"></i>하위조직추가</a>');
					}

					ele.push('		</div>');
					ele.push('	</td>');
					ele.push('</tr>');
				}
					
				if(i == 0) ele.push('<tr><td colspan="2">검색된 데이터가 없습니다.</td></tr>');
				$('.tbl_standard2 tbody').html(ele.join(''));

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
			

		}, complete: function() {
			//부모코드 찾아서 붙이기
			$('.tbl_standard2 tbody tr').each(function(){
				var de_id = $(this).data('dscode');
				var pr_id = $(this).data('dspcode');
				if( de_id == pr_id) {
					$('.tbl_standard2 tbody').append($(this).clone().wrapAll('<tr/>').parent().html() );
					$(this).remove();
				} else {
					$('.tbl_standard2 tbody tr[data-dscode="'+pr_id+'"]').after($(this).clone().wrapAll('<tr/>').parent().html() );
					$(this).remove();
				}
			});

			$('.tbl_standard2').removeClass('none');
		}
	});
}