<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<%@taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<c:set var="cpath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=2023090212">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<title>관리자 페이지</title>
</head>
<body>
	<div class="adbody">
	<c:if test="${empty ui}">
		<div class="adtitle">ADMINISTRATOR</div>
		<div class="admoom">
			<c:choose>
				<c:when test="${empty sessionScope.ui}">
					<p class="card-text">회원님 Welcome!</p>
					<form action="${cpath}/login/loginProcess" method="post">
						<div class="intotal">
							<div class="adin1">
								<input type= "text" name="id" class="loginid" id="id"value="" placeholder="아이디"/>
							</div> 
							<div class="adin2"> 
							 <input type= "password" name ="password" class="password" id="password" value="" placeholder="패스워드"/> 
							 </div> 
					 </div> 
					 <div class ="adbt"> 
					 	 <button type= "submit"class ="loginbt1" value="">로그인</button> 
						 <button type= "button"class = "loginbt2"
						 	onclick = "location.href='/admin_ship.jsp'">회원가입 </button> 
				 	 </div>
				 	 <h4 class="card-title">${ui.Name}</h4>
				  </form>
			 </c:when>
			 <c:otherwise>
			 	  <p>Welcome, ${sessionScope.ui.id}님!</p>
			 	  <!-- 로그아웃 버튼 등 추가적인 기능 구현 -->
			 </c:otherwise>
		 </c:choose>
	  </div>
   </c:if>
</div>
</body>
<script>

</script>
</html>