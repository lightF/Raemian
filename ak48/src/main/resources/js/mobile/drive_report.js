$(document).ready(function(){
    // 리스트 호출
    list();

  
});

// row값 변경
$(document).on('change', '[name="row"]', function(){
	list();
});

// 검색
$(document).on('submit', '[name="sch_form"]', function(){
	$('.m_search').hide();
	list();
});

// 페이징
$(document).on('click', 'a[data-page]', function(){
	$('[name="page"]').val($(this).attr('data-page'));
	list();
});

// 신규등록, 기존 정보 열람&수정 구분
$(document).on('click', '.btn_add', function(){
	var type = $(this).attr('data-type');
	location.href = '/DBCS/drive_report_write?no='+type;
});

//////////////////////////////////////////////////////////////////////////////////

function list(){
    
	var data = {};

    data.row = $('[name="row"]').val();
    data.column = $('[name="column"]').val();
    data.order = $('[name="order"]').val();
    data.page = $('[name="page"]').val();
    if ($('[name="start_date"]').val()) { data.start_date = $('[name="start_date"]').val().replaceAll('-', '') + '000000' };
    if ($('[name="end_date"]').val()) { data.end_date = $('[name="end_date"]').val().replaceAll('-', '') + '235959' };
    if ($('[name="og_name"]').val()) { data.og_name = $('[name="og_name"]').val() };
    if ($('[name="ve_number"]').val()) { data.ve_number = $('[name="ve_number"]').val() };
    if ($('[name="rc_handle"]').val()) { data.rc_handle = $('[name="rc_handle"]').val() };

    var arr = new Array;
    var total = 0;

    $.ajax({ 
        url: contextPath + '/car/list',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(data){
            if(data.code == 1 && data.result.length > 0){
                for(var i = 0; i < data.result.length; i++) {
					arr.push(`<li><input type="hidden" name="seq" value="`+data.result[i].seq+`">
                        <p class="count">`+(i+1)+`</p>
                        <a class="btn_add" data-type="`+data.result[i].seq+`">
                            <div class="list_st1">
                                <p>운행팀: <span class="team">`+data.result[i].team_name+`</span></p>
                                <span class="line"></span>
                                <p>차량번호: <span class="car_nb">`+data.result[i].ve_number+`</span></p>
                            </div>
                            <div class="list_st2">
                                <p>운행전: <span class="before">`+data.result[i].rc_before+`</span></p>
                                <span class="line"></span>
                                <p>운행후: <span class="after">`+data.result[i].rc_after+`</span></p>
                            </div>
                            <div class="list_st3">
                                <p>운행일자: <span class="date">`+length8(data.result[i].rc_date, '-', 1)+`</span></p>
								<span class="line"></span>
								<p>주차비: <span class="date">`+number_format(data.result[i].rc_park)+`</span></p>
								<span class="line"></span>
								<p>통행료: <span class="date">`+number_format(data.result[i].rc_pass)+`</span></p>
                            </div>

                        </a></li>`);
				}
                total = data.total;
                row = data.row;
                $('.ul_list ul').html(arr.join(''));
            } else {
                $('.ul_list ul').html('<li class="empty">등록된 데이터가 없습니다.</li>');
            }
            $('#total').text(number_format(data.total));
        }, complete: function() {
			paging(total, row, $('[name="page"]').val());
        }
    })
}