var no = location.search.split('no=');
var seq = parseInt(no[1]); // 시퀀스

$(document).ready(function(){
    // 신규등록, 기존 정보 열람&수정 구분
    

    change_form(seq);
   
});

 // 클릭 묶음
$(document).click('.tb_1 tbody tr', function(e){
	 var ts = $(this).attr('tr_seq');

	// 하단 입력창 추가
	if(e.target.className == 'btn add_btn'){
		ts++;
		add_row(ts);
	}

	// 하단 입력창 삭제
	if(e.target.className == 'del_btn'){
		ts--;
		var row = $(e.target).closest('tr').attr('data-row');
		$('.tb_1 tr[data-row="'+row+'"]').remove();
	}

	// 게시글(일지) 삭제
	if($(e.target).attr('del_seq') || $(e.target).parent().attr('del_seq')){
		pop_confirm('삭제 하시겠습니까?', function(){
			delette(seq);
		});
		
	}
	// 수정 & 등록 & 필수값 입력 알림
	if(e.target.className == 'btn save'){
		if(!$('.iess').val()){
			pop_alert('필수 입력 정보를 확인하세요.');
			return false;
		} else {
			var txt = '';
			seq != '' ? txt = '수정' : txt = '저장';

			pop_confirm(''+txt+' 하시겠습니까?', function(){
				edit();
			});
		}
	}
});

$(document).change('input[name="rc_amount"], input[name="rc_price"]', function(){

	var rc_amount	= $('[name="rc_amount"]').val();
	var rc_price	= $('[name="rc_price"]').val();

	if(rc_amount == '' || rc_price == '') return false;

	rc_amount.indexOf(',')	!= -1 ? rc_amount = rc_amount.replaceAll(',', '') : rc_amount = rc_amount;
	rc_price.indexOf(',')	!= -1 ? rc_price = rc_price.replaceAll(',', '') : rc_price = rc_price;

	$('[name="rc_refuel"]').val(number_format(Number(rc_amount) / Number(rc_price)));
});

 // 자동입력 묶음
$(document).change('input', function(e){
	var ts = $(this).closest('tr').attr('tr_seq');
	e.preventDefault();
	var arr = new Array();

	//운행후 자동입력2
	if(e.target.name == 'rc_drive'){
		if($('[name="rc_drive"]').val() && $('[name="rc_before"]').val()){
			$('[name="rc_after"]').val($('[name="rc_drive"]').val() + $('[name="rc_before"]').val());
		} 
	}

	/* 주유리터
	var rc_amount	= Number($('[name="rc_amount"]').val().replace(',', ''));
	var rc_price	= Number($('[name="rc_price"]').val().replace(',', ''));
	if(e.target.name == 'rc_price'){
		if($('[name="rc_amount"]').val() && $('[name="rc_price"]').val()){
		//$('[name="rc_refuel"]').val(($('[name="rc_amount"]').val() / $('[name="rc_price"]').val()).toFixed(1));
		$('[name="rc_refuel"]').val(number_format(rc_amount / rc_price.toFixed(1)));
	}
		} else if (e.target.name == 'rc_amount'){if($('[name="rc_amount"]').val() && $('[name="rc_price"]').val()){
			//$('[name="rc_refuel"]').val(($('[name="rc_amount"]').val() / $('[name="rc_price"]').val()).toFixed(1));
			$('[name="rc_refuel"]').val(number_format(rc_amount / rc_price.toFixed(1)));
		}
	}
	*/

	// 경유지
	if(e.target.name == 'rh_depart[]'){
		if($(e.target).parent().parent().attr('tr_seq', 1)){
			arr.push($(e.target).val());
			$('[name="rc_area"]').val(arr.join(', '));
		}
	}
	if(e.target.name == 'rh_arrival[]'){
		if($('[name="rh_depart[]"]').val()){
			arr.push($('[name="rh_depart[]"]').val());
			for(var i=1; i<= ts; i++){
				arr.push($('tr[tr_seq="'+i+'"] [name="rh_arrival[]"]').val());
			}
			$('[name="rc_area"]').val(arr.join(', '));
		}
		//출발지(자동)
		for(var i=1; i<ts; i++){
			var j = i+1;
			
			var fin = $('tr[tr_seq="'+i+'"] [name="rh_arrival[]"]');
			var str = $('tr[tr_seq="'+j+'"] [name="rh_depart[]"]');
			$(str).val($(fin).val());
		}
	}

	// 주행거리
	if(e.target.name == 'rh_distance[]'){
		var val = $('[name="rc_drive"]');
		var dist = $('[name="rh_distance[]"]');
		for(var i=0; i<dist.length; i++){
			var n = parseInt(dist[i].value);
			arr.push(n);
			var re = arr.reduce((sum, currValue) => {
				return sum + currValue;
			});
			val.val(re);
		}
		var before = $('[name="rc_before"]');
		var after = $('[name="rc_after"]');
		if(before.val() && val.val()){
			var bef = parseInt(before.val());
			var dri = parseInt(val.val());
			after.val(bef + dri) ;
		}
	}

	// 가동시간
	if(e.target.name == 'rh_minute[]'){
		var val = $('[name="rc_operate"]');
		var min = $('[name="rh_minute[]"]');
		for(var i=0; i<min.length; i++){
			var n = parseInt(min[i].value);
			arr.push(n);
			var re = arr.reduce((sum, currValue) => {
				return sum + currValue;
			});
			val.val(re);
		}
	}

	// 통행료
	if(e.target.name == 'rh_pass[]'){
		var val = $('[name="rc_pass"]');
		var toll = $('[name="rh_pass[]"]');
		for(var i=0; i<toll.length; i++){
			var n = parseInt(toll[i].value);
			arr.push(n);
			var re = arr.reduce((sum, currValue) => {
				return sum + currValue;
			});
			val.val(re);
		}
	}

	// 주차비
	if(e.target.name == 'rh_park[]'){
		var val = $('[name="rc_park"]');
		var park = $('[name="rh_park[]"]');
		for(var i=0; i<park.length; i++){
			var n = parseInt(park[i].value);
			arr.push(n);
			var re = arr.reduce((sum, currValue) => {
				return sum + currValue;
			});
			val.val(re);
		}
	}
});
// 운행전 (외부 팝업에서 불러오는 값이라 따로 뺌)
$(document).on('click', '#car_sch .table.tb_scroll tbody > tr', function(){
	//console.log($('#car_sch table tbody tr [name="ve_drive"]'))
	$('[name="rc_before"]').val($('#car_sch table tbody tr [name="ve_drive"]').val());
	if($('#car_sch table tbody tr [name="ve_drive"]').val('')){
		$('[name="rc_before"]').val(0);
	}
	// 운행후 자동입력
	if($('[name="rc_drive"]').val() && $('[name="rc_before"]').val()){
		$('[name="rc_after"]').val($('[name="rc_drive"]').val() + $('[name="rc_before"]').val());
	}
});

///////////////////////////////////////////////////////////////////////////////////////

// 신규등록, 기존 정보 열람&수정 구분
function change_form(seq){ 
    // 하단 입력창 초기화
    var tr = $('.tb_1 tbody tr');
    for(var i=tr.length; i>0; i--){
        if(tr.length > 0){ 
            var j=i-1;
            tr[j].remove();
        }
    }
    // 파일 이미지 초기화
    var del = $('.file_del');
    if(del){
        del.prev().remove();
        del.remove();
    }
    if(seq > 0){
        // 기존 정보 열람(수정)
        detail(seq);
        // 시퀀스란에 시퀀스 입력
        $('[name="seq"]').val(seq);
        // 입력자란 비우기
        $('[name="per_seq"]').val('');
        $('[name="per_name"]').val('');
        // 상단 문구 + 뒤로가기 버튼
        $('.top_area').html(`<div class="top_tit">
            <p>운행일지 > <span>일지 상세보기</span></p>
            </div>
            <a class="btn gray back" href="`+contextPath+`/drive_report">
            <i class="ri-arrow-go-back-line"></i> 
            </a>`);

        // 하단 버튼 변경
        $('[name="car_detail"] .btn_area').html(`<button class="btn save"><i class="ri-check-line"></i>저장</button>
            <a class="btn del" data-dialog="delete_pop"><i class="ri-delete-bin-line"></i>삭제</a>`);
        
        // 삭제 기능 활성화(삭제 시퀀스 생성 및 '삭제 하시겠습니까?' 팝업 '예' 버튼에 부여)
        $('#delete_pop .point').attr('del_seq', seq);
    } else {
        // 신규 정보 등록
        add_row(1);
    }
}

// 하단 입력창 추가
function add_row(ts){
	$('.tb_1 tbody tr.empty').remove();
	var row	= $('.tb_1').find('tr').length / 8;
    var tb = $('.tb_1 tbody');

    if(ts == 1){
        $(tb).append(`<tr data-row="`+row+`" tr_seq="`+ts+`">
            <th>출발지</th>
            <td>
                <input type="text" name="rh_depart[]" placeholder="입력하세요.">
            </td>
			<td rowspan="8"><a class="del_btn">-</a></td>
		</tr>
		<tr data-row="`+row+`">
            <th>도착지</th>
            <td>
                <input type="text" name="rh_arrival[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>거리</th>
            <td>
                <input type="text" name="rh_distance[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>시간(분)</th>
            <td>
                <input type="text" name="rh_minute[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>통행료</th>
            <td>
                <input type="text" name="rh_pass[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>주차비</th>
            <td>
                <input type="text" name="rh_park[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>윤전자</th>
            <td>
                <input type="text" name="rh_driver[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>비고</th>
            <td>
                <input type="text" name="rh_note[]" placeholder="입력하세요.">
            </td>
        </tr>`);
    } else {
        $(tb).append(`<tr data-row="`+row+`" tr_seq="`+ts+`">
            <th>출발지</th>
            <td>
                <input type="text" name="rh_depart[]" placeholder="자동입력" readonly>
            </td>
			<td rowspan="8"><a class="del_btn">-</a></td>
		</tr>
		<tr data-row="`+row+`">
            <th>도착지</th>
            <td>
                <input type="text" name="rh_arrival[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>거리</th>
            <td>
                <input type="text" name="rh_distance[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>시간(분)</th>
            <td>
                <input type="text" name="rh_minute[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>통행료</th>
            <td>
                <input type="text" name="rh_pass[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>주차비</th>
            <td>
                <input type="text" name="rh_park[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>윤전자</th>
            <td>
                <input type="text" name="rh_driver[]" placeholder="입력하세요.">
            </td>
		</tr>
		<tr data-row="`+row+`">
            <th>비고</th>
            <td>
                <input type="text" name="rh_note[]" placeholder="입력하세요.">
            </td>
        </tr>`);

        // 출발지 자동입력(클릭)
        for(var i=1; i<ts; i++){
            var j = i+1;
            
            var fin = $('tr[tr_seq="'+i+'"] [name="rh_arrival[]"]');
            var str = $('tr[tr_seq="'+j+'"] [name="rh_depart[]"]');
            $(str).val($(fin).val());
        }
    }
}

// 상세보기
function detail(seq){
    $.ajax({
        type: 'post',
        url: contextPath + '/car/detail',
        data: {seq: seq},
        dataType: 'json',
        success: function(data){
            $('[name="seq"]').val(seq);

            $('[name="f_seq[]"]').val('');
            $('[name="f_del[]"]').val('1');
            
            if(data.code == 1 && data.result.length > 0){
                var dt = data.result[0];

                // 날짜는 따로('-'때문에)
                if(dt.rc_date){
                    dtr = dt.rc_date.toString();
                    rd = dtr.replace(/(\d{4})(\d{2})(\d{2})(\d{6})/g, '$1-$2-$3');
                }
				 $('[name="rc_date"]').val(rd);
                // 상단 입력 부분 (~'고장부품'까지)
                $('[name="ve_seq"]').val(dt.ve_seq);
                $('[name="ve_number"]').val(dt.ve_number);
                $('[name="per_seq"]').val(dt.per_seq);
                $('[name="per_name"]').val(dt.per_name);
                $('[name="rc_drive"]').val(dt.rc_drive);
                $('[name="rc_before"]').val(dt.rc_before);
                $('[name="rc_after"]').val(dt.rc_after);
                $('[name="rc_operate"]').val(dt.rc_operate);
                $('[name="rc_area"]').val(dt.rc_area);
                $('[name="rc_pass"]').val(dt.rc_pass);
                $('[name="rc_park"]').val(dt.rc_park);
                $('[name="rc_refuel"]').val(dt.rc_refuel);
                $('[name="rc_amount"]').val(dt.rc_amount);
                $('[name="rc_price"]').val(dt.rc_price);
                $('[name="rc_handle"] option[value="'+dt.rc_handle+'"]').prop('selected', true);
                $('[name="rc_trouble"]').val(dt.rc_trouble);
                $('[name="rc_part"]').val(dt.rc_part);

                // 파일 부분 (data.result3)
                if(data.result3.length > 0){
                    for(var i=0;i<data.result3.length;i++) {
                        //이미지업로드
                        if(data.result3[i].f_repath && data.result3[i].f_resize) {
                            var html3 = new Array();
                            $('#f_seq'+(i+1)).next().next().next().val(data.result3[i].f_seq);
                            $('#f_seq'+(i+1)).next().next().next().next().val(1);
                            html3.push('<a class="img_view" href="'+resourcePath+ data.result3[i].f_path+data.result3[i].f_original+' target="_blank">');
                            html3.push('<img src="'+resourcePath+ data.result3[i].f_repath+data.result3[i].f_resize+'"/></a>');
                            html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');
    
                            $('#f_seq'+(i+1)).parent().append( html3.join('') );
                        }
                    }

                }

                // 하단 입력 부분 ('출발지' ~ '비고' 까지)
                var rh = new Array();
				for(var i = 0; i < data.result2.length; i++){
					var dt2 = data.result2[i];
					rh.push(`<tr tr_seq="`+(i+1)+`">
						<th>출발지</th>
						<td>
							<input type="hidden" name="rh_seq[]" value="`+dt2.rh_seq+`">
							<input type="text" name="rh_depart[]" value="`+dt2.rh_depart+`">
						</td>
						<th rowspan="8"><a class="btn del_btn">-</a></th>
					</tr>
					<tr>
						<th>도착지</th>
						<td>
							<input type="text" name="rh_arrival[]" value="`+dt2.rh_arrival+`">
						</td>
					</tr>
					<tr>
						<th>거리</th>
						<td>
							<input type="text" name="rh_distance[]" value="`+dt2.rh_distance+`">
						</td>
					</tr>
					<tr>
						<th>시간(분)</th>
						<td>
							<input type="text" name="rh_minute[]" value="`+dt2.rh_minute+`">
						</td>
					</tr>
					<tr>
						<th>통행료</th>
						<td>
							<input type="text" name="rh_pass[]" value="`+dt2.rh_pass+`">
						</td>
					</tr>
					<tr>
						<th>주차비</th>
						<td>
							<input type="text" name="rh_park[]" value="`+dt2.rh_park+`">
						</td>
					</tr>
					<tr>
						<th>윤전자</th>
						<td>
							<input type="text" name="rh_driver[]" value="`+dt2.rh_driver+`">
						</td>
					</tr>
					<tr>
						<th>비고</th>
						<td>
							<input type="text" name="rh_note[]" value="`+dt2.rh_note+`">
						</td>
					</tr>`);
				}

				if (i == 0) rh.push('<tr class="empty"><td colspan="3">조회할 데이터가 없습니다.</td></tr>');
				document.querySelector('.tb_1 tbody').innerHTML = rh.join('');
                

            } else {
                alert('게시글 데이터가 존재하지 않습니다.')
            }
        }
    });
}

// 추가 & 수정
function edit() {
    $('[name="car_detail"]').ajaxSubmit({ 
        url: contextPath + '/car/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			beforeSubmit: function(data) {
				data = commatoint(data);
			},
			success: function(data){
                var seq = document.querySelector('[name="car_detail"] [name="seq"]').value;
				var txt = '';
					seq != '' ? txt = '수정' : txt = '저장';
				if(data.code == 1) {
					pop_alert(txt+' 되었습니다.');

					setTimeout(function(){
						location.href = '/DBCS/drive_report';
					}, 1000);

				} else {
					pop_alert(txt+'에 실패하였습니다.');
				}
			},
			error: function(data, status, err) {
				alert('데이터 로드에 실패하였습니다');
			}, complete: function(){
               
			}
    });
}


// 삭제
function delette(seq){
    $.ajax({
        type: 'post',
        url: contextPath + '/car/delete',
        data: {seq: seq},
        dataType: 'json',
        success: function(data){
            if(data.code == 1){
                pop_alert('삭제 되었습니다.');
				setTimeout(function(){
					location.href = '/DBCS/drive_report';
				}, 1000);
            } else {
                pop_alert('삭제에 실패하였습니다.');
            }
        }, complete: function(){
        }
    });
}