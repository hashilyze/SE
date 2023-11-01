USE sedb;

CREATE VIEW XPost AS 
SELECT *, (SELECT json_arrayagg(Post_Image.name)
	FROM Post_Image
	GROUP BY Post_Image.pid
    HAVING Post.pid = Post_Image.pid) AS images, # 이미지 목록
    (SELECT name FROM User WHERE Post.writer = User.uid) AS writer_name, # 작성자 이름
    (SELECT name FROM Category WHERE Post.category = Category.cid) AS category_name # 카테고리 명
FROM Post;