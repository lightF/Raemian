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
<link rel="stylesheet" href="./admin/css/notice.css?v=">
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
        <li class="topmenu3">홍길동님 환영합니다  <a href="">[로그아웃]</a></li>
    </ul>
 </div>

<div class="menuline"></div> 
</nav>
<!-- 세대정보 입력 시작 -->
<main class="page_main">
<section class="page_section">
<div class="listbody">
    <div class="protitle">환경설정 등록</div>
    <div class="procho">
    <form id="frm" method="post" action="./info/infoInsert.do"> 
       <section class="data_listsview">
       <ol>
       <li>주거타입</li>
       <li><input type="text" class="notice_in in2"> ※ 예) 74A 타입</li>
       <li>글쓴이</li>
       <li><input type="text" class="notice_in in2" readonly></li> <li>주거전용</li>
       <li><input type="text" class="notice_in in2">㎡&nbsp;&nbsp;&nbsp;※ 숫자만 입력하세요</li>
       <li>주거공용</li>
       <li><input type="text" class="notice_in in2">㎡&nbsp;&nbsp;&nbsp;※ 숫자만 입력하세요</li>
       <li>기타공용</li>
       <li><input type="text" class="notice_in in2">㎡&nbsp;&nbsp;&nbsp;※ 숫자만 입력하세요</li>
       <li>계약면적</li>
       <li><input type="text" class="notice_in in2">㎡&nbsp;&nbsp;&nbsp;※ 숫자만 입력하세요</li>
       <li>이미지 URL</li>
       <li><input type="text" class="notice_in in1">&nbsp;&nbsp;&nbsp;예시) http://abc.co.kr/123.jpg</li> 
       <li>사용 유/무</li>
       <li><input type="radio" class="radio_txt" checked>사용함 <input type="radio" class="radio_txt">사용안함</li>
       <li>출력순서</li>
       <li><input type="text" class="notice_in in2">&nbsp;&nbsp;&nbsp;※ 숫자만 입력하세요 단, 동일한 이름일 경우 데이터 등록된 순으로 출력 됩니다.</li>
       </ol>
       <span class="notice_btns">
      <input type="button" id="btn" value="주거타입 등록" class="meno_btn2"></span>
       </section>
       </form>
    </div>
</div> 
</section>
</main>
<!-- 세대정보 입력 끝 -->
<footer>
<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All rights reserved</div>    
</footer>
</body>
<script>
document.querySelector("#btn").addEventListener("click", function() {
	frm.submit();
})
</script>
</html>