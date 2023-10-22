package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.Criteria;
import ak.app.entity.Info;


@Mapper
public interface infomapper {

	public List<Info> getList(Criteria cri);
	public int totalCount();
		
}
