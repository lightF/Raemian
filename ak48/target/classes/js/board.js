var oEditors = [];
var session_per = document.querySelector('#pseq').value;
var file_path = '';
document.addEventListener('DOMContentLoaded', function () {
    //수정요구 사항 11/11
    $(document).on('click','.nt_save',function(){
        $('[name="add_form"]')[0].reportValidity()
        if($('[name="add_form"]')[0].reportValidity()){
            $('#save_pop').addClass('dialog_open')
        }
        
    })
    $(document).on('click','#save_pop .point',function(e){
        e.preventDefault();
        $('#save_pop').removeClass('dialog_open')
        $('[name="add_form"]')[0].reportValidity()
        if($('[name="add_form"]')[0].reportValidity()){
            $('[name="add_form"]').submit()
        }
    })

    document.addEventListener('click', function (e) {
      //  console.log(e.target)
    });
    //정렬팝업, 최상위 div .cont의 개별 class 변경하여 사용바람
    $(document).on('click', 'table thead th[data-order]', function () {
        list();//리스트 재호출
    });
    list();
    //form 제출 시 리스트 호출
    document.querySelector('[name="sch_form"]').onsubmit = function () {
        event.preventDefault();
        document.querySelector('[name="page"]').value = 1;
        list();
    };
    document.querySelector('[name="add_form"]').onsubmit = function () {
        event.preventDefault();
        save1();
    };

    //정렬
    var th = document.querySelectorAll('.btn_sort');
    for (var i = 0; i < th.length; i++) {
        th[i].addEventListener('click', function () {
            var od = document.querySelector('[name="order"]');
            var col = document.querySelector('[name="column"]');
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


    //첨부 변경시
    var file_input = document.querySelectorAll('.file_input');
    for (var i = 0; i < file_input.length; i++) {
        file_input[i].addEventListener('change', function () {
            this.classList.add('new_file')
            var closest = this.parentNode;
            setImageFromFile(this, closest.querySelector('img'));
        })
    }
    //팝업 오픈 시
    document.addEventListener('click', function (e) {
        if (e.target.className == 'ri-close-line') {
            var ori = e.target.parentNode.parentNode;
            if (ori.querySelector('input')) {
                ori.querySelector('label').style.display = 'flex';
                ori.querySelector('p').style.display = 'flex';
                ori.querySelector('input').className = 'file_input';
                ori.querySelector('input').value = '';
                ori.querySelector('img').remove();
                ori.querySelector('.file_del').remove();
                ori.insertAdjacentHTML('beforeend', '<img><a class="file_del"><i class="ri-close-line"></i></a>');
            }

        }
        //페이지 이동 모션
        if (e.target.getAttribute('data-page')) {
            var cur = document.querySelector('.page-item.active');
            cur.classList.remove('active');
            e.target.parentNode.classList.add('active');
            document.querySelector('[name="page"]').value = e.target.getAttribute('data-page');
            list();
        }
        if (e.target.parentNode.getAttribute('data-page')) {
            var cur = document.querySelector('.page-item.active');
            cur.classList.remove('active');
            var pre = e.target.parentNode;
            pre.parentNode.classList.add('active');
            document.querySelector('[name="page"]').value = e.target.parentNode.getAttribute('data-page');
            list();
        }







        //작성자가 본인 글을 열 때
        if (e.target.parentNode.getAttribute('data-dialog') && e.target.parentNode.getAttribute('data-perseq') == session_per) {
            var input = document.querySelectorAll('.file_input');
            for (var i = 0; i < input.length; i++) {
                input[i].className = 'file_input';
                input[i].value = '';
                var pr = input[i].parentNode;
                pr.querySelector('label').style.display = 'flex';
                pr.querySelector('p').style.display = 'flex';
                pr.querySelector('img').remove();
                pr.querySelector('.file_del').remove();
                pr.insertAdjacentHTML('beforeend', '<img><a class="file_del"><i class="ri-close-line"></i></a>');
            }
            document.querySelector('#contents').value = '';
            document.querySelector('.nt_save').parentNode.style.display = 'block';
            if (document.querySelector('iframe')) {
                for (var i = 0; i < document.querySelectorAll('iframe').length; i++) {
                    document.querySelectorAll('iframe')[i].remove();
                }
                view(e.target.parentNode.getAttribute('data-seq'), 1);
            } else {
                view(e.target.parentNode.getAttribute('data-seq'), 1);
            }
            //삭제 활성화
            var closest = document.querySelector('#notice_write');
            var del = closest.querySelector('.del');
            del.style.display = 'block';
            del.setAttribute('data-delseq', e.target.parentNode.getAttribute('data-seq'))
            //작성자가 아닌 사람이 글을 볼 때
        } else if (e.target.parentNode.getAttribute('data-dialog') && e.target.parentNode.getAttribute('data-perseq') != null && e.target.parentNode.getAttribute('data-perseq') != session_per) {

            document.querySelector('#notice_write').removeAttribute('data-pop')
            var input = document.querySelectorAll('.file_input');
            for (var i = 0; i < input.length; i++) {
                input[i].className = 'file_input';
                input[i].value = '';
                var pr = input[i].parentNode;
                pr.querySelector('label').style.display = 'none';
                pr.querySelector('p').style.display = 'none';
                pr.querySelector('img').remove();
                pr.querySelector('.file_del').remove();
                pr.insertAdjacentHTML('beforeend', '<img><a class="file_del"><i class="ri-close-line"></i></a>');
            }
            document.querySelector('.nt_save').style.display = 'none';
            var pop = document.querySelector('#notice_write');
            document.querySelector('#contents').value = '';
            if (document.querySelector('iframe')) {
                for (var i = 0; i < document.querySelectorAll('iframe').length; i++) {
                    document.querySelectorAll('iframe')[i].remove();
                }
                view(e.target.parentNode.getAttribute('data-seq'));
            } else {
                view(e.target.parentNode.getAttribute('data-seq'));

            }

            //파일창 컨트롤
            var closest = document.querySelector('#notice_write');
            var icon1 = closest.querySelectorAll('.ri-upload-fill');
            var icon2 = closest.querySelectorAll('.ri-delete-bin-line');
            for (var i = 0; i < icon1.length; i++) {
                icon1[i].className = 'ri-download-fill';
                icon1[i].parentNode.nextSibling.innerHTML = 'File download';
            }
            var del = closest.querySelector('.del');
            del.style.display = 'none';

            //글 작성 시
        } else if (e.target.getAttribute('data-dialog') && !e.target.parentNode.getAttribute('data-perseq')) {			
            document.querySelector('#notice_write').removeAttribute('data-pop')
            var input = document.querySelectorAll('.file_input');
            for (var i = 0; i < input.length; i++) {
                input[i].className = 'file_input';
                input[i].value = '';
                var pr = input[i].parentNode;
                pr.querySelector('label').style.display = 'flex';
                pr.querySelector('p').style.display = 'flex';
                pr.querySelector('img').remove();
                pr.querySelector('.file_del').remove();
                pr.insertAdjacentHTML('beforeend', '<img><a class="file_del"><i class="ri-close-line"></i></a>');
            }
            document.querySelector('#contents').value = '';
            document.querySelector('.nt_save').parentNode.style.display = 'block';
            document.querySelector('.nt_save').style.display = 'block';
            document.querySelector('[name="nt_subject"]').value = '';
            document.querySelector('[name="nt_subject"]').removeAttribute('readonly')
            if (document.querySelector('iframe')) {
                for (var i = 0; i < document.querySelectorAll('iframe').length; i++) {
                    document.querySelectorAll('iframe')[i].remove();
                }
                setTimeout(500, editeor2('contents', [''], 335, true))

            } else {
                setTimeout(500, editeor2('contents', [''], 335, true))

            }
            //기타 디폴트 케이스
            //파일창 컨트롤
            var closest = document.querySelector('#notice_write');
            //삭제 비활성화
            var del = closest.querySelector('.del');
            del.style.display = 'none';
            var icon1 = closest.querySelectorAll('.ri-download-fill');
            var icon2 = closest.querySelectorAll('.ri-delete-bin-line');
            var src = closest.querySelectorAll('img');
            for (var i = 0; i < icon1.length; i++) {
                icon1[i].className = 'ri-upload-fill';
                icon1[i].parentNode.nextSibling.innerHTML = 'File upload';
            }

            for (var i = 0; i < src.length; i++) {
                src[i].src = '';
                src[i].className = '';
            }

            var del = closest.querySelector('.del');
            del.style.display = 'none';
        }









        if (e.target.className == 'on_view') {
            var ori = e.target;
            var tg = ori.getAttribute('src')
            if (tg.indexOf('data:image/') == -1) {
                window.open(tg, '_blank');
            }
        } else if (e.target.className == 'on_view no_del') {
            var ori = e.target;
            var tg = ori.getAttribute('src');
            window.open(tg, '_blank');
        }


        //삭제임
        // if(e.target.className == 'btn del'){
        //     var ck = confirm('해당 항목을 삭제하시겠습니까?')
        //     if(ck){
        //         del_row(e.target.getAttribute('data-delseq'));
        //     }
        //     //del_row(e.target.getAttribute('data-delseq'));
        // }
    });
    $(document).on('click', '#delete_pop .point', function () {
        del_row($('#notice_write').attr('data-pop'));
    })
    $(document).on('click', '.btn.del', function () {
        $('#delete_pop').addClass('dialog_open');
    })
    //저장 클릭시
    // document.querySelector('.nt_save').addEventListener('click', function () {
    //     save1();
    // })


});

function del_row(seq) {
    var data = {};
    data.seq = seq
    $.ajax({
        url: contextPath + '/board/delete',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 1) {
                pop_alert('삭제 되었습니다.');
            } else {
                pop_alert('삭제에 실패였습니다.');
            }


        }, complete: function () {
            var closest = document.querySelector('#notice_write');
            closest.querySelector('.close').click();
            $('#delete_pop').removeClass('dialog_open');
            list();
        }
    });
}

function view(seq, view) {
    //setTimeout(500,editeor2('contents', contents,335))
    var data = {};
    data.seq = seq;
    $.ajax({
        type: 'post',
        url: contextPath + '/board/detail',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 1 && data.result.length > 0) {
                var con = new Array();
                con.push(data.result[0].bd_content)
                if (view) {
                    setTimeout(500, editeor2('contents', con, 335, true));
                    document.querySelector('[name="nt_subject"]').value = data.result[0].bd_subject;
                    document.querySelector('[name="nt_subject"]').removeAttribute('readonly');
                    document.querySelector('#notice_write').setAttribute('data-pop', seq)
                    if (data.result2.length > 0) {
                        var input = document.querySelectorAll('.file_input');
                        for (var i = 0; i < data.result2.length; i++) {
                            var dt = data.result2[i];
                            var ori = input[i].parentNode;
                            ori.querySelector('label').style.display = 'none'
                            ori.querySelector('p').style.display = 'none'
                            ori.querySelector('img').setAttribute('src', resourcePath + dt.f_path + dt.f_unique);
                            ori.querySelector('img').className = 'on_view';
                            ori.querySelector('img').setAttribute('data-seqq', dt.f_seq)
                        }
                    }
                } else {
                    setTimeout(500, editeor2('contents', con, 385, false));
                    document.querySelector('[name="nt_subject"]').value = data.result[0].bd_subject;
                    document.querySelector('[name="nt_subject"]').setAttribute('readonly', true);
                    document.querySelector('#notice_write').setAttribute('data-pop', seq)
                    if (data.result2.length > 0) {
                        var input = document.querySelectorAll('.file_input');
                        for (var i = 0; i < data.result2.length; i++) {
                            var dt = data.result2[i];
                            var ori = input[i].parentNode;
                            ori.querySelector('label').style.display = 'none'
                            ori.querySelector('p').style.display = 'none'
                            ori.querySelector('img').setAttribute('src', resourcePath + dt.f_path + dt.f_unique);
                            ori.querySelector('img').className = 'on_view no_del';
                            ori.querySelector('img').setAttribute('data-seqq', dt.f_seq)
                        }
                    }
                }
            } else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
                pop_alert('게시글 데이터가 존재하지 않습니다.')
            }
            if (data.code == 1 && data.result2.length > 0) {
                file_path = data.result2[0].f_path;
            }

        }, complete: function () {

        }
    });

}
function setImageFromFile(input, expression) {

    if (input.files && input.files[0]) {
        var reader2 = new FileReader();
        reader2.onload = function (e) {
            //expression.css('background-image','url('+e.target.result+')');
            expression.setAttribute('src', e.target.result);
            expression.removeAttribute('data-seqq')
            expression.classList.add('on_view');
            var ori = expression.parentNode;
            ori.querySelector('label').style.display = 'none'
            ori.querySelector('p').style.display = 'none'
        }
        reader2.readAsDataURL(input.files[0]);
    }
}
function save1() {
    var data = new FormData();
    oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);
    data.append('bd_content', document.querySelector('#contents').value);

    data.append('bd_subject', document.querySelector('[name="nt_subject"]').value);
    var f1 = document.querySelector('#file1').parentNode;
    var ff1 = f1.querySelector('img').getAttribute('data-seqq');
    var f2 = document.querySelector('#file2').parentNode;
    var ff2 = f2.querySelector('img').getAttribute('data-seqq');
    var f3 = document.querySelector('#file3').parentNode;
    var ff3 = f3.querySelector('img').getAttribute('data-seqq');
    var f4 = document.querySelector('#file4').parentNode;
    var ff4 = f4.querySelector('img').getAttribute('data-seqq');
    if (ff1 != undefined) {
        data.append('f_seq', ff1)
    } else if (document.querySelector('#file1').files[0]) {
        data.append('upload', document.querySelector('#file1').files[0])
    }
    if (ff2 != undefined) {
        data.append('f_seq', ff2)
    } else if (document.querySelector('#file2').files[0]) {
        data.append('upload', document.querySelector('#file2').files[0])
    }
    if (ff3 != undefined) {
        data.append('f_seq', ff3)
    } else if (document.querySelector('#file3').files[0]) {
        data.append('upload', document.querySelector('#file3').files[0])
    }
    if (ff4 != undefined) {
        data.append('f_seq', ff4)
    } else if (document.querySelector('#file4').files[0]) {
        data.append('upload', document.querySelector('#file4').files[0])
    }
    if (document.querySelector('#notice_write').getAttribute('data-pop') != undefined && document.querySelector('#notice_write').getAttribute('data-pop') != '') {
        data.append('seq', document.querySelector('#notice_write').getAttribute('data-pop'));
    }
    $.ajax({
        type: 'post',
        url: contextPath + '/board/edit',
        data: data,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (data) {
            var data = JSON.parse(data)
            if (Number(data.code) == 1) {
                pop_alert('저장 되었습니다.')
            } else if(data.code == 3){
					pop_alert('권한이 없습니다.');
			} else { 
                pop_alert('저장에 실패했습니다.')
            }

        }, complete: function () {

            var closest = document.querySelector('#notice_write');
            document.querySelector('#contents').value = '';
            closest.querySelector('.close').click();
            list();
        }
    });
}



//웹 에디터 화면 설정 function
function editeor2(title, contents, size, read) {

    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: 'contents', // html editor가 들어갈 textarea id 입니다.
        sSkinURI: resourcePath + "/smarteditor2/SmartEditor2Skin.html",  // html editor가 skin url 입니다.
        htParams: {

            // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
            bUseToolbar: read,
            // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
            bUseVerticalResizer: false,
            // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
            bUseModeChanger: false,
            fOnBeforeUnload: function () {

            }
        },

        /**
         * 수정 시 에디터에 데이터 저장
         */
        fOnAppLoad: function () {
            //수정모드를 구현할 때 사용할 부분입니다. 로딩이 끝난 후 값이 체워지게 하는 구현을 합니다.
            if (contents) {
                oEditors.getById["contents"].exec("PASTE_HTML", [contents]); //로딩이 끝나면 contents를 txtContent에 넣습니다.
            }
            if (read === false) {
                oEditors.getById["contents"].exec("DISABLE_WYSIWYG");
            }
            if (size) {
                oEditors.getById["contents"].exec("RESIZE_EDITING_AREA", [0, size]);
            } else {
                oEditors.getById["contents"].exec("RESIZE_EDITING_AREA", [0, 335]);
            }



        },

        fCreator: "createSEditor2",
    });
}
function list() {
    var data = {};
    data.row = document.querySelector('[name="row"]').value;
    data.column = document.querySelector('[name="column"]').value;
    data.order = document.querySelector('[name="order"]').value;
    data.page = document.querySelector('[name="page"]').value;
    
    if (document.querySelector('[name="start_date"]').value) { data.start_date = document.querySelector('[name="start_date"]').value.replaceAll('-', '') + '000000' }
    if (document.querySelector('[name="end_date"]').value) { data.end_date = document.querySelector('[name="end_date"]').value.replaceAll('-', '') + '000000' }
    if (document.querySelector('[name="title"]').value) { data.bd_subject = document.querySelector('[name="title"]').value }
    if (document.querySelector('[name="editor"]').value) { data.per_name = document.querySelector('[name="editor"]').value }
    
    var arr = new Array();
    var total = 0;
    $.ajax({
        url: contextPath + '/board/list',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 1 && data.result.length > 0) {
                for (var i = 0; i < data.result.length; i++) {
                    var dt = data.result[i];
                    arr.push('<tr data-dialog="notice_write" data-seq="' + dt.seq + '" data-perseq="' + dt.per_seq + '">');
                    //arr.push('<td>' + ((i + 1) + (($('[name="page"]').val() - 1) * $('[name="row"]').val())) + '</td>');
                    arr.push('<td>' + dt.seq + '</td>');
                    arr.push('<td>' + dt.bd_subject + '</td>');

                    //파일 자리임 나중에 파일 추가되면 파일 아이콘 띄우기
                    arr.push('<td></td>');
                    arr.push('<td>' + dt.per_name + '</td>');
                    arr.push('<td>' + dt.bd_count + '</td>');
                    arr.push('<td>' + length8(dt.update_date, '-', 2) + '</td>');
                    arr.push('</tr>')
                }
                total = data.total;
                document.querySelector('.list_tbody').innerHTML = arr.join('');
                document.querySelector('#total').innerHTML = data.total;
            } else if (data.code == 3) {
				pop_alert('권한이 없습니다.');
			}else {
                document.querySelector('.list_tbody').innerHTML = '<tr class="empty"> <td colspan="6">등록된 데이터가 없습니다.</td> </tr>';
                document.querySelector('#total').innerHTML = data.total;
            }

        }, complete: function () {
            paging(total, document.querySelector('[name="row"]').value, document.querySelector('[name="page"]').value)
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




