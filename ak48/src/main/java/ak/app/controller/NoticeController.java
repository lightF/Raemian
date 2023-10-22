package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ak.app.entity.Criteria;
import ak.app.entity.PageMaker;
import ak.app.entity.notice;
import ak.app.mapper.noticemapper;

@Controller
@RequestMapping("/notice/*")
public class NoticeController {
	
	@Autowired
	noticemapper noticemapper;
	
	@GetMapping("/getList")
	public String getList(Criteria cri, Model model,notice nt) {
		List<notice> list=noticemapper.getList(cri);
		model.addAttribute("list", list); // Model
		PageMaker pageMaker=new PageMaker();
		pageMaker.setCri(cri);
		model.addAttribute("pageMaker", pageMaker);	
		System.out.println(nt);
		return "notice_main.jsp"; // View
 	}
	
	@RequestMapping("/noticeWrite")
	public String noticeWritePage() {
		return "notice_write.jsp";
	}
	
	@PostMapping("/insert")
	public String noticeInsert(notice nt) { // paramerter(board) title,content, writer
		noticemapper.insert(nt); // 등록
		System.out.println(nt);
		return "redirect:/notice_main.jsp";// redirect
	}
	
	

	
	
	
	

}