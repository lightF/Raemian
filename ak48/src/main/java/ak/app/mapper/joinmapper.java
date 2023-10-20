package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.Join;

@Mapper
public interface joinmapper {
	//public List<FAQ> getLists();	
	
	public void insert(Join js);
	public List<Join> getLists();
	
}