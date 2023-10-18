var p_seq = '<%=(String)session.getAttribute("per_seq")%>';

//리스트엑셀다운
$(document).on('click', '.drive_report .list_xlsx ', function() {
	var row = $('[name=row] option:selected').val();
	var page = $('[name=sch_form] [name=page]').val();
	console.log(contextPath +'/car/list/excel?row='+row+'&page='+page);
	window.location.href = contextPath +'/car/list/excel?row='+row+'&page='+page;
});


//팝업 엑셀다운
$(document).on('click', '[name=add_form] .btn.xlsx', function() {
	var seq = $('[name=add_form] [name=seq]').val();
	console.log(contextPath +'/car/detail/excel?seq='+seq);
	window.location.href = contextPath +'/car/detail/excel?seq='+seq;
});

$(document).on('click', '[name="car_report_form"] .btn.search_btn', function() {
	if($('[name="car_report_form"] [name="ve_seq"]').val() == '') {
		pop_alert('차량번호를 입력해주세요');
		return false;
	}

	car_report();
});

document.addEventListener('DOMContentLoaded', function () {
	$('[name="car_report_form"] [name="date"]').val( dayjs().format('YYYY-MM-DD') );
    document.addEventListener('click', function (e) {
       // console.log(e.target)
    });
    
    // 운행일지 리스트
    list();

    // 운행일지 리스트 검색
    document.querySelector('[name="sch_form"]').onsubmit = function(){
        event.preventDefault();
        list();
    };

    // 로우 변경
	document.querySelector('[name="row"]').addEventListener('change', function () {
        document.querySelector('[name="page"]').value = 1;
        list();
    });


    // 클릭 모음
    var rs = document.querySelector('.under_tb [name="soonbun"]').value;
    document.addEventListener('click', function (e){
        
        if(e.target.className == 'btn edit_btn' || e.target.parentNode.className == 'btn edit_btn'){
            // 필수값 미입력시 알림
            var iess = document.querySelectorAll('.iess');
			var chk = '';
            for(var i=0; i<iess.length; i++){
                if(document.querySelectorAll('.iess')[i].value == ''){
					chk++;
                }
			}
			if (chk > 0){
				pop_alert('필수 입력 정보를 확인하세요.');
				return false;
			}

			var seq = document.querySelector('[name="add_form"] [name="seq"]').value;
			if(!seq){ 
				pop_confirm('등록 하시겠습니까?'); 
			} else {
				pop_confirm('수정 하시겠습니까?');
			}
              

            // 등록, 수정 구분
        }
        // 삭제, 등록, 수정 하시겠습니까? :예
        if(e.target.className == 'btn point btn_ok' || e.target.parentNode.className =='btn point btn_ok'){
            if(e.target.className == 'btn point btn_ok'){
                var txt = e.target.parentNode.parentNode.querySelector('p').innerText;
            } else if(e.target.parentNode.className =='btn point btn_ok'){
                var txt = e.target.parentNode.parentNode.parentNode.querySelector('p').innerText;
            }

            if(txt == '등록 하시겠습니까?'){
                edit(); 
            } else if(txt == '수정 하시겠습니까?'){
                edit();
            } else {
                var del = document.querySelector('.del_ok');
                del.previousSibling.previousSibling.previousSibling.value = 2;
                del.previousSibling.remove();
                del.remove();
            }
        }

        // 일지(게시글) 삭제
        if(e.target.getAttribute('data-delseq')){
            delette(e.target.getAttribute('data-delseq'));
        }

        //정렬
        if(e.target.getAttribute('data-order')){
            list();
        } 

        // 상단 작성 버튼 클릭시
        if(e.target.className == 'btn sky'){
            reset_form();
            rs=1;

            var seq = document.querySelector('[name="add_form"] [name="seq"]');
            // 초기화
            $('[name="add_form"]')[0].reset();
            seq.value = ''
        }

        // '취소'버튼 누르면 창 닫기
        if(e.target.className == 'btn close' || e.target.parentNode.className == 'btn close'){
            var closest = document.querySelector('#drive_repo');
            closest.querySelector('.close').click();
        }

        // 하단 리스트에서 클릭시
        if(e.target.getAttribute('data-seq') || e.target.parentNode.getAttribute('data-seq')){
            change_form();
            var del = document.querySelector('#delete_pop .btn_area .point');
            if(e.target.getAttribute('data-seq')){
                detail(e.target.getAttribute('data-seq'));
                del.setAttribute('data-delseq', e.target.getAttribute('data-seq'))
            } else if(e.target.parentNode.getAttribute('data-seq')){
                detail(e.target.parentNode.getAttribute('data-seq'));
                del.setAttribute('data-delseq', e.target.parentNode.getAttribute('data-seq'))
            }
        }
        // 페이지 이동
        if(e.target.getAttribute('data-page')){
            var cur = document.querySelector('.page-item.active');
            cur.classList.remove('active');
            e.target.parentNode.classList.add('active');
            document.querySelector('[name="page"]').value = e.target.getAttribute('data-page');
            list();
        }
        // 하단 입력창 추가
        if(e.target.className == 'btn add_btn'){
            rs++;
            add_row(rs);
            str_fin(rs);
        }
        // 하단 입력창 삭제 
        if(e.target.className == 'btn del_btn'){
            if(e.target.parentNode.parentNode.getAttribute('tr_seq') == 1){
                alert('1번 행은 삭제할 수 없습니다.');
            } else {
                rs--;
                e.target.parentNode.parentNode.remove();
            }
        }

    }); 
    // 자동입력들
    document.addEventListener('change', function(e){
        e.preventDefault();
        var arr = new Array();
        
        // 운행후
        var before = document.querySelector('[name="add_form"] [name="rc_before"]');
        var after = document.querySelector('[name="add_form"] [name="rc_after"]');
        var drive = document.querySelector('[name="add_form"] [name="rc_drive"]');
        if(e.target.name == 'rc_before'){if(before.value && drive.value){
            var bef = parseInt(before.value);
            var dri = parseInt(drive.value); 
            after.value = bef + dri ;
        }} else if(e.target.name == 'rc_drive'){if(before.value && drive.value){
            var bef = parseInt(before.value);
            var dri = parseInt(drive.value);
            after.value = bef + dri ;
        }}

        // 주유리터
        var oil = document.querySelector('#oil');
        var oil_all = document.querySelector('#oil_all');
        var oil_l = document.querySelector('#oil_l');
        if(e.target.id == 'oil_l'){if(oil_all.value && oil_l.value){
            var all = parseInt(oil_all.value);
            var lit = parseInt(oil_l.value);
            oil.value = (all/lit).toFixed(1);
        }} else if(e.target.id == 'oil_all'){if(oil_all.value && oil_l.value){
            var all = parseInt(oil_all.value);
            var lit = parseInt(oil_l.value);
            oil.value = (all/lit).toFixed(1);
        }}
        
        // 경유지
        var area = document.querySelector('#area');
        var aarr = new Array();
        var start = document.querySelector('#str1');
        if(e.target.name == 'rh_depart[]'){
            aarr.push(start.value);
            area.value = aarr.join('');
        }
        if(e.target.name == 'rh_arrival[]'){
            if(start.value){
                aarr.push(start.value);
                var arri = document.getElementsByName("rh_arrival[]");
                for(var i=0; i<arri.length; i++){
                    var n = arri[i].value;
                    aarr.push(n);
                }
                area.value = aarr.join(', ');
            }
        }
        
        // 주행거리
        if(e.target.name == 'rh_distance[]'){
            var val = document.querySelector('[name="add_form"] [name="rc_drive"]');
            var dist = document.getElementsByName("rh_distance[]");
            for(var i=0; i<dist.length; i++){
                var n = parseInt(dist[i].value);
                arr.push(n);
                var re = arr.reduce((sum, currValue) => {
                    return sum + currValue;
                });
                val.value = re;
            }
            var before = document.querySelector('[name="add_form"] [name="rc_before"]');
            var after = document.querySelector('[name="add_form"] [name="rc_after"]');
            if(before.value && drive.value){
                var bef = parseInt(before.value);
                var dri = parseInt(val.value);
                after.value = bef + dri ;
            }
        }

        // 가동시간
        if(e.target.name == 'rh_minute[]'){
            var val = document.querySelector('[name="add_form"] [name="rc_operate"]');
            var min = document.getElementsByName("rh_minute[]");
            for(var i=0; i<min.length; i++){
                var n = parseInt(min[i].value);
                arr.push(n);
                var re = arr.reduce((sum, currValue) => {
                    return sum + currValue;
                });
                val.value = re;
            }
        }

        // 통행료
        if(e.target.name == 'rh_pass[]'){
            var val = document.querySelector('[name="add_form"] [name="rc_pass"]');
            var toll = document.getElementsByName("rh_pass[]");
            for(var i=0; i<toll.length; i++){
                var n = parseInt(toll[i].value);
                arr.push(n);
                var re = arr.reduce((sum, currValue) => {
                    return sum + currValue;
                });
                val.value = re;
            }
        }

        // 주차비
        if(e.target.name == 'rh_park[]'){
            var val = document.querySelector('[name="add_form"] [name="rc_park"]');
            var park = document.getElementsByName("rh_park[]");
            for(var i=0; i<park.length; i++){
                var n = parseInt(park[i].value);
                arr.push(n);
                var re = arr.reduce((sum, currValue) => {
                    return sum + currValue;
                });
                val.value = re;
            }
        }
        
    });
    // 운행후
    var before = document.querySelector('[name="add_form"] [name="rc_before"]');
    var after = document.querySelector('[name="add_form"] [name="rc_after"]');
    var drive = document.querySelector('[name="add_form"] [name="rc_drive"]');
    // 운행전
    $(document).on('click', '#car_sch .table.tb_scroll tbody > tr', function(){
        var km = document.querySelector('#car_sch [name="car_vehicle_list"] table tbody tr [name="ve_drive"]').value;
        /*
		before.value = km;
        if(km == ''){
            before.value = 0;
        }
		*/ 

		km != '' ? before.value = km :  before.value = 0;

        if(before.value && drive.value){
            var bef = parseInt(before.value); 
            var dri = parseInt(drive.value);
            after.value = bef + dri ;
        }
    });

});

//////////////////////////////////////////////////////////////////////////////////////////////////

// 출발지 자동입력 (도착지 기재 후 행 추가)
function str_fin(rs){
    for(var i=1; i<rs; i++){
        var j=i+1;
        var str = document.querySelector('#str'+j);
        var fin = document.querySelector('#fin'+i);
        if(fin.value){
            str.value = fin.value;
        } else if(rs>=2) {
            fin.addEventListener('change',function(e){
                e.preventDefault();
                str.value = fin.value;
            })
        }
    }
}
 
// 폼 버전 변경 (상세보기 & 수정)
function change_form(){
    // 상단 텍스트 + 버튼 변경
    document.querySelector('#drive_repo .content .top p span').innerText = '운행일지 상세보기';
    var ba = document.querySelector('#drive_repo .content .body .btn_area');
    
    ba.innerHTML = `<button type="submit" class="btn edit_btn"><i class="ri-check-line"></i>저장</button>
    <a class="btn xlsx sky">Xlsx 다운로드</a>
    <a class="btn del" data-dialog="delete_pop"><i class="ri-delete-bin-line"></i>삭제</a>`;

    // 하단 입력창 초기화
    var tr = document.querySelectorAll('.under_tb tbody tr');
    for(var i=tr.length; i>0; i--){
        if(tr.length > 0){
            var j=i-1;
            tr[j].remove();
        }
    }
    var del = document.querySelector('.file_del');
    if(del){
        del.previousSibling.remove();
        del.remove();
    }
    add_row(1);
}

// 폼 버전 변경 (처음 작성 == 초기화)
function reset_form(){
    // 상단 텍스트 + 버튼 변경
    document.querySelector('#drive_repo .content .top p span').innerText = '운행일지 작성';
    var ba = document.querySelector('#drive_repo .content .body .btn_area');
    
    ba.innerHTML = `<button type="submit" class="btn edit_btn"><i class="ri-check-line"></i>저장</button>
    <a class="btn close"><i class="ri-close-line"></i>취소</a>`;
    
    // 하단 입력창 초기화
    var tr = document.querySelectorAll('.under_tb tbody tr');
    for(var i=tr.length; i>0; i--){
        if(tr.length > 0){
            var j=i-1;
            tr[j].remove();
        }
    }
    var del = document.querySelector('.file_del');
    if(del){
        del.previousSibling.remove();
        del.remove();
    }
    add_row(1);
}

// 하단 입력창 추가
function add_row(rs) {
    var tb = document.querySelector('.under_tb tbody');
    var nr = tb.insertRow();
    
    if(rs == 1){
        nr.innerHTML = `<tr>
    <td><div><input type="text" name="soonbun" value="1" readonly />
    <input type="hidden" name="rh_seq[]" value="" readonly /></div></td>
    <td><div><input type="text" name="rh_depart[]" placeholder="입력하세요." id="str1" /></div></td>
    <td><div><input type="text" name="rh_arrival[]" placeholder="입력하세요." id="fin1" /></div></td>
    <td><div><input type="text" name="rh_distance[]" class="input_number"  placeholder="입력하세요." /></div></td>
    <td><div><input type="text" name="rh_minute[]" class="input_number"  placeholder="입력하세요." /></div></td>
    <td><div><input type="text" name="rh_pass[]" class="input_number" placeholder="입력하세요." /></div></td>
    <td><div><input type="text" name="rh_park[]" class="input_number"  placeholder="입력하세요." /></div></td>
    <td><div><input type="text" name="rh_driver[]" placeholder="입력하세요." /></div></td>
    <td><div><input type="text" name="rh_note[]" placeholder="입력하세요." /></div></td>
    <td class="tb_btn"><a class="btn del_btn">-</a></td></tr>`
    } else {   
        nr.innerHTML = `<tr>
        <td><div><input type="text" name="soonbun" value="` + rs + `" readonly />
        <input type="hidden" name="rh_seq[]" value="" readonly /></div></td>
        <td><div><input type="text" name="rh_depart[]" id="str` + rs + `"readonly /></div></td>
        <td><div><input type="text" name="rh_arrival[]" placeholder="입력하세요." id="fin` + rs + `" /></div></td>
        <td><div><input type="text" name="rh_distance[]" class="input_number" placeholder="입력하세요." /></div></td>
        <td><div><input type="text" name="rh_minute[]" class="input_number" placeholder="입력하세요." /></div></td>
        <td><div><input type="text" name="rh_pass[]" class="input_number" placeholder="입력하세요." /></div></td>
        <td><div><input type="text" name="rh_park[]" class="input_number" placeholder="입력하세요." /></div></td>
        <td><div><input type="text" name="rh_driver[]" placeholder="입력하세요." /></div></td>
        <td><div><input type="text" name="rh_note[]" placeholder="입력하세요." /></div></td>
        <td class="tb_btn"><a class="btn del_btn">-</a></td></tr>`
    }
    
    tb.appendChild(nr);
    document.querySelectorAll('.under_tb tbody tr')[rs-1].setAttribute('tr_seq', rs);
}

//운행일지 추가 & 수정
function edit() {
    // var data = $('form [name = "add_form"]').serializeArray();
    // var data = new FormData();
    // var form = document.querySelector('[name="add_form"]');
    
    // if(form.getAttribute('data-seq')){
    //     data.append('seq', form.getAttribute('data-seq'));
    // } else{
    //     data.append('seq','');
    // }
    // data.append('ve_seq', form.querySelector('[name="ve_seq"]').value);
    // data.append('ve_number', form.querySelector('[name="ve_number"]').value);
    // data.append('per_seq', form.querySelector('[name="per_seq"]').value);
    // data.append('per_name', form.querySelector('[name="per_name"]').value);
    // data.append('rc_date', form.querySelector('[name="rc_date"]').value.replaceAll('-','')+'000000');
    // data.append('rc_drive', form.querySelector('[name="rc_drive"]').value);
    // data.append('rc_before', form.querySelector('[name="rc_before"]').value);
    // data.append('rc_after', form.querySelector('[name="rc_after"]').value);
    // data.append('rc_operate', form.querySelector('[name="rc_operate"]').value);
    // data.append('rc_area', form.querySelector('[name="rc_area"]').value);
    // data.append('rc_pass', form.querySelector('[name="rc_pass"]').value);
    // data.append('rc_park', form.querySelector('[name="rc_park"]').value);
    // data.append('rc_refuel', form.querySelector('[name="rc_refuel"]').value);
    // data.append('rc_amount', form.querySelector('[name="rc_amount"]').value);
    // data.append('rc_price', form.querySelector('[name="rc_price"]').value);
    // data.append('rc_handle', form.querySelector('[name="rc_handle"]').value);
    // data.append('rc_trouble', form.querySelector('[name="rc_trouble"]').value);
    // data.append('rc_part', form.querySelector('[name="rc_part"]').value);
    
    // data.append('f_seq[]', '');
    // data.append('upload[]', form.querySelector('[name="upload[]"]')[0]);

    // var tr = document.querySelectorAll('.under_tb tbody tr');
    // for(var i=0; i<tr.length; i++){
    //     data.append('rh_seq[]', '');
    //     data.append('rh_depart[]', form.querySelectorAll('[name="rh_depart[]"]')[i].value);
    //     data.append('rh_arrival[]', form.querySelectorAll('[name="rh_arrival[]"]')[i].value);
    //     data.append('rh_distance[]', form.querySelectorAll('[name="rh_distance[]"]')[i].value);
    //     data.append('rh_minute[]', form.querySelectorAll('[name="rh_minute[]"]')[i].value);
    //     data.append('rh_pass[]', form.querySelectorAll('[name="rh_pass[]"]')[i].value);
    //     data.append('rh_park[]', form.querySelectorAll('[name="rh_park[]"]')[i].value);
    //     data.append('rh_driver[]', form.querySelectorAll('[name="rh_driver[]"]')[i].value);
    //     data.append('rh_note[]', form.querySelectorAll('[name="rh_note[]"]')[i].value);
    // }
    $('[name="add_form"]').ajaxSubmit({ 
        url: contextPath + '/car/edit',
			type: 'post',
			dataType: 'json',
			enctype : 'multipart/form-data',
			resetForm : true,
			beforeSubmit: function(data) {
				data = commatoint(data);
			},
			success: function(data){
                var seq = document.querySelector('[name="add_form"] [name="seq"]').value;
				if(data.code == 1) {
                    if(seq){
                        pop_alert('수정되었습니다.');
                    } else {
                        pop_alert('등록되었습니다.');
                    }
				} else if(data.code == 3) {
					pop_alert('권한이 없습니다.');
				} else {
                    if(seq){
                        pop_alert('수정에 실패했습니다.');
                    } else {
                        pop_alert('등록에 실패했습니다.');
                    }
				}
			},
			complete: function(){
				$('[name=sch_form]')[0].reset();
                list();
			},
			error: function(data, status, err) {
				pop_alert('저장에 실패하였습니다.');
			} 
    });
}

// 상세보기
function detail(seq){
    $.ajax({
        type: 'post',
        url: contextPath + '/car/detail',
        data: {seq: seq},
        dataType: 'json',
        success: function(data){
			if (data.code == 1){
				document.querySelector('[name="add_form"] [name="seq"]').value = seq;

				document.querySelector('[name="add_form"] [name="f_seq[]"]').value = '';
				document.querySelector('[name="add_form"] [name="f_del[]"]').value = '1';
				if(data.result.length > 0){
					var dt = data.result[0];
					
					document.querySelector('[name="add_form"] [name="ve_seq"]').value = dt.ve_seq;
					document.querySelector('[name="add_form"] [name="ve_number"]').value = dt.ve_number;
					document.querySelector('[name="add_form"] [name="per_seq"]').value = dt.per_seq;
					document.querySelector('[name="add_form"] [name="per_name"]').value = dt.per_name;
					if(dt.rc_date){
						dtr = dt.rc_date.toString();
						rd = dtr.replace(/(\d{4})(\d{2})(\d{2})(\d{6})/g, '$1-$2-$3');
						document.querySelector('[name="add_form"] [name="rc_date"]').value = rd;
					}
					document.querySelector('[name="add_form"] [name="rc_drive"]').value = number_format(dt.rc_drive);
					document.querySelector('[name="add_form"] [name="rc_before"]').value = number_format(dt.rc_before);
					document.querySelector('[name="add_form"] [name="rc_after"]').value = number_format(dt.rc_after);
					document.querySelector('[name="add_form"] [name="rc_operate"]').value = number_format(dt.rc_operate);
					document.querySelector('[name="add_form"] [name="rc_area"]').value = dt.rc_area;
					document.querySelector('[name="add_form"] [name="rc_pass"]').value = number_format(dt.rc_pass);
					document.querySelector('[name="add_form"] [name="rc_park"]').value = number_format(dt.rc_park);
					document.querySelector('[name="add_form"] [name="rc_refuel"]').value = number_format(dt.rc_refuel);
					document.querySelector('[name="add_form"] [name="rc_amount"]').value = number_format(dt.rc_amount);
					document.querySelector('[name="add_form"] [name="rc_price"]').value = number_format(dt.rc_price);
					document.querySelector('[name="add_form"] [name="rc_handle"]').value = dt.rc_handle;
					document.querySelector('[name="add_form"] [name="rc_trouble"]').value = number_format(dt.rc_trouble);
					document.querySelector('[name="add_form"] [name="rc_part"]').value = dt.rc_part;
					

					$('#drive_repo .img_view, #drive_repo .file_del').remove();
					if(data.result3.length > 0){
						for(var i=0;i<data.result3.length;i++) {
							//이미지업로드
							if(data.result3[i].f_repath && data.result3[i].f_resize) {
								var html3 = new Array();
								$('#drive_repo #f_seq'+(i+1)).next().next().next().val(data.result3[i].f_seq);
								$('#drive_repo #f_seq'+(i+1)).next().next().next().next().val(1);
								html3.push('<a class="img_view" href="'+resourcePath+ data.result3[i].f_path+data.result3[i].f_original+' target="_blank">');
								html3.push('<img src="'+resourcePath+ data.result3[i].f_repath+data.result3[i].f_resize+'"/></a>');
								html3.push('<a class="file_del"><i class="ri-close-line"></i></a>');
		
								$('#drive_repo #f_seq'+(i+1)).parent().append( html3.join('') );
							}
						}

					} 
					var dt2 = data.result2;
					var rh = new Array();
					if(dt2.length > 0){
						for(var i = 0; i < dt2.length; i++){
							rh.push(`<tr>
							<td><div><input type="text" name="soonbun" value="` + (i+1) + `" readonly />
							<input type="hidden" name="rh_seq[]" value="` + dt2[i].rh_seq + `" readonly /></div></td>
							<td><div><input type="text" name="rh_depart[]" id="str1" value="`+ dt2[i].rh_depart +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_arrival[]" id="fin1" value="`+ dt2[i].rh_arrival +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_distance[]" class="input_number" value="`+ number_format(dt2[i].rh_distance) +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_minute[]" class="input_number" value="`+ number_format(dt2[i].rh_minute) +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_pass[]" class="input_number"  value="`+ number_format(dt2[i].rh_pass) +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_park[]" class="input_number"  value="`+ number_format(dt2[i].rh_park) +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_driver[]" value="`+ dt2[i].rh_driver +`" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_note[]" value="`+ dt2[i].rh_note +`" placeholder="입력하세요." /></div></td>
							<td class="tb_btn"><a class="btn del_btn">-</a></td></tr>`);
						}
					document.querySelector('.under_tb tbody').innerHTML = rh.join('');
					} else {
						rh.push(`<tr>
							<td><div><input type="text" name="soonbun" value="1" readonly />
							<input type="hidden" name="rh_seq[]" value="" readonly /></div></td>
							<td><div><input type="text" name="rh_depart[]" id="str1" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_arrival[]" id="fin1" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_distance[]" class="input_number" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_minute[]" class="input_number" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_pass[]" class="input_number" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_park[]" class="input_number" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_driver[]" value="" placeholder="입력하세요." /></div></td>
							<td><div><input type="text" name="rh_note[]" value="" placeholder="입력하세요." /></div></td>
							<td class="tb_btn"><a class="btn del_btn">-</a></td></tr>`);
						
						document.querySelector('.under_tb tbody').innerHTML = rh.join('');
					}   
				}else {
					alert('게시글 데이터가 존재하지 않습니다.'); 
					
				}
			} else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
			}
        }, complete: function() {
		}
    });
}

// 삭제
function delette(seq){
    var data = {};
    data.seq = seq;
    $.ajax({
        type: 'post',
        url: contextPath + '/car/delete',
        data: data,
        dataType: 'json',
        success: function(data){
            if(data.code == 1){
                pop_alert('삭제되었습니다.');
            } else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
                pop_alert('삭제에 실패했습니다.');
            }
        }, complete: function(){
            var closest = document.querySelector('#drive_repo');
            closest.querySelector('.close').click();
            list();
        }
    });
}

// 리스트 호출
function list() {
	loader();

	var data = {};

    data.row = document.querySelector('[name="row"]').value;
    data.column = document.querySelector('[name="column"]').value;
    data.order = document.querySelector('[name="order"]').value;
    data.page = document.querySelector('[name="page"]').value;
    if (document.querySelector('[name="start_date"]').value) { data.start_date = document.querySelector('[name="start_date"]').value.replaceAll('-', '') + '000000' }
    if (document.querySelector('[name="end_date"]').value) { data.end_date = document.querySelector('[name="end_date"]').value.replaceAll('-', '') + '235959' }
    if (document.querySelector('[name="group_name"]').value) { data.og_name = document.querySelector('[name="group_name"]').value }
    if (document.querySelector('[name="ve_number"]').value) { data.ve_number = document.querySelector('[name="ve_number"]').value }
    if (document.querySelector('[name="rc_handle"]').value) { data.rc_handle = document.querySelector('[name="rc_handle"]').value }

    var arr = new Array;
    var total = 0;
	$.ajax({
		url: contextPath + '/car/list',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			close_loader();
			if(data.code == 1 ) {
				if (data.result.length > 0){
					for(var i = 0; i < data.result.length; i++) {
						arr.push(`<tr data-dialog="drive_repo" data-seq="` + data.result[i].seq + `"> 
									<td>` + length8(data.result[i].rc_date, '-', 2) + `</td>
									<td>` + number_format(data.result[i].rc_before) + `</td>
									<td>` + number_format(data.result[i].rc_after) + `</td>
									<td>` + data.result[i].group_name + `</td>
									<td>` + data.result[i].team_name + `</td>
									<td>` + data.result[i].ve_number + `</td>
									<td>` + number_format(data.result[i].rc_amount) + `/` + data.result[i].rc_refuel + `</td>
									<td>` + number_format(data.result[i].rc_trouble) + `</td>
									<td>` + number_format(data.result[i].rc_park) + `</td>
									<td>` + number_format(data.result[i].rc_pass) + `</td>

						</tr>`);
					}
					total = data.total;
					document.querySelector('.list_tbody').innerHTML = arr.join('');
				} else {
					document.querySelector('.list_tbody').innerHTML = '<tr class="empty"> <td colspan="8">등록된 데이터가 없습니다.</td> </tr>';
				}

            } else if(data.code == 3) {
				pop_alert('권한이 없습니다.');
			} else {
				pop_alert('데이터 로드에 실패했습니다.');
            }

			$('#total').text(number_format(data.total));
		}, complete: function() {
			paging(total, document.querySelector('[name="row"]').value, document.querySelector('[name="page"]').value)
        }
    });
}


function car_report(){
	var html = new Array();
	var data = $('[name=car_report_form]').serializeArray();
	$('#drive_repo2 table.under_tb tbody').html('');
	$.ajax({
		url: contextPath + '/car/report',
		type: 'post',
		data: data,
		dataType: 'json',
		success: function(data) {
			if(data.code == 1 ) {
				if (data.result.length > 0){
						$('#drive_repo2 table.head_title td').eq(0).text( data.result[0].ve_name );
						$('#drive_repo2 table.head_title td').eq(1).text( data.result[0].og_name );
						$('#drive_repo2 table.head_title td').eq(2).text( data.result[0].per_name );
						$('#drive_repo2 table.head_title td').eq(3).text( data.result[0].ve_number );
						$('#drive_repo2 table.head_title td').eq(4).text( data.result[0].team_name );
						$('#drive_repo2 table.head_title td').eq(5).text( data.result[0].ve_type );
					}
				if (data.result2.length > 0){
					for(var i = 0; i < data.result2.length; i++) {
						if(i == 0) {//합계
							html.push('<tr class="total">');
							html.push('<td>합계</td>');
							html.push('<td>'+number_format(data.result2[i].rc_before)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_after)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_drive)+'</td>');
							html.push('<td>'+data.result2[i].rc_refuel+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_amount)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_trouble)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_pass)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_park)+'</td>');
							html.push('<td></td>');
							html.push('</tr>	');
						} else {
							html.push('<tr>');
							html.push('<td>'+String(data.result2[i].rc_date).substr(6, 2)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_before)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_after)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_drive)+'</td>');
							html.push('<td>'+data.result2[i].rc_refuel+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_amount)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_trouble)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_pass)+'</td>');
							html.push('<td>'+number_format(data.result2[i].rc_park)+'</td>');
							html.push('<td>'+data.result2[i].rc_area+'</td>');
							html.push('</tr>	');
						}
					}
					$('#drive_repo2 table.car_report_body tbody').html( html.join('') );
				}
			}
		}, complete: function(){
			$('#drive_repo2 .table_btn h2 span').text( dayjs( $('#drive_repo2 [name="date"]').val() ).format('YYYY년 MM월') );
		}
	});
}
