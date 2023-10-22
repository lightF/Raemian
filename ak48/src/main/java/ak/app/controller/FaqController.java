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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import ak.app.entity.FAQ;
import ak.app.entity.PageMaker;
import ak.app.mapper.faqmapper;

@Controller
@RequestMapping("/faq/*")
public class FaqController {
	
	@Autowired
	faqmapper faqmapper;
	
	@RequestMapping("/List")
	public String Lists(Model model) { // type, keyword
		List<FAQ> list=faqmapper.getLists();
		model.addAttribute("list", list); // Model
		PageMaker pageMaker=new PageMaker();
		model.addAttribute("pageMaker", pageMaker);		
		return "faq_main.jsp"; // View
 	}
	
	@PostMapping("/faqInsert")
	public String fqaInsert(FAQ FQ,RedirectAttributes rttr) { // paramerter(board) title,content, writer
		faqmapper.faqinsert(FQ); // 등록
		rttr.addFlashAttribute("result", FQ.getId()); // ${result}
		return "redirect:/faq_main.jsp";// redirect
	}
	
	@RequestMapping(value="/Delete", method = RequestMethod.POST)
	public ResponseEntity<String> deleteFaq(@RequestParam("id") Long id) {
	    // Perform the delete operation based on the 'faqNumber' parameter
	    // Your delete logic here
	    return ResponseEntity.ok("FAQ deleted successfully");
	}
	
	@PostMapping("/faq_main")
	public String Write(FAQ fq) {
		faqmapper.Write(fq);
		return "redirect:faq_main";
	}

}