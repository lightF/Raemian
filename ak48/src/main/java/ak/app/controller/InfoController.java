package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ak.app.entity.Criteria;
import ak.app.entity.Info;
import ak.app.entity.PageMaker;
import ak.app.mapper.infomapper;

@Controller
@RequestMapping("/info/*")
public class InfoController {

	@Autowired
	infomapper infomapper;

	@GetMapping("/list")
	public String getList(Criteria cri, Model model) {
		List<Info> list=infomapper.getList(cri);
		// 객체바인딩
		model.addAttribute("list", list); // Model
		// 페이징 처리에 필요한 부분
		PageMaker pageMaker=new PageMaker();
		pageMaker.setCri(cri);
		pageMaker.setTotalCount(infomapper.totalCount());
		model.addAttribute("pageMaker", pageMaker);		
		return "info_main.jsp"; // View
 	}
	
	
}
