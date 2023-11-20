function requestRegister(method) {
    let titleTag = document.getElementById("title");
    let priceTag = document.getElementById("price");
    let descriptionTag = document.getElementById("description");
    // 사용자가 입력한 게시물 가져오기
    let title = titleTag.value;
    let price = priceTag.value;
    let description = descriptionTag.value;
    // input필드가 비어있는지 확인
    if (title.trim() === "") {
        alert("게시물 제목을 입력하세요.");
        titleTag.focus();
        return; // 빈 내용이면 함수 종료
    } else if(price.trim() === "" || isNaN(price) || price < 0){
        alert("게시물 가격을 입력하세요.");
        priceTag.focus();
        return;
    } else if(description.trim() === ""){
        alert("게시물 내용을 입력하세요.");
        descriptionTag.focus();
        return;
    }

    // formData 객체 생성
    let formData = new FormData();
    formData.append("title", title);
    formData.append("price", parseInt(price));
    formData.append("description", description);
    // 사용자가 선택한 이미지 파일 추가
    let files = document.getElementById("image").files;
    for (let file of files) {
        formData.append("images", file);
    }
    
    if(method == "POST"){
        var url = "/post"
    } else if(method == "PUT"){
        let paths = new URL(location.href).pathname.split("/");
        var pid = paths[paths.length - 1];
        var url = `/post/${pid}`
    } else{
        console.error("type error");
        return;
    }

    // POST 요청 설정
    let req = {
        method: method,
        headers: {},
        body: formData
    };

    // fetch를 사용한 서버 요청
    fetch(url, req)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.result === "Success") {
                alert("게시물이 등록되었습니다.");
                // 등록이 성공하면 해당 게시물의 읽기 페이지로 리디렉션
                if(method == "POST") pid = data.pid;
                location.href = `/post/read/${pid}`;
            } else {
                alert("게시물 등록에 실패했습니다. 다시 시도해주세요.");
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            alert("게시물 등록에 실패했습니다. 다시 시도해주세요.");
        });
}

function requestDelete() {
    let paths = new URL(location.href).pathname.split("/");
    let pid = paths[paths.length - 1];
    let url = `/post/${pid}`

    let req = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    };

    // fetch를 사용한 서버 요청
    fetch(url, req)
        .then((response) => response.json())
        .then((data) => {
            if (data.result === "Success") {
                alert("게시물이 삭제되었습니다.");
                location.href = `/`;
            } else {
                alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            alert("게시물 삭제에 실패했습니다. 다시 시도해주세요.");
        });
}