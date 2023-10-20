package ak.app.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import ak.app.entity.Criteria;
import ak.app.entity.userInfo;

@Service
public interface AdminService {
	public List<Map<String, Object>> position(Map<String, Object> param) throws Exception;
	public void register(userInfo u);
	public List<userInfo> getList(Criteria cri);
	public int totalCount(Criteria cri);
}
