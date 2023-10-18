$(document).ready(function() {
	$('[name="car_search"] [name="date"]').val( dayjs().format('YYYY-MM') );
	$('[name="car_search"] [name="end_date"]').val( dayjs().format('YYYY-MM') );
	

	car_table(1);
	car_liter_chart(1);
	car_move_chart(1);

});
	

$(document).on('click', 'a[data-tab]', function(){
	$('.car_tab5_search').hide();
	if ($(this).attr('data-tab') == 'car_tab4'){
		car_table4( 4 );
	} else if ($(this).attr('data-tab') == 'car_tab5'){
		$('.car_tab5_search').show();
		car_table5();
	} else {
		car_table( $(this).data('tab').replace('car_tab', '') );
		car_liter_chart($(this).data('tab').replace('car_tab', '') );
		car_move_chart($(this).data('tab').replace('car_tab', '') );
	}
});

$(document).on('change', '[name="car_search"] [name="date"]', function(){
	$('.car_tab5_search').hide();
	if ($('.tab a.active').attr('data-tab') == 'car_tab4'){
		car_table4(4);
	} else if ($('.tab a.active').attr('data-tab') == 'car_tab5'){
		$('.car_tab5_search').show();
		car_table5();
	} else {
		car_table( $('.tab .active').data('tab').replace('car_tab', '') );
		car_liter_chart($('.tab .active').data('tab').replace('car_tab', '') );
		car_move_chart($('.tab .active').data('tab').replace('car_tab', '') );
	}
});

$(document).on('change', '[name="car_search"] [name="end_date"]', function(){
	car_table5();
});

$(document).on('click', '#car_sch tbody tr', function(){
	car_table5();
});


//엑셀다운
$(document).on('click', '.car_management_list .btn.xlsx ', function() {
	var date	= $('[name=car_search] [name=date]').val();
	window.location.href = contextPath +'/car/excel?date='+date+'-01';
});

function car_table(section){
	loader();
	var html = new Array();
	$.ajax({
		url: contextPath + '/car/table',
		type: 'post',
		data: { section: section, date: $('[name="car_search"] [name="date"]').val() +'-01' },
		dataType: 'json',
		success: function(data) {
			close_loader();
			if(data.code == 1) {
				for(var i=0;i<data.result.length;i++) {
					html.push('<tr>');
					html.push('<td>'+data.result[i].name+'</td>');
					html.push('<td>'+number_format(data.result[i].value1)+'</td>');
					html.push('<td>'+number_format(data.result[i].value2)+'</td>');
					html.push('<td>'+number_format(data.result[i].value3)+'</td>');
					html.push('<td>'+data.result[i].value4+'</td>');
					html.push('<td>'+data.result[i].value5+'</td>');
					html.push('<td>'+data.result[i].value6+'</td>');
					html.push('</tr>');
				}
				if (i == 0) html.push('<tr><td colspan="7">조회할 데이터가 없습니다.</td></tr>');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {pop_alert('데이터로드에 실패하였습니다.');}
			

		}, complete: function(){
			 $('[data-tab="car_tab'+section+'"] table tbody').html( html.join('') );
		}
	})
}

function car_table4(section){
	loader();
	var html = new Array();
	$.ajax({
		url: contextPath + '/car/table',
		type: 'post',
		data: { section: section, date: $('[name="car_search"] [name="date"]').val() +'-01' },
		dataType: 'json',
		success: function(data) {
			close_loader();
			if(data.code == 1) {
				for(var i=0;i<data.result.length;i++) {
					html.push('<tr>');
					html.push('	<td>'+data.result[i].ve_number+'</td>');
					html.push('	<td>'+number_format(data.result[i].rc_drive)+'</td>');
					html.push('	<td>'+number_format(data.result[i].rc_amount)+'</td>');
					html.push('	<td>'+number_format(data.result[i].rc_park)+'</td>');
					html.push('	<td>'+number_format(data.result[i].rc_pass)+'</td>');
					html.push('	<td>'+number_format(data.result[i].rc_trouble)+'</td>');
					html.push('</tr>');
				}
				if (i == 0) html.push('<tr><td colspan="6">조회할 데이터가 없습니다.</td></tr>');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {pop_alert('데이터로드에 실패하였습니다.');}
			

		}, complete: function(){
			 $('[data-tab="car_tab'+section+'"] table tbody').html( html.join('') );
		}
	})
}

function car_table5(){
	loader();
	var html = new Array();
	$.ajax({
		url: contextPath + '/car/table',
		type: 'post',
		data: { section: 5, start_date: $('[name="car_search"] [name="date"]').val() +'-01',  end_date: $('[name="car_search"] [name="end_date"]').val() +'-01'},
		dataType: 'json',
		success: function(data) {
			close_loader();
			if(data.code == 1) {
				for(var i=0;i<data.result.length;i++) {
					html.push('<tr>');
					html.push('	<td>'+data.result[i].rc_date+'</td>');
					html.push('	<td>'+data.result[i].ve_number+'</td>');
					html.push('	<td>'+data.result[i].rc_drive+'</td>');
					html.push('	<td>'+data.result[i].rc_amount+'</td>');
					html.push('	<td>'+data.result[i].rc_park+'</td>');
					html.push('	<td>'+data.result[i].rc_pass+'</td>');
					html.push('	<td>'+data.result[i].rc_trouble+'</td>');
					html.push('</tr>');
				}
				if (i == 0) html.push('<tr><td colspan="7">조회할 데이터가 없습니다.</td></tr>');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {pop_alert('데이터로드에 실패하였습니다.');}
			

		}, complete: function(){
			 $('[data-tab="car_tab5"] table tbody').html( html.join('') );
		}
	})
}


function car_liter_chart(section){
	$.ajax({
		url: contextPath + '/car/liter/chart',
		type: 'post',
		data: { section: section, date: $('[name="car_search"] [name="date"]').val() +'-01' },
		dataType: 'json',
		success: function(data) {
			if(data.code == 1){
				//console.log( ((section  * 2) -1) );
				chart('[data-tab="car_tab'+section+'"] #chart'+ ((section  * 2) -1), data, 1,  '', '', '', '', {left: 30, top: 10, right: 10, bottom: 30});
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터로드에 실패하였습니다.');
			
			}
		}

	})
}
function car_move_chart(section){
	$.ajax({
		url: contextPath + '/car/move/chart',
		type: 'post',
		data: { section: section, date: $('[name="car_search"] [name="date"]').val() +'-01' },
		dataType: 'json',
		success: function(data) {
			if(data.code == 1){
				chart('[data-tab="car_tab'+section+'"] #chart'+  (section * 2), data, 1,  '', '', '', '', {left: 30, top: 10, right: 10, bottom: 30});
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터로드에 실패하였습니다.');
			}
		}

	})
}