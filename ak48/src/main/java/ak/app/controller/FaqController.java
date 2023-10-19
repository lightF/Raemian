package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ak.app.entity.Criteria;
import ak.app.entity.FAQ;
import ak.app.entity.PageMaker;
import ak.app.mapper.faqmapper;

@Controller
@RequestMapping("/faq/*")
public class FaqController {
	
	@Autowired
	faqmapper faqmapper;

	@RequestMapping("/list")
	public String getLists(Criteria cri, Model model) { // type, keyword
		List<FAQ> list=faqmapper.getLists(cri);
		model.addAttribute("list", list); // Model
		// 페이징 처리에 필요한 부분
		PageMaker pageMaker=new PageMaker();
		pageMaker.setCri(cri);
		pageMaker.setTotalCount(faqmapper.totalCount(cri));
		model.addAttribute("pageMaker", pageMaker);		
		return "faq_main"; // View
 	}

	@PostMapping("/Delete")
	public void delete(String fqn) {
		faqmapper.delete(fqn);
	}

	@PostMapping("/Write")
	public String Write(FAQ fq) {
		faqmapper.Write(fq);
		return "redirect:faqPage";
	}

}
