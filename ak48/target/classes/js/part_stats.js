$(document).ready(function() {
	$('[name=part_search] [name=date]').val(dayjs().format(today));
	part_table();
});


$(document).on('click', '.btn_search', function() {
	part_table();
});


$(document).on('click', '.part_list tr', function() {
	stock_table($(this).attr('data-seq'));
});


//창고 select
$(document).on('click', '#team_sch label', function() {
	var seq = $(this).prev('input').val();

	var html = new Array();
	html.push('<option value="">선택</option>');	
	$.ajax({
		url: contextPath + '/part/org',
		type: 'post',
		data: seq,
		dataType: 'json',
		success: function(data) {
			if(data.code == 1) {
				for(var i=0; i<data.result.length; i++) {
					html.push('<option value="'+data.result[i].og_code+'">'+data.result[i].og_name+'</option>');	
				}
				$('[name="sr_seq"]').html( html.join('') );

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alet('데이터 로드에 실패하였습니다.');
			}

		}
	});

});

//엑셀다운
$(document).on('click', '.part_stats .btn.xlsx ', function() {
	var date	= $('[name=part_search] [name=date]').val();
	var og_seq	= $('[name=part_search] [name=og_seq]').val();
	var sr_seq	= $('[name=part_search] [name=sr_seq]').val();
	var pt_name	= $('[name=part_search] [name=pt_name]').val();
	
	window.location.href = contextPath +'/part/stock/excel?date='+date+'&og_seq='+og_seq+'&sr_seq='+sr_seq+'&pt_name='+pt_name;
});



function part_table(){
	loader();
	var params	= $('[name=part_search]').serializeArray();
	
	$.ajax({
		url: contextPath + '/part/table',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				
				var total	= data.result[0];
				var item	= data.result2;
				var ele = new Array();
				
				if (item.length > 0) {
					ele.push('<tr>');
					ele.push('	<td>총계</td>');
					ele.push('	<td></td>');
					ele.push('	<td></td>');
					ele.push('	<td></td>');
					ele.push('	<td></td>');
					ele.push('	<td>'+number_format(total.ol_total)+'</td>');
					ele.push('	<td>'+number_format(total.ol_amount)+'</td>');
					ele.push('</tr>');
				}
				
				for (var i = 0; i < item.length; i++){
					ele.push('<tr data-seq='+item[i].seq+'>');
					ele.push('	<td>'+item[i].pt_code+'</td>');
					ele.push('	<td>'+item[i].pt_name+'</td>');
					ele.push('	<td>'+item[i].ds_name+'</td>');
					ele.push('	<td>'+item[i].sr_seq+'</td>');
					ele.push('	<td>'+item[i].og_name+'</td>');
					ele.push('	<td>'+number_format(item[i].ol_total)+'</td>');
					ele.push('	<td>'+number_format(item[i].ol_amount)+'</td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="7">검색된 데이터가 없습니다.</td></tr>');

				$('.part_list tbody').html(ele.join(''));
				$('.count_total').text(data.total);
				
				paging(data.total, data.row, $('[name=payment_search] [name=page]').val());


				

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

}

function stock_table(seq){
	$.ajax({
		url: contextPath + '/part/stock/table',
		type: 'post',
		dataType: 'json',
		data: {'seq' : seq},
		success: function(data) {

			if (data.code == 1){
				var ele = new Array();
				var ele2 = new Array();

				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr data-seq="'+data.result[i].seq+'">');
					ele.push('	<td>'+data.result[i].sr_seq+'</td>');
					ele.push('	<td>'+data.result[i].pt_code+'</td>');
					ele.push('	<td>'+number_format(data.result[i].od_price)+'</td>');
					ele.push('	<td>'+number_format(data.result[i].od_ea)+'</td>');
					ele.push('	<td>'+number_format(data.result[i].od_amount)+'</td>');

					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="5">검색된 데이터가 없습니다.</td></tr>');

				$('.stock_table tbody').html(ele.join(''));

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});
}


