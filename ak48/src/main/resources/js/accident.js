$(document).ready(function() {
	list();
	item_position_list();
	car_vehicle_list();
});
	
$(document).on('click', '.btn_search', function() {
	list();
});


//리스트 정렬
$(document).on('click', '.accident_list th[data-order]', function() {
	list();
});


//페이지 이동
$(document).on('change', '[name=row]', function() {
	list();
});


//페이지 이동
$(document).on('click', '.accident .paging a', function() {
	$('[name=accident_search] [name=page]').val($(this).attr('data-page'));
	list();
});


//등록 / 상세팝업 열기
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
	
	$('[name=accident_detail] .btn_area a').hide();
	if (type=='new'){
		$('.detail_tit').text('사고일지 작성');
		$('[name=accident_detail] input, [name=accident_detail] textarea').val('');
		$('[name=accident_detail] select option').prop('selected', false);
		$('[name=accident_detail] .input_file').removeClass('upload');
		$('[name=accident_detail] .img .img_view, [name=accident_detail] .img .file_del').remove();
		$('[name=accident_detail] .btn_area .close_in').show();
	} else {
		$('.detail_tit').text('상세 사고일지');
		$('[name=accident_detail] .btn_area .btn_remove, [name=accident_detail] .btn_area .xlsx').show();

		detail($(this).closest('tr').find('[name=seq]').val());
	}
});



//리스트 엑셀다운
$(document).on('click', '.accident .list_xlsx ', function() {
	var page = $('[name=accident_search] [name=page]').val();
	var row = $('[name=row] option:selected').val();

	console.log(contextPath +'/car/vehicle/list/excel?row='+row+'&page='+page);
	window.location.href = contextPath +'/car/accident/list/excel?row='+row+'&page='+page;
});

//팝업 엑셀다운
$(document).on('click', '[name=accident_detail] .btn.xlsx ', function() {
	var seq = $('[name=accident_detail] [name=seq]').val();
	console.log(contextPath +'/car/accident/detail/excel?seq='+seq);
	window.location.href = contextPath +'/car/accident/detail/excel?seq='+seq;
});


//사고 일지 삭제
$(document).on('click', '[name=accident_detail] .btn_remove', function() {
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/car/accident/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : $('[name=accident_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 하였습니다.');
					list();

				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제 실패 하였습니다.');
				}
			}
		});
	
	});


});

//사고 일지 저장
$(document).on('click', '[name=accident_detail] .btn_save', function() {
	var chk = '';
	$('[name=accident_detail] input').each(function(i){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
		}
	});
	
	if(chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}

	save();
});

function list(){
	loader();
	var params	= $('[name=accident_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/car/accident/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();
			if (data.code == 1){
				var ele = new Array();
				for(var i=0; i < data.result.length; i++){
					var ac_blame = '';
					switch(data.result[i].ac_blame){
						case 1: ac_blame = '자사과실'; break;
						case 2: ac_blame = '상대과실'; break;
						case 3: ac_blame = '쌍방과실'; break;
					}
					ele.push('<tr>');
					ele.push('	<input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ data.result[i].seq+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ data.result[i].group_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ data.result[i].team_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ data.result[i].ve_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ data.result[i].ve_number+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ ac_blame+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ length8(data.result[i].ac_date, '-', 1)+'</td>');
					ele.push('	<td class="btn_add" data-dialog="accident_log_view" data-type="modify">'+ data.result[i].ac_place+'</td>');
					ele.push('	<td><a class="btn_report" data-dialog="accident_log_report"><i class="ri-draft-fill"></i></a></td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="11">검색된 데이터가 없습니다.</td></tr>');

				$('.accident_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=accident_search] [name=page]').val());
				

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}, complete: function(){
			$('.btn_report').click(function(){
				report($(this).closest('tr').find('[name=seq]').val());			
			});
		}
	});

}


function detail(seq){

	$.ajax({
		url: contextPath + '/car/accident/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item = data.result[0];
				$('[name=accident_detail] [name=seq]').val(item.seq);
				$('[name=accident_detail] [name=ve_seq]').val(item.ve_seq);
				$('[name=accident_detail] [name=ve_name]').val(item.ve_name);
				$('[name=accident_detail] [name=per_seq]').val(item.per_seq);
				$('[name=accident_detail] [name=per_name]').val(item.per_name);
				$('[name=accident_detail] [name=per_organize]').val(item.per_organize);
				$('[name=accident_detail] [name=per_organize_name]').val(item.per_organize_name);
				$('[name=accident_detail] [name=per_team]').val(item.per_team);
				$('[name=accident_detail] [name=per_team_name]').val(item.per_team_name);
				$('[name=accident_detail] [name=ac_date]').val(length8(item.ac_date, '-', 1));
				$('[name=accident_detail] [name=ac_weather]').val(item.ac_weather);
				$('[name=accident_detail] [name=ac_place]').val(item.ac_place);
				$('[name=accident_detail] [name=ac_model]').val(item.ac_model);
				$('[name=accident_detail] [name=ac_car]').val(item.ac_car);
				$('[name=accident_detail] [name=ac_phone]').val(item.ac_phone);
				$('[name=accident_detail] [name=ac_summary]').val(item.ac_summary);
				$('[name=accident_detail] [name=ac_blame] option[value='+item.ac_blame+']').prop('selected', true);
				$('[name=accident_detail] [name=ac_report]').val(length8(item.ac_report, '-', 1));
				$('[name=accident_detail] [name=ac_our1]').val(item.ac_our1);
				$('[name=accident_detail] [name=ac_our2]').val(item.ac_our2);
				$('[name=accident_detail] [name=ac_match1]').val(item.ac_match1);
				$('[name=accident_detail] [name=ac_match2]').val(item.ac_match2);
				$('[name=accident_detail] [name=ac_term]').val(item.ac_term);
				$('[name=accident_detail] [name=ac_etc]').val(item.ac_etc);
				
				$('[name=accident_detail] .input_file').removeClass('upload');
				$('[name=accident_detail] .img_view, [name=accident_detail] .file_del').remove();

				if(data.result2.length > 0){
					for(var i=0;i<data.result2.length;i++) {
						//이미지업로드
						if(data.result2[i].f_repath && data.result2[i].f_resize) {
							var html3 = new Array();

							$('[name=accident_detail] #a_file'+(i+1)).next().next().next().val(data.result2[i].f_seq);
							$('[name=accident_detail] #a_file'+(i+1)).next().next().next().next().val(1);
							html3.push('<a class="img_view" href="'+resourcePath+ data.result2[i].f_path+data.result2[i].f_unique+'" target="_blank">');
							html3.push('<img src="'+resourcePath+ data.result2[i].f_repath+data.result2[i].f_resize+'" alt="'+resourcePath+ data.result2[i].f_path+data.result2[i].f_original+'"></a>');
							html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');
							
							$('[name=accident_detail] #a_file'+(i+1)).parent().append( html3.join('') );
						} 
					}
				} 

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}, complete: function () {
			$('#person_sch [name="user_list"] [name=row] option[value="20"]').prop('selected', true);
		}
	});
}


function save(){

	pop_confirm('저장하시겠습니까?', function(){
		$('[name=accident_detail]').ajaxSubmit({
			url: contextPath + '/car/accident/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			success: function(data){
				if(data.code == 1) {
					pop_alert('저장 되었습니다.');
					list();
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}
			},
			error: function(data, status, err) {
				pop_alert('저장에 실패하였습니다.');
			}, complete: function(){
				$('[name=accident_search]')[0].reset();
			}
		});

	
	});
	
}

function report(seq){

	$.ajax({
		url: contextPath + '/car/accident/report',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var ac_blame ='';
				switch(data.result[0].ac_blame){
					case 1:	ac_blame = '자사과실'; break;
					case 2:	ac_blame = '상대과실'; break;
					case 3:	ac_blame = '쌍방과실'; break;
				}

				$('#accident_log_report .team_name').text(data.result[0].team_name);
				$('#accident_log_report .pos_seq').text(position_name[ data.result[0].pos_seq ]);
				$('#accident_log_report .per_name').text(data.result[0].per_name);
				$('#accident_log_report .ac_date').text(length8(data.result[0].ac_date, '-', 1));
				$('#accident_log_report .ac_place').text(data.result[0].ac_place);
				$('#accident_log_report .ac_weather').text(data.result[0].ac_weather);
				$('#accident_log_report .ac_model').text(data.result[0].ac_model);
				$('#accident_log_report .ac_car').text(data.result[0].ac_car);
				$('#accident_log_report .ac_phone').text(data.result[0].ac_phone);
				$('#accident_log_report .ve_name').text(data.result[0].ve_name);
				$('#accident_log_report .ve_number').text(data.result[0].ve_number);
				$('#accident_log_report .ac_summary').text(data.result[0].ac_summary);
				$('#accident_log_report .ac_our1').text(data.result[0].ac_our1);
				$('#accident_log_report .ac_match1').text(data.result[0].ac_match1);
				$('#accident_log_report .ac_match2').text(data.result[0].ac_match2);
				$('#accident_log_report .ac_blame').text(ac_blame);
				$('#accident_log_report .ac_etc').text(data.result[0].ac_etc);
				
				$('#accident_log_report .year').text(String(data.result[0].ac_date).substr(0,4));
				$('#accident_log_report .moth').text(String(data.result[0].ac_date).substr(4,2));
				$('#accident_log_report .day').text(String(data.result[0].ac_date).substr(6,2));

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}
	});

}
