$(document).ready(function() {
	item_type_list();
	list();	
});
	

$(document).on('click', '.btn_search', function() {
	list();
});

//리스트 정렬
$(document).on('click', '.shift_list th[data-order]', function() {
	list();
});


//페이지 이동
$(document).on('click', '.duty .paging a', function() {
	$('[name=shift_search] [name=page]').val($(this).attr('data-page'));
	list();
});

$(document).on('change', '[name=row]', function() {
	list();
});


//등록 / 상세 팝업
$(document).on('click', '.btn_add', function() {
	var type = $(this).attr('data-type');
	
	$('[name=breakdown_shift_detail] .btn_area a').hide();

	if (type == 'new'){
		$('[name=breakdown_shift_detail] input').val('').attr('placeholder', '입력하세요');
		$('[name=breakdown_shift_detail] select option').prop('selected', false);
		$('[name=breakdown_shift_detail] .btn_area .close').show();
		$('[name=breakdown_shift_detail] .img').find('.upload').removeClass('upload');
		$('[name=breakdown_shift_detail] .img_view, [name=breakdown_shift_detail] .file_del').remove();
		$('[name=breakdown_shift_detail] tbody tr').remove();
		add_list($('.tbl_work'), 1);
		add_list($('.tbl_instruct'), 2);
		add_list($('.tbl_report'), 3);
	} else {
		$('[name=breakdown_shift_detail] .btn_area .btn_remove, [name=breakdown_shift_detail] .btn_area .btn.xlsx').show();
		detail($(this).closest('tr').find('[name=seq]').val());
	}

});


//팝업 테이블행 추가
$(document).on('click', '[name=breakdown_shift_detail] table .add_btn', function(){
	var target	= $(this).closest('table');
	var type	= $(this).attr('data-addlist');
	add_list(target, type);
	
});


//팝업 테이블행행 삭제
$(document).on('click', 'table .del_btn', function(){
	$(this).closest('tr').remove();
});

//보고서 열기
$(document).on('click', '.shift_list .btn_report', function(){
	report($(this).closest('tr').find('[name=seq]').val());
});

//당직일지 삭제
$(document).on('click', '[name=breakdown_shift_detail] .btn_remove', function(){
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/breakdown/shift/delete',
			type: 'post',
			dataType: 'json',
			data: {seq : $('[name=breakdown_shift_detail] [name=seq]').val()},
			success: function(data) {
				if (data.code == 1){
					pop_alert('삭제 되었습니다.');
					
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제 실패 하였습니다.');
				}
				
			}
		});
	
	});
});


//엑셀다운
$(document).on('click', '[name=breakdown_shift_detail] .btn.xlsx ', function() {
	var seq = $('[name=breakdown_shift_detail] [name=seq]').val();
	window.location.href = contextPath +'/breakdown/shift/detail/excel?seq='+seq;
});


//당직일지 저장
$(document).on('click', '[name=breakdown_shift_detail] .btn_save', function(){
	var chk = '';
	$('[name=breakdown_shift_detail] input').each(function(i){
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
	var params	= $('[name=shift_search]').serializeArray();
		params.push({'name' : 'row', 'value' : $('.tb_bottom select[name=row] option:selected').val()});

	$.ajax({
		url: contextPath + '/breakdown/shift/list',
		type: 'post',
		dataType: 'json',
		data: params,
		success: function(data) {
			close_loader();

			if (data.code == 1){
				var ele = new Array();
				for (var i = 0; i < data.result.length; i++){
					var type = data.result[i].sh_type;

					switch(type){
						case 1: type = '주간'; break;
						case 2: type = '야간'; break;
					}
					ele.push('<tr>');
					ele.push('	<input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					ele.push('	<td class="btn_add" data-dialog="duty_view" data-type="modify">'+data.result[i].og_name+'</td>');
					ele.push('	<td class="btn_add" data-dialog="duty_view" data-type="modify">'+length8(data.result[i].sh_date, '-', 1)+'</td>');
					ele.push('	<td class="btn_add" data-dialog="duty_view" data-type="modify">'+type+'</td>');
					ele.push('	<td class="btn_add" data-dialog="duty_view" data-type="modify">'+number_format(data.result[i].sh_count)+'</td>');
					ele.push('	<td><a class="btn_report" data-dialog="duty_report"><i class="ri-draft-fill"></i></a></td>');
					ele.push('</tr>');
				}
				
				if(i == 0) ele.push('<tr><td colspan="5">검색된 데이터가 없습니다.</td></tr>');

				$('.shift_list tbody').html(ele.join(''));
				$('.count_total').text(number_format(data.total));
				
				paging(data.total, data.row, $('[name=shift_search] [name=page]').val());

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
			

		}
	});
}


function detail(seq){
	$.ajax({
		url: contextPath + '/breakdown/shift/detail',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var item		= data.result[0];
				var worker		= data.result3;
				var instruct	= data.result4;
				var report		= data.result5;
				
				$('[name=breakdown_shift_detail] [name=seq]').val(item.seq);
				$('[name=breakdown_shift_detail] [name=og_seq]').val(item.og_seq);
				$('[name=breakdown_shift_detail] [name=og_name]').val(item.og_name);
				$('[name=breakdown_shift_detail] [name=sh_type] option[value="'+item.sh_type+'"]').prop('selected', true);
				$('[name=breakdown_shift_detail] [name=sh_date]').val(length8(item.sh_date, '-',1));
				$('[name=breakdown_shift_detail] [name=sh_etc]').val(item.sh_etc);
				$('[name=breakdown_shift_detail] [name=sh_weather]').val(item.sh_weather);
				$('[name=breakdown_shift_detail] [name=sh_temp]').val(item.sh_temp);
				$('[name=breakdown_shift_detail] [name=sh_wind]').val(item.sh_wind);
				$('[name=breakdown_shift_detail] [name=sh_humid]').val(item.sh_humid);
				
				$('[name=breakdown_shift_detail] .upload').removeClass('upload');
				$('[name=breakdown_shift_detail] .img_view, [name=breakdown_shift_detail] .file_del').remove();
				
				if(data.result2.length > 0){
					for(var i=0;i<data.result2.length;i++) {
						//이미지업로드
						if(data.result2[i].f_repath && data.result2[i].f_resize) {
							var html = new Array();
							$('[name=breakdown_shift_detail] #d_seq'+(i+1)).parent('div').addClass('upload');
							$('[name=breakdown_shift_detail] #d_seq'+(i+1)).next().next().next().val(data.result2[i].f_seq);
							$('[name=breakdown_shift_detail] #d_seq'+(i+1)).next().next().next().next().val(1);

							var img_chk = data.result2[i].f_original.split('.');
								img_chk = img_chk[1];


							if (img_chk != 'jpeg' && img_chk != 'jpg' && img_chk != 'png' && img_chk != 'bmp'){
								html.push('<a class="img_view" href="'+resourcePath+ data.result2[i].f_path+data.result2[i].f_unique+'" target="_blank">');
								html.push('<div class="up_etc"><i class="ri-file-text-line"></i><span>etc..</span></div>');
								html.push('<a class="file_del"><i class="ri-close-line"></i></a>');

							} else {
								html.push('<a class="img_view" href="'+resourcePath+ data.result2[i].f_path+data.result2[i].f_unique+'" target="_blank">');
								html.push('<img src="'+resourcePath+ data.result2[i].f_repath+data.result2[i].f_resize+'"/></a>');
								html.push('<a class="file_del"><i class="ri-close-line"></i></a>');
							}

							$('[name=breakdown_shift_detail] #d_seq'+(i+1)).parent().append( html.join('') );
						}
					}
				}
				
				var wle = new Array();
				for(var i=0; i < worker.length; i++){
					wle.push('<tr>');
//					wle.push('	<td>'+worker[i].wk_seq+'</td>');
					wle.push('	<td>'+(i+1)+'</td>');
					if (worker[i].wt_seq != ''){
						wle.push('	<td>'+type_name[ worker[i].wt_seq ]+'</td>');
					} else {
						wle.push('	<td>'+worker[i].wt_seq+'</td>');
					}
					wle.push('	<td><input type="text" name="wk_place[]" value="'+worker[i].wk_place+'"></td>');
					wle.push('	<td><input type="text" name="wk_team[]" value="'+worker[i].wk_team+'"></td>');
					wle.push('	<td><input type="text" name="wk_rank[]" value="'+worker[i].wk_rank+'"></td>');
					wle.push('	<td>');
					wle.push('		<div class="sch_inp">');
					wle.push('			<input type="hidden" name="per_seq[]" value="'+worker[i].per_seq+'">');
					wle.push('			<input type="text" name="per_seq_name[]" value="'+worker[i].per_name+'" placeholder="검색하기">');
					wle.push('			<a class="btn" data-dialog="person_sch" data-num="'+i+'"><i class="ri-search-line"></i></a>');
					wle.push('		</div>');
					wle.push('	<td><input type="datetime-local" name="wk_start[]" value="'+datetime_local(worker[i].wk_start)+'"></td>');
					wle.push('	<td><input type="datetime-local" name="wk_end[]" value="'+datetime_local(worker[i].wk_end)+'"></td>');
					wle.push('	<td><input type="text" name="wk_content[]" value="'+worker[i].wk_content+'"></td>');
					wle.push('	<td><input type="text" name="wk_note[]" value="'+worker[i].wk_note+'"></td>');
					wle.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					wle.push('</tr>');
				}
				if (i == 0) wle.push('<tr class="empty"><td colspan="11">조회된 데이터가 없습니다.</td></tr>');
				$('.tbl_work tbody').html(wle.join(''));

				var ile = new Array();
				for(var j=0; j < instruct.length; j++){
					ile.push('<tr>');
					ile.push('	<td>');
					ile.push('		<input type="hidden" name="ct_seq[]" value="'+instruct[j].ct_seq+'">');
					ile.push('		<input type="text" name="ct_phone[]" value="'+instruct[j].ct_phone+'">');
					ile.push('	</td>');
					ile.push('	<td><input type="datetime-local" id="meeting-time" name="ct_date[]" value="'+datetime_local(instruct[j].ct_date)+'"></td>');
					ile.push('	<td>');
					ile.push('		<div class="sch_inp">');
					ile.push('			<input type="hidden" name="per_seq2[]" value="'+instruct[j].per_seq+'" >');
					ile.push('			<input type="text" name="per_seq2_name[]" placeholder="검색하기" value="'+instruct[j].per_seq2_name+'">');
					ile.push('			<a class="btn" data-dialog="person_sch" data-num="'+j+'"><i class="ri-search-line"></i></a>');
					ile.push('		</div>');
					ile.push('	</td>');
					ile.push('	<td><input type="text" name="ct_content[]" value="'+instruct[j].ct_content+'"></td>');
					ile.push('	<td><input type="text" name="ct_result[]" value="'+instruct[j].ct_result+'"></td>');
					ile.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					ile.push('</tr>');
				}
				if (j == 0) ile.push('<tr class="empty"><td colspan="6">조회된 데이터가 없습니다.</td></tr>');
				$('.tbl_instruct tbody').html(ile.join(''));

				var rle = new Array();
				for(var k=0; k < report.length; k++){
					rle.push('<tr>');
					rle.push('	<td>');
					rle.push('		<input type="hidden" name="rp_seq[]" value="'+report[k].rp_seq+'">');
					rle.push('		<input type="datetime-local" id="meeting-time" name="rp_hour[]" value="'+datetime_local(report[k].rp_hour)+'">');
					rle.push('	</td>');
					rle.push('	<td><input type="text" name="rp_content[]" value="'+report[k].rp_content+'"></td>');
					rle.push('	<td><input type="text" name="rp_caller[]" value="'+report[k].rp_caller+'"></td>');
					rle.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					rle.push('</tr>');
				}
				if (k == 0) rle.push('<tr class="empty"><td colspan="4">조회된 데이터가 없습니다.</td></tr>');
				$('.tbl_report tbody').html(rle.join(''));

			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
				
			}
			

		}
	});

}

function save(){
	pop_confirm('저장하시겠습니까?', function(){
		$('[name=breakdown_shift_detail]').ajaxSubmit({
			url: contextPath + '/breakdown/shift/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			success: function(data){
				if(data.code == 1) {
					pop_alert('저장 되었습니다.');
					list();
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패하였습니다.');
				}
			},
			error: function(data, status, err) {
				pop_alert('저장에 실패하였습니다.');
			},
			complete: function(){
				//이미지초기화
				$('.img_view, .file_del').remove();
				$('[name=shift_search]')[0].reset();
			}
		});

	
	});
}

function report(seq){
	$.ajax({
		url: contextPath + '/breakdown/shift/report',
		type: 'post',
		dataType: 'json',
		data: {seq : seq},
		success: function(data) {
			if (data.code == 1){
				var list	= data.result;
				var contact = data.result2; 
				var total	= data.result3;
				var total2	= data.result4;
				var report	= data.result5;

				var ele		= new Array();
				var cle		= new Array();
				var tle1	= new Array();
				var tle2	= new Array();
				var rle		= new Array();


				for(var i=0; i < list.length; i++){
					ele.push('<tr>');
					ele.push('	<td>'+list[i].wk_place+'</td>');
					ele.push('	<td>'+list[i].wk_team+'</td>');
					ele.push('	<td>'+list[i].wk_rank+'</td>');
					ele.push('	<td>'+list[i].per_name+'</td>');
					ele.push('	<td>'+length14(list[i].wk_start, '-', ':', 4)+' - '+length14(list[i].wk_end, '-', ':', 4)+'</td>');
					ele.push('	<td>'+list[i].wk_content+'</td>');
					ele.push('	<td>'+list[i].wk_note+'</td>');
					ele.push('</tr>');
				}

				$('[name=breakdown_shift_report] .list tbody').html(ele.join(''));
				
				for(var i = 0; i < contact.length; i++){
					cle.push('<tr>');
					cle.push('	<td>'+contact[i].ct_phone+'</td>');
					cle.push('	<td>'+length8(contact[i].ct_date, '-', 1)+'</td>');
					cle.push('	<td>'+contact[i].per_name+'</td>');
					cle.push('	<td>'+contact[i].ct_content+'</td>');
					cle.push('	<td>'+contact[i].ct_result+'</td>');
					cle.push('</tr>');
				}
				$('[name=breakdown_shift_report] .contact .rowspan').attr('rowspan', contact.length + 1);
				$('[name=breakdown_shift_report] .contact tbody tr').not(':first').remove();
				$('[name=breakdown_shift_report] .contact tbody').append(cle.join(''));

				
				var value1 = 0, value2 = 0, value3 = 0;
				var sub1_1 = 0, sub1_2= 0, sub2_1 = 0, sub2_2= 0, sub3_1 = 0, sub3_2= 0, sub4_1 = 0, sub4_2= 0;

				for(var i=0; i < total.length; i++){
					value1 += total[i].value1; //계(발생)
					value2 += total[i].value2; //계(처리)

					if (total[i].division == 1){//영업시스템
						sub1_1 += total[i].value3;
						sub1_2 += total[i].value3;
					}

					if (total[i].division == 2){//ITS
						sub2_1 += total[i].value3;
						sub2_2 += total[i].value3;
					}
					
					if (total[i].division == 3){//제한차량/면탈
						sub3_1 += total[i].value3;
						sub3_2 += total[i].value3;
					}

					if (total[i].division == 4){//기타
						sub4_1 += total[i].value3;
						sub4_2 += total[i].value3;
					}

					value3 += total[i].value5;
				}
				
				$('[name=breakdown_shift_report] .total_one td').eq(1).text(value1);//계(발생)
				$('[name=breakdown_shift_report] .total_one td').eq(2).text(value2);//계(처리)
				$('[name=breakdown_shift_report] .total_one td').eq(3).text(sub1_1);
				$('[name=breakdown_shift_report] .total_one td').eq(4).text(sub1_2);
				$('[name=breakdown_shift_report] .total_one td').eq(5).text(sub2_1);
				$('[name=breakdown_shift_report] .total_one td').eq(6).text(sub1_2);
				$('[name=breakdown_shift_report] .total_one td').eq(7).text(sub3_1);
				$('[name=breakdown_shift_report] .total_one td').eq(8).text(sub3_2);
				$('[name=breakdown_shift_report] .total_one td').eq(9).text(sub4_1);
				$('[name=breakdown_shift_report] .total_one td').eq(10).text(sub4_2);
				$('[name=breakdown_shift_report] .total_one td').last().text(value3);//미조치

				for(var i=0; i < total2.length; i++){
					tle2.push('<tr>');
					tle2.push('	<td>'+total2[i].brc_name+'</td>');
					tle2.push('	<td>'+total2[i].value1+'</td>');
					tle2.push('	<td>'+total2[i].value2+'</td>');

					if (total2[i].division == 1){
						tle2.push('	<td>'+total2[i].value3+'</td>');
						tle2.push('	<td>'+total2[i].value4+'</td>');
					} else {
						tle2.push('	<td></td>');
						tle2.push('	<td></td>');
					}

					if(total2[i].division == 2){
						tle2.push('	<td>'+total2[i].value3+'</td>');
						tle2.push('	<td>'+total2[i].value4+'</td>');
					} else {
						tle2.push('	<td></td>');
						tle2.push('	<td></td>');
					}
					
					if(total2[i].division == 3){
						tle2.push('	<td>'+total2[i].value3+'</td>');
						tle2.push('	<td>'+total2[i].value4+'</td>');
					} else {
						tle2.push('	<td></td>');
						tle2.push('	<td></td>');
					}
					
					if (total2[i].division == 4){
						tle2.push('	<td>'+total2[i].value3+'</td>');
						tle2.push('	<td>'+total2[i].value4+'</td>');
					} else {
						tle2.push('	<td></td>');
						tle2.push('	<td></td>');
					}

					tle2.push('	<td>'+total2[i].value5+'</td>');
					tle2.push('</tr>');
				}
				
				$('.total tbody tr').not(':first').remove();
				$('.total tbody').append(tle2.join(''));
				
				for(var i=0; i < report.length; i++){
					rle.push('<tr>');
					rle.push('	<td>'+length14(report[i].rp_hour, '-', ':', 1)+'</td>');
					rle.push('	<td>'+report[i].rp_content+'</td>');
					rle.push('	<td>'+report[i].rp_caller+'</td>');
					rle.push('</tr>');
				}

				
				$('[name=breakdown_shift_report] .report .rowspan').attr('rowspan', report.length + 1);
				$('[name=breakdown_shift_report] .report tbody tr').not(':first').remove();
				$('[name=breakdown_shift_report] .report tbody').append(rle.join(''));

				$('[name=breakdown_shift_report] .title .date-txt').text(data.date);
				$('[name=breakdown_shift_report] .txt-foot strong').text(data.group+'장');
				
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
		}
	});
}


function add_list(target, type){
	item_type_list();

	target.find('tr.empty').remove();
	var length = target.find('tbody tr').length;
	var ele = new Array();

	if (type == 1){
		ele.push('<tr>');
		ele.push('	<td><input type="hidden" name="wk_seq[]" value=""></td>');
		ele.push('	<td><select name="wt_seq[]" required></select></td>');
		ele.push('	<td><input type="text" name="wk_place[]" placeholder="입력하세요" required></td>');
		ele.push('	<td><input type="text" name="wk_team[]" placeholder="입력하세요" required></td>');
		ele.push('	<td><input type="text" name="wk_rank[]" placeholder="입력하세요" required></td>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="per_seq[]" value="" required>');
		ele.push('			<input type="text" name="per_name[]" placeholder="검색하세요" readonly>');
		ele.push('			<a class="btn" data-dialog="person_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('	<td><input type="datetime-local" name="wk_start[]" placeholder="입력하세요" required></td>');
		ele.push('	<td><input type="datetime-local" name="wk_end[]" placeholder="입력하세요" required></td>');
		ele.push('	<td><input type="text" name="wk_content[]" placeholder="입력하세요"></td>');
		ele.push('	<td><input type="text" name="wk_note[]" placeholder="입력하세요"></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');

	} else if (type == 2){
		ele.push('<tr>');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="ct_seq[]" value="" placeholder="입력하세요">');
		ele.push('		<input type="text" name="ct_phone[]" placeholder="입력하세요">');
		ele.push('	</td>');
		ele.push('	<td><input type="datetime-local" id="meeting-time" name="ct_date[]" placeholder="입력하세요"></td>');
		ele.push('	<td>');
		ele.push('		<div class="sch_inp">');
		ele.push('			<input type="hidden" name="per_seq2[]" value="" placeholder="입력하세요">');
		ele.push('			<input type="text" name="per_seq2_name[]" placeholder="검색하세요" readonly>');
		ele.push('			<a class="btn" data-dialog="person_sch" data-num="'+length+'"><i class="ri-search-line"></i></a>');
		ele.push('		</div>');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="ct_content[]" placeholder="입력하세요"></td>');
		ele.push('	<td><input type="text" name="ct_result[]" placeholder="입력하세요"></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn">-</a></td>');
		ele.push('</tr>');
	} else {
		ele.push('<tr>');
		ele.push('	<td>');
		ele.push('		<input type="hidden" name="rp_seq[]" value="" placeholder="입력하세요">');
		ele.push('		<input type="datetime-local" id="meeting-time" name="rp_hour[]" value="" placeholder="입력하세요">');
		ele.push('	</td>');
		ele.push('	<td><input type="text" name="rp_content[]" placeholder="입력하세요"></td>');
		ele.push('	<td><input type="text" name="rp_caller[]" placeholder="입력하세요"></td>');
		ele.push('	<td class="tb_btn"><a class="btn del_btn" data-num="'+length+'">-</a></td>');
		ele.push('</tr>');
	}

	target.find('tbody').append(ele.join(''));
}