$(document).ready(function() {
	var type = $('[name=quarter] option:selected').val();
	list(type);
});
	

$(document).on('click', '.btn_search', function() {
	var type = $('[name=quarter] option:selected').val();
	list(type);
});


$(document).on('mouseover', 'table tr', function() {
	var idx = $(this).eq();
	$('.table tr').eq(idx).addClass('active');

});

//엑셀다운
$(document).on('click', '.ventre .btn.xlsx ', function() {
	var year	= $('[name=breakdown_search] [name=year]').val();
	var quarter	= $('[name=breakdown_search] [name=quarter]').val();
	var og_seq	= $('[name=breakdown_search] [name=og_seq]').val();
	
	window.location.href = contextPath +'/breakdown/excel?year='+year+'&quarter='+quarter+'&og_seq='+og_seq;
});

function list(type){
	loader();

	var params	= $('[name=breakdown_search]').serializeArray();

	$.ajax({
		url: contextPath + '/breakdown/table',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				var txt = '';
				var txt2 = '';
				for (var i = 0; i < data.result.length; i++){
					ele.push('<tr>');
					var j = i;
					if(type == 0) {
						switch(i){
							case 0: txt ='전체'; break; case 4: txt = '1월'; break; case 8: txt = '2월'; break; case 12: txt = '3월'; break; case 16: txt = '1/4분기'; break;
							case 20: txt = '4월'; break; case 24: txt = '5월'; break; case 28: txt = '6월'; break; case 32: txt = '2/4분기'; break;
							case 36: txt = '7월'; break; case 40: txt = '8월'; break; case 44: txt = '9월'; break; case 48: txt = '3/4분기'; break;
							case 52: txt = '10월'; break; case 56: txt = '11월'; break; case 60: txt = '12월'; break; case 64: txt = '4/4분기'; break;
							default: txt =''; break;
						} 
						
					} else {
						if (type == 1){
							switch(i){
								case 0: txt ='종합'; break; case 4: txt = '1월'; break; case 8: txt = '2월'; break; case 12: txt = '3월'; break; case 16: txt = '1/4분기'; break;
								default: txt =''; break;
							}
							
						} else if (type == 2){
							switch(i){
								case 0: txt ='종합'; break; case 4: txt = '4월'; break; case 8: txt = '5월'; break; case 12: txt = '6월'; break; case 16: txt = '2/4분기'; break;
								default: txt =''; break;
							}

						} else if (type == 3){
							switch(i){
								case 0: txt ='종합'; break; case 4: txt = '7월'; break; case 8: txt = '8월'; break; case 12: txt = '9월'; break;case 16: txt = '3/4분기'; break;
								default: txt =''; break;
							}
						} else {
							switch(i){
								case 0: txt ='종합'; break; case 4: txt = '10월'; break; case 8: txt = '11월'; break; case 12: txt = '12월'; break; case 16: txt = '4/4분기'; break;
								default: txt =''; break;
							}
						}
						
					}

					if (i  == 0 || i == 4 || i == 8 || i == 12 || i == 16 || i == 20 || i == 24 || i == 28 || i == 32 || i == 36 || i == 40 || i == 44 || i == 48 || i == 52 || i == 56 || i == 60 || i == 64){
						txt2 = '고장시간(분)';
					} else if (i == 1 || i == 5 || i == 9 || i == 13 || i == 17 || i == 21 || i == 25 || i == 29 || i == 33 || i == 37 || i == 41 || i == 45 || i == 49 || i == 53 || i == 57 || i == 61 || i == 65) {
						txt2 = '고장건수';
					} else if (i == 2 || i == 6 || i == 10 || i == 14 || i == 18 || i == 22 || i == 26 || i == 30 || i == 34 || i == 38 || i == 42 || i == 46 || i == 50  || i == 54 || i == 58 || i == 62 || i == 66) {
						txt2 = '고장율';
					} else if (i == 3 || i == 7 || i == 11 || i == 15 || i == 19 || i == 23 || i == 27 || i == 31 || i == 35 || i == 39 || i == 43 || i == 47 || i == 51 || i == 55 || i == 59 || i == 63 || i == 67) {
						txt2 = '가동율';
					} else {
						txt2 = '';
					}
					
					ele.push('	<td>'+txt+'</td>');//월
					ele.push('	<td>'+txt2+'</td>');//구분
					ele.push('	<td>'+data.result[i].value1+'</td>');
					ele.push('	<td>'+data.result[i].value2+'</td>');
					ele.push('	<td>'+data.result[i].value3+'</td>');
					ele.push('	<td>'+data.result[i].value4+'</td>');
					ele.push('	<td>'+data.result[i].value5+'</td>');
					ele.push('	<td>'+data.result[i].value6+'</td>');
					ele.push('</tr>');
				}
				if(i == 0) ele.push('<tr><td colspan="6">검색된 데이터가 없습니다.</td></tr>');
				$('.breakdown_list tbody').html(ele.join(''));

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});

}


