$(document).ready(function() {
	loader();

	var html = new Array();
	$.ajax({
		url: contextPath + '/measure/table',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			close_loader();
			if (data.code == 1){
				html.push('<tr>');
				html.push('<th>품명</th>');
				for(var i=0;i<data.result2.length;i++) html.push('<th>'+data.result2[i].og_name+'</th>');
				html.push('</tr>');
				$('.instrument_list .tb_scroll thead').html( html.join('') );
				html = new Array();
				for(var i=0;i<data.result.length;i++){
					if( i == 0 ) html.push('<tr class="total">'); else html.push('<tr>');
					
					for(var j=0;j<data.result[i].length;j++) {
						if(j==0) html.push('<td>'+data.result[i][j].md_name+'</td>');
						html.push('<td>'+number_format(data.result[i][j].value)+'</td>');
					}
					html.push('</tr>	');
				}
				//console.log(html.join(''));
				$('.instrument_list .tb_scroll tbody').html( html.join('') );
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}
	});
});

//엑셀다운
$(document).on('click', '.instrument_list .btn.xlsx ', function() {
	window.location.href = contextPath +'/measure/stock/excel';
});
	
