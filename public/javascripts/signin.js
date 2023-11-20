async function requestSignin() {
    let loginIdTag = document.getElementById("login_id");
    let passwordTag = document.getElementById("password");

    let login_id = loginIdTag.value;
    let password = passwordTag.value;
    if (login_id.trim() === "") {
        alert("아이디를 입력하십시오.");
        loginIdTag.focus();
        return;
    }
    if (password.trim() === "") {
        alert("비밀번호를 입력하십시오.");
        passwordTag.focus();
        return;
    }

    let url = "/auth/sign-in";
    let req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            login_id,
            password
        })
    };

    try{
        let response = await fetch(url, req);
        let data = await response.json();
        if (data.result == "Success") {
            location.href = "/";
            return;
        }
    } catch(err){
        console.error(err);
    }
    alert("로그인 실패");
    passwordTag.value = "";
    passwordTag.focus();
}