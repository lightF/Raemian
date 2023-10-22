<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=7">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<title>관리자 페이지</title>
</head>
<body>
	<%@include file="./top.jsp"%>
	<main>
		<section>
			<div class="ad_top"></div>

			<div class="ad_mainall">
				<div class="ad_main">
					<div class="ad_main1">
						<ul>
							<li class="ad_maintitle">일반회원</li>
							<li class="ad_mainbox"></li>
							<ol>
								<li>아이디</li>
								<li>고객명</li>
								<li>연락처</li>
								<li>이메일</li>
								<li>주소</li>
							</ol>
							<c:forEach items="${members}" var="m">
								<ol class="bgcancel">
									<li>${m.getMid()}</li>
									<li>${m.getMname()}</li>
									<li>${m.getMtel()}</li>
									<li>${m.getMemail()}</li>
									<li style="text-align: left;">(${m.getMadd1()})${m.getMadd2()}${m.getMadd3()}</li>
								</ol>
							</c:forEach>
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
            <ol>
                <li>아이디</li>
                <li>고객명</li>
                <li>연락처</li>
                <li>예약일자</li>
                <li>예약시간</li>
                <li>예약인원</li>
            </ol>
            <c:forEach items="${reserve}" var="r">
            <ol class="bgcancel">
                <li>${r.getRid()}</li>
                <li>${r.getRname()}</li>
                <li>${r.getRtel()}</li>
                <li>${r.getRreservedate()}</li>
                <li>${r.getRtime()}</li>
                <li>${r.getRperson()}</li>
            </ol>
            </c:forEach>  
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