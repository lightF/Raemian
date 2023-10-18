var oEditors = [];
var session_per = document.querySelector('#pseq').value;

document.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem('nt_seq')
    localStorage.removeItem('nt_fix')

    document.addEventListener('click', function (e) {
   //     console.log(e.target)
    });
    list();

    //글쓰기
    document.querySelector('.top .sky').addEventListener('click',function(){
        localStorage.removeItem('nt_seq');
        localStorage.removeItem('nt_fix');
        location.href = contextPath + '/notice_write';
    })
    //form 제출 시 리스트 호출
    document.querySelector('[name="sch_form"]').onsubmit = function () {
        event.preventDefault();
        document.querySelector('[name="page"]').value = 1;
        document.querySelector('.m_search').style.display = 'none'
        list();
    };
   
    //정렬
    var th = document.querySelectorAll('.btn_sort');
    for (var i = 0; i < th.length; i++) {
        th[i].addEventListener('click', function () {
            var od = document.querySelector('[name="order"]');
            var col = document.querySelector('[name="col"]');
            if (od.value.toString().trim() == "ASC") { od.value = 'DESC' } else { od.value = "ASC" };
            col.value = this.getAttribute('data-col');
            list();
        })
    }
    // 로우 변경
    document.querySelector('[name="row"]').addEventListener('change', function () {
        document.querySelector('[name="page"]').value = 1;
        list();
    })
    
  
    //클릭 모션 집합
    document.addEventListener('click', function (e) {
         //페이지 이동 모션
         if(e.target.getAttribute('data-page')){
            var cur = document.querySelector('.page-item.active');
            cur.classList.remove('active');
            //e.target.parentNode.classList.add('active');
            document.querySelector('[name="page"]').value = e.target.getAttribute('data-page');
            list();
        }
        if(e.target.parentNode.getAttribute('data-page')){
            var cur = document.querySelector('.page-item.active');
            cur.classList.remove('active');
            var pre = e.target.parentNode;
            //pre.parentNode.classList.add('active');
            document.querySelector('[name="page"]').value = e.target.parentNode.getAttribute('data-page');
            list();
        }  
       
    });

    

});

function list() {
    var data = {};
    data.row = document.querySelector('[name="row"]').value;
    data.column = document.querySelector('[name="col"]').value;
    data.order = document.querySelector('[name="order"]').value;
    data.page = document.querySelector('[name="page"]').value;
    if (document.querySelector('[name="start_date"]').value) { data.start_date = document.querySelector('[name="start_date"]').value.replaceAll('-', '') + '000000' }
    if (document.querySelector('[name="end_date"]').value) { data.end_date = document.querySelector('[name="end_date"]').value.replaceAll('-', '') + '000000' }
    if (document.querySelector('[name="title"]').value) { data.nt_subject = document.querySelector('[name="title"]').value }
    if (document.querySelector('[name="editor"]').value) { data.per_name = document.querySelector('[name="editor"]').value }

    var arr = new Array();
    var total = 0;
    $.ajax({
        url: contextPath + '/board/notice/list',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 1 && data.result.length > 0) {
                for (var i = 0; i < data.result.length; i++) {
                    var dt = data.result[i];
                    arr.push('<li class="list_li" data-seq="' + dt.seq + '" data-perseq="' + dt.per_seq + '">');
                    //arr.push('<p class="count">' + ((i + 1) + (($('[name="page"]').val() - 1) * $('[name="row"]').val())) + '</p>');
                    arr.push('<p class="count">' + dt.seq + '</p>');
                    arr.push('<a>');
                    arr.push('<div class="list_st1">')
					arr.push('<p>작성자 : <span class="name">'+dt.per_name+'</span></p>')
                    arr.push('<span class="line"></span>')
                    switch(Number(dt.nt_file)){
                        case 0:
                            arr.push('<p class="file">파일 : </p>')
                            break;
                        default : 
                            arr.push('<p class="file">파일 : <i class="ri-file-gif-line"></i></p>')
                            break;
                    }
                    arr.push('</div>')
                    arr.push('<div class="list_st2">')
                    arr.push('<p>'+dt.nt_subject+'</p>')
                    arr.push('</div>')
                    arr.push(`<div class="list_st3">
                    <p>등록일 : <span class="date">`+length8(dt.update_date, '-', 2)+`</span></p>
                    <span class="line"></span>
                    <p>조회 : <span class="look">`+dt.nt_count +`</span></p>
                </div>`);

                    //닫힘
                    arr.push('</a></li>');
                }
                total = data.total;
                document.querySelector('.list_tbody').innerHTML = arr.join('');
                document.querySelector('.count_total').innerHTML = data.total;
            } else {
                document.querySelector('.list_tbody').innerHTML = `<li>
                <p class="count">1</p>
                <a>
                    <div class="list_st1">
                        <p><span class="name"></span></p>
                        <span class="line"></span>
                        <p class="file"></p>
                    </div>
                    <div class="list_st2">
                        <p>등록된 게시물이 없습니다.</p>
                    </div>
                    <div class="list_st3">
                        <p><span class="date"></span></p>
                        <span class="line"></span>
                        <p><span class="look"></span></p>
                    </div>
                </a>
            </li>`;
                document.querySelector('.count_total').innerHTML = data.total;
            }

        }, complete: function () {
            paging(total, document.querySelector('[name="row"]').value, document.querySelector('[name="page"]').value)
            document.querySelector('a[data-page="'+document.querySelector('[name="page"]').value+'"]').parentNode.classList.add('active')

            // if (e.target.parentNode.getAttribute('data-dialog') && e.target.parentNode.getAttribute('data-perseq') == session_per) {
            var tg = document.querySelectorAll('.list_li');
            for(var i = 0 ; i < tg.length; i ++){
                tg[i].addEventListener('click',function(){
                    if(this.getAttribute('data-perseq') == session_per){
                        localStorage.setItem('nt_seq',this.getAttribute('data-seq'))
                        localStorage.setItem('nt_fix','Y')
                        location.href = contextPath + '/notice_write';
                    }else{
                        localStorage.setItem('nt_seq',this.getAttribute('data-seq'))
                        localStorage.removeItem('nt_fix');
                        location.href = contextPath + '/notice_view';
                    }
                });
            }
        }
    });
}

						
								
								
								
							
							
								
							
							
						


function length8(num, formet, type) {

    var str = num.toString();

    switch (type) {
        case 2:
            var num_8 = str.substring(2, 4) + formet + str.substring(4, 6) + formet + str.substring(6, 8);
            break;

        default:
            var num_8 = str.substring(0, 4) + formet + str.substring(4, 6) + formet + str.substring(6, 8);
            break;

    }



    return num_8;
}




