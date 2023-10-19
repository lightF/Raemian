package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.Criteria;
import ak.app.entity.FAQ;

@Mapper
public interface faqmapper {
	public List<FAQ> getLists(Criteria cri);	
	public void delete(String faqNumber);
	public void Write(FAQ fq);
	public int totalCount(Criteria cri);
	
}