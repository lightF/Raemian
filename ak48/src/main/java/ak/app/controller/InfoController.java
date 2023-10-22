package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ak.app.entity.Criteria;
import ak.app.entity.Info;
import ak.app.entity.PageMaker;
import ak.app.mapper.Infomapper;

@Controller
@RequestMapping("/info/*")
public class InfoController {

	@Autowired
	Infomapper infomapper;

	@RequestMapping("/infopage")
	public String infoPage(Criteria cri, Model model) {
		List<Info> list=infomapper.getList(cri);
		model.addAttribute("list", list); // Model
		// 페이징 처리에 필요한 부분
		PageMaker pageMaker = new PageMaker();
		pageMaker.setCri(cri);
		pageMaker.setTotalCount(infomapper.totalCount());
		return "info_main";
	}

	@PostMapping("/infoDelete")
	public void deleteNotice(String infoNumber) {
		infomapper.deleteInfo(infoNumber);
	}

	@GetMapping("/infoInsert.do")
	public String InfoInsert() {
		return "info_main";
	}

	@PostMapping("/infoInsert.do")
	public String InfoInsert(Info io) {
		infomapper.InfoInsert(io);
		return "redirect:info_writer";
	}
}
