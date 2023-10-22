package ak.app.service;

import org.springframework.stereotype.Service;

import ak.app.entity.Criteria;

@Service
public interface NoticeService {
	public int totalCount(Criteria cri);
}
