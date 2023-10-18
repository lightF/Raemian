document.addEventListener('DOMContentLoaded',function(){


    var seq = localStorage.getItem('bd_seq');
    var pseq = localStorage.getItem('bd_fix');

    //수정요구 사항 11/11
    $(document).on('click', '.nt_save', function () {
        $('[name="add_form"]')[0].reportValidity()
        if ($('[name="add_form"]')[0].reportValidity()) {
            $('#save_pop').addClass('dialog_open')
        }
    })
    $(document).on('click', '#save_pop .point', function (e) {
        e.preventDefault();
        $('#save_pop').removeClass('dialog_open')
        $('[name="add_form"]')[0].reportValidity()
        if ($('[name="add_form"]')[0].reportValidity()) {
            $('[name="add_form"]').submit()
        }
    })


    if(pseq){
        view(seq);
		$('[name=add_form] .btn.close').hide();
    } else {
		console.log(pseq);

		$('[name=add_form] .btn.del').hide();
        editeor2('',[''],'',true);
    }

    // 서버에 제출 submit 버튼 이벤트 등록
    document.querySelector('[name="add_form"]').onsubmit = function () {
        event.preventDefault();
        save1(seq);
    };

     //첨부 변경시
     var file_input = document.querySelectorAll('.file_input');
     for (var i = 0; i < file_input.length; i++) {
         file_input[i].addEventListener('change', function () {
             this.classList.add('new_file')
             var closest = this.parentNode;
             setImageFromFile(this, closest.querySelector('img'));
         })
     }

     //클릭 모션 모음
     document.addEventListener('click',function(e){
        //이미지 x 버튼 클릭
        if(e.target.className == 'ri-close-line'){
            var ori = e.target.parentNode.parentNode;
            if(ori.querySelector('input')){
                ori.querySelector('label').style.display = 'flex';
                ori.querySelector('input').className = 'file_input';
                ori.querySelector('input').value = '';
                ori.querySelector('img').remove();
                ori.querySelector('.file_del').remove();
                ori.insertAdjacentHTML('beforeend', '<img><a class="file_del"><i class="ri-close-line"></i></a>');
            }
           
        }

        //이미지 새창
        if(e.target.className == 'on_view'){
            var ori = e.target;
            var tg = ori.getAttribute('src')
            if(tg.indexOf('data:image/') == -1){
                window.open(tg, '_blank');
            }
        }else if(e.target.className == 'on_view no_del'){
            var ori = e.target;
            var tg = ori.getAttribute('src')
            window.open(tg, '_blank');
        }

          //삭제임
        if (e.target.className == 'btn del') {
            $('#delete_pop').addClass('dialog_open')
            /*var ck = confirm('해당 항목을 삭제하시겠습니까?')
            if(ck){
                del_row(seq);
            }*/
            //del_row(e.target.getAttribute('data-delseq'));
        }
     })
     $(document).on('click', '#delete_pop .point', function () {
        del_row(seq);
    })



})


function del_row(seq){
    var data = {};
    data.seq = seq
    $.ajax({
        url: contextPath + '/board/delete',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if(data.code == 1){
                pop_alert('선택 항목이 삭제되었습니다.')
            }else{
                pop_alert('오류가 발생했습니다. 서버환경을 확인해주세요.')
            }
            

        }, complete: function () {
            $(document).find('.pop_alert  .point').on('click', function () {
                location.href = contextPath + '/notice';
            })
            //location.href = contextPath + '/notice';
        }
    });
}


function view(seq) {
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
               
                    editeor2('contents',con,'',true)
                    document.querySelector('[name="bd_subject"]').value = data.result[0].bd_subject;
                    document.querySelector('[name="bd_subject"]').removeAttribute('readonly');
                    if(data.result2.length > 0){
                        var input = document.querySelectorAll('.file_input');
                        for(var i =0; i < data.result2.length; i++){
                            var dt = data.result2[i];
                            var ori = input[i].parentNode;
                            ori.querySelector('label').style.display = 'none'
                            ori.querySelector('img').setAttribute('src', resourcePath + dt.f_path + dt.f_unique);
                            ori.querySelector('img').className = 'on_view';
                            ori.querySelector('img').setAttribute('data-seqq', dt.f_seq)
                        }
                    }
             
            } else {
                pop_alert('게시글 데이터가 존재하지 않습니다.')
            }
            if(data.code == 1 && data.result2.length > 0){
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
        }
        reader2.readAsDataURL(input.files[0]);
    }
}
function save1(seq) {
    var data = new FormData();
    oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);
    data.append('bd_content', document.querySelector('#contents').value);

    data.append('bd_subject', document.querySelector('[name="bd_subject"]').value);
    var f1 = document.querySelector('#file1').parentNode;
    var ff1 = f1.querySelector('img').getAttribute('data-seqq');
    var f2 = document.querySelector('#file2').parentNode;
    var ff2 = f2.querySelector('img').getAttribute('data-seqq');
    var f3 = document.querySelector('#file3').parentNode;
    var ff3 = f3.querySelector('img').getAttribute('data-seqq');
    var f4 = document.querySelector('#file4').parentNode;
    var ff4 = f4.querySelector('img').getAttribute('data-seqq');
    if(ff1 != undefined){
        data.append('f_seq',ff1)
    }else if(document.querySelector('#file1').files[0]){
        data.append('upload',document.querySelector('#file1').files[0])
    }
    if(ff2 != undefined){
        data.append('f_seq',ff2)
    }else if(document.querySelector('#file2').files[0]){
        data.append('upload',document.querySelector('#file2').files[0])
    }
    if(ff3 != undefined){
        data.append('f_seq',ff3)
    }else if(document.querySelector('#file3').files[0]){
        data.append('upload',document.querySelector('#file3').files[0])
    }
    if(ff4 != undefined){
        data.append('f_seq',ff4)
    }else if(document.querySelector('#file4').files[0]){
        data.append('upload',document.querySelector('#file4').files[0])
    }
    if(seq){
        data.append('seq', seq);
    }
    // if (document.querySelector('#notice_write').getAttribute('data-pop') != undefined && document.querySelector('#notice_write').getAttribute('data-pop') != '') {
    //     data.append('seq', document.querySelector('#notice_write').getAttribute('data-pop'));
    // }
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
                pop_alert('게시글이 등록되었습니다.')
            } else {
                pop_alert('게시글 등록을 실패했습니다.')
            }

        }, complete: function () {
            $(document).find('.pop_alert  .point').on('click', function () {
                location.href = contextPath + '/board';
            })
            // location.href = contextPath + '/notice';
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
            // if (size) {
            //     oEditors.getById["contents"].exec("RESIZE_EDITING_AREA", [0, size]);
            // } else {
            //     oEditors.getById["contents"].exec("RESIZE_EDITING_AREA", [0, 335]);
            // }



        },

        fCreator: "createSEditor2",
    });
}