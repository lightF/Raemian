package ak.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ak.app.entity.Criteria;
import ak.app.entity.FAQ;

@Service
public interface FaqService {
	public List<FAQ> getList(Criteria cri);
	public int totalCount(Criteria cri);
	

}
