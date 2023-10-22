package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

import ak.app.entity.Criteria;
import ak.app.entity.notice;

@Mapper
public interface noticemapper {
	public void insert(notice nt);
	@Update("update notices set views=views+1 where idx=#{idx}")
	public notice Content(int idx);
	public void update();
	public List<notice> getList(Criteria cri);
}