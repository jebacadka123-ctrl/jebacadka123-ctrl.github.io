var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")) {
        selector.classList.remove("selector_open");
    } else {
        selector.classList.add("selector_open");
    }
});

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
});

imageInput.addEventListener('change', (event) => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    var reader = new FileReader();

    reader.onload = function() {
        var base64Image = reader.result.split(',')[1];

        var data = new FormData();
        data.append("key", "8ca5d96c7a478e5a16bb17c74a37f819"); // IMGBB API key
        data.append("image", base64Image);

        fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: data
        })
        .then(result => result.json())
        .then(response => {
            if(response.success) {
                var url = response.data.url;
                upload.classList.remove("error_shown");
                upload.setAttribute("selected", url);
                upload.classList.add("upload_loaded");
                upload.classList.remove("upload_loading");
                upload.querySelector(".upload_uploaded").src = url;
            } else {
                console.error("Upload failed:", response);
                upload.classList.remove("upload_loading");
                upload.classList.add("error_shown");
            }
        })
        .catch(err => {
            console.error("Upload error:", err);
            upload.classList.remove("upload_loading");
            upload.classList.add("error_shown");
        });
    };

    reader.readAsDataURL(file);
});

document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);
    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday += "." + element.value;
        if (isEmpty(element.value)) dateEmpty = true;
    });
    birthday = birthday.substring(1);

    if (dateEmpty) {
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }
    });

    if (empty.length != 0) {
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

function isEmpty(value) {
    let pattern = /^\s*$/;
    return pattern.test(value);
}

function forwardToId(params) {
    location.href = "/FistaszjoCwelbywatel/id?" + params;
}

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    if (guide.classList.contains("unfolded")) {
        guide.classList.remove("unfolded");
    } else {
        guide.classList.add("unfolded");
    }
});
