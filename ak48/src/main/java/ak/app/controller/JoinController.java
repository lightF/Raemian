package ak.app.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.User;
import ak.app.mapper.joinmapper;

@RequestMapping("/join/*")
@RestController
public class JoinController {

	@Autowired
	joinmapper joinmapper;

	// @ResponseBody->jackson-databind(객체를->JSON 데이터포멧으로 변환)
	@GetMapping("/all")
	public List<User> joinList() {
		List<User> list = joinmapper.getLists();
		return list; // JSON 데이터 형식으로 변환(API)해서 리턴(응답)하겠다.
	}
	
	@RequestMapping("/Join.do")
	public String oin() {
		return "join_member.jsp";  // join.jsp
	}
	
	@RequestMapping("/Register.do")
	public String Register(User m, String memPassword1, String memPassword2,
			                  RedirectAttributes rttr, HttpSession session) {
		if(m.getId()==null || m.getId().equals("") ||
		   memPassword1==null || memPassword1.equals("") ||
		   memPassword2==null || memPassword2.equals("") ||
		   m.getName()==null || m.getName().equals("") ||	
		   m.getEmail()==null || m.getEmail().equals("")) {
		   // 누락메세지를 가지고 가기? =>객체바인딩(Model, HttpServletRequest, HttpSession)
		   rttr.addFlashAttribute("msgType", "실패 메세지");
		   rttr.addFlashAttribute("msg", "모든 내용을 입력하세요.");
		   return "redirect:/Join.do";  // ${msgType} , ${msg}
		}
		if(!memPassword1.equals(memPassword2)) {
		   rttr.addFlashAttribute("msgType", "실패 메세지");
		   rttr.addFlashAttribute("msg", "비밀번호가 서로 다릅니다.");
		   return "redirect:/Join.do";  // ${msgType} , ${msg}
		}		
		int result=joinmapper.Register(m);
		if(result==1) { // 회원가입 성공 메세지
		   rttr.addFlashAttribute("msgType", "성공 메세지");
		   rttr.addFlashAttribute("msg", "회원가입에 성공했습니다.");
		   session.setAttribute("mvo", m); // ${!empty mvo}
		   return "redirect:/";
		}else {
		   rttr.addFlashAttribute("msgType", "실패 메세지");
		   rttr.addFlashAttribute("msg", "이미 존재하는 회원입니다.");
		   return "redirect:/Join.do";
		}		
	}

	
	@RequestMapping("/RegisterCheck.do")
	public @ResponseBody int RegisterCheck(@RequestParam("ID") String ID) {
		User js = joinmapper.RegisterCheck(ID);
		if (js != null || ID.equals("")) {
			return 0; // 이미 존재하는 회원, 입력불가
		}
		return 1; // 사용가능한 아이디
	}

	

}
