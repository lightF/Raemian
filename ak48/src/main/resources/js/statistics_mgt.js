$(document).ready(function() {
	tab($('.tab a.active').attr('data-tab'));
});


$(document).on('click', '.tab a', function() {
	tab($(this).attr('data-tab'));
})


//row 변경시 재호출
$(document).on('change', '[name=row]', function() {
	$('.tab a.active').click();
});

//페이지 이동
$(document).on('click', '.paging a', function() {
	$('[name=frm_list] [name=page]').val($(this).attr('data-page'));

	tab($('.tab a.active').attr('data-tab'));
});

//사업단 엑셀다운
$(document).on('click', '[data-tab=tab1] .btn.xlsx ', function() {
	window.location.href = contextPath +'/facility/org/excel';
});

//이전/철거 엑셀다운
$(document).on('click', '[data-tab=tab2] .btn.xlsx ', function() {
	window.location.href = contextPath +'/facility/history/excel';
});




function tab(view){
	if (view == 'tab1'){
		list_org();
	} else {
		list_history();
	}
}

function list_org() {
	loader();

	var params = $('[name=frm_list]').serializeArray();
	params.push(
		{'name' : 'column', 'value' : 'og_seq'},
		{'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()
	});

	$.ajax({
		url: contextPath + '/facility/org/table',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele		= new Array();
				var ele2	= new Array();
				var ele3	= new Array();
				
				//합계 통계
				for(var i=0; i < data.result.length; i++){
					ele.push('<tr>');
					ele.push('	<td>'+data.result[i][0].type+'</td>');
					ele.push('	<td>'+data.result[i][0].device+'</td>');
					ele.push('	<td>'+number_format(data.result[i][0].total)+'</td>');
					ele.push('</tr>');

					ele3.push('<tr>');

					for(var j=0; j < data.result[i].length; j++){
						ele3.push('<td>'+number_format(data.result[i][j].value)+'</td>');
					}
					ele3.push('</tr>');
				}
				

				for(var i=0; i < data.result2.length; i++){
					ele2.push('	<th>'+data.result2[i].og_name+'</th>');
				}


				if(i == 0) ele.push('<tr><td colspan="2">검색된 데이터가 없습니다.</td></tr>');
				if(j == 0) ele3.push('<tr><td colspan="2">검색된 데이터가 없습니다.</td></tr>');

				$('.tbl_org tbody').html(ele.join(''));
				$('.tbl_org2 thead tr').html(ele2.join(''));
				$('.tbl_org2 tbody').html(ele3.join(''));

			} else if (data.code == 3){
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

function list_history(){
	loader();

	var params = $('[name=frm_list]').serializeArray();
	params.push(
		{'name' : 'column', 'value' : 'dh_seq'},
		{'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()
	});


	$.ajax({
		url: contextPath + '/facility/history/table',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				var division ='';
				var approve = '';
				
				for (var i = 0; i < data.result.length; i++){
					switch(data.result[i].dh_division){
						case 1: division = '신규'; break;
						case 2: division = '철거'; break;
						case 3: division = '이동'; break;						
					}

					switch(data.result[i].dh_approve){
						case 1: approve = '미승인'; break;
						case 2: approve = '승인'; break;
					}

					ele.push('<tr>');
					ele.push('	<td>'+length8(data.result[i].dh_date,'-', '2')+'</td>');
					ele.push('	<td>'+data.result[i].dh_location+'</td>');
					ele.push('	<td>'+data.result[i].dh_install+'</td>');
					ele.push('	<td>'+division+'</td>');
					ele.push('	<td>'+approve+'</td>');
					ele.push('	<td>'+data.result[i].dh_man+'</td>');
					ele.push('	<td>'+data.result[i].dh_team+'</td>');
					ele.push('	<td>'+data.result[i].dh_state+'</td>');
					ele.push('	<td>'+data.result[i].dh_case+'</td>');
					ele.push('</tr>');
				}
				if(i == 0) ele.push('<tr><td colspan="9">검색된 데이터가 없습니다.</td></tr>');
				$('.tbl_history tbody').html(ele.join(''));
				$('.count_total').text(data.total);
				
				paging(data.total, $('[name=row] option:selected').val(), $('[name=frm_list] [name=page]').val());

			} else if (data.code == 3){
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