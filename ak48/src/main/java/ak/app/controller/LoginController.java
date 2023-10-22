package ak.app.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ak.app.mapper.mapper;

@Controller
@RequestMapping("/login/*")
public class LoginController {
	@Autowired
	mapper mapper;

	@RequestMapping("/loginProcess")
	public String login(@RequestParam String id, @RequestParam String password,HttpServletRequest req) {
		if (id.equals("admin") && password.equals("1234")) {
			// 인증 성공 시, 로그인 세션을 설정하고 리다이렉트합니다.
			return "redirect:/admin_main.jsp";
		} else {
			// 인증 실패 시, 다시 로그인 페이지로 리다이렉트합니다.
			return "redirect:/index.jsp";
		}
	}
	@RequestMapping("/logoutProcess")
	public String logout(HttpSession session) {
		session.removeAttribute("loggedInUser"); // Remove loggedInUser attribute from session
		return "redirect:/index.jsp"; // Redirect back to login page after logout
	}
	
}