package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ak.app.entity.Join;
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
	@PostMapping("/Insert.do")
	public String Insert(Join js) { // paramerter(board) title,content, writer
		joinmapper.insert(js);
		return "redirect:/index.jsp";// redirect
	}
	
	@RequestMapping("/boardList.do")
	public String boardList(Model model) {
		List<Join> list = joinmapper.getLists();
		model.addAttribute("list", list);// 객체바인딩
		return "boardList";
	}
	
	
	
	
	

}
