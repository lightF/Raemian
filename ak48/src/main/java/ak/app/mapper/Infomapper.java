package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.Criteria;
import ak.app.entity.Info;


@Mapper
public interface Infomapper {
	public List<Info> getLists();
	public int countInfo(String search);
	public void InfoInsert(Info io);
	public List<Info> getList(Criteria cri);
	public int totalCount();
	public void deleteInfo(String infoNumber);
		
}
