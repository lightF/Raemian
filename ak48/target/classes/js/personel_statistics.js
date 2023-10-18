$(document).ready(function() {
	$('[name="start_date"]').val( dayjs().format('YYYY-MM-DD') );
	$('[name="end_date"]').val( dayjs().add(1, 'd').format('YYYY-MM-DD') );
	$('.caption_date > div:first-child').text( $('[name="end_date"]').val() );
		user_table();
		user_type_chart();
		user_group_chart();
	$('.personnel_statistics .search .btn_area .btn').on('click', function(){
		user_table();
		user_type_chart();
		user_group_chart();
	});
});

//엑셀다운
$(document).on('click', '.personnel_statistics .btn.xlsx ', function() {
	var start	= $('.personnel_statistics [name=start_date]').val();
	var end		= $('.personnel_statistics [name=end_date]').val();

	window.location.href = contextPath +'/user/excel?start_date='+start+'&'+end;
});


function user_table(){
	loader();
	var html = new Array();
	var html2 = new Array();
	var html_tmp;
	var html3 = new Array();
	var tr = new Array();
	$('.personnel_statistics .tb_scroll table thead').html( '' );
	$.ajax({
		url: contextPath + '/item/grade/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			close_loader();
			if (data.code == 1){
				html.push('<tr>');
				html.push('<th rowspan="3">구분</th>');
				html.push('<th colspan="'+(data.result.length + 1) +'">정규직</th>');
				html.push('<th rowspan="3">계약</th>');
				html.push('<th rowspan="3">인턴</th>');
				html.push('<th rowspan="3">촉탁</th>');
				html.push('<th rowspan="3">계</th>');
				html.push('</tr>');
				html.push('<tr>');

				html2.push('<tr>');
				for(var i=0;i<data.result.length;i++){
					//html.push('<th>'+ data.result[i].name +'</th>');
					if(data.result[i].name.length > 3) {
						html2.push('<th>'+ data.result[i].name.substring(3, data.result[i].name.length) +'</th>');
						if(  i > 0 && data.result[i].name.substring(0, 3) != data.result[(i-1)].name.substring(0, 3) || i == 0) {
							tr.push({ name:  data.result[i].name.substring(0, 3), cnt: 1 });
						} else {
							tr[ (tr.length -1) ].cnt++;
						}
					} else { 
						html_tmp = '<th rowspan="2">'+ data.result[i].name +'</th>';
					}
				}	
				html2.push('</tr>');
				for(var i=0;i<tr.length;i++) 
					html.push('<th colspan="'+ tr[i].cnt +'">'+tr[i].name+'</th>');
				html.push( html_tmp );
				html.push('<th rowspan="2">계</th>');
				html.push('</tr>');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}, complete: function(){
			$('.personnel_statistics .tb_scroll table thead').html( html.join('') + html2.join('') );
			$.ajax({
				url: contextPath + '/user/table',
				type: 'post',
				data: { start_date: $('[name="start_date"]').val(), end_date: $('[name="end_date"]').val()},
				dataType: 'json',
				success: function(data) {
					if(data.code != 1) pop_alert('데이터로드에 실패하였습니다.');
					html = new Array();
					for(var i=0;i<data.result.length;i++) {
						if( i == (data.result.length - 1) ){
							html.push('<tr class="total">');
							html.push('<td>총계</td>');
						} else {
							html.push('<tr>');
							html.push('<td>'+data.result[i][0].area+'</td>');
						}
						for(var j=0;j<data.result[i].length;j++) {
							html.push('<td>'+number_format(data.result[i][j].value)+'</td>');
						}
						html.push('</tr>');
					}
				$('.personnel_statistics .tb_scroll table tbody').html( html.join('') );
				}
			})
		}
	});
}

function user_type_chart(){
	$.ajax({
		url: contextPath + '/user/type/chart',
		type: 'post',
		data: { start_date: $('[name="start_date"]').val(), end_date: $('[name="end_date"]').val()},
		dataType: 'json',
		success: function(data) {
			if(data.code == 1){ 
				chart('#chart1', data, 6,  '', '', '', '');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터로드에 실패하였습니다.');
			}
		}
	});
}

function user_group_chart(){
	$.ajax({
		url: contextPath + '/user/group/chart',
		type: 'post',
		data: { start_date: $('[name="start_date"]').val(), end_date: $('[name="end_date"]').val()},
		dataType: 'json',
		success: function(data) {
			if(data.code == 1) {
				chart('#chart2', data, 6,  '', '', '', '');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터로드에 실패하였습니다.');
			}
		}
	});
}