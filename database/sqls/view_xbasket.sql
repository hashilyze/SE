CREATE OR REPLACE VIEW XBasket AS 
SELECT Basket.uid as uid, XPost.*
FROM Basket LEFT JOIN XPost ON Basket.pid = XPost.pid;