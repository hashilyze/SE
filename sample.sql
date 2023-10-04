create database sedb;

use sedb;

# 테이블 생성
create table board (
    pid    INT              	NOT NULL    AUTO_INCREMENT COMMENT '게시글ID', 
    
    author      VARCHAR(50)      	NOT NULL    				COMMENT '작성자',
    pw			VARCHAR(50)			NOT NULL    				COMMENT '삭제 비밀번호', 
    
    category	VARCHAR(50)			NOT NULL					COMMENT '그룹',
    title       VARCHAR(50)      	NOT NULL    				COMMENT '제목', 
    content     VARCHAR(1000)    	NOT NULL default "" 		COMMENT '내용', 
	image_name  VARCHAR(1000)    	default NULL 				COMMENT '이미지', 
  
	regist_date	DATETIME         	NOT NULL    				COMMENT '등록일자', 
    views		INT					NOT NULL 	default 0,
    votes		INT					NOT NULL 	default 0,
    
    PRIMARY KEY (pid)
);

# 샘플 레코드 
insert into board(author, pw, category, title, content, image_name, regist_date)
values
("작성자1", "1234", "CS", "첫번째 글", "빈 내용", "no_image.jpg", "2023-09-01 06:12:24"),
("작성자2", "1234", "CS", "두번째 글", "사과입니다.", "apple.jpg", "2023-09-02 06:12:24"),
("작성자3", "1234", "CS", "세번째 글", "나무입니다.", "tree.jpg", "2023-09-03 06:12:24");

# 보기
select * from board;