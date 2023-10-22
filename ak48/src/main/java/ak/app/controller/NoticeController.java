package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.notice;
import ak.app.mapper.noticemapper;

@Controller
@RequestMapping("/notice/*")
public class NoticeController {
	
	@Autowired(required=false)
	noticemapper noticemapper;
	
	
	@RequestMapping("/List")
	public String List(Model model) {

		List<notice> list = noticemapper.Lists();
		model.addAttribute("list", list);// 객체바인딩
		return "notice_main";
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
	@GetMapping("/insert")
	public String Insert() {
		return "notice_write";
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
	
	@GetMapping("/Content")
	public String boardContent(int idx, Model model) {
		notice nt = noticemapper.Content(idx);
		noticemapper.Content(idx);		
		model.addAttribute("nt", nt);
		return "Content"; //boardContent.jsp
	}
	

}