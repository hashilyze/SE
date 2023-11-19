function requestSignin() {
    let name = document.getElementById("name").value;
    let login_id = document.getElementById("login_id").value;
    let password = document.getElementById("password").value;

    let url = "/user";
    let req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            login_id,
            password
        })
    };
    
    fetch(url, req)
    .then((response) => response.json())
    .then((data) => {
        if (data.result == "Success") {
            alert("회원가입에 성공하였습니다.");
            location.href = "/auth/sign-in";
        } else {
            alert("회원가입 실패");
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        }
    }).catch((err) => console.error(err));
}