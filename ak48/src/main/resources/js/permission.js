$(document).ready(function(){
	auth_list();
	$('.txt a').click(function () {              
		if($(this).hasClass('hide')){
			$(this).removeClass('hide');
		} else {
			$(this).addClass('hide');
		}
	});


});

$(document).on('click', '.permission [name="auth_list"] .btn_area .btn', function(){
	auth_update();
});


function auth_update(){
	//checkbox 체크안된값은 받을수가 없음
	var data = new Array();
	$('.permission [name="auth_list"] tbody tr td:not(:first-child)').css('background', 'gray');
	$('.permission [name="auth_list"] tbody tr td:not(:first-child)').each(function(){
		data.push({ name: 'seq[]', value: $(this).find('[name="seq[]"]').val() });
		data.push({ name: 'ag_seq[]', value: $(this).find('[name="ag_seq[]"]').val() });
		data.push({ name: 'mn_seq[]', value: $(this).find('[name="mn_seq[]"]').val() });
		if($(this).find('[name="all_read[]"]:checked').val() ) data.push({ name: 'all_read[]', value: '1' });
		else data.push({ name: 'all_read[]', value: '2' });
		
		if($(this).find('[name="all_edit[]"]:checked').val() ) data.push({ name: 'all_edit[]', value: '1' });
		else data.push({ name: 'all_edit[]', value: '2' });
		
		if($(this).find('[name="org_read[]"]:checked').val() ) data.push({ name: 'org_read[]', value: '1' });
		else data.push({ name: 'org_read[]', value: '2' });
		
		if($(this).find('[name="org_edit[]"]:checked').val() ) data.push({ name: 'org_edit[]', value: '1' });
		else data.push({ name: 'org_edit[]', value: '2' });
		
		if($(this).find('[name="my_read[]"]:checked').val() ) data.push({ name: 'my_read[]', value: '1' });
		else data.push({ name: 'my_read[]', value: '2' });
		
		if($(this).find('[name="my_create[]"]:checked').val() ) data.push({ name: 'my_create[]', value: '1' });
		else data.push({ name: 'my_create[]', value: '2' });
		
		if($(this).find('[name="my_edit[]"]:checked').val() ) data.push({ name: 'my_edit[]', value: '1' });
		else data.push({ name: 'my_edit[]', value: '2' });
		
		if($(this).find('[name="auth_use[]"]:checked').val() ) data.push({ name: 'auth_use[]', value: '1' });
		else data.push({ name: 'auth_use[]', value: '2' });
	});
	
	$.ajax({
		url: contextPath + '/auth/edit',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			if(data.code == 1) {
				pop_alert('저장되었습니다.');
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {pop_alert('저장에 실패 하였습니다');}
		},complete: function(){
			auth_list();
		}
	});
}
//권한 표시
function auth_list(){
	loader();
	var html = new Array();
	var html2 = new Array();

	$.ajax({
		url: contextPath + '/auth/list',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			close_loader();
			if (data.code == 1){
				for(var i=0;i<data.result.length;i++) {
					if((i > 0 && data.result[i].mn_code != data.result[(i-1)].mn_code) || i == 0) {
						if(data.result[i].mn_code == data.result[i].mn_pcode) html.push('<tr class="board">');//1depth
						else html.push('	<tr class="board_sub sub">');//2depth
					}
					//3나누기 1남을때?
					if(i % 3 == 0) {
						if(data.result[i].mn_code == data.result[i].mn_pcode) {
							//1depth
							html.push('	<td class="mu_depth1">');
						} else {
							//2depth
							html.push('	<td class="mu_depth2">');
						}
						//seq	int[]	권한 시퀀스
						//ag_seq	int[]	권한 조직 시퀀스
						//mn_seq	int[]	메뉴 시퀀스
						//all_read	int[]	전체 조회
						//all_edit	int[]	전체 편집
						//org_read	int[]	조직 조회
						//org_edit	int[]	조직 편집
						//my_read	int[]	내 조회
						//my_create	int[]	내 생성
						//my_edit	int[]	내 편집
						//auth_use	int[]	메뉴 사용여부
						html.push('		<span></span>'+data.result[i].mn_name);
						html.push('	</td>');
					}
					html.push('	<td>');
					html.push('		<input type="hidden" name="seq[]" value="'+data.result[i].seq+'">');
					html.push('		<input type="hidden" name="ag_seq[]" value="'+data.result[i].ag_seq+'">');
					html.push('		<input type="hidden" name="mn_seq[]" value="'+data.result[i].mn_seq+'">');
					html.push('		<div>');
					html.push('			<ul>');

					html.push('				<li>');
					html.push('					<div class="txt">');
					html.push('						<input type="checkbox" name="auth_use[]" value="1" id="auth_use'+data.result[i].seq+'"');
					if(data.result[i].auth_use == 1) html.push(' checked');
					html.push('>					<label for="auth_use'+data.result[i].seq+'">메뉴 숨기기</label></div>');
					html.push('					<div class="chk">');
					html.push('						<div>조회</div>');
					html.push('						<div>생성</div>');
					html.push('						<div>편집</div>');
					html.push('					</div>');
					html.push('				</li>');


					html.push('				<li>');
					html.push('					<div class="txt">전체 게시물</div>');
					html.push('					<div class="chk">');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="all_read[]" value="1" id="board_admin1_'+data.result[i].seq+'"');
					if(data.result[i].all_read == 1) html.push(' checked');
					html.push('>							<label for="board_admin1_'+data.result[i].seq+'"><span></span></label>');
					html.push('						</div>');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="all_edit[]" value="1" id="board_admin2_'+data.result[i].seq+'"');
					if(data.result[i].all_edit == 1) html.push(' checked');
					html.push('>							<label for="board_admin2_'+data.result[i].seq+'"><span></span></label>');
					html.push('						</div>');
					html.push('					</div>');
					html.push('				</li>');
					html.push('				<li>');
					html.push('					<div class="txt">조직 게시물</div>');
					html.push('					<div class="chk">');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="org_read[]" value="1" id="board_admin3_'+data.result[i].seq+'" ');
					if(data.result[i].org_read == 1) html.push(' checked');
					html.push('>							<label for="board_admin3_'+data.result[i].seq+'"><span></span></label>');
					html.push('						</div>');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="org_edit[]" value="1" id="board_admin4_'+data.result[i].seq+'"');
					if(data.result[i].org_edit == 1) html.push(' checked');
					html.push('>							<label for="board_admin4_'+data.result[i].seq+'"><span></span></label>');
					html.push('						</div>');
					html.push('					</div>');
					html.push('				</li>');
					html.push('				<li>');
					html.push('					<div class="txt">내 게시물</div>');
					html.push('					<div class="chk">');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="my_read[]" value="1" id="board_admin5_'+data.result[i].seq+'"');
					if(data.result[i].my_read == 1) html.push(' checked');
					html.push('>							<label for="board_admin5_'+data.result[i].seq+'""><span></span></label>');
					html.push('						</div>');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="my_create[]" value="1" id="board_admin6_'+data.result[i].seq+'""');
					if(data.result[i].my_create == 1) html.push(' checked');
					html.push('>							<label for="board_admin6_'+data.result[i].seq+'""><span></span></label>');
					html.push('						</div>');
					html.push('						<div class="checkbox">');
					html.push('							<input type="checkbox" name="my_edit[]" value="1" id="board_admin7_'+data.result[i].seq+'""');
					if(data.result[i].my_edit == 1) html.push(' checked');
					html.push('>							<label for="board_admin7_'+data.result[i].seq+'""><span></span></label>');
					html.push('						</div>');
					html.push('					</div>');
					html.push('				</li>');
					html.push('			</ul>');
					html.push('		</div>');
					html.push('	</td>');
					
					if((i< data.result.length - 1 && data.result[i].mn_code != data.result[(i+1)].mn_code) || i == (data.result.length - 1)) html.push('</tr>');
				}
			} else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패하였습니다.');
			}

		}, complete: function(){
			$('.permission table tbody').html( html.join('') );
		}
	});
}