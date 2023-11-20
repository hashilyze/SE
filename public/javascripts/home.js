// 추천 시스템
window.onload = function () {
    let req = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    };

    let buildRecommandation = (url, offset) => {
        fetch(url, req)
            .then((response) => response.json())
            .then((data) => {
                if (data.result != "Success") return;
                let count = data.posts.length;
                for (let i = 0; i < count; ++i) {
                    let index = i + offset;
                    let post = data.posts[i];

                    let imagePath = "";
                    if (post.images && post.images.length > 0) {
                        imagePath = `/uploads/${post.images[0]}`;
                    } else {
                        imagePath = "/images/no_image.png";
                    }

                    document.getElementById(`img-${index}`).setAttribute("src", imagePath);
                    document.getElementById(`thumbnail-${index}`).setAttribute("href", `/post/read/${post.pid}`);
                    document.getElementById(`title-${index}`).setAttribute("href", `/post/read/${post.pid}`)
                    document.getElementById(`title-${index}`).innerText = post.title;
                }
            }).catch((err) => console.error(err));
    };

    let url1 = "/post/search?format=1&limit=3&offset=0&order=DESC&key=likes";
    let url2 = "/post/search?format=2&limit=3&offset=0&order=DESC&key=likes";
    buildRecommandation(url1, 1);
    buildRecommandation(url2, 4);
}