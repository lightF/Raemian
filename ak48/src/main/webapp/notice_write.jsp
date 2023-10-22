<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=3">
<link rel="stylesheet" href="./admin_css.css?v=3">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./admin/css/notice.css?v=3">
<!-- 신규추가된 css 파일 끝-->
<title>관리자 페이지</title>
<script>
</script>
</head>
<body>
<nav>
<div class="menusize">
    <ul id="menus">
        <li class="topmenu1">ADMINISTRATOR</li>
        <li class="topmenu2">환경설정</li>
        <li class="topmenu2">회원관리</li>
        <li class="topmenu2">공지사항 관리</li>
        <li class="topmenu2">1:1 문의사항</li>
        <li class="topmenu2">예약현황</li>
        <li class="topmenu2">관리자현황</li>
        <li class="topmenu3">홍길동님 환영합니다  
        <a href="index.jsp">[로그아웃]</a></li>
    </ul>
 </div>
<div class="menuline"></div> 
</nav>
<!-- 공지사항 등록 시작 -->
<main class="page_main">
  <section class="page_section">
    <div class="listbody">
      <div class="protitle">공지사항 등록</div>
      <form action="notice/insert" method="post">
        <!-- Replace 'your_action_url_here' with the actual URL where the form should be submitted -->
        <div class="procho">
          <section class="data_listsview">
            <ol>
              <li>공지제목</li>
              <li>
              <input type="text" name="title"  class="notice_in in1"></li>
              <li>글쓴이</li>
              <li>
              <input type="text" name="writer" class="notice_in in2"></li>
              <li>내용</li>
              <li>
              <textarea name="content" class="notice_in in3"></textarea>
              </li>
              <li>첨부파일</li>
              <li><input type="file" name="file"></li>
            </ol>
          </section>
        </div>
        <span class="notice_btns">
          <input type="submit" value="글등록" class="meno_btn2">
        </span>
      </form>
    </div>
  </section>
</main>
<!-- 공지사항 등록 끝 -->
<footer>
<script src="./ckeditor/ckeditor.js?v=1"></script>
<script>
document.querySelector("#btn").addEventListener("click",function(){
	notice.submit();
})
let texts = document.querySelector("#texts")
	CKEDITOR.replace("texts")
	CKEDITOR.config.resize_enabled = false;
</script>
<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All rights reserved</div>    
</footer>
</body>
<script src="/code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
document.getElementById("meno_btn2").addEventListener("click", function() {
	  window.alert("등록되었습니다.");
});
</script>
</html>