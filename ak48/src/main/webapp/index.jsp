<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="cpath" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=2023090212">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
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
						<form action="/login/loginProcess" method="post"
							onsubmit="return validateForm()">
							<div class="intotal">
								<div class="adin1">
									<input type="text" name="id" class="loginid" value=""
										placeholder="아이디" />
								</div>
								<div class="adin2">
									<input type="password" name="password" value=""
										placeholder="패스워드" />
								</div>
							</div>
							<div class="adbt">
								<button type="submit" class="loginbt1" value="로그인">로그인</button>
								<button type="button" class="loginbt2"
									onclick="location.href='/admin_ship.jsp'">회원가입</button>
							</div>
						</form>
						<h4 class="card-title">${ui.Name}</h4>
					</c:when>
					<c:otherwise>
						<p>Welcome, ${sessionScope.ui.id}님!</p>
						<form action="${cpath}/login/logoutProcess" method="post">
							<button type="submit" class="btn btn-primary form-control">로그아웃</button>
						</form>
					</c:otherwise>
				</c:choose>
			</div>
		</c:if>
	</div>
</body>
<script>
function validateForm() {
    var id = document.forms[0].id.value;
    var password = document.forms[0].password.value;

    if (id === "" || password === "") {
        alert("아이디와 패스워드를 입력하세요.");
        return false;
    }
    return true;
}
</script>
</html>