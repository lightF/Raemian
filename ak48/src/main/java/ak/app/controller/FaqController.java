package ak.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import ak.app.entity.FAQ;
import ak.app.entity.PageMaker;
import ak.app.mapper.faqmapper;

@Controller
@RequestMapping("/faq/*")
public class FaqController {
	
	@Autowired
	faqmapper faqmapper;
	@RequestMapping("/getList.do")
	public String getLists(Model model) { // type, keyword
		List<FAQ> list=faqmapper.getLists();
		System.out.println("list"+ list);
		model.addAttribute("list", list); // Model
		// 페이징 처리에 필요한 부분
		PageMaker pageMaker=new PageMaker();
		model.addAttribute("pageMaker", pageMaker);		

		return "/faq_main"; // View
 	}
	
	@RequestMapping(value = "/Delete", method = RequestMethod.POST)
	public ResponseEntity<String> deleteFaq(@RequestParam("id") Long id) {
	    // Perform the delete operation based on the 'faqNumber' parameter
	    // Your delete logic here
	    return ResponseEntity.ok("FAQ deleted successfully");
	}

	
	@PostMapping("/Write")
	public String Write(FAQ fq) {
		faqmapper.Write(fq);
		return "redirect:faqPage";
	}

}
