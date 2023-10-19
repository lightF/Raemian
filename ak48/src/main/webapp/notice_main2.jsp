<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/page_default.css?v=4">
<link rel="stylesheet" href="./admin_css.css?v=4">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<!-- 신규추가된 css 파일 -->
<link rel="stylesheet" href="./admin/css/notice.css?v=4">
<!-- 신규추가된 css 파일 끝-->
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
        <li class="topmenu3">홍길동님 환영합니다  
        <a href="index.jsp">[로그아웃]</a></li>
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
        <li>제목</li>
        <li>첨부파일 유/무</li>
        <li>조회수</li>
        <li>글쓴이</li>
        <li>등록일</li>
        <li>삭제</li>
    </ul>
    <c:forEach var="nt" items="${list}">
    <ul>
        <li><c:out value="${nt.title}" /></li> <!-- Display the notice number (assuming it's 'idx') -->
        <li><c:out value="${nt.title}" /></li> <!-- Display the notice title -->
        <li><c:out value="${nt.title}" /></li> <!-- Display whether there is an attachment -->
        <li><c:out value="${nt.title}" /></li> <!-- Display the number of views (assuming it's 'views') -->
        <li><c:out value="${nt.title}" /></li> <!-- Display the writer's name -->
        <li><c:out value="${nt.title}" /></li> <!-- Display the registration date (assuming it's 'indate') -->
        <li><c:out value="${nt.title}" /></li> <!-- Display the delete status (assuming it's 'del') -->
    </ul>
	</c:forEach>
       <ul>
        <li>1</li>
        <li style="text-align: left; justify-content: flex-start;">공지사항 샘플...</li>
        <li>O</li>
        <li>0</li>
        <li>관리자</li>
        <li>2023-10-06</li>
       <li>
            <input type="button" value="삭제" class="delbtn">
        </li>
       </ul>
       <ul class="nodatas">
        <li>등록된 공지사항이 없습니다.</li>
       </ul>
       <span class="notice_btns">
       <input type="button" value="글쓰기" class="meno_btn2"></span>
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
        <li class="paginate_button previous">
          <a href="${pageMaker.startPage-1}">◀</a>
        </li>
      </c:if>      
      <!-- 페이지번호 처리 -->
          <c:forEach var="pageNum" begin="${pageMaker.startPage}" end="${pageMaker.endPage}">
	         <li class="paginate_button ${pageMaker.cri.page==pageNum ? 'active' : ''}"><a href="${pageNum}">${pageNum}</a></li>
		  </c:forEach>    
      <!-- 다음처리 -->
      <c:if test="${pageMaker.next}">
        <li class="paginate_button next">
          <a href="${pageMaker.endPage+1}">▶</a>
        </li>
      </c:if> 
        </ul>
      </div>
      <!-- END -->
      <form id="pageFrm" action="${cpath}/notice/list" method="post">
         <!-- 게시물 번호(idx)추가 -->         
         <input type="hidden" id="page" name="page" value="${pageMaker.cri.page}"/>
         <input type="hidden" name="perPageNum" value="${pageMaker.cri.perPageNum}"/>
         <input type="hidden" name="type" value="${pageMaker.cri.type}"/>
         <input type="hidden" name="keyword" value="${pageMaker.cri.keyword}"/>
      </form>      
</main>
<!-- 공지사항 관리 끝 -->
<footer>
<div class="menusize">Copyright ⓒ 2023 Raemian 분양안내 관리 시스템 All rights reserved</div>    
</footer>
</body>
</html>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
 <script>
    $(document).ready(function() {
        function datalist(data) {
            var list = document.getElementById("List");
            data.forEach(function (nt) {
                var listItem = document.createElement("ul");
                listItem.innerHTML = `
                    <li>${nt.idx}</li>
                    <li>${nt.title}</li>
                    <li>${nt.attachment ? 'Yes' : 'No'}</li>
                    <li>${nt.views}</li>
                    <li>${nt.writer}</li>
                    <li>${nt.indate}</li>
                    <li>${nt.del ? 'Yes' : 'No'}</li>`;
                list.appendChild(listItem);
            });
        }

        // Make an AJAX request to fetch notice data
        $.ajax({
            type: "POST", // or "POST" depending on your server-side implementation
            url: "notice/Listss", // Specify the URL for fetching notices
            success: function(response) {
                // Assuming the response is an array of notices
                datalist(response);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
</script>
</html>
