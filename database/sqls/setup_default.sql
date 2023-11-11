INSERT IGNORE INTO User(login_id, password, name, role)
VALUES
("admin", "admin", "관리자", 1),
("tester", "tester", "테스터", 0);

# 형식
INSERT IGNORE INTO Format(name)
VALUES
("설계코드"),
("설계도");

# 카테고리
INSERT IGNORE INTO Category(name)
VALUES
("공지"),
("딥러닝"),
("프로그래밍 언어론"),
("임베디드 소프트웨어"),
("머신러닝"),
("데이터베이스"),
("알고리즘"),
("소프트웨어 공학 및 설계");