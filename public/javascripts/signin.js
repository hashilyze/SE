function requestSignin() {
    let login_id = document.getElementById("login_id").value;
    let password = document.getElementById("password").value;

    let url = "/auth/sign-in";
    let req = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            login_id,
            password
        })
    };
    
    fetch(url, req)
    .then((response) => response.json())
    .then((data) => {
        if (data.result == "Success") {
            location.href = "/";
        } else {
            alert("로그인 실패");
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        }
    }).catch((err) => console.error(err));
}