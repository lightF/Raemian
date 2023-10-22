package ak.app.controller;

import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.userInfo;
import ak.app.mapper.mapper;

@Controller
@RequestMapping("/admin/*")
public class AdminController {
	@Autowired
	mapper mapper;
	
	@RequestMapping("/RegisterCheck.do")
	public @ResponseBody int RegisterCheck(@RequestParam("ID") String ID) {
		userInfo m = mapper.RegisterCheck(ID);
		if (m != null || ID.equals("")) {
			return 0; // 이미 존재하는 회원, 입력불가
		}
		return 1; // 사용가능한 아이디
	}

	// 1. 변수 null 값 체크
	// 2. pwd1 VS pwd2 비교
	// 3. insert
	// 4. 성공 메시지 전달
	@ResponseBody
	@RequestMapping("/Register.do")
	public Map<String, String> Register(userInfo u, String password1, String password2, RedirectAttributes rttr,
			HttpSession session, HttpServletRequest req) {
		Map<String, String> data = new HashMap<>();
		// ipv4가져오기
		String ip = null;
		try {
			ip = Inet4Address.getLocalHost().getHostAddress();
			u.setIp(ip);
		} catch (UnknownHostException e) {
		}
		System.out.println("ip");
		System.out.println(ip);

		// 1. Check for null or empty values
		if (u != null && password1 != null && !password1.isEmpty() && password2 != null && !password2.isEmpty()) {
			// 2. Compare password1 and password2
			if (password1.equals(password2)) {
				// u.setPassword(password1);
				// pwd > 해시화 저장
				u.setPassword(hashPassword(password1));

				System.out.println("암호화되었는지 확인하장!!");
				System.out.println(u.getPassword());

				// 3. Insert user
				int temp = mapper.register(u);

				// 4. Return success or failure message
				if (temp > 0) {
					data.put("message", "회원가입 성공하였습니다.");
					return data;
				} else {
					System.out.println(temp);
					System.out.println(password1);
					System.out.println(u);
					System.out.println(u.getIp());
					data.put("message", "회원가입에 실패했습니다. 다시 시도하여 주세요.");
					return data;
				}
			} else {
				data.put("message", "비밀번호가 일치하지 않습니다. 다시 입력하여 주세요.");
				return data;
			}
		} else {
			data.put("message", "빈값이 입력되었습니다. 다시 입력하여 주세요.");
			return data;
		}
	}

	// pwd 해시화 하자!!
	public static String hashPassword(String password) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256"); // 사용할 해시 알고리즘 선택 (SHA-256 사용 예시)
			byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
			StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
			for (byte b : encodedHash) {
				String hex = Integer.toHexString(0xff & b);
				if (hex.length() == 1) {
					hexString.append('0');
				}
				hexString.append(hex);
			}

			return hexString.toString();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}
	}

	// 1. searchPart:: 1 이름 / 2 아이디 / 3 연락처
	// 2. LIST 가져오기
	// 3. 리턴
	@ResponseBody
	@RequestMapping("/getList.do")
	public List<userInfo> getList(userInfo u, String searchPart, String searchText, String searchMembership,
			RedirectAttributes rttr, HttpSession session) {
		// 변수선언
		List<userInfo> userList = null;

		// [[[조건검색]]]
		// 구분값: 1 이름 && not null
		// 구분값: 2 아이디 && not null
		// 구분값: 3 연락처 && not null
		if (searchPart != null && searchPart != "" && searchText != null && searchText != ""
				&& searchMembership != null) {
			// 소속set 99 전체, 1 본사, 2 경기도, 3 인천, 4대전, 5세종, 6광주, 7 대구, 8 울산, 9전라남도, 10 전라북도, 11
			// 충청남도, 12 충청북도, 13 경상남도, 14 경상북도, 15제주도
			u.setMembership(searchMembership);
			// searchPart:: 1 이름 / 2 아이디 / 3 연락처
			if (searchPart.equals("1")) {
				// 이름 SET
				u.setName(searchText);
			} else if (searchPart.equals("2")) {
				// 아이디 SET
				u.setId(searchText);
			} else if (searchPart.equals("3")) {
				// 연락처 SET
				u.setPhone(searchText);
			}
			// LIST 가져오기
			userList = mapper.getList(u);

			// 구분값: null && null>> [[[전체검색]]]
		} else if (searchPart == null && searchText == null && searchMembership == null) {
			// 2. LIST 가져오기
			userList = mapper.getList(u);
		}
		// 리턴
		return userList;
	}

}