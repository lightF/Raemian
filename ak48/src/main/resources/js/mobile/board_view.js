document.addEventListener('DOMContentLoaded',function(){


    var seq = localStorage.getItem('bd_seq');

    if(seq){
        view(seq)
    }


     //클릭 모션 모음
     document.addEventListener('click',function(e){

        //이미지새창
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

     })
    


})





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
               
                    editeor3('contents',con,'',false)
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
                alert('게시글 데이터가 존재하지 않습니다.')
            }
            if(data.code == 1 && data.result2.length > 0){
                file_path = data.result2[0].f_path;
            }

        }, complete: function () {

        }
    });

}



//웹 에디터 화면 설정 function
function editeor3(title, contents, size, read) {

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