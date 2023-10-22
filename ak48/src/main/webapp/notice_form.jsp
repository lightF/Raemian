<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=4">
<link rel="stylesheet" href="./admin_css.css?v=4">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./admin/css/notice.css?v=4">
<!-- 신규추가된 css 파일 끝-->
<title>관리자 페이지</title>
</head>
<body>
<div class="menusize">
    <ul id="menus">
        <li class="topmenu1">ADMINISTRATOR</li>
        <li class="topmenu2"><a href="./info_main.jsp" class="atag">환경설정</a></li>
         <li class="topmenu3"><a href="reserve_main.jsp">회원관리</a></li>
        <li class="topmenu2"><a href="./notice_main.jsp" class="atag">공지사항 관리</a></li>
        <li class="topmenu2"><a href="./faq_main.jsp" class="atag">FAQ</a></li>
        <li class="topmenu2"><a href="./index.jsp" class="atag">관리자현황</a></li>
        <li class="topmenu3">${loginAdmin.getAname()}님 환영합니다  <a href="./logout" class="atag">[로그아웃]</a></li>
    </ul>
 </div>
 <form action="/notice/Insert" method="post">
	<!-- 공지사항 관리 시작 -->
	<main class="page_main">
		<section class="page_section">
				<div class="listbody">
					<div class="protitle">공지사항 관리</div>
					<div class="procho">
						<section class="search_part">
							<ol>
								<li>공지사항 검색</li>
								<li class="prochoL procfont">검색형식</li>
								<li class="prochoL "><select class="kosel"
									id="search_part1" onchange="search_part1" required>
										<option value="2">글쓴이</option>
										<option value="4">제목</option>
								</select></li>
								<li>
									<!-- <input type="text" id="sdate2" class="search_input"> --> <input
									type="text" name="search_text1" id="search_text1"
									placeholder="검색어를 입력하세요">
									<button type="button" class="proclick" id="search">검색</button>
								</li>
								<li></li>
								<li></li>
							</ol>
						</section>
						<section class="data_listsview">
							<div class="protaball">
								<table width="1100">
									<!-- <thead>
								<tr style="color: white; background-color: rgb(67, 66, 66);">
									<td class="listcenter">번호</td>
									<td class="listcenter">제목</td>
									<td class="listcenter">첨부파일 유/무</td>
									<td class="listcenter">조회수</td>
									<td class="listcenter">글쓴이</td>
									<td class="listcenter">등록일</td>
									<td class="listcenter">삭제</td>
								</tr>
							</thead> -->
									<table width="1100">
										<thead>
											<tr style="color: white; background-color: rgb(67, 66, 66);">
												<th class="listcenter">번호</th>
												<th class="listcenter">제목</th>
												<th class="listcenter">첨부파일 유/무</th>
												<th class="listcenter">조회수</th>
												<th class="listcenter">글쓴이</th>
												<th class="listcenter">등록일</th>
											</tr>
										</thead>

										<c:forEach var="item" items="${total_list}">
											<tr>
												<td>${item[0]}</td>
												<td>
												<a href="boardContent.do?idx=${item.idx}">${item.title}
												</a></td>
												<td>${item.getidx}</td>
												<td>${item.writer}</td>
												<td>${item.title}</td>
												<td>${item[2]}</td>
												<td>${item[3]}</td>
												<td>${item[4]}</td>
												<td>${item[5]}</td>
											</tr>
										</c:forEach>
										<!-- 결과를 표시할 영역 시작-->
										<tbody id="searchResults">
										</tbody>
										<!-- 결과를 표시할 영역 종료-->
									</table>
							</div>
							<div class="propagebt">
								<ul class="pagination">
									<li><a href="#">&laquo; Previous</a></li>
									<li><a href="#" class="active">1</a></li>
									<li><a href="#">2</a></li>
									<li><a href="#">3</a></li>
									<li><a href="#">4</a></li>
									<li><a href="#">5</a></li>
									<li><a href="#">Next &raquo;</a></li>
								</ul>
							</div>
							</table>
							</div>
							<ul>
								<li>1</li>
								<li style="text-align: left; justify-content: flex-start;">공지사항
									샘플...</li>
								<li>O</li>
								<li>0</li>
								<li>관리자</li>
								<li>2023-10-06</li>
								<li><input type="button" value="삭제" class="delbtn">
								</li>
							</ul>
							<ul class="nodatas">
								<li>등록된 공지사항이 없습니다.</li>
							</ul>
							<span class="notice_btns"> 
								<input type="button" value="글쓰기" class="meno_btn2" onclick="goWritePage()">
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
		
		<!-- 페이징 START -->
		<div style="text-align: center">
			<ul class="pagination">
				<!-- 이전처리 -->
				<c:if test="${pageMaker.prev}">
					<li class="paginate_button previous"><a
						href="${pageMaker.startPage-1}">◀</a></li>
				</c:if>
				<!-- 페이지번호 처리 -->
				<c:forEach var="pageNum" begin="${pageMaker.startPage}"
					end="${pageMaker.endPage}">
					<li
						class="paginate_button ${pageMaker.cri.page==pageNum ? 'active' : ''}"><a
						href="${pageNum}">${pageNum}</a></li>
				</c:forEach>
				<!-- 다음처리 -->
				<c:if test="${pageMaker.next}">
					<li class="paginate_button next"><a
						href="${pageMaker.endPage+1}">▶</a></li>
				</c:if>
			</ul>
		</div>
		<!-- END -->
		<form id="pageFrm" action="${cpath}/notice/list" method="post">
			<!-- 게시물 번호(idx)추가 -->
			<input type="hidden" id="page" name="page"
				value="${pageMaker.cri.page}" /> <input type="hidden"
				name="perPageNum" value="${pageMaker.cri.perPageNum}" /> <input
				type="hidden" name="type" value="${pageMaker.cri.type}" /> <input
				type="hidden" name="keyword" value="${pageMaker.cri.keyword}" />
		</form>
	</main>
	</form>
	<!-- 공지사항 관리 끝 -->
	<footer>
		<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All
			rights reserved</div>
	</footer>
</body>
</html>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
	$(document).ready(function() {
		$("#search").click(function() {
			//사용자가 입력한 데이터 가져오기
			//var searchMembership = $("#search_membership1").val(); //소속구분
			var searchPart = $("#search_part1").val(); //검색구분
			var searchText = $("#search_text1").val(); //검색어

			//입력된 데이터를 객체로 저장
			var formData = {
				//searchMembership : searchMembership,
				searchPart : searchPart,
				searchText : searchText
			};

			// AJAX 요청 보내기
			$.ajax({
				type : "POST", // HTTP 메소드 선택 (GET 또는 POST)
				url : "/notice/getList.do", // 서버의 컨트롤러 URL
				data : formData, // 전송할 데이터
				dataType : "json", // 응답 데이터 타입 (JSON을 사용할 경우)
				success : function(response) {
					//서버에서 받은 데이터를 활용하여 alert 띄우기
					//var message = response.message;
					//alert(message);
					displayResults(response);
				},
				error : function(xhr, status, error) {
					// 오류 응답의 responseText 출력
					//console.log("오류 발생: " + xhr.responseText);
					// 오류 처리 코드 추가
					//alert("오류가 발생했습니다.");
					//alert(xhr.responseText);
					location.reload();
				}
			});
		});
	});

	function displayResults(results) {
		//console.log("results: " + results);

		var tableBody = "";
		if (results.length === 0) {
			tableBody += "<tr height='30'><td colspan='9'className='listcenter'>일치하는 결과가 없습니다.</td></tr>";
		} else {
			//console.log("i: " + i);

			for (var i = 0; i < results.length; i++) {
				tableBody += "<tr>";
				tableBody += "<td>" + results[i].idx + "</td>"; //번호
				tableBody += "<td>" + results[i].title + "</td>"; //제목
				tableBody += "<td>" + results[i].hasattachment + "</td>"; //첨부파일 유/무
				tableBody += "<td>" + results[i].views + "</td>"; //조회수
				tableBody += "<td>" + results[i].writer + "</td>"; //글쓴이
				tableBody += "<td>" + results[i].indate + "</td>"; //등록일
				tableBody += "<td><button onclick='handleButtonClick(" + i
						+ ")'>삭제</button></td>"; //삭제
				tableBody += "</tr>";
			}
		}

		$("#searchResults").html(tableBody);
	}
	function noticeForm() {
		  window.location.href = "notice_write.jsp";
		}


	//입력변수 초기화
	function resetSearch() {
		$("#searchInput").val(""); // 입력 필드 초기화
		search(); // 전체 검색 실행
	}
</script>
</html>
