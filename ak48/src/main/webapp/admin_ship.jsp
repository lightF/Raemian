<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="javax.xml.crypto.Data"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%
Date today = new Date();
SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
String v = df.format(today);
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="./admin/css/admin_css.css?v=<%=v%>">
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap">
<title>Insert title here</title>
</head>
<form id="frm" method="post" action="${contextPath}/admin/Register.do">
	<div class="membody">
		<div class="adtitle">ADMINISTRATOR MEMBERSHIP</div>
		<div class="memoutline">
			<div class="memsel1">
				<ul class="memu">
					<li class="memfont">소속 및 부서선택</li>
					<li class="memlisel1"><select id="membership" class="kosel"
						name="membership" required>
							<option value="">소속 선택</option>
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
				<ul class="memu">
					<li class="memlisel1"><select id="dept" class="kosel"
						onchange="dept" required>
							<option value="">부서 선택</option>
							<option value="1">임원</option>
							<option value="2">회계팀</option>
							<option value="3">영업팀</option>
							<option value="4">전산팀</option>
							<option value="5">디자인팀</option>
							<option value="6">MD팀</option>
							<option value="7">고객관리팀</option>
					</select></li>
				</ul>
			</div>
			<div class="memsel1">
				<ul class="memu">
					<li class="memfont">이름</li>
					<li><input type="text" class="admamber1" id="name" name="name"
						placeholder="이름을 입력해 주세요" required></li>
					<li class="memfont1">직책</li>
					<li><select id="position" class="kosel" onchange="position"
						required>
							<option value="">직책 선택</option>
							<option value="1">임원</option>
							<option value="2">실장</option>
							<option value="3">팀장</option>
							<option value="4">부장</option>
							<option value="5">차장</option>
							<option value="6">과장</option>
							<option value="7">대리</option>
							<option value="8">주임</option>
							<option value="9">사원</option>
							<option value="999">전체관리자</option>
					</select></li>
				</ul>
			</div>
			<div class="memsel2">
				<ul>
					<li class="memfont">아이디</li>
					<li><input type="text" class="admamber2" id="id" name="id" placeholder="아이디를 입력해 주세요"></li>
					 <li><button type="button" class="idcheck" id="checkBtn" >중복체크</button></li> 
				</ul>
			</div>
			<div class="memsel2">
				<ul>
					<!-- <li class="memfont">패스워드</li>
                    <li><input type="password" class="admamber1" id="password1" name="password1" onkeyup="passwordCheck()" value="" placeholder="패스워드를 입력해 주세요"></li>
                    <li class="memfont">패스워드확인</li>
                    <li><input type="password" class="admamber4" id="password2" name="password2" onkeyup="passwordCheck()" value="" placeholder="동일한 패스워드를 입력해 주세요"></li> -->
					<li>비밀번호</li>
					<li><input type="password" name="password1" id="password1"
						placeholder="비밀번호를 입력하세요"><br></li>
					<li>비밀번호 확인</li>
					<li><input type="password" name="password2" id="password2"
						placeholder="비밀번호를 다시 입력하세요"><br></li>
				</ul>
			</div>
			<div class="memsel3">
				<ul>
					<li class="memfont">이메일</li>
					<li><input type="text" class="admamber3" id="email"
						name="email" placeholder="이메일을 입력해 주세요"></li>
				</ul>
			</div>
			<div class="memsel4">
				<ul>
					<li class="memfont">연락처</li>
					<li><select class="adnumber" name="phone" id="phone">
							<option value="010">010</option>
							<option value="011">011</option>
					</select></li>
					<li class="ad_number">-</li>
					<li><input type="text" class="adnumber" id="phone1"
						name="phone1" maxlength="4"></li>
					<li class="ad_number">-</li>
					<li><input type="text" class="adnumber" id="phone2"
						name="phone3" maxlength="4"></li>
				</ul>
			</div>

		</div>
	</div>
	<div class="admembt">
		<ul>
			<li><button type="button" class="admembt_ok" id="adm_ok">신청하기</button></li>
			<li><button type="button" class="admembt_no" id="adm_cancel" onclick="">취소하기</button></li>
		</ul>
	</div>
</form>
</body>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function() {
        $("#adm_ok").click(function() {
            // 사용자가 입력한 데이터 가져오기
            var membership = $("#membership").val();
            var dept = $("#dept").val();
            var name = $("#name").val();
            var position = $("#position").val();
            var id = $("#id").val();
            var password1 = $("#password1").val();
            var password2 = $("#password2").val();
            var email = $("#email").val();
            var phone =
                $("#phone").val() + "-" +
                $("#phone1").val() + "-" +
                $("#phone2").val();

            // 입력된 데이터를 객체로 저장
			var formData = {
				membership: membership,
				dept: dept,
				name: name,
				position: position,
				id: id,
				password1: password1,
				password2: password2,
				email: email,
				phone: phone
			};

			// AJAX 요청 보내기
			$.ajax({
			    type: "POST", // HTTP 메소드 선택 (GET 또는 POST)
			    url: "/admin/Register.do", // 서버의 컨트롤러 URL
			    data : formData, // 전송할 데이터
			    dataType : "json", // 응답 데이터 타입 (JSON을 사용할 경우)
			    success : function(response) {
			        // 서버에서 받은 데이터를 활용하여 alert 띄우기
			        var message = response.message;
			        alert(message);
			        if (response.success) { 
			            location.href="/config_main";  // 회원가입 성공 시 config_main.jsp로 이동
			        }
			    },
			    error : function(xhr, status, error) {
			       alert(xhr.responseText);
			   }
		   });
	   });
   });
    $(document).ready(function() {
    	  $("#checkBtn").click(function(e) {
    	    e.preventDefault();
    	    var id = $("#id").val();
    	    if (id === "") {
    	      alert("아이디를 입력해주세요.");
    	      return;
    	    }

    	    $.ajax({
    	      url: "${contextPath}/admin/RegisterCheck.do",
    	      method: 'GET',
    	      data: { ID: id },
    	      success: function(response) {
    	        if (response === 0) {
    	          alert("이미 존재하는 회원입니다. 다른 아이디를 입력해주세요.");
    	        } else if (response === 1) {
    	          alert("사용 가능한 아이디입니다.");
    	        } else {
    	          alert("중복 체크에 실패했습니다. 다시 시도해주세요.");
    	        }
    	      },
    	      error: function(xhr, status, error) {
    	        console.error(error);
    	        alert("중복 체크에 실패했습니다. 다시 시도해주세요.");
    	      }
    	    });
    	  });
    	});
    $(document).ready(function() {
  	  $("#adm_ok").click(function(e) {
  	    e.preventDefault();
  	    // 여기에 입력값 유효성 검사 및 필요한 데이터 처리 로직을 추가해주세요.
  	    // 신청 완료 후 admin_main.jsp로 이동
  	    alert("가입이 완료되었습니다.");
  	    window.location.href = "/admin_main.jsp";
  	  });
  	});
</script>