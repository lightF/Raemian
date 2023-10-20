package ak.app.entity;

import lombok.Data;

@Data
public class FAQ {
String id;			//번호
String question;	//질문
String answer;		//답변
String writer;		//작성자
String creationdate;	//등록일

}
