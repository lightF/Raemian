var oEditors = [];
var session_per = document.querySelector('#pseq').value;
var file_path = '';
Dropzone.autoDiscover = false; // deprecated 된 옵션. false로 해놓는걸 공식문서에서 명시
var dropzone = "";
document.addEventListener('DOMContentLoaded', function () {
    // 수정요구 사항 11/11
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

    //드래그 가이드 모션
    document.addEventListener('dragover', function (e) {
        e.preventDefault();
        var tg = document.querySelector('.guide_drop');
        var tg2 = document.querySelector('.ri-upload-cloud-fill');
        tg.style.display = "block"
        if (tg2) { tg2.style.display = "none" }
    });
    document.addEventListener('dragleave', function (e) {
        e.preventDefault();
        var tg = document.querySelector('.guide_drop');
        var tg2 = document.querySelector('.ri-upload-cloud-fill');
        tg.style.display = "none"
        if (tg2) { tg2.style.display = "block" }
    });
    document.addEventListener('drop', function (e) {
        e.preventDefault();
        var tg = document.querySelector('.guide_drop');
        var tg2 = document.querySelector('.ri-upload-cloud-fill');
        tg.style.display = "none"
        if (tg2) { tg2.style.display = "block" }
    });
    //정렬팝업, 최상위 div .cont의 개별 class 변경하여 사용바람
    $(document).on('click', 'table thead th[data-order]', function () {
        list();//리스트 재호출
    });
    document.addEventListener('click', function (e) {
        //console.log(e.target)
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
        var files = myDropzone.files
        save1(files)
    };
    //정렬
    // var th = document.querySelectorAll('.btn_sort');
    // for (var i = 0; i < th.length; i++) {
    //     th[i].addEventListener('click', function () {
    //         var od = document.querySelector('[name="order"]');
    //         var col = document.querySelector('[name="column"]');
    //         if (od.value.toString().trim() == "ASC") { od.value = 'DESC' } else { od.value = "ASC" };
    //         col.value = this.getAttribute('data-col');
    //         list();
    //     })
    // }
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
            document.querySelector('.nt_save').style.display = 'block';
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
            document.querySelector('.nt_save').style.display = 'none';
            if (document.querySelector('iframe')) {
                for (var i = 0; i < document.querySelectorAll('iframe').length; i++) {
                    document.querySelectorAll('iframe')[i].remove();
                }
                view(e.target.parentNode.getAttribute('data-seq'), 2);
            } else {
                view(e.target.parentNode.getAttribute('data-seq'), 2);

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
            // for (var i = 0; i < icon2.length; i++) {
            //     icon2[i].className = 'ri-download-fill'
            //     icon2[i].parentNode.nextSibling.innerHTML = 'File download';
            // }

            //글 작성 시
        } else if (e.target.getAttribute('data-dialog') && !e.target.parentNode.getAttribute('data-perseq')) {
            document.querySelector('#notice_write').removeAttribute('data-pop')
            document.querySelector('.nt_save').style.display = 'block';
            document.querySelector('[name="nt_subject"]').value = '';
            document.querySelector('[name="nt_subject"]').removeAttribute('readonly')
            if (document.querySelector('iframe')) {
                for (var i = 0; i < document.querySelectorAll('iframe').length; i++) {
                    document.querySelectorAll('iframe')[i].remove();
                }
                setTimeout(500, editeor2('contents', [''], 358, true))

            } else {
                setTimeout(500, editeor2('contents', [''], 358, true))

            }


            img_area(1)
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
            // for (var i = 0; i < icon2.length; i++) {
            //     icon2[i].className = 'ri-upload-fill'
            //     icon2[i].parentNode.nextSibling.innerHTML = 'File upload';
            // }
            // for(var i = 0 ; i < src.length; i++){
            //    src[i].src = '';
            //    src[i].className = '';
            // }

            var del = closest.querySelector('.del');
            del.style.display = 'none';
        }








        //        console.log(e.target)
        if (e.target.parentNode.className == 'dz-preview dz-image-preview') {
            var ori = e.target.parentNode;
            var tg = ori.querySelector('.dz-image img').getAttribute('alt')
            window.open(resourcePath + file_path + tg, '_blank');
        } else if (e.target.parentNode.parentNode.className == 'dz-preview dz-image-preview') {
            var ori = e.target.parentNode.parentNode;
            var tg = ori.querySelector('.dz-image img').getAttribute('alt')
            window.open(resourcePath + file_path + tg, '_blank');
        }

        //삭제임
        // if (e.target.className == 'btn del') {
        //     var ck = confirm('해당 항목을 삭제하시겠습니까?')
        //     if (ck) {
        //         del_row(e.target.getAttribute('data-delseq'));
        //     }
        //     //del_row(e.target.getAttribute('data-delseq'));
        // }
    });
    $(document).on('click', '#delete_pop .point', function () {
        del_row($('#notice_write').attr('data-pop'));
    })
    $(document).on('click', '.btn.del', function () {
        $('#delete_pop').addClass('dialog_open')
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
        url: contextPath + '/board/notice/delete',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 1) {
                pop_alert('선택 항목이 삭제되었습니다.')
            } else {
                pop_alert('오류가 발생했습니다. 서버환경을 확인해주세요.')
            }


        }, complete: function () {
            var closest = document.querySelector('#notice_write');
            closest.querySelector('.close').click();
            $('#delete_pop').removeClass('dialog_open')
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
        url: contextPath + '/board/notice/detail',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.code == 1 && data.result.length > 0) {
                var con = new Array();
                con.push(data.result[0].nt_content)
                if (view) {
                    switch (Number(view)) {
                        case 1:
                            setTimeout(100, editeor2('contents', con, 358, true));
                            document.querySelector('[name="nt_subject"]').value = data.result[0].nt_subject;
                            document.querySelector('[name="nt_subject"]').removeAttribute('readonly');
                            document.querySelector('#notice_write').setAttribute('data-pop', seq)
                            img_area(2, data)
                            break;

                        default:
                            setTimeout(100, editeor2('contents', con, 358, false));
                            document.querySelector('[name="nt_subject"]').value = data.result[0].nt_subject;
                            document.querySelector('[name="nt_subject"]').setAttribute('readonly', true);
                            document.querySelector('#notice_write').setAttribute('data-pop', seq)
                            img_area(3, data)
                            break;
                    }

                } else {
                    setTimeout(100, editeor2('contents', con, 385, false));
                    document.querySelector('[name="nt_subject"]').value = data.result[0].nt_subject;
                    document.querySelector('[name="nt_subject"]').setAttribute('readonly', true)
                }
            } else if (data.code == 3){
				pop_alert('권한이 없습니다.');
			} else {
                pop_alert('게시글 데이터가 존재하지 않습니다.');
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
            expression.classList.add('on_view');
        }
        reader2.readAsDataURL(input.files[0]);
    }
}
function save1(files) {
    var data = new FormData();
    var filess = files.files
    for (var i = 0; i < filess.length; i++) {
        // var tg = document.querySelectorAll('.dz-image')[i]
        // if(tg.getAttribute('data-seqq') != undefined && tg.getAttribute('data-seqq') != ''){
        //     data.append('f_seq',tg.getAttribute('data-seqq') )
        // }else{
        //     data.append('upload',filess[i])
        // }
        console.log(filess[i].seq)
        if (filess[i].seq != undefined) {
            data.append('f_seq', filess[i].seq)
        } else {
            data.append('upload', filess[i])
        }


    }
    oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);
    data.append('nt_content', document.querySelector('#contents').value);

    data.append('nt_subject', document.querySelector('[name="nt_subject"]').value);
    if (document.querySelector('#notice_write').getAttribute('data-pop') != undefined && document.querySelector('#notice_write').getAttribute('data-pop') != '') {
        data.append('seq', document.querySelector('#notice_write').getAttribute('data-pop'));
    }
    //console.log(data)

    // if(document.querySelector('#file1').files[0]){data.append('upload',document.querySelector('#file1').files[0])}
    // if(document.querySelector('#file2').files[0]){data.append('upload',document.querySelector('#file2').files[0])}
    // if(document.querySelector('#file3').files[0]){data.append('upload',document.querySelector('#file3').files[0])}
    // if(document.querySelector('#file4').files[0]){data.append('upload',document.querySelector('#file4').files[0])}
    $.ajax({
        type: 'post',
        url: contextPath + '/board/notice/edit',
        data: data,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (data) {
            var data = JSON.parse(data)
            if (Number(data.code) == 1) {
                pop_alert('저장 되었습니다.');
            } else if (data.code == 3) {
				pop_alert('권한이 없습니다.');
			}else {
                pop_alert('저장에 실패했습니다.');
            }

        }, complete: function () {
            var closest = document.querySelector('#notice_write');
            closest.querySelector('.close').click();
            document.querySelector('#contents').value = '';

            $('#notice_write').removeClass('dialog_open')
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
                    arr.push('<tr data-dialog="notice_write" data-seq="' + dt.seq + '" data-perseq="' + dt.per_seq + '">');
                    //arr.push('<td>' + ((i + 1) + (($('[name="page"]').val() - 1) * $('[name="row"]').val())) + '</td>');
                    arr.push('<td>' + dt.seq + '</td>');
                    arr.push('<td>' + dt.nt_subject + '</td>');

                    //파일 자리임 나중에 파일 추가되면 파일 아이콘 띄우기
                    arr.push('<td></td>');
                    arr.push('<td>' + dt.per_name + '</td>');
                    arr.push('<td>' + dt.nt_count + '</td>');
                    arr.push('<td>' + length8(dt.update_date, '-', 2) + '</td>');
                    arr.push('</tr>')
                }
                total = data.total;
                document.querySelector('.list_tbody').innerHTML = arr.join('');
                document.querySelector('#total').innerHTML = data.total;
            } else if (data.code == 3){
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




function img_area(type, data) {

    // if(document.querySelector('.dz-default.dz-message')){
    //     document.querySelector('.dz-default.dz-message').remove();
    //     document.querySelector('li.dropzone.needsclick').className = 'dropzone needsclick';
    // }
    if (dropzone != '') {
        dropzone.destroy();

    }
    switch (Number(type)) {

        //글쓰기
        case 1:
            dropzone = new Dropzone("li.dropzone", {
                url: 'https://httpbin.org/post', // 파일을 업로드할 서버 주소 url.
                method: 'post', // 기본 post로 request 감. put으로도 할수있음
                autoProcessQueue: false, // 자동으로 보내기. true : 파일 업로드 되자마자 서버로 요청, false : 서버에는 올라가지 않은 상태. 따로 this.processQueue() 호출시 전송
                clickable: true, // 클릭 가능 여부
                autoQueue: false, // 드래그 드랍 후 바로 서버로 전송
                createImageThumbnails: true, //파일 업로드 썸네일 생성

                thumbnailHeight: 120, // Upload icon size
                thumbnailWidth: 120, // Upload icon size

                maxFiles: 4, // 업로드 파일수
                maxFilesize: 1000, // 최대업로드용량 : 100MB
                paramName: 'image', // 서버에서 사용할 formdata 이름 설정 (default는 file)
                parallelUploads: 4, // 동시파일업로드 수(이걸 지정한 수 만큼 여러파일을 한번에 넘긴다.)
                uploadMultiple: true, // 다중업로드 기능
                timeout: 300000, //커넥션 타임아웃 설정 -> 데이터가 클 경우 꼭 넉넉히 설정해주자

                addRemoveLinks: true, // 업로드 후 파일 삭제버튼 표시 여부
                dictRemoveFile: '', // 삭제버튼 표시 텍스트
                acceptedFiles: '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF', // 이미지 파일 포맷만 허용


                init: function () {

                    this.removeAllFiles();
                    // 최초 dropzone 설정시 init을 통해 호출
                    let myDropzone = this; // closure 변수 (화살표 함수 쓰지않게 주의)

                    // 서버에 제출 submit 버튼 이벤트 등록
                    document.querySelector('[name="add_form"]').onsubmit = function () {
                        event.preventDefault();

                        save1(myDropzone)
                    };


                    // 업로드한 파일을 서버에 요청하는 동안 호출 실행
                    this.on('sending', function (file, xhr, formData) {
                        //console.log('보내는중');
                    });

                    // 서버로 파일이 성공적으로 전송되면 실행
                    this.on('success', function (file, responseText) {
                        //console.log('성공');
                    });

                    // 업로드 에러 처리
                    this.on('error', function (file, errorMessage) {
                        if (errorMessage != 'Upload canceled.') {
                            pop_alert(errorMessage);
                        }
                        this.removeFile(file);

                    });

                    this.on("maxfilesexceeded", function (file) {
                        this.removeAllFiles();
                        this.addFile(file);
                    });

                },

            });
            break;
        //내가쓴 글 보기
        case 2:
            dropzone = new Dropzone("li.dropzone", {
                url: 'https://httpbin.org/post', // 파일을 업로드할 서버 주소 url.
                method: 'post', // 기본 post로 request 감. put으로도 할수있음
                autoProcessQueue: false, // 자동으로 보내기. true : 파일 업로드 되자마자 서버로 요청, false : 서버에는 올라가지 않은 상태. 따로 this.processQueue() 호출시 전송
                clickable: true, // 클릭 가능 여부
                autoQueue: false, // 드래그 드랍 후 바로 서버로 전송
                createImageThumbnails: true, //파일 업로드 썸네일 생성

                thumbnailHeight: 120, // Upload icon size
                thumbnailWidth: 120, // Upload icon size

                maxFiles: 4, // 업로드 파일수
                maxFilesize: 1000, // 최대업로드용량 : 100MB
                paramName: 'image', // 서버에서 사용할 formdata 이름 설정 (default는 file)
                parallelUploads: 4, // 동시파일업로드 수(이걸 지정한 수 만큼 여러파일을 한번에 넘긴다.)
                uploadMultiple: true, // 다중업로드 기능
                timeout: 300000, //커넥션 타임아웃 설정 -> 데이터가 클 경우 꼭 넉넉히 설정해주자

                addRemoveLinks: true, // 업로드 후 파일 삭제버튼 표시 여부
                dictRemoveFile: '', // 삭제버튼 표시 텍스트
                acceptedFiles: '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF', // 이미지 파일 포맷만 허용


                init: function () {







                    // 최초 dropzone 설정시 init을 통해 호출
                    var myDropzone = this; // closure 변수 (화살표 함수 쓰지않게 주의)

                    if (data.result2 != undefined && data.result2.length > 0) {

                        data.result2.forEach(element => {
                            let dt = element;
                            fetch(resourcePath + dt.f_path + dt.f_unique)
                                .then(res => res.blob())
                                .then((currentBlob) => {
                                    //console.log(currentBlob)
                                    var generateFile = new File([currentBlob], dt.f_unique, {
                                        type: currentBlob.type
                                    });
                                    generateFile.seq = dt.f_seq;
                                    myDropzone.addFile(generateFile);
                                });
                        });



                    }


                    // 서버에 제출 submit 버튼 이벤트 등록
                    document.querySelector('[name="add_form"]').onsubmit = function () {
                        event.preventDefault();

                        save1(myDropzone)
                    };


                    // 업로드한 파일을 서버에 요청하는 동안 호출 실행
                    this.on('sending', function (file, xhr, formData) {
                        //console.log('보내는중');
                    });

                    // 서버로 파일이 성공적으로 전송되면 실행
                    this.on('success', function (file, responseText) {
                        //console.log('성공');
                    });

                    // 업로드 에러 처리
                    this.on('error', function (file, errorMessage) {
                        if (errorMessage != 'Upload canceled.') {
                            pop_alert(errorMessage);
                        }
                        this.removeFile(file);

                    });

                    this.on("maxfilesexceeded", function (file) {
                        this.removeAllFiles();
                        this.addFile(file);
                    });

                    this.on("complete", function (file) {
                        //console.log(data.result2)
                    });
                    this.on('addedfile', function (file) {


                    })
                    this.on("removedfile", function (file) {
                        data.length = 0;
                    });
                },

            });
            break;
        //다른사람글 보기
        default:
            dropzone = new Dropzone("li.dropzone", {
                url: 'https://httpbin.org/post', // 파일을 업로드할 서버 주소 url.
                method: 'post', // 기본 post로 request 감. put으로도 할수있음
                autoProcessQueue: false, // 자동으로 보내기. true : 파일 업로드 되자마자 서버로 요청, false : 서버에는 올라가지 않은 상태. 따로 this.processQueue() 호출시 전송
                clickable: false, // 클릭 가능 여부
                autoQueue: false, // 드래그 드랍 후 바로 서버로 전송
                createImageThumbnails: true, //파일 업로드 썸네일 생성

                thumbnailHeight: 120, // Upload icon size
                thumbnailWidth: 120, // Upload icon size

                maxFiles: 4, // 업로드 파일수
                maxFilesize: 1000, // 최대업로드용량 : 100MB
                paramName: 'image', // 서버에서 사용할 formdata 이름 설정 (default는 file)
                parallelUploads: 4, // 동시파일업로드 수(이걸 지정한 수 만큼 여러파일을 한번에 넘긴다.)
                uploadMultiple: true, // 다중업로드 기능
                timeout: 300000, //커넥션 타임아웃 설정 -> 데이터가 클 경우 꼭 넉넉히 설정해주자


                acceptedFiles: '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF', // 이미지 파일 포맷만 허용


                init: function () {
                    // 최초 dropzone 설정시 init을 통해 호출
                    var myDropzone = this; // closure 변수 (화살표 함수 쓰지않게 주의)

                    if (data.result2 != undefined && data.result2.length > 0) {

                        data.result2.forEach(element => {
                            let dt = element;
                            fetch(resourcePath + dt.f_path + dt.f_unique)
                                .then(res => res.blob())
                                .then((currentBlob) => {
                                    //console.log(currentBlob)
                                    var generateFile = new File([currentBlob], dt.f_unique, {
                                        type: currentBlob.type
                                    });
                                    generateFile.seq = dt.f_seq;
                                    myDropzone.addFile(generateFile);
                                });
                        });



                    }




                    // 업로드한 파일을 서버에 요청하는 동안 호출 실행
                    this.on('sending', function (file, xhr, formData) {
                        //console.log('보내는중');
                    });

                    // 서버로 파일이 성공적으로 전송되면 실행
                    this.on('success', function (file, responseText) {
                        //console.log('성공');
                    });

                    // 업로드 에러 처리
                    this.on('error', function (file, errorMessage) {
                        if (errorMessage != 'Upload canceled.') {
                            pop_alert(errorMessage);
                        }
                        this.removeFile(file);

                    });

                    this.on("maxfilesexceeded", function (file) {
                        this.removeAllFiles();
                        this.addFile(file);
                    });

                },

            });
            break;
    }





}