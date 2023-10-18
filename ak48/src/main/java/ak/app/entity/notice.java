package ak.app.entity;



import lombok.Data;


@Data
public class notice {
	  private int idx;
	  private String title;
	  private String content;
	  private String writer;
	  private String indate;
	  private boolean hasAttachment;
	  private int views; // 조회수
}
