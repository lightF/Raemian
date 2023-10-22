package ak.app.service;

import org.springframework.stereotype.Service;

import ak.app.entity.userInfo;

@Service
public interface LoginService {
	public userInfo login(userInfo ui);
}
