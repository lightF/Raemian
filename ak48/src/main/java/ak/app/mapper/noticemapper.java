package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.Criteria;
import ak.app.entity.notice;

@Mapper
public interface noticemapper {
	public void insert(notice nt);
	public notice Content(int idx);
	public notice noticeContent(int idx);
	public List<notice> Lists(notice nt);
	public int totalCount(Criteria cri);
}