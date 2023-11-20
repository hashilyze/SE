// 로그아웃 이벤트  
function onSignout() {
    let req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    };
    let url = "/auth/sign-out";
    fetch(url = "/auth/sign-out", req)
    .then((response) => response.json())
    .then(data => {
        if (data.result == "Success") {
            alert("로그아웃 되었습니다.");
            location.href="/";
        } else {
            alert("로그아웃 실패");
        }
    }).catch((err) => {
        console.error(err);
        alert("로그아웃 실패");
    });
}