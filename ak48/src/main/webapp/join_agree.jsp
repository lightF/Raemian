<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
<meta property="og:type" content="website">
<meta property="og:title" content="인천검단 레미안">
<title>인천검단 레미안</title>
<!-- css -->
<link rel="stylesheet" type="text/css" href="./admin/css/normalize.css">
<link rel="stylesheet" type="text/css" href="./admin/css/slick.css">
<link rel="stylesheet" type="text/css" href="./admin/css/swiper.min.css">
<link rel="stylesheet" type="text/css" href="./admin/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="./admin/css/cal-style.css">
<link rel="stylesheet" type="text/css" href="./admin/css/common.css">
<link rel="stylesheet" href="./dadmin/css/sweetalert.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="./admin/css/top.css?v=3">
<!-- 추가된 css -->
<link rel="stylesheet" type="text/css" href="./admin/css/new_member.css?v=3">
<!-- 추가된 css -->
</head>
<body>
<!-- wrap -->
<div id="wrap">
	<!-- header 로고 & 대메뉴,소메뉴 -->
	<header id="hd">
    <div class="top_menu">
        <ul class="top_menu_list">
        <!--로그인 후 -->
        <!--
        <li>홍길동님 환영합니다 [로그아웃]</li>
        -->
        <!-- 로그인 전 -->
        <li>로그인</li>
        <li>회원가입</li>
        <li>FAQ</li>
        <li>공지사항</li>
        </ul>
    </div>
        <div class="top">
            <h1><a href="/" class="icon-hd-logo"></a></h1>
            <nav id="gnb">
                <li>
                    <a href=""><span>사업정보</span></a>
                    <ul>
                        <li><a href="">지구안내</a></li>
                        <li><a href="">입지안내</a></li>
                        <li><a href="">지역조감도</a></li>
                    </ul>
                </li>
                <li>
                    <a href=""><span>단지정보</span></a>
                    <ul>
                        <li><a href="">단지안내</a></li>
                        <li><a href="">시스템</a></li>
                        <li><a href="">단지배치도</a></li>
                        <li><a href="">동호배치도</a></li>
                    </ul>
                </li>
                <li>
                    <a href=""><span>세대정보</span></a>
                    <ul>
                        <li><a href="">타입별 평면도</a></li>
                        <li><a href="">인테리어</a></li>
						<li><a href="">사이버모델하우스</a></li>
						<li><a href="">인테리어마감재</a></li>
                    </ul>
                </li>
                <li>
                    <a href=""><span>공급정보</span></a>
                    <ul>
                       <li><a href="">입주자 모집공고</a></li>
                        <li><a href="">E-카달로그</a></li>
                         <li><a href="">공급일정 안내</a></li>
                        <li><a href="">오시는 길</a></li>
                      <li><a href=""></a></li>
                    </ul>
                </li>
                <li>
                    <a href=""><span>사전방문예약</span></a>
                    <ul>
                        <li><a href="">사전방문예약</a></li>
                        <li><a href="">사전방문예약확인</a></li>
                        <li><a href="">사전방문예약취소</a></li>
                    </ul>
                </li>
            </nav>
        </div>
	</header>
	<!-- header 로고 & 대메뉴,소메뉴 끝 -->


<div id="container">
<div id="index">
    
<!-- 서브 화면 시작 -->
    <label class="mbship_title">
        <p>MEMBER-SHIP</p>
        <ul>
          <li>01. 약관동의</li>
          <li><img src="./img/step_on.png" /></li>
          <li>02. 정보입력</li>
          <li><img src="./img/step_off.png" /></li>
          <li>03. 가입완료</li>
        </ul>
      </label>
      <fieldset class="mbship_box">
        <h3>약관동의</h3>
        <span class="agree_span">
        <label class="mbship_text">
         <input type="checkbox" id="all_agree" onclick="toggleCheckboxes(this.checked)" /> 의 모든 약관을 확인하고 전체 동의 합니다.
          (전체동의, 선택항목도 포함됩니다.)
        </label>
        <label class="mbship_text">
            <input type="checkbox"><font color="red"> (필수)</font>이용약관
        </label>
        <div class="agree_text"></div>
        <label class="mbship_text">
            <input type="checkbox"><font color="red"> (필수)</font> 개인정보 수집 및 이용
        </label>
        <div class="agree_text"></div>
        </span>
        <button type="button" class="next_btn" onclick="goToReservationInPage()">다음단계</button>
      </fieldset>
    
<!-- 서브 화면 종료 -->
</div>
  <!-- 카피라이터 시작 -->
	  	<footer id="ft">
  	    <div>
              <div class="ft-area">
                  <div class="row">
                      <div class="col-sm-9 col-xs-12 pull-right"><!--col-sm-10-->
                          <div class="row">
                              <div class="col-sm-12 col-xs-12">
                                  <p class="tit">인천검단 레미안 주택전시관</p>
                                  <p class="copy">
                                    <em>위치</em><span>인천 서구 청라동 22-2</span> <br class="m_br">   
									&nbsp;<em> LH콜센터</em><span>1688-0123</span>
                                    <em>주택전시관</em><span>000-123-5678</span>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <p class="copyright-p">
                      <img src="img/logo_ft.png" class="img-responsive center-block" alt="">
                  </p>
                  <div class="right-line px-h"></div>
              </div>
  	    </div>
  	</footer>	
 <!-- 카피라이터 종료 -->
</div>
    </div>
</body>
<script>
function goToReservationInPage() {
  window.location.href = "join_member.jsp";
}
function toggleCheckboxes(checked) {
	  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
	  
	  for (var i = 0; i < checkboxes.length; i++) {
	    if (checkboxes[i].id !== 'all_agree') {
	      checkboxes[i].checked = checked;
	    }
	  }
	}
</script>
</html>
