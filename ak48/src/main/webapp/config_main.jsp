<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html xmlns:c="http://java.sun.com/jsp/jstl/core">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=7">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=7">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
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
				<li class="topmenu3"><span><%=session.getAttribute("name")%></span>님
					환영합니다 <a href="/index.jsp">[로그아웃]</a>
			</ul>
		</div>
		<div class="menuline"></div>
	</nav>


	<!-- 관리자 리스트 시작 -->
	<main class="page_main">
		<section class="page_section">
			<form id="frm" name="frm" method="post" action="/getList.do">
				<div class="listbody">
					<div class="adlisttitle">관리자 현황</div>
					<div class="procho">
						<ul>
							<li class="prochoL procfont">소속</li>
							<li class="prochoL "><select class="kosel"
								id="search_membership1" onchange="search_membership1" required>
									<option value="">전체</option>
									<option value="1">본사</option>
									<option value="2">경기도</option>
									<option value="3">인천</option>
									<option value="4">대전</option>
									<option value="5">세종</option>
									<option value="6">광주</option>
									<option value="7">대구</option>
									<option value="8">울산</option>
									<option value="9">전라남도</option>
									<option value="10">전라북도</option>
									<option value="11">충청남도</option>
									<option value="12">충청북도</option>
									<option value="13">경상남도</option>
									<option value="14">경상북도</option>
									<option value="15">제주도</option>
							</select></li>
						</ul>
					</div>
					<div class="procho">
						<ul>
							<li class="prochoL procfont">검색형식</li>
							<li class="prochoL ">
								<select class="kosel" id="search_part1" onchange="search_part1" required>
									<option value="1">이름</option>
									<option value="2">아이디</option>
									<option value="3">연락처</option>
								</select>
							</li>
							<li class="prochoL">
								<input type="text" name="search_text1" id="search_text1" placeholder="검색어를 입력하세요"></li>
							<li>
								<button type="button" class="proclick" id="search">검색</button>
							</li>
							<li class="prochoL">
								<button type="button" class="proclick" id="search2">전체</button>
							</li>
						</ul>
					</div>
					<div class="protaball">
						<table width="1100">
							<thead>
								<tr style="color: white; background-color: rgb(67, 66, 66);">
									<td class="listcenter">NO</td>
									<td class="listcenter">아이디</td>
									<td class="listcenter">이름</td>
									<td class="listcenter">패스워드</td>
									<td class="listcenter">소속</td>
									<td class="listcenter">연락처</td>
									<td class="listcenter">부서</td>
									<td class="listcenter">직급</td>
									<td class="listcenter">이메일</td>
									<!-- <td class="listcenter" >근태1</td> -->
									<td class="listcenter">근태</td>
									<td class="listcenter">IP</td>
									<td class="listcenter">적용</td>
								</tr>
							</thead>
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
				</div>
			</form>
			<!-- 관리자 리스트 끝 -->
		</section>
	</main>
	<footer>
		<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All
			rights reserved</div>
	</footer>
</body>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
	$(document).ready(function() {
		$("#search").click(function() {
			//사용자가 입력한 데이터 가져오기
			var searchMembership = $("#search_membership1").val(); //소속구분
			var searchPart = $("#search_part1").val(); //검색구분
			var searchText = $("#search_text1").val(); //검색어
			//입력된 데이터를 객체로 저장
			var formData = {
				searchMembership : searchMembership,
				searchPart : searchPart,
				searchText : searchText
			};

			// AJAX 요청 보내기
			$.ajax({
				type : "POST", // HTTP 메소드 선택 (GET 또는 POST)
				url : "/admin/getList.do", // 서버의 컨트롤러 URL
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
				tableBody += "<td>" + results[i].id + "</td>"; //아이디
				tableBody += "<td>" + results[i].name + "</td>"; //가입자명
				tableBody += "<td>" + results[i].password + "</td>"; //패스워드
				tableBody += "<td>" + results[i].membership + "</td>"; //소속
				tableBody += "<td>" + results[i].phone + "</td>"; //전번
				tableBody += "<td>" + results[i].dept + "</td>"; //부서
				tableBody += "<td>" + results[i].position + "</td>"; //직급
				tableBody += "<td>" + results[i].email + "</td>"; //이메일
				//tableBody += "<td>" + results[i].status + "</td>";		//근태(근무중/퇴직)
				tableBody += "<td><select id='dropdown_" + i + "'>"
						+ results[i].status + "<option value='1' "
						+ (results[i].status === '1' ? 'selected' : '')
						+ ">근무중</option>" + "<option value='2' "
						+ (results[i].status === '2' ? 'selected' : '')
						+ ">퇴직</option>" + "</select>" + "</td>";
				tableBody += "<td>" + results[i].ip + "</td>"; //ip
				tableBody += "<td><button onclick='handleButtonClick(" + i
						+ ")'>적용</button></td>";
				tableBody += "</tr>";
			}
		}

		$("#searchResults").html(tableBody);
	}

	$(document).ready(function() {
		$("#search2").click(function() {
			// AJAX 요청 보내기
			$.ajax({
				type : "POST", // HTTP 메소드 선택 (GET 또는 POST)
				url : "/admin/getList.do", // 서버의 컨트롤러 URL
				//data : formData, // 전송할 데이터
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
					location.reload();
					alert(xhr.responseText);
				}
			});
		});
	});

	//입력변수 초기화
	function resetSearch() {
		$("#searchInput").val(""); // 입력 필드 초기화
		search(); // 전체 검색 실행
	}
</script>
</html>