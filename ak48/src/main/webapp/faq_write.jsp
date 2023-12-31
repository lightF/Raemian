<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
        <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=2">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=2">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./admin/css/notice.css?v=2">
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
        <a href="">[로그아웃]</a></li>
    </ul>
 </div>
<div class="menuline"></div> 
</nav>
<!-- FAQ 등록 시작 -->
<main class="page_main">
<section class="page_section">
<div class="listbody">
    <div class="protitle">FAQ 등록</div>
    <div class="procho">
    <form id="faq" action="./faq_main.jsp" method="post">
       <section class="data_listsview">
       <ol>
       <li>질문 제목</li>
       <li><input type="text" class="notice_in in1"></li>
       <li>글쓴이</li>
       <li><input type="text" class="notice_in in2" readonly></li> 
       <li style="height:520px;">질문 내용</li>
       <li style="height:520px; padding-top: 10px;">
       <textarea class="notice_in in3"></textarea>
       </li>      
       </ol>
       <span class="notice_btns">
       <input type="button" value="FAQ 등록" class="meno_btn2" id="faq_btn"></span>
       </section>
       </form>
    </div>
</div> 
</section>
</main>
<!-- FAQ 등록 끝 -->
<footer>
<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All rights reserved</div>    
</footer>
</body>
<script src="./ckeditor/ckeditor.js?v=1"></script>
<script>
document.querySelector("#faq_btn").addEventListener("click",function(){
	faq.submit();
})
let texts = document.querySelector("#texts")
</script>
<!-- FAQ 등록 끝 -->
<footer>
<%@include file="./footer.jsp" %>    
</footer>
</html>