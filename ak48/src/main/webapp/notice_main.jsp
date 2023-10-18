<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=3">
<link rel="stylesheet" href="./admin_css.css?v=3">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
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
				<li class="topmenu3">홍길동님 환영합니다 <a href="/index.jsp">[로그아웃]</a></li>
			</ul>
		</div>
		<div class="menuline"></div>
	</nav>
	<!-- 공지사항 관리 시작 -->
	<main class="page_main">
		<section class="page_section">
			<div class="listbody">
				<div class="protitle">공지사항 관리</div>
				<div class="procho">
					<section class="search_part">
						<ol>
							<li>공지사항 검색</li>
							<li><input type="text" id="sdate2" class="search_input">
								<input type="button" value="검색" class="datebtn"></li>
							<li></li>
							<li></li>
						</ol>
					</section>
					<section class="data_listsview">
						<ul>
							<li>번호</li>
							<li>제목</li>
							<li>첨부파일유/무</li>
							<li>조회수</li>
							<li>글쓴이</li>
							<li>등록일</li>
							<li>삭제</li>
						</ul>

						<c:forEach var="nt" items="${list}">
							<ul>
								<li>${nt.idx}</li>
								<li><a href="boardContent.do?idx=${nt.idx}">${nt.title}</a></li>
								<li>${nt.hasAttachment ? 'O' : 'X'}</li>
								<li>${nt.views}</li>
								<li>${nt.writer}</li>
								<li>${nt.indate}</li>
								<li><input type="button" value="삭제" class="delbtn"></li>
							</ul>
						</c:forEach>

						<ul class="nodatas">
							<li>등록된 공지사항이 없습니다.</li>
						</ul>
						<span class="notice_btns"> <input type="button" value="글쓰기" class="meno_btn2" id="btnWrite">
						</span>
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
		<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All
			rights reserved</div>
	</footer>
</body>
<script src="/code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$("#btnWrite").on("click", function() {
	  // Redirect to the "notice_write.jsp" page
	  window.location.href = "notice_write.jsp";
	});
</script>
</html>