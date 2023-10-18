
$(document).ready(function() {
	if(localStorage.getItem('id') ) {
		$('input[name="id"]').val( localStorage.getItem('id') );
	}

	$('.login [name=id]').focus();
});

$(document).on('click', '.login .login_btn', function() {
	login();
});

$(document).on('change', '#id_save', function() {
	var chk = $(this).is(':checked');
	if (chk == true){
		localStorage.setItem('id', $('input[name="id"]').val());
	} else {
		localStorage.clear();
	}

});


function login() {
	if ($('input[name=id]').val() == ''){
		pop_alert('아이디 입력해주세요.');
		return false;
	}
	if ($('input[name=pw]').val() == ''){
		pop_alert('비밀번호를 입력바랍니다.');
		return false;
	}
	

	var data = $('[name=login]').serialize();
	$.ajax({
		url: contextPath + '/user/login',
		type: 'post',
		dataType: 'json',
		data: data,
		success: function(data) {
			if(data.code == 1) {
				location.href = contextPath + data.url;
			} else if(data.code == 0) {
				pop_alert('아이디 또는 비밀번호를 확인해주세요');
				
			}
		}, complete: function() {
			
		}
	}); 
}

