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
<link rel="stylesheet" type="text/css" href="./admin/css/top.css?v=1">
<!-- 추가된 css -->
<link rel="stylesheet" type="text/css" href="./admin/css/new_member.css?v=26">
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
    
<!-- 회원가입 화면 시작 -->
    <label class="mbship_title">
        <p>MEMBER-SHIP</p>
        <ul>
          <li style="color: #000;">01. 약관동의</li>
          <li><img src="./img/step_off.png" /></li>
          <li style="color: #1B9C9E;">02. 정보입력</li>
          <li><img src="./img/step_on.png" /></li>
          <li>03. 가입완료</li>
        </ul>
      </label>
      <form id="frm" action="${contextPath}/Register.do" method="post">
      <fieldset class="mbship_box">
        <h3>기본정보 입력 <span style="display: inline-block; font-size: 12px; vertical-align: 5px; float: right;">■ 표시는 필수 입력 항목입니다.</span></h3>
        <span class="agree_span">
        <ol class="mbinfos">
        <li><em class="ck_font">■</em> 이름</li>
        <li><input type="text" name="name" class="mbinput1" placeholder="이름을 입력하세요"></li>
        <li><em class="ck_font">■</em> 아이디</li>
        <li>
        <input type="text" class="mbinput2" placeholder="6~12자의 아이디를 입력하세요">
        <button type="button" name="id" id="checkBtn" class="mb_btn1">중복확인</button>
        </li>
        <li><em class="ck_font">■</em> 비밀번호</li>
        <li>
        <input type="text" name="password" class="mbinput3" placeholder="8~14자의 패스워드를 입력하세요">
        </li>
        <li><em class="ck_font">■</em> 비밀번호 확인</li>
        <li>
        <input type="text" name="password" class="mbinput3" placeholder="동일한 패스워드를 입력하세요">
        </li>
        <li><em class="ck_font">■</em> 휴대전화번호</li>
        <li>
        <input type="text" name="phone" class="mbinput2" placeholder="숫자만 입력하세요">
        <button type="button" class="mb_btn1">인증발송</button>
        </li>
        <li><em class="ck_font">■</em> 인증번호</li>
        <li>
        <input type="text" name="m_sms"  class="mbinput2" placeholder="숫자 6자리를 입력하세요" maxlength="6">
        <button type="button" class="mb_btn1">인증완료</button>
        </li>
        <li> 이메일</li>
        <li>
        <input type="text" name="m_email" class="mbinput3" placeholder="이메일을 입력하세요" maxlength="6">
        </li>
        <li style="height: 125px;"><em class="ck_font">■</em> 주소</li>
        <li style="height: 120px; line-height: normal; margin-top: 5px;">
        <input type="text" name="address"  class="mbinput1" placeholder="우편번호" maxlength="5" readonly>
        <button type="button" class="mb_btn1">주소찾기</button>
        <input type="text" class="mbinput4" placeholder="도로명 주소" readonly>
        <input type="text" class="mbinput4" placeholder="상세주소를 입력하세요" readonly>
        </li>
        <li style="height: 100px;"> 마케팅 수신여부</li>
        <li style="height: 100px;">
        <label class="ck_label"><input type="checkbox" class="mbinput5" name="address"> 이메일 </label>
        <label class="ck_label"><input type="checkbox" class="mbinput5"> 전화 </label>
        <label class="ck_label"><input type="checkbox" class="mbinput5"> 우편물 </label>
        <label class="ck_label"><input type="checkbox" class="mbinput5"> SMS (문자 메세지)</label><br>
        선택하신 정보 수신에 동의하겠습니다. (서비스, 이벤트 소식 등의 홍보/마케팅 정보를 수신하게 됩니다.)
        </li>
        </ol>
        </span>
        <span class="span_buttons">
        <button type="button" class="next_btn1_1" id="adm_ok" onclick="goInsert()">회원가입</button>
        <button type="button" class="next_btn2_1" id="adm_cancel" onclick="">가입취소</button>
        </span>
      </fieldset>
      </form>
    
<!-- 회원가입 화면 종료>
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
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
function goInsert() {
    var name = $("#id").val();
    if (name == null || name == "" || name == 0) {
        alert("나이를 입력하세요");
        return;
    }
    document.frm.submit(); // 전송
}
</script>
</html>
