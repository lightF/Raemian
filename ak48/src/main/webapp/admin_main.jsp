<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=7">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<title>관리자 페이지</title>
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
				<li class="topmenu3"><span>
				<%=session.getAttribute("name")%>
				</span>님 환영합니다 <input type="hidden" value='<%=session.getAttribute("name")%>
				' id="name"> <%
			 if (session.getAttribute("msg") != null) {
 %>
					<script>alert("<%=session.getAttribute("msg")%>
					");
				</script> <%
 }
 %>
					<p>
						<c:out value="${sessionScope.userList.name}" />
						님
					</p> <!-- 이름 출력 --> <a href="/index.jsp">[로그아웃]</a></li>
			</ul>
		</div>
		<div class="menuline"></div>
	</nav>
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
							<li class="ad_mainbox"></li>
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