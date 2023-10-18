package ak.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import ak.app.entity.AuthVO;
import ak.app.entity.userInfo;

@Mapper
public interface mapper {
	public userInfo RegisterCheck(String id);
	public int register(userInfo u);
	public List<userInfo> getList(userInfo u);
	public int totalCount();
	public void authInsert(AuthVO saveVO);
	public List<userInfo> searchUsers(String id);
	public int getTotalCount(userInfo u);
	public int updateFailCount(userInfo u);
	public userInfo login(userInfo u); // SQL
	
}