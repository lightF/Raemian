package ak.app.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import ak.app.entity.userInfo;
import ak.app.mapper.mapper;

@Controller
@RequestMapping("/login/*")
public class LoginController {
	@Autowired
	mapper mapper;
	// 로그인 기능 구현
	@RequestMapping("/loginProcess")
	public String login(userInfo u, HttpSession session) {
		userInfo ui=mapper.login(u);
		System.out.println(u);
		if(ui!=null) { //로그인 성공
			session.setAttribute("ui", ui); // 객체바인딩 -> ${!empty mvo}
		}
		return "redirect:/admin_main.jsp";
	}
	@RequestMapping("/logoutProcess")
	public String logout(HttpSession session) {
		System.out.println("6666666666666666");
		session.invalidate(); // 세션 무효화(로그아웃)
		return "redirect:/index";
	}
}