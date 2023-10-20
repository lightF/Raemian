package ak.app.controller;

import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.Join;
import ak.app.entity.userInfo;
import ak.app.mapper.joinmapper;

@Controller
@RequestMapping("/join/*")
public class JoinController {
	
	@Autowired
	joinmapper joinmapper;
	
	@GetMapping("/insert")
	public String Insert() {
		return "notice_write.jsp";
	}
	@PostMapping("/insert")
	public String Insert(Join js) { // paramerter(board) title,content, writer
		joinmapper.insert(js);
		return "redirect:/index.jsp";// redirect
	}
	
	@RequestMapping("/RegisterCheck.do")
	public @ResponseBody int RegisterCheck(@RequestParam("ID") String ID) {
		Join js = joinmapper.RegisterCheck(ID);
		if (js != null || ID.equals("")) {
			return 0; // 이미 존재하는 회원, 입력불가
		}
		return 1; // 사용가능한 아이디
	}
	
	
	
	@ResponseBody
	@RequestMapping("/insert.do")
	public Map<String, String> Insert(Join js, userInfo u, String password1, String password2, RedirectAttributes rttr,
			HttpSession session, HttpServletRequest req) {
		Map<String, String> data = new HashMap<>();
		String ip = null;
		try {
			ip = Inet4Address.getLocalHost().getHostAddress();
			u.setIp(ip);
		} catch (UnknownHostException e) {
		}
		System.out.println("ip");
		System.out.println(ip);

		if (u != null && password1 != null && !password1.isEmpty() && password2 != null && !password2.isEmpty()) {
			if (password1.equals(password2)) {
				u.setPassword(hashPassword(password1));

				System.out.println("암호화되었는지 확인하장!!");
				System.out.println(u.getPassword());
				int temp = joinmapper.insert(null);
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
	
	//pwd 해시화 하자!!
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

	
	
	
	
	
	

}
