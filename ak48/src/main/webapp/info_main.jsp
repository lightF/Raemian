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
        <li class="topmenu2"><a href="./info_main.jsp" class="atag">환경설정</a></li>
        <li class="topmenu2"><a href="./admin_main.jsp" class="atag">회원관리</a></li>
        <li class="topmenu2"><a href="./info_main.jsp" class="atag">공지사항 관리</a></li>
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
        <form id="info" method="get" action="./infoWrite">
        <input type="text" id="sdate2" class="search_input" value="${search}" name="search">
         <input type="button"id="infoSearchBtn" value="검색" class="datebtn">
         </form>
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
       
       <c:forEach items="${infos}" var="info">
       <ul style="height:140px;">
        <li>${info.getIno()}</li>
        <li style="text-align: left; justify-content: flex-start;">
        <div class="info_img">
        <img src="${info.getIimagedir()}">   
        </div>
        <div class="info_text">
        <span>주거타입 : ${info.intype()}</span>
        <span>주거전용 : ${info.info1()}</span>
        <span>주거공용 : ${info.info2()}</span>
        <span>기타공용 : ${info.info3()}</span>
        <span>계약면적 : ${info.info4()}</span>
        </div>
        </li>
        <li>${info.infouse()}</li>
        <li>${info.iorder()}</li>
        <li>${info.writer()}</li>
        <li>${info.indate()}</li>
        <li>
            <input type="button" value="삭제" class="delbtn" onclick="deleteInfo(${info.getIno()})">
        </li>
       </ul>
       </c:forEach>
       
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
       <input type="button" value="세대타입 생성" class="meno_btn2" onclick="location.href='./info_write.jsp'"></span>
       <aside>
        <div class="page_number">
         <c:choose>
       <c:when test="${currentPage > 1}">
        <a href="./config?pageNumber=${currentPage - 1}&search=${search}"><</a>
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
                <a href="./config?pageNumber=${page}&search=${search}">${page}</a>
            </c:otherwise>
        </c:choose>
    </c:forEach>
      <c:choose>
        <c:when test="${currentPage < totalPages}">
            <a href="./config?pageNumber=${currentPage + 1}&search=${search}">></a>
        </c:when>
        <c:otherwise>
            <span>></span>
        </c:otherwise>
    </c:choose>
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
<script>
function deleteInfo(val){
	console.log(val)
	if(confirm("삭제시 데이터가 복구되지 않습니다 삭제하시겠습니까?")){
		fetch("./infoDelete", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "infoNumber=" + val
		}).then(function(response) {
			alert("삭제완료")
			return response.text();
		}).then(function(result) {
			location.href = "./infoPage"
		}).catch(function(error) {
			console.log("Data Error!!");
		});
	}
}
document.querySelector("#infoSearchBtn").addEventListener("click",function(){
	info.submit();
})
</script>
</html>