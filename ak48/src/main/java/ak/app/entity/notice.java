package ak.app.entity;


import lombok.Data;


@Data
public class notice {
	   int idx;				//번호
	   String title;		//제목
	   String content;		//내용
	   String writer;		//글쓴이
	   String indate;		//등록일
	   String hasattachment; //첨부파일 유/무
	   int views; 			  // 조회수
}

