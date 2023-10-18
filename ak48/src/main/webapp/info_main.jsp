<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=333">
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
<!-- 환경설정 관리 시작 -->
<main class="page_main">
<section class="page_section">
<div class="listbody">
    <div class="protitle">환경설정 관리</div>
    <div class="procho">
       <section class="search_part">
        <ol>
        <li>세대정보 검색</li>
        <li>
        <input type="text" id="sdate2" class="search_input">
        <input type="button" value="검색" class="datebtn">
        </li>        
        <li></li>
        <li></li> 
        </ol>
       </section> 
       <section class="data_listsview">
       <ul>
        <li>번호</li>
        <li>세대타입 및 면적</li>
        <li>사용 유/무</li>
        <li>출력순서</li>
        <li>글쓴이</li>
        <li>등록일</li>
        <li>삭제</li>
       </ul>
       
       <ul style="height:140px;">
        <li>1</li>
        <li style="text-align: left; justify-content: flex-start;">
        <div class="info_img">
        <img src="#">   
        </div>
        <div class="info_text">
        <span>주거타입 : 내용</span>
        <span>주거전용 : 내용</span>
        <span>주거공용 : 내용</span>
        <span>기타공용 : 내용</span>
        <span>계약면적 : 내용</span>
        </div>
        </li>
        <li>O</li>
        <li>1</li>
        <li>관리자</li>
        <li>2023-10-06</li>
        <li>
            <input type="button" value="삭제" class="delbtn">
        </li>
       </ul>
       <ul class="nodatas">
        <li>등록된 세대타입 내용이 없습니다.</li>
       </ul>
       <span class="notice_btns">
       <input type="button" value="세대타입 생성" class="meno_btn2"></span>
       <aside>
        <div class="page_number">
           <ul>
           <li>1</li>      
           </ul>
        </div>
       </aside>
       </section>
    </div>
</div> 
</section>
</main>
<!-- 공지사항 관리 끝 -->
<footer>
<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All rights reserved</div>    
</footer>
</body>
</html>