var today = dayjs(new Date()).format('YYYY-MM');

$(document).ready(function() {
	item_division_list();
	item_system_list();
	tab($('.tab .active').attr('data-tab'));

	$('[name=revenue_search] [name=date]').val(today);
});
	
$(document).on('click', '.tab a', function() {
	var t_tab = $(this).attr('data-tab');

	tab(t_tab);
	$('.box').hide();
	$('.box[data-tab="'+t_tab+'"]').show();
});

$(document).on('click', '.btn_search', function() {
	tab($('.tab .active').attr('data-tab'));
});

//콜근무 엑셀다운
$(document).on('click', '[data-tab=work_list_tab1] .btn.xlsx ', function() {
	var og_seq	= $('[name=revenue_search] [name=og_seq]').val();
	var date	= $('[name=revenue_search] [name=date]').val();
	var page = $('[name=revenue_search] [name=page]').val();
	var row = $('[name=row] option:selected').val();
	
	console.log(contextPath +'/call/revenue/excel?og_seq='+og_seq+'&date='+date+'row='+row+'&page='+page);
	window.location.href = contextPath +'/call/revenue/excel?og_seq='+og_seq+'&date='+date+'row='+row+'&page='+page;
});

//월집계표 엑셀다운
$(document).on('click', '[data-tab=work_list_tab2] .btn.xlsx ', function() {
	var og_seq	= $('[name=revenue_search] [name=og_seq]').val();
	var date	= $('[name=revenue_search] [name=date]').val();

	window.location.href = contextPath +'/call/month/excel?og_seq='+og_seq+'&date='+date;
});


function tab(view){
	if (view == 'work_list_tab1'){
		evenue_table();
	} else {
		month_table();
	}
}


function evenue_table(){
	loader();

	var params = $('[name=revenue_search]').serializeArray();
	params.push(
		{'name' : 'page', 'value' : $('[name=revenue_search] [name=page]').val()},
		{'name' : 'order', 'value' : 'DESC'},
		{'name' : 'column', 'value' : 'wkd_start'},
		{'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()}
	);
	
	if (params[2].value == '') {
		params[2] = {'name' : 'date', 'value' : today+'-01'};
	} else {
		params[2] = {'name' : 'date', 'value' : $('[name=revenue_search] [name=date]').val()+'-01'};
	}


	$.ajax({
		url: contextPath + '/call/revenue/table',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele		= new Array();

				//합계 통계
				for(var i=0; i < data.result.length; i ++){
					ele.push('<tr>');
					ele.push('	<td>'+length8(data.result[i].wkd_start, '-', 1)+'</td>');
					ele.push('	<td>'+data.result[i].og_name+'</td>');

					data.result[i].wd_seq  == '' ? ele.push('<td></td>') : ele.push('<td>'+division_name[ data.result[i].wd_seq ]+'</td>');

					ele.push('	<td>'+data.result[i].per_name+'</td>');
					ele.push('	<td>'+length14(data.result[i].wkd_start, '-', ':', 1)+'</td>');
					ele.push('	<td>'+length14(data.result[i].wkd_finish, '-', ':', 1)+'</td>');
					ele.push('	<td>'+data.result[i].wkd_hour+'</td>');
					ele.push('	<td>'+number_format(data.result[i].wkd_amount)+'</td>');

					data.result[i].sys_seq == '' ? ele.push('<td></td>') : ele.push('<td>'+system_name[ data.result[i].sys_seq ]+'</td>');

					ele.push('	<td>'+data.result[i].wrk_work+'</td>');
					ele.push('</tr>');

				}

				if(i == 0) ele.push('<tr class="empty"><td colspan="10">검색된 데이터가 없습니다.</td></tr>');
				$('.revenue_list tbody').html(ele.join(''));
				
				if (data.result.length > 0) {
					var date_str = String(data.result[0].wkd_start);
					$('div[data-tab=work_list_tab1] .date').text(date_str.substr(0,4)+'년 '+date_str.substr(4,2)+'월');
					$('.count_total').text(number_format(data.total));
				}

				paging(data.total, data.row, $('[name=revenue_search] [name=page]').val());
				

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

function month_table(){
	loader();
	var params = $('[name=revenue_search]').serializeArray();

	$.ajax({
		url: contextPath + '/call/month/table',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele		= new Array();
				var ele2	= new Array();
				
				//계 통계
				for(var i=0; i < data.result.length; i ++){
					ele2.push('<tr>');
					ele2.push('	<td>'+data.result[i].value1+'</td>');
					ele2.push('	<td>'+data.result[i].value2+'</td>');
					ele2.push('	<td>'+data.result[i].value3+'</td>');
					ele2.push('	<td>'+data.result[i].value4+'</td>');
					ele2.push('	<td>'+data.result[i].value5+'</td>');
					ele2.push('	<td>'+data.result[i].value6+'</td>');
					ele2.push('	<td>'+data.result[i].value7+'</td>');
					ele2.push('	<td></td>');
					ele2.push('</tr>');

				}
				//그외 통계
				for(var i=0; i < data.result2.length; i ++){
					ele2.push('<tr>');
					ele2.push('	<td>'+data.result2[i].value1+'</td>');
					ele2.push('	<td>'+data.result2[i].value2+'</td>');
					ele2.push('	<td>'+data.result2[i].value3+'</td>');
					ele2.push('	<td>'+data.result2[i].value4+'</td>');
					ele2.push('	<td>'+data.result2[i].value5+'</td>');
					ele2.push('	<td>'+data.result2[i].value6+'</td>');
					ele2.push('	<td>'+data.result2[i].value7+'</td>');
					ele2.push('	<td></td>');
					ele2.push('</tr>');

				}

				if(i == 0) ele.push('<tr><td colspan="10">검색된 데이터가 없습니다.</td></tr>');
				$('.month_list tbody').html(ele.join(''));
				$('.month_list tbody').append(ele2.join(''));
				var date_str = $('[name=revenue_search] [name=date]').val().replace('-', '년 ');
				$('div[data-tab=work_list_tab2] .date').text(date_str+'월');

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