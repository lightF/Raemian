<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=${date}">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=${date}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./admin/css/notice.css?v=${date}">
<!-- 신규추가된 css 파일 끝-->
<title>관리자 페이지</title>
<script>
</script>
</head>
<body>
<div class="menusize">
    <ul id="menus">
        <li class="topmenu1">ADMINISTRATOR</li>
        <li class="topmenu2">환경설정</li>
         <li class="topmenu3"></li>
        <li class="topmenu2"></li>
        <li class="topmenu2">FAQ</li>
        <li class="topmenu2"></li>
        <li class="topmenu3">${loginAdmin.getAname()}님 환영합니다  <a href="./logout" class="atag">[로그아웃]</a></li>
    </ul>
 </div>
<main class="page_main">
<section class="page_section">
<div class="listbody">
    <div class="protitle">공지사항 관리</div>
    <div class="procho">
       <section class="search_part">
        <ol>
        <li>공지사항 검색</li>
        <li>
        <form action="./notice/getList" method="get" id="searchNotice">
        <input type="text" id="sdate2" class="search_input" name="search" value="${search}">
        <input type="submit" value="검색" class="datebtn">
        </form>
        </li>        
        <li></li>
        <li></li> 
        </ol>
       </section> 
       <section class="data_listsview">
       <ul>
        <li>번호</li>
        <li>제목</li>
        <li>첨부파일 유/무</li>
        <li>조회수</li>
        <li>글쓴이</li>
        <li>등록일</li>
        <li>삭제</li>
       </ul>
       <c:forEach var="nt" items="${list}">
            <ul>
                <li>${nt.idx}</li>
                <li>${nt.title}</li>
                <li>${nt.hasattachment}</li>
                <li>${nt.views}</li>
                <li>${nt.writer}</li>
                <li>${nt.indate}</li>
                <li>
                <form action="/deleteNotice" method="post">
                <input type="hidden" name="id" value="${nt.id}">
                <input type="submit" value="삭제" class="delbtn">
                 </form>
                </li>
            </ul>
        </c:forEach>
       <c:if test="${notices==null}">
       <ul class="nodatas">
        <li>등록된 공지사항이 없습니다.</li>
       </ul>
        </c:if>
       <span class="notice_btns">
       <input type="button" value="글쓰기" class="meno_btn2" onclick="location.href='./notice_write.jsp'"></span>
       <aside>
        <div class="page_number">
        <c:choose>
       <c:when test="${currentPage > 1}">
        <a href="./noticeConfig?pageNumber=${currentPage - 1}&search=${search}"><</a>
       </c:when>
        <c:otherwise>
            <span><</span>
        </c:otherwise>
    </c:choose>
   <c:forEach begin="1" end="${totalPages}" var="page">
        <c:choose>
            <c:when test="${page == currentPage}">
                <span>${page}</span>
            </c:when>
            <c:otherwise>
                <a href="./noticeConfig?pageNumber=${page}&search=${search}">${page}</a>
            </c:otherwise>
        </c:choose>
    </c:forEach>
     <c:choose>
        <c:when test="${currentPage < totalPages}">
            <a href="./noticeConfig?pageNumber=${currentPage + 1}&search=${search}">></a>
        </c:when>
        <c:otherwise>
            <span>></span>
        </c:otherwise>
    </c:choose>
        </div>
       </aside>
       </section>
    </div>
</div> 
</section>
</main>
<!-- 공지사항 관리 끝 -->
<footer>
<%@include file="./footer.jsp" %> 
</footer>
</body>
<script>
function deleteNotice(val){
	console.log(val)
	if(confirm("삭제시 데이터가 복구되지 않습니다 삭제하시겠습니까?")){
		fetch("./noticeDelete", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "noticeNumber=" + val
		}).then(function(response) {
			alert("삭제완료")
			return response.text();
		}).then(function(result) {
			location.href = "./noticeConfig"
		}).catch(function(error) {
			console.log("Data Error!!");
		});
	}
}
function linked(val){
	location.href="./notice/"+val;
}
</script>
</html>