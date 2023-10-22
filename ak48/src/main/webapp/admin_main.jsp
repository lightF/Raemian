<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=7">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<title>관리자 페이지</title>
<div class="menusize">
    <ul id="menus">
        <li class="topmenu1">ADMINISTRATOR</li>
        <li class="topmenu2" onclick="window.location.href='info_main.jsp'">환경설정</li>
        <li class="topmenu3">회원관리</li>
        <li class="topmenu2">공지사항 관리</li>
        <li class="topmenu2">FAQ></li>
        <li class="topmenu2">ㅇㅇㅇ</li>
        <li class="topmenu3" onclick="window.location.href='config_main.jsp'">관리자 현황</li>
        <a href="./index.jsp" class="atag">[로그아웃]</a></li>
    </ul>
 </div>
<div class="menuline"></div>
</head>
<body>
	<main>
		<section>
			<div class="ad_top"></div>

			<div class="ad_mainall">
				<div class="ad_main">
					<div class="ad_main1">
						<ul>
							<li class="ad_maintitle">일반회원</li>
							<li class="ad_mainbox"></li>
						</ul>
					</div>
				</div>
				<div class="ad_main">
					<div class="ad_main1">
						<ul>
							<li class="ad_maintitle">1:1 문의사항</li>
							<li class="ad_mainbox"></li>
						</ul>
					</div>
				</div>
				<div class="ad_main">
      <div class="ad_main1">
         <ul>
            <li class="ad_maintitle">예약현황</li>
            <li class="ad_mainbox2">
            </li> 
         </ul>
      </div>
   </div>
			</div>
			<div class="ad_botom"></div>
		</section>
	</main>
	<footer>
		<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All
			rights reserved</div>
	</footer>
	<script>
		
	</script>
</body>
</html>