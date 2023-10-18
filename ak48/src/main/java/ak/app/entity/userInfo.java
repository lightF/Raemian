package ak.app.entity;


import lombok.Data;

@Data
public class userInfo {
	int idx; 			// NO
	String id; 			// 아이디
	String name; 		// 가입자명
	String password; 	// 패스워드
	String membership; 	// 소속
	String phone; 		// 연락처
	String dept; 		// 부서
	String position; 	// 직급
	String email; 		// 이메일
	String status; 		// 근태
	String ip; 			// ip
	String column;
	String start_num;
	String row_num;
	int failcount;      // 로그인 실패 카운트
	
}