$(document).ready(function() {

	var type = location.search.split('=');
		type = type[1];
	
		list(type);
});

$(document).on('click', '.btn_search', function() {
	$('.m_search').hide();
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});

//페이지 이동
$(document).on('click', '.paging a', function() {
	$('[name=action_search] [name=page]').val($(this).attr('data-page'));
	list();

});

$(document).on('click', '.btn_add', function() {
	var type	= $(this).attr('data-type');
	var seq	= $(this).closest('li').find('[name=seq]').val();
	if (type == 'new'){
		location.href= '/DBCS/faultreception_mgt_write?type='+type;
	} else {
		location.href= '/DBCS/faultreception_mgt_write?type='+type+'&seq='+seq;
	}

});


function list(type){
	params	= $('[name=action_search]').serializeArray();
	params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});
	

	$.ajax({
		url: contextPath + '/breakdown/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<li>');
					ele.push('	<input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					ele.push('	<p class="count">'+ ((i + 1) + (($('[name="page"]').val() - 1) * $('[name="row"]').val())) +'</p>');
					ele.push('	<a class="btn_add" data-type="modify">');
					ele.push('		<div class="list_st1">');
					ele.push('			<p>기기명: <span class="device">'+data.result[i].dc_name+'</span></p>');
					ele.push('			<span class="line"></span>');
					ele.push('			<p>고장기준: <span class="fa_type">'+data.result[i].bk_standard+'</span></p>');
					ele.push('		</div>');
					ele.push('		<div class="list_st2">');
					ele.push('			<p>설비위치: <span class="location">'+data.result[i].dc_location+'</span></p>');
					ele.push('		</div>');
					ele.push('		<div class="list_st3">');
					ele.push('			<p>접수일시: <span class="date1">'+length8(data.result[i].bk_receipt, '-', 1)+'</span></p>');
					ele.push('			<span class="line"></span>');
					ele.push('			<p>조치일시: <span class="date2">'+length8(data.result[i].bk_start, '-', 1)+'</span></p>');
					ele.push('		</div>');
					ele.push('	</a>');
					ele.push('</li>');
				}
				
				if(i == 0) ele.push('<li class="empty">검색된 데이터가 없습니다.</li>');

				$('.ul_list ul').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=action_search] [name=page]').val());


				

			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});


}
	