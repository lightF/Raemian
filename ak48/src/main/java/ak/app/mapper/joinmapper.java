package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.User;

@Mapper
public interface joinmapper {
	//public List<FAQ> getLists();	
	
	public int insert(User js);
	public List<User> getLists();
	public User RegisterCheck(String iD);
	public int Register(User m);
	
}