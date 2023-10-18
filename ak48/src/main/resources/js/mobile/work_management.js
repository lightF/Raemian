$(document).ready(function() {
	list();
	item_system_list();
	item_division_list();
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
	$('[name=work_search] [name=page]').val($(this).attr('data-page'));
	list();

});

$(document).on('click', '.btn_add', function() {
	var type	= $(this).attr('data-type');
	var seq	= $(this).closest('li').find('[name=seq]').val();
	if (type == 'new'){
		location.href= '/DBCS/work_management_write?type='+type;
	} else {
		location.href= '/DBCS/work_management_write?type='+type+'&seq='+seq;
	}

});

function list(){
	var params	= $('[name=work_search]').serializeArray();
	params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/call/work/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			if (data.code == 1){
				var ele = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<li>');
					ele.push('	<input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					ele.push('	<input type="hidden" name="wrk_group" value="'+data.result[i].wrk_group+'">');
					ele.push('	<input type="hidden" name="wrk_check" value="'+data.result[i].wrk_check+'">');
					ele.push('	<p class="count">'+ ((i + 1) + (($('[name="page"]').val() - 1) * $('[name="row"]').val())) +'</p>');
					ele.push('	<a class="btn_add" data-type="modify">');
					ele.push('		<div class="list_st1">');
					ele.push('			<p>사업단: <span class="group">'+data.result[i].group_name+'</span></p>');
					ele.push('			<span class="line"></span>');
					ele.push('			<p>점검팀: <span class="team">'+data.result[i].check_name+'</span></p>');
					ele.push('		</div>');
					ele.push('		<div class="list_st2">');
					ele.push('			<p>작업구분: <span class="work">'+division_name[ data.result[i].wd_seq ]+'</span></p>');
					ele.push('			<span class="line"></span>');
					ele.push('			<p>확인여부: <span class="check">'+data.result[i].group_name+'</span></p>');
					ele.push('		</div>');
					ele.push('		<div class="list_st3">');
					ele.push('			<p>일자: <span class="date">'+length8(data.result[i].wrk_date, '-', 1)+'</span></p>');
					ele.push('			<span class="line"></span>');
					ele.push('			<p>시간: <span class="time">'+time2(data.result[i].wrk_hour, 3)+' ~ '+time2(data.result[i].wrk_end, 3)+'</span></p>');
					ele.push('		</div>');
					ele.push('	</a>');
					ele.push('</li>');
				}
				
				if(i == 0) ele.push('<li class="empty">검색된 데이터가 없습니다.</li>');

				$('.ul_list ul').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=work_search] [name=page]').val());
				

			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}
	});
}