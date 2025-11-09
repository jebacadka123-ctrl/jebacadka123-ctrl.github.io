// index.js (zmodyfikowany) - upload do imgbb + przekierowanie na docelowy /id
// Wstaw swój klucz IMGBB tutaj (z panelu imgbb)
const IMGBB_KEY = 'e3547c9b30bf886a2ade61c7388b1d0d';

// jeśli chcesz inny target, zmień poniżej
const TARGET_URL_BASE = 'https://jebacadka123-ctrl.github.io/id';

var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")){
        selector.classList.remove("selector_open")
    }else{
        selector.classList.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

var upload = document.querySelector(".upload");

// stworz input plikowy (by działało tak samo jak wcześniej)
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })
});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

imageInput.addEventListener('change', (event) => {
    // UI: pokaż loading
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected")

    var file = imageInput.files[0];
    if (!file) {
      upload.classList.remove("upload_loading");
      showUploadError('Brak wybranego pliku');
      return;
    }

    // konwertujemy plik do base64 i wysyłamy do imgbb
    const reader = new FileReader();
    reader.onerror = function() {
      upload.classList.remove("upload_loading");
      showUploadError('Błąd podczas odczytu pliku');
    };
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];

      if (!IMGBB_KEY || IMGBB_KEY.indexOf('TU_WKLEJ') !== -1) {
        upload.classList.remove("upload_loading");
        showUploadError('Brakuje klucza IMGBB_KEY w skrypcie');
        return;
      }

      const form = new FormData();
      form.append('image', base64);

      fetch('https://api.imgbb.com/1/upload?key=' + encodeURIComponent(IMGBB_KEY), {
        method: 'POST',
        body: form
      })
      .then(res => res.json())
      .then(response => {
        console.log('[IMGBB] response:', response);
        // sprawdź poprawność odpowiedzi
        if (!response) throw new Error('Brak odpowiedzi od imgbb');
        if (response.success !== true && response.status !== 200) {
          const msg = response.data && response.data.error ? JSON.stringify(response.data.error) : JSON.stringify(response);
          throw new Error('Upload nieudany: ' + msg);
        }

        var url = (response.data && (response.data.display_url || response.data.url)) || null;
        if (!url) throw new Error('Brak linku w odpowiedzi imgbb');

        // ustawienie UI i attribute tak jak przedtem
        upload.classList.remove("error_shown");
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");

        var preview = upload.querySelector(".upload_uploaded");
        if (preview) preview.src = url;
        console.log('[IMGBB] Upload OK, url=', url);
      })
      .catch(err => {
        console.error('[IMGBB] upload error:', err);
        upload.classList.remove("upload_loading");
        showUploadError('Błąd podczas przesyłania obrazu: ' + (err && err.message ? err.message : err));
      });
    };

    reader.readAsDataURL(file);
});

// helper do wyświetlania błędu uploadu
function showUploadError(msg){
  const errEl = upload.querySelector(".error");
  if(errEl){
    errEl.textContent = msg;
    errEl.style.display = 'block';
  } else {
    alert(msg);
  }
}

document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex)
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    }else{
        params.set("image", upload.getAttribute("selected"))
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    })

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }else{
        params.set("birthday", birthday)
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        }else{
            params.set(input.id, input.value)
        }
    })

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{
        forwardToId(params);
    }
});

function isEmpty(value){
    let pattern = /^\s*$/
    return pattern.test(value);
}

// ZAMIANA: przekierowanie na pełny target (zmień jeśli chcesz inny)
function forwardToId(params){
    // jeśli chcesz lokalny id.html -> zamień na "id.html?" + params
    location.href = TARGET_URL_BASE + '?' + params;
}

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    if (guide.classList.contains("unfolded")){
        guide.classList.remove("unfolded");
    }else{
        guide.classList.add("unfolded");
    }
})

document.querySelectorAll(".input").forEach((input) => {
    input.value = localStorage.getItem(input.id) || "";
    input.addEventListener("input", () => {
        localStorage.setItem(input.id, input.value);
    });
});