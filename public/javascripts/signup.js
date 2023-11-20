async function requestSignin() {
    let nameTag = document.getElementById("name");
    let loginIdTag = document.getElementById("login_id");
    let passwordTag = document.getElementById("password");

    let name = nameTag.value;
    let login_id = loginIdTag.value;
    let password = passwordTag.value;
    if (name.trim() === "") {
        alert("이름을 입력하십시오.");
        nameTag.focus();
        return;
    }
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
    try{
        let response = await fetch(url, req);
        if(response.status == 403){
            alert("동일한 아이디가 존재합니다.");
            loginIdTag.value = "";
            loginIdTag.focus();
            return;
        }
        let data = await response.json();
        if (data.result == "Success") {
            alert("회원가입되었습니다.");
            location.href = "/auth/sign-in";
            return;
        }
    } catch(err){
        console.error(err);
    }
    alert("회원가입 실패");
    passwordTag.value = "";
    passwordTag.focus();
}