<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>

<!-- /WEB-INF/views/admin/css/faq_main.jsp -->
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=4">
<link rel="stylesheet" href="./admin_css.css?v=4">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./admin/css/notice.css?v=4">
<!-- 신규추가된 css 파일 끝-->
<title>관리자 페이지</title>
<script>
</script>
</head>
<body>
	<%@include file="./top.jsp"%>
	<!-- FAQ 리스트 시작 -->
	<main class="page_main">
		<section class="page_section">
			<div class="listbody">
				<div class="protitle">FAQ 관리</div>
				<div class="procho">
					<section class="search_part">
						<ol>
							<li>FAQ내용 검색</li>
							<li>
								<form action="getList.do" method="get" id="searchFaq">
									<input type="text" class="search_input" name="search"
										value="${search}"> <input type="button" value="검색"
										class="datebtn" id="faqSearchBtn">
								</form>
							</li>
							<li></li>
							<li></li>
						</ol>
					</section>
					<section class="data_listsview2">
						<ul>
							<li>QA</li>
							<li>질문/답변</li>
							<li>글쓴이</li>
							<li>등록일</li>
							<li>삭제</li>
						</ul>

						<c:forEach var="item" items="${total_list}">
							<tr>
								<td>${item[0]}</td>
								<td>${item[1]}</td>
								<td>${item[2]}</td>
								<td>${item[3]}</td>
								<td>${item[4]}</td>
							</tr>
						</c:forEach>
						<!-- set : 해당 값을 다른 표현식 이름으로 활용할 수 있도록 셋팅하는 태그 -->
						<c:set var="page" value="${total_person/2}" />
						<!-- FAQ 샘플 HTML 코드 시작 -->
						<span id="faqSpan"> <c:forEach items="${faqs}" var="faq">
								<ul class="node">
									<li>Q</li>
									<li style="text-align: left; justify-content: flex-start;">${faqs.getFquestion()}</li>
									<li>${faqs.getFwriter()}</li>
									<li>2023-10-06</li>
									<li><input type="button" value="삭제" class="delbtn"
										onclick="deleteFaq(${faqs.getFno()})"></li>
								</ul>
								<!-- display:none 또는 display:flex 로 해야합니다. -->
								<ol style="display: none;">
									<li>A</li>
									<li style="text-align: left; justify-content: flex-start;">${faqs.getFanswer()}</li>
								</ol>
							</c:forEach>
						</span>
						<!-- FAQ 샘플 testsetestset HTML 코드 끝 -->
						<c:if test="${faqs==null}">
							<ul class="nodatas">
								<li>등록된 FAQ 내용 없습니다.</li>
							</ul>
						</c:if>
						<span class="notice_btns"> <input type="button"
							value="FAQ 등록" class="meno_btn2"></span>
						<aside>
							<div class="page_number">
								<c:choose>
									<c:when test="${currentPage > 1}">
										<a
											href="./faqPage?pageNumber=${currentPage - 1}&search=${search}"><</a>
									</c:when>
									<c:otherwise>
										<span><</span>
									</c:otherwise>
								</c:choose>
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
								<form id="pageFrm" action="${cpath}/faq/list" method="get">
									<!-- 게시물 번호(idx)추가 -->
									<input type="hidden" id="page" name="page"
										value="${pageMaker.cri.page}" /> <input type="hidden"
										name="perPageNum" value="${pageMaker.cri.perPageNum}" />
								</form>
							</div>
						</aside>
					</section>
				</div>
			</div>
		</section>
	</main>
	<!-- FAQ 리스트 끝 -->
	<footer>
		<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All
			rights reserved</div>
	</footer>
</body>
<script>
function deleteFaq(val){
	console.log(val)
	if(confirm("삭제시 데이터가 복구되지 않습니다 삭제하시겠습니까?")){
		fetch("./faqDelete", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "faqNumber=" + val
		}).then(function(response) {
			alert("삭제완료")
			return response.text();
		}).then(function(result) {
			location.href = "/faq_main.jsp"
		}).catch(function(error) {
			console.log("Data Error!!");
		});
	}
}
</script>
</html>