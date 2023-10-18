<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./css/notice.css?v=">
<!-- 신규추가된 css 파일 끝-->
<title>관리자 페이지</title>
<script>
</script>
</head>
<body>
<%@include file="./top.jsp" %>
<!-- 공지사항 등록 시작 -->
<main class="page_main">
<section class="page_section">
<div class="listbody">
    <div class="protitle">공지사항 등록</div>
    <div class="procho">
       <form id="notice" method="post" action="./noticeWrite" enctype="multipart/form-data">
       <section class="data_listsview">
       <ol>
       <li>공지제목</li>
       <li><input type="text" class="notice_in in1" name="ctitle"></li>
       <li>글쓴이</li>
       <li><input type="text"  class="notice_in in2" readonly name="cwriter"></li> <li style="height:520px;">내용</li>
       <li style="height:520px; padding-top: 10px;">
       <textarea class="notice_in in3" name="csection" id="texts"></textarea>
       </li>       
       <li>첨부파일</li>
       <li><input type="file" name="cfile"></li>   
       </ol>
       <span class="notice_btns">
       <input type="button" id="btn" value="글등록" class="meno_btn2"></span>
       </section>
       </form>
    </div>
</div> 
</section>
<script src="./ckeditor/ckeditor.js?v=1"></script>
<script>
document.querySelector("#btn").addEventListener("click",function(){
	notice.submit();
})
let texts = document.querySelector("#texts")
	CKEDITOR.replace("texts")
	CKEDITOR.config.resize_enabled = false;
</script>
</main>
<!-- 공지사항 등록 끝 -->
<footer>
<%@include file="./footer.jsp" %> 
</footer>
</body>
</html>