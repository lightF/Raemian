$(document).ready(function(){
	item_grade_list();//직급
	item_position_list();//직위
	item_task_list();//담당업무
	item_job_list(); //직책
	org_list();//사업단명
	item_edu_list();//최종학력

	$('#person_sch [name="user_list"] [name=row][option]').prop('selected', false);
	$('#person_sch [name="user_list"] [name=row]').append('<option value="999999" selected></option>');
	user_list();
	// has_next_dep
	$('.has_next_dep>p').click(function () {
		$(this).parent().toggleClass('on');
	});
	
	$('[name="row"]').change(function(){
		user_list();
	});
	$('[name="jg_seq"] .btn_area .btn, [name="user_list_search"] .sch_btn .btn').click(function(){
		user_list();
	});
	//주소입력
    $('.addr1 input, .addr1 .btn').on('click', function(){ //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function(data) { //선택시 입력값 세팅
				document.querySelector('[name="per_zip"]').value = data.zonecode;
				document.querySelector('[name="per_addr"]').value = data.address;
				document.querySelector('[name="per_detail"]').focus();
            }
        }).open();
    });
});

$(document).on('click', '.btn_search', function(){
	user_list();
});

//중복검사
$(document).on('click', '.test', function(){
	if( $('#user_detail_view [name="seq"]').val() != '')  return false;
	
	if ($('[name=user_detail] [name=per_id]').val() == '') {
		pop_alert('사번을 입력해 주세요'); 
		return false;
	}

	$('#user_detail_view .ipt').removeClass('comp').html('<i class="ri-error-warning-line"></i>중복검사 필요');
	$.ajax({
		url: contextPath + '/user/check',
		type: 'post',
		data: {per_id : $('#user_detail_view [name="per_id"]').val()},
		dataType: 'json',
		success: function(data) {
			if(data.code == 0){
				$('#user_detail_view [name="per_id_chk"]').val(1);
				$('#user_detail_view .ipt').addClass('comp').html('<i class="ri-error-warning-line"></i>사용할수있는 사번입니다.');
				$('#user_detail_view [name=per_pwd]').val($('#user_detail_view [name="per_id"]').val());

			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('이미 등록된 사번입니다.<br/>다시 입력해주세요.');
			}
		}
	})
});


$(document).on('click', '[data-page]', function(){
	$('[name="page"]').val( $(this).data('page'));
	user_list();
});
$(document).on('click', '[data-dialog="user_detail_view"]', function () {
	$('#user_detail_view .btn_area a').hide();

	if(!$(this).find('[name="seq"]').val()){
		$('#user_detail_view input').val('');
		$('#user_detail_view select option').prop('selected', false);
		$('#user_detail_view .photo_img .img_view, #user_detail_view .photo_img .file_del').remove();
		$('#user_detail_view .table:not(:last) tbody tr').remove();
		
		$('#user_detail_view .ipt, #user_detail_view .ess_pwd').show();
		$('#user_detail_view [name=per_id]').attr('readonly', false);
		$('#user_detail_view [name=per_pwd]').attr({'required' : false, 'placeholder' : '입력하세요'});
		$('#user_detail_view .btn_area .close').show();
	} else {
		user_detail($(this).find('[name="seq"]').val());

		$('#user_detail_view .ipt, #user_detail_view .ess_pwd').hide();
		$('#user_detail_view [name=per_id]').attr('readonly', true);
		$('#user_detail_view [name=per_pwd]').attr({'required' : false, 'placeholder': '*****'});
		$('#user_detail_view .xlsx, #user_detail_view .btn_remove').show();
	}
});


//수임자 팝업
$(document).on('click', '#user_detail_view [data-dialog="person_sch"]', function(){
	//작성자, 수임자 구분필요
	if( $(this).prev().attr('name') == 've_delegate') {//수임자
		$('#person_sch .top.comm > p > span').text('수임자 선택');
	} else {
		$('#person_sch .top.comm > p > span').text('작성자 선택');
	}
});
//정렬팝업, 최상위 div .cont의 개별 class 변경하여 사용바람
$(document).on('click', '.cont.employee table thead th[data-order]', function(){
	user_list();//리스트 재호출
});

//엑셀다운
$(document).on('click', '[name=user_detail] .btn.xlsx ', function() {
	var seq = $('[name=user_detail] [name=seq]').val();
	window.location.href = contextPath +'/user/detail/excel?seq='+seq;
});

//저장하시겠습니까? : 예
$(document).on('click', '[name="user_detail"] .btn_area .btn.point', function(e){
	var chk = 0;
	$('[name="user_detail"] input, [name="user_detail"] select, [name="user_detail"] textarea').each(function(){
		var required = $(this);
		if (required.prop('required') && $(this).val() == ''){
			chk++;
		}
	});

	if (chk > 0){
		pop_alert('필수 입력 정보를 확인하세요.');
		return false;
	}

	user_edit();
});

//게시물삭제
//$(document).on('click', '#delete_pop .btn_area [data-dialog="del_chk_pop"]', function(){
$(document).on('click', '[name=user_detail] .btn_remove', function(){
	pop_confirm('삭제 하시겠습니까?', function(){
		$.ajax({
			url: contextPath + '/user/delete',
			type: 'post',
			data: { seq: $('[name="user_detail"] [name="seq"]').val() },
			dataType: 'json',
			success: function(data) {
				if(data.code == 1) {
					pop_alert('삭제 되었습니다.');
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('삭제에 실패하였습니다.');
				}
			}, complete: function(){
				user_list();
			}
		});
	
	});
	
});

//학력사항
$(document).on('click', '.emp_info > div:nth-child(2) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="sc_seq[]">');
	html.push('	<td><input type="date" name="sc_enter[]"></td>');
	html.push('	<td><input type="date" name="sc_finish[]"></td>');
	html.push('	<td><input type="text" name="sc_name[]" placeholder="입력하세요."></td>');
	html.push('	<td><input type="text" name="sc_major[]" placeholder="입력하세요."></td>');
	html.push('	<td>');
	html.push('		<select name="sc_relation[]" >');
	html.push('			<option value="">선택</option>');
	html.push('			<option value="1">유</option>');
	html.push('			<option value="2">무</option>');
	/*
	for(var j=0;j<task_name.length;j++) {
		if(task_name[j]) html.push('<option value="'+j+'">'+task_name[j]+'</option>');					
	}
	*/
	html.push('		</select>');
	html.push('	</td>');
	html.push('	<td>');
	html.push('		<select name="fe_seq[]">');
	html.push('			<option value="">선택</option>');
	for(var j=0;j<edu_name.length;j++) {
		if(edu_name[j]) html.push('<option value="'+j+'">'+edu_name[j]+'</option>');					
	}
	html.push('		</select>');
	html.push('	</td>');
	html.push('	<td class="tb_btn">');
	html.push('		<a class="btn del_btn">-</a>');
	html.push('	</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(2) tbody').append( html.join('') );
});


//교육이력
$(document).on('click', '.emp_info > div:nth-child(3) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="ed_seq[]">');
	html.push('<td><input type="date" name="ed_finish[]"></td>');
	html.push('<td><input type="date" name="ed_expire[]"></td>');
	html.push('<td><input type="text" name="ed_organ[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="ed_process[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="ed_edu[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="ed_score[]" class="input_number" placeholder="입력하세요."></td>');
	html.push('<td class="tb_btn">');
	html.push('	<a class="btn del_btn">-</a>');
	html.push('</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(3) tbody').append( html.join('') );
});

//자격면허
$(document).on('click', '.emp_info > div:nth-child(4) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="l_seq[]">');
	html.push('<td><input type="date" name="l_finish[]"></td>');
	html.push('<td><input type="date" name="l_expire[]"></td>');
	html.push('<td><input type="text" name="l_organ[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="l_name[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="l_grade[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="l_num[]" placeholder="입력하세요."></td>');
	html.push('<td class="tb_btn">');
	html.push('<a class="btn del_btn">-</a>');
	html.push('</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(4) tbody').append( html.join('') );
});

//타사이력
$(document).on('click', '.emp_info > div:nth-child(5) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="oc_seq[]">');
	html.push('<td><input type="date" name="oc_join[]"></td>');
	html.push('<td><input type="date" name="oc_resign[]"></td>');
	html.push('<td class="x2"><input type="text" name="oc_name[]" placeholder="입력하세요."></td>');
	html.push('<td class="x2"><input type="text" name="oc_note[]" placeholder="입력하세요."></td>');
	html.push('<td class="tb_btn">');
	html.push('<a class="btn del_btn">-</a>');
	html.push('</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(5) tbody').append( html.join('') );
});

//프로젝트
$(document).on('click', '.emp_info > div:nth-child(7) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="proj_seq[]">');
	html.push('<td><input type="date" name="proj_start[]"></td>');
	html.push('<td><input type="date" name="proj_end[]"></td>');
	html.push('<td><input type="text" name="proj_place[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="proj_name[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="proj_part[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="proj_position[]" placeholder="입력하세요."></td>');
	html.push('<td class="tb_btn">');
	html.push('<a class="btn del_btn">-</a>');
	html.push('</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(7) tbody').append( html.join('') );
});

//경력수첩
$(document).on('click', '.emp_info > div:nth-child(8) .add_btn', function(){
	var cp_name = ['선택','한국정보통신공사협회', '한국엔지니어링진흥협','한국전력기술인협회','한국건설기술인협회','한국소방안전협회','한국전기공사협회','한국정보통신기술협회','한국전력공사협회','한국소프트웨어산업협회', '한국소방시설협회'];
	var html = new Array();

	html.push('<tr>');
	html.push('<input type="hidden" name="lv_seq[]">');//seq
	html.push('<td><input type="text" name="per_seq[]" placeholder="입력하세요."></td>');//회원 seq
	html.push('<td><select name="lv_cp[]">');//발급기관
	
	for(var j=0; j <cp_name.length; j++){
		html.push('	<option value="'+j+'">'+cp_name[j]+'</option>');
	}
	
	html.push('</select></td>');
	html.push('<td><input type="text" name="lv_no[]" value="" placeholder="입력하세요."></td>');//발급번호
	html.push('<td><select name="lv_level[]">');//경력등급
	html.push('	<option value="">선택</option>');
	html.push('	<option value="1">초급</option>');
	html.push('	<option value="2">중급</option>');
	html.push('	<option value="3">고급</option>');
	html.push('	<option value="4">특급</option>');
	html.push('	<option value="5">기능계</option>');
	html.push('</select></td>');
	html.push('<td><input type="date" name="lv_date[]" value="" ></td>');//발급일자
	html.push('<td><select name="lv_standard[]">');//발급기준
	html.push('	<option value="0">선택</option>');
	html.push('	<option value="1">학력</option>');
	html.push('	<option value="2">경력</option>');
	html.push('	<option value="3">자격</option>');
	html.push('	<option value="4">학력/경력</option>');
	html.push('	<option value="5">자격/경력</option>');
	html.push('</select></td>');
	html.push('<td><input type="date" name="update_date[]" value=""></td>');//수정일
	html.push('<td class="tb_btn"><a class="btn del_btn">-</a></td>');


	html.push('</tr>');
	
	$('.emp_info > div:nth-child(8) tbody').append( html.join('') );
});

//발주처경력
$(document).on('click', '.emp_info > div:nth-child(9) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="po_seq[]">');
	html.push('<td><input type="date" name="po_start[]"></td>');
	html.push('<td><input type="date" name="po_end[]"></td>');
	html.push('<td><input type="text" name="po_place[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="po_manage[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="po_part[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="po_system[]" placeholder="입력하세요."></td>');
	html.push('<td class="tb_btn">');
	html.push('<a class="btn del_btn">-</a>');
	html.push('</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(9) tbody').append( html.join('') );
});

//협회경력
$(document).on('click', '.emp_info > div:nth-child(10) .add_btn', function(){
	var html = new Array();
	html.push('<tr>');
	html.push('<input type="hidden" name="soc_seq[]">');
	html.push('<td><input type="date" name="soc_start[]" ></td>');
	html.push('<td><input type="date" name="soc_end[]"></td>');
	html.push('<td><input type="text" name="soc_place[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="soc_manage[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="soc_part[]" placeholder="입력하세요."></td>');
	html.push('<td><input type="text" name="soc_system[]" placeholder="입력하세요."></td>');
	html.push('<td class="tb_btn">');
	html.push('<a class="btn del_btn">-</a>');
	html.push('</td>');
	html.push('</tr>');
	$('.emp_info > div:nth-child(10) tbody').append( html.join('') );
});

//행삭제
$(document).on('click', '.emp_info .del_btn', function(){
	$(this).closest('tr').remove();
});

function user_edit(){
	pop_confirm('저장 하시겠습니까?', function(){
		$('[name="user_detail"]').ajaxSubmit({
			url: contextPath + '/user/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			success: function(data){
				if(data.code == 1) {
					pop_alert('저장 되었습니다.');
				} else if (data.code == 3){
					pop_alert('권한이 없습니다.');
				} else {
					pop_alert('저장에 실패 하였습니다.');
				}
			},
			error: function(data, status, err) {
				pop_alert('데이터 로드에 실패하였습니다.');
			}, complete: function(){
				$('#save_chk_pop').addClass('dialog_open');
				//이미지초기화
				$('.img_view, .file_del').remove();
				$('[name=user_list_search]')[0].reset();
				user_list();
			}
		});
	
	});
		
}
//팝업
function user_detail( seq ){
	if(!seq) {
		$('#user_detail_view [name="user_detail"]')[0].reset();//신규작성시 초기화
		return false;
	}

	$.ajax({
		url: contextPath + '/user/detail',
		type: 'post',
		data: { seq: seq },
		dataType: 'json',
		success: function(data) {
			if (data.code == 1){
				$('#user_detail_view [name="f_seq[]"]').val('');
				$('#user_detail_view [name="f_del[]"]').val('1');
				if(data.result.length > 0){
					$('[name="user_detail"] [name="seq"]').val( data.result[0].seq );
					$('[name="user_detail"] [name="per_name"]').val( data.result[0].per_name );
					$('[name="user_detail"] [name="per_ename"]').val( data.result[0].per_ename );
					$('[name="user_detail"] [name="per_birth"]').val( date2( data.result[0].per_birth ) );
					$('[name="user_detail"] [name="per_cname"]').val( data.result[0].per_cname );
					$('[name="user_detail"] [name="per_organize"]').val( data.result[0].per_organize );
					$('[name="user_detail"] [name="per_organize_tmp"]').val( org_name[ data.result[0].per_organize ] );
					$('[name="user_detail"] [name="per_area"]').val( data.result[0].per_area );
					$('[name="user_detail"] [name="per_team"]').val( data.result[0].per_team );
					$('[name="user_detail"] [name="per_team_tmp"]').val( org_name[ data.result[0].per_team ] );
					$('[name="user_detail"] [name="at_seq"]').val( data.result[0].at_seq );
					$('[name="user_detail"] [name="per_place"]').val( data.result[0].per_place );
					$('[name="user_detail"] [name="jg_seq"] [value="'+ data.result[0].jg_seq +'"]').prop('selected', true);
					$('[name="user_detail"] [name="per_id"]').val( data.result[0].per_id );
					$('[name="user_detail"] [name="pos_seq"] [value="'+ data.result[0].pos_seq +'"]').prop('selected', true);
					$('[name="user_detail"] [name="per_email"]').val( data.result[0].per_email );
					$('[name="user_detail"] [name="j_seq"] [value="'+ data.result[0].j_seq +'"]').prop('selected', true);

					$('[name="user_detail"] [name="per_type"] [value="'+ data.result[0].per_type +'"]').prop('selected', true);
					$('[name="user_detail"] [name="per_zip"]').val( data.result[0].per_zip );
					$('[name="user_detail"] [name="per_addr"]').val( data.result[0].per_addr );
					$('[name="user_detail"] [name="per_detail"]').val( data.result[0].per_detail );
					$('[name="user_detail"] [name="per_home"]').val( data.result[0].per_home );
					$('[name="user_detail"] [name="per_mobile"]').val( data.result[0].per_mobile );
					$('[name="user_detail"] [name="per_office"]').val( data.result[0].per_office );
					$('[name="user_detail"] [name="per_join"]').val( date2( data.result[0].per_join) );
					$('[name="user_detail"] [name="per_promote"]').val( date2( data.result[0].per_promote) );
					$('[name="user_detail"] [name="per_resign"]').val( date2( data.result[0].per_resign) );
					
					$('[name=user_detail] .img_view, [name=user_detail] .file_del').remove();
					if (data.result[0].f_seq){
						var html3 = new Array();
						html3.push('<a class="img_view" href="'+resourcePath+ data.result[0].f_path+data.result[0].f_unique+'" target="_blank">');
						html3.push('<img src="'+resourcePath+ data.result[0].f_repath+data.result[0].f_resize+'"/></a>');
						html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');

						$('[name=user_detail] #f_seq1').parent().append( html3.join('') );
					} 
					
				} 
				
				//학력사항
				$('.emp_info > div:nth-child(2) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result2.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="sc_seq[]" value="'+data.result2[i].sc_seq+'">');
					html.push('	<td><input type="date" name="sc_enter[]" value="'+date2(data.result2[i].sc_enter)+'" title="'+date2(data.result2[i].sc_enter)+'"></td>');
					html.push('	<td><input type="date" name="sc_finish[]" value="'+date2(data.result2[i].sc_finish)+'" title="'+date2(data.result2[i].sc_finish)+'"></td>');
					html.push('	<td><input type="text" name="sc_name[]"  value="'+data.result2[i].sc_name+'" title="'+data.result2[i].sc_name+'"></td>');
					html.push('	<td><input type="text" name="sc_major[]"  value="'+data.result2[i].sc_major+'" title="'+data.result2[i].sc_major+'"></td>');
					html.push('	<td>');
					html.push('		<select name="sc_relation[]" >');
					html.push('			<option value="">선택</option>');
					html.push('			<option value="1" '+(data.result2[i].sc_relation == 1 ? 'selected' : '')+'>유</option>');
					html.push('			<option value="2" '+(data.result2[i].sc_relation == 2 ? 'selected' : '')+'>무</option>');
					/*
					for(var j=0;j<task_name.length;j++) {
						if(task_name[j]) {
							if(j == data.result2[i].sc_relation) html.push('<option value="'+j+'" selected>'+task_name[j]+'</option>');					
							else html.push('<option value="'+j+'">'+task_name[j]+'</option>');					
						}
					}
					*/
					html.push('		</select>');
					html.push('	</td>');
					html.push('	<td>');
					html.push('		<select name="fe_seq[]">');
					html.push('			<option value="">선택</option>');
					for(var j=0;j<edu_name.length;j++) {
						if(edu_name[j]) {
							if(j == data.result2[i].fe_seq) html.push('<option value="'+j+'" selected>'+edu_name[j]+'</option>');					
							else html.push('<option value="'+j+'">'+edu_name[j]+'</option>');					
						}
					}
					html.push('		</select>');
					html.push('	</td>');
					html.push('	<td class="tb_btn">');
					html.push('		<a class="btn del_btn">-</a>');
					html.push('	</td>');
					html.push('</tr>');
				}

				$('.emp_info > div:nth-child(2) tbody').html( html.join('') );

				//학력사항
				$('.emp_info > div:nth-child(3) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result3.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="ed_seq[]" value="'+data.result3[i].ed_seq+'">');
					html.push('<td><input type="date" name="ed_finish[]" value="'+date2(data.result3[i].ed_finish)+'"></td>');
					html.push('<td><input type="date" name="ed_expire[]" value="'+date2(data.result3[i].ed_expire)+'"></td>');
					html.push('<td><input type="text" name="ed_organ[]" value="'+data.result3[i].ed_organ+'" title="'+data.result3[i].ed_organ+'"></td>');
					html.push('<td><input type="text" name="ed_process[]" value="'+data.result3[i].ed_process+'" title="'+data.result3[i].ed_process+'"></td>');
					html.push('<td><input type="text" name="ed_edu[]" value="'+data.result3[i].ed_edu+'" title="'+data.result3[i].ed_edu+'"></td>');
					html.push('<td><input type="text" name="ed_score[]" class="input_number" value="'+data.result3[i].ed_score+'" title="'+data.result3[i].ed_score+'"></td>');
					html.push('<td class="tb_btn">');
					html.push('	<a class="btn del_btn">-</a>');
					html.push('</td>');
					html.push('</tr>');
				}

				$('.emp_info > div:nth-child(3) tbody').html( html.join('') );

				//자격면허
				$('.emp_info > div:nth-child(4) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result4.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="l_seq[]" value="'+data.result4[i].l_seq+'">');
					html.push('<td><input type="date" name="l_finish[]" value="'+date2(data.result4[i].l_finish)+'"></td>');
					html.push('<td><input type="date" name="l_expire[]" value="'+date2(data.result4[i].l_expire)+'"></td>');
					html.push('<td><input type="text" name="l_organ[]" value="'+data.result4[i].l_organ+'" title="'+data.result4[i].l_organ+'."></td>');
					html.push('<td><input type="text" name="l_name[]" value="'+data.result4[i].l_name+'" title="'+data.result4[i].l_name+'."></td>');
					html.push('<td><input type="text" name="l_grade[]" value="'+data.result4[i].l_grade+'" title="'+data.result4[i].l_grade+'"></td>');
					html.push('<td><input type="text" name="l_num[]" value="'+data.result4[i].l_num+'" title="'+data.result4[i].l_num+'"></td>');
					html.push('<td class="tb_btn">');
					html.push('<a class="btn del_btn">-</a>');
					html.push('</td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(4) tbody').append( html.join('') );

				//타사이력
				$('.emp_info > div:nth-child(5) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result5.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="oc_seq[]" value="'+data.result5[i].oc_seq+'">');
					html.push('<td><input type="date" name="oc_join[]" value="'+date2(data.result5[i].oc_join)+'"></td>');
					html.push('<td><input type="date" name="oc_resign[]" value="'+date2(data.result5[i].oc_resign)+'" title="'+date2(data.result5[i].oc_resign)+'"></td>');
					html.push('<td class="x2"><input type="text" name="oc_name[]" value="'+data.result5[i].oc_name+'" title="'+data.result5[i].oc_name+'"></td>');
					html.push('<td class="x2"><input type="text" name="oc_note[]"  value="'+data.result5[i].oc_note+'" title="'+data.result5[i].oc_note+'"></td>');
					html.push('<td class="tb_btn">');
					html.push('<a class="btn del_btn">-</a>');
					html.push('</td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(5) tbody').append( html.join('') );

				//자사이력
				$('.emp_info > div:nth-child(6) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result6.length;i++){
					html.push('<tr>');
					html.push('<td title="'+date2(data.result6[i].c_appoint)+'">'+date2(data.result6[i].c_appoint)+'</td>');
					html.push('<td title="'+date2(data.result6[i].c_finish)+'">'+date2(data.result6[i].c_finish)+'</td>');
					html.push('<td title="'+data.result6[i].c_place+'">'+data.result6[i].c_place+'</td>');
					html.push('<td title="'+data.result6[i].c_team+'">'+data.result6[i].c_team+'</td>');
					html.push('<td title="'+data.result6[i].c_part+'">'+data.result6[i].c_part+'</td>');
					html.push('<td title="'+data.result6[i].c_position+'">'+data.result6[i].c_position+'</td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(6) tbody').append( html.join('') );

				//프로젝트
				$('.emp_info > div:nth-child(7) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result7.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="proj_seq[]" value="'+data.result7[i].proj_seq+'">');
					html.push('<td><input type="date" name="proj_start[]" value="'+date2(data.result7[i].proj_start)+'"></td>');
					html.push('<td><input type="date" name="proj_end[]" value="'+date2(data.result7[i].proj_end)+'"></td>');
					html.push('<td><input type="text" name="proj_place[]" value="'+data.result7[i].proj_place+'" title="'+data.result7[i].proj_place+'"></td>');
					html.push('<td><input type="text" name="proj_name[]" value="'+data.result7[i].proj_name+'" title="'+data.result7[i].proj_name+'"></td>');
					html.push('<td><input type="text" name="proj_part[]" value="'+data.result7[i].proj_part+'" title="'+data.result7[i].proj_part+'"></td>');
					html.push('<td><input type="text" name="proj_position[]"  value="'+data.result7[i].proj_position+'" title="'+data.result7[i].proj_position+'"></td>');
					html.push('<td class="tb_btn">');
					html.push('<a class="btn del_btn">-</a>');
					html.push('</td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(7) tbody').append( html.join('') );

				//경력수첩
				$('.emp_info > div:nth-child(8) tbody').html( '' );
				var html = new Array();
				var cp_name = ['선택','한국정보통신공사협회', '한국엔지니어링진흥협','한국전력기술인협회','한국건설기술인협회','한국소방안전협회','한국전기공사협회','한국정보통신기술협회','한국전력공사협회','한국소프트웨어산업협회', '한국소방시설협회'];
				for(var i=0; i<data.result11.length; i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="lv_seq[]" value="'+data.result11[i].lv_seq+'">');//seq
					html.push('<td><input type="text" name="per_seq[]" value="'+data.result11[i].per_seq+'" placeholder="입력하세요."></td>');//회원 seq
					html.push('<td><select name="lv_cp[]">');//발급기관
					
					for(var j=0; j <cp_name.length; j++){
						html.push('	<option value="'+j+'">'+cp_name[j]+'</option>');
					}
					
					html.push('</select></td>');
					html.push('<td><input type="text" name="lv_no[]" value="" title="'+data.result11[i].lv_no+'" placeholder="입력하세요."></td>');//발급번호
					html.push('<td><select name="lv_level[]">');//경력등급
					html.push('	<option value="">선택</option>');
					html.push('	<option value="1">초급</option>');
					html.push('	<option value="2">중급</option>');
					html.push('	<option value="3">고급</option>');
					html.push('	<option value="4">특급</option>');
					html.push('	<option value="5">기능계</option>');
					html.push('</select></td>');
					html.push('<td><input type="date" name="lv_date[]" value="" title="'+data.result11[i].update_date+'"></td>');//발급일자
					html.push('<td><select name="lv_standard[]">');//발급기준
					html.push('	<option value="0">선택</option>');
					html.push('	<option value="1">학력</option>');
					html.push('	<option value="2">경력</option>');
					html.push('	<option value="3">자격</option>');
					html.push('	<option value="4">학력/경력</option>');
					html.push('	<option value="5">자격/경력</option>');
					html.push('</select></td>');
					html.push('<td><input type="date" name="update_date[]" value="" title="'+data.result11[i].update_date+'"></td>');//수정일
					html.push('<td class="tb_btn"><a class="btn del_btn">-</a></td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(8) tbody').append( html.join('') );

			
				//발주처경력
				$('.emp_info > div:nth-child(9) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result8.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="po_seq[]" value="'+data.result8[i].po_seq+'">');
					html.push('<td><input type="date" name="po_start[]" value="'+date2(data.result8[i].po_start)+'"></td>');
					html.push('<td><input type="date" name="po_end[]" value="'+date2(data.result8[i].po_end)+'"></td>');
					html.push('<td><input type="text" name="po_place[]" value="'+data.result8[i].po_place+'" title="'+data.result8[i].po_place+'"></td>');
					html.push('<td><input type="text" name="po_manage[]" value="'+data.result8[i].po_manage+'" title="'+data.result8[i].po_manage+'"></td>');
					html.push('<td><input type="text" name="po_part[]" value="'+data.result8[i].po_part+'" title="'+data.result8[i].po_part+'"></td>');
					html.push('<td><input type="text" name="po_system[]" value="'+data.result8[i].po_system+'" title="'+data.result8[i].po_system+'"></td>');
					html.push('<td class="tb_btn">');
					html.push('<a class="btn del_btn">-</a>');
					html.push('</td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(9) tbody').append( html.join('') );

				//협회경력
				$('.emp_info > div:nth-child(10) tbody').html( '' );
				var html = new Array();
				for(var i=0;i<data.result9.length;i++){
					html.push('<tr>');
					html.push('<input type="hidden" name="soc_seq[]" value="'+data.result9[i].soc_seq+'">');
					html.push('<td><input type="date" name="soc_start[]" value="'+date2(data.result9[i].soc_start)+'" ></td>');
					html.push('<td><input type="date" name="soc_end[]" value="'+date2(data.result9[i].soc_end)+'"></td>');
					html.push('<td><input type="text" name="soc_place[]" value="'+data.result9[i].soc_place+'" title="'+data.result9[i].soc_place+'"></td>');
					html.push('<td><input type="text" name="soc_manage[]" value="'+data.result9[i].soc_manage+'" title="'+data.result9[i].soc_manage+'"></td>');
					html.push('<td><input type="text" name="soc_part[]" value="'+data.result9[i].soc_part+'" title="'+data.result9[i].soc_part+'"></td>');
					html.push('<td><input type="text" name="soc_system[]" value="'+data.result9[i].soc_system+'" title="'+data.result9[i].soc_system+'"></td>');
					html.push('<td class="tb_btn">');
					html.push('<a class="btn del_btn">-</a>');
					html.push('</td>');
					html.push('</tr>');
				}
				$('.emp_info > div:nth-child(10) tbody').append( html.join('') );
				$('.emp_info > div:nth-child(11) [name="car_model"]').val( data.result10[0].car_model );
				$('.emp_info > div:nth-child(11) [name="car_number"]').val( data.result10[0].car_number );
				$('.emp_info > div:nth-child(11) [name="car_name"]').val( data.result10[0].car_name );
				$('.emp_info > div:nth-child(11) [name="per_status"] [value="'+data.result10[0].per_status +'"]').prop('selected', true);
				$('.emp_info > div:nth-child(11) [name="ag_seq"] [value="'+data.result10[0].ag_seq +'"]').prop('selected', true);
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}
	});
}

function user_list(){
	loader();
	var html = new Array();
	var data = new Array();
	var data2 = $('[name="user_list_search"]').serializeArray();

	data2.push({ 'name' : 'row', 'value' : $('.employee [name="row"] option:selected').val()});

	//빈값 제거
	for(var i=0;i<data2.length;i++) {
		if(data2[i].value != '') data.push(data2[i]);
	}
	$('.employee .tb tbody').html('');
	$.ajax({
		url: contextPath + '/user/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			close_loader();
			if (data.code == 1){
				for(var i=0;i<data.result.length;i++){
					html.push('<tr data-dialog="user_detail_view"><input type="hidden" name="seq" value="'+data.result[i].seq+'">');
					html.push('	<td>'+data.result[i].per_id+'</td>');
					html.push('	<td>'+data.result[i].per_name+'</td>');
					html.push('	<td>'+data.result[i].per_organize+'</td>');
					html.push('	<td>'+data.result[i].per_team+'</td>');
					html.push('	<td>');
					if(data.result[i].at_seq) html.push(task_name[ data.result[i].at_seq ]);
					html.push('</td>');
					html.push('	<td>');
					if(data.result[i].pos_seq) html.push(position_name[ data.result[i].pos_seq ]);
					html.push('</td>');
					html.push('	<td>');
					if(data.result[i].jg_seq) html.push(grade_name[ data.result[i].jg_seq ]);
					html.push('</td>');
					html.push('</tr>');
				}
				if( i == 0) html.push('<tr><td colspan="7">조회된 데이터가 없습니다.</td></tr>');
				paging(data.total, 20, $('[name="page"]').val() );
				$('.employee .count span').text( number_format(data.total) );
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}
		}, complete: function(){
			$('.employee .tb tbody').html( html.join('') );
		}
	});

}



