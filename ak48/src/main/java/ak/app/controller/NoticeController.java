package ak.app.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.PageMaker;
import ak.app.entity.notice;
import ak.app.entity.userInfo;
import ak.app.mapper.noticemapper;

@Controller
@RequestMapping("/notice/*")
public class NoticeController {
	
	@Autowired
	noticemapper noticemapper;
	
	@GetMapping("/insert")
	public String Insert() {
		return "notice_write.jsp";
	}
	@PostMapping("/insert")
	public String insert(notice nt,RedirectAttributes rttr) { // paramerter(board) title,content, writer
		noticemapper.insert(nt);
		System.out.println(nt.getIdx());
		System.out.println(nt.getTitle());
		System.out.println(nt);
		System.out.println(nt);
		rttr.addFlashAttribute("result", nt.getIdx()); // ${result}
		return "redirect:/notice_main.jsp";// redirect
	}
	@ResponseBody
	@RequestMapping("/getList.do")
	public List<notice> getLists(Model model,notice n, userInfo u, String searchPart, String searchText, String searchMembership,
	RedirectAttributes rttr, HttpSession session) {
		List<notice> nt = null;
		//2: 글쓴이
		if (searchPart.equals("2")) {
			// 글쓴이 SET
			n.setWriter(searchText);
		//4: 제목
		} else if (searchPart.equals("4")) {
			//제목
			n.setTitle(searchText);
		} 
		nt = noticemapper.Lists(n);
		
		System.out.println("nt");
		System.out.println(nt);
		
		return nt;
	}
	/*
	@RequestMapping("/lists.do")
	public String Lists(@ModelAttribute("cri") Criteria cri, Model model) {
	    List<notice> list = noticemapper.Lists(cri);
	    model.addAttribute("list", list); // Model
	    // 페이징 처리에 필요한 부분
	    PageMaker pageMaker = new PageMaker();
	    pageMaker.setCri(cri);
	    pageMaker.setTotalCount(noticemapper.totalCount(cri));
	    model.addAttribute("pageMaker", pageMaker);
	    return "notice_main"; // View
	}
	*/
	@GetMapping("/Content")
	public String noticeContent(int idx, Model model) {
		notice nt = noticemapper.noticeContent(idx);
		model.addAttribute("nt", nt);
		return "noticeContent.jsp"; //boardContent.jsp
	}
	
	

}
