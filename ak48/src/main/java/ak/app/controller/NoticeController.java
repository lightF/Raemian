package ak.app.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.notice;
import ak.app.entity.userInfo;
import ak.app.mapper.noticemapper;

@Controller
@RequestMapping("/notice/*")
public class NoticeController {
	@Autowired
	noticemapper noticemapper;
	
	@GetMapping("/Insert.do")
	public String noticeInsert() {
		return "notice_write.jsp";
	}

	@PostMapping("/Insert.do")
	public String noticeInsert(notice nt,RedirectAttributes rttr) { // paramerter(board) title,content, writer
		noticemapper.noticeInsert(nt);
		System.out.println(nt.getIdx());
		System.out.println(nt.getTitle());
		System.out.println(nt);
		System.out.println(nt);
		rttr.addFlashAttribute("result", nt.getIdx()); // ${result}
		return "redirect:/notice_main.jsp";// redirect
	}
	
	@ResponseBody
	@RequestMapping("/List.do")
	public notice getLists(notice nt, userInfo u, String searchPart, String searchText, String searchMembership,
			RedirectAttributes rttr, HttpSession session) {
		notice list = nt;
		return list;
	}
		
	
	@GetMapping("/Content.do")
	public String noticeContent(int idx, Model model) {
		notice nt = noticemapper.noticeContent(idx);
		model.addAttribute("nt", nt);
		return "noticeContent.jsp"; //boardContent.jsp
	}
	
	

}
