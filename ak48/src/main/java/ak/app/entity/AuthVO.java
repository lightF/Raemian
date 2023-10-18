package ak.app.entity;

import lombok.Data;

@Data
public class AuthVO {
	private int no; //일련번호
	private String authID; //회원아이디
	private String auth; //회원권한(3가지 권한부여 ROLE_USER, ROLE_MANAGER, ROLE_ADMIN)
	
}
