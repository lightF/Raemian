package ak.app.entity;

import lombok.Data;

//페이징처리를 만드는 클래스
@Data
public class PageMaker {

	private Criteria cri;
	private int totalCount; //총 게시글의 게수
	private int startPage; //시작번호 페이지 번호를 눌렀을때 ex) 10페이지까지는 1부터 나옴.
	private int endPage; //끝페이지 번호 (조정되어야한다)
	private boolean prev;	//이전,,버튼 이후,,버튼 (true이면 이전 false면 이후)
	private boolean next; // 다음버튼
	private int displayPageNum=5;	// 1,2,3,4,5,6,7,8,9,10 하단의 몇개씩 페이지를 보여주는가..?
	//게시글의 총 게시글수
	public void setTotalCount(int totalcount) {
		this.totalCount=totalcount;
		makePaging();
	}
	private void makePaging() {
		// TODO Auto-generated method stub
		// 1. 페이징 처리(화면에 보여질 마지막 페이지 번호) 공식
		endPage=(int)Math.ceil(cri.getPage()/(double)displayPageNum)*displayPageNum; 
		// 2. 화면에 시작 페이지 번호 start페이지는 1부터 시작된다
		startPage=(endPage-displayPageNum)+1;
		if (startPage<=0) startPage=1;
		// 3. 전체 마지막 페이지 계산 
		int tempEndPage=(int)Math.ceil(totalCount/(double)cri.getPerPageNum());
		// 4. 마지막 페이지 번호화면에 보여질 유효성 체크
		// 마지막 페이지보다 tempendPage가 값이 크면
		if (tempEndPage < endPage) {
			endPage=tempEndPage;
		}
		// 5. 이전 페이지 버튼(링크) 존재 여부
		//start 페이지가 1이면 flase,1이 아니면 true
		prev=(startPage==1) ? false : true;
		//6.다음페이지 버튼(링크) 존재 여부
		next=(endPage < tempEndPage) ? true : false;
		
	}
}
