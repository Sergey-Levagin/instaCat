const $cont = document.querySelector("[data-cont]");
const $openModel = document.querySelector("[data-open_model]");
const $models_wr = document.querySelector("[data-models_wr]");
const $model_form = document.querySelector("[data-model_form]");
const $model_formChange = document.querySelector("[data-model_formChange]");
const $form_change = document.querySelector("[data-form_change]");
const $open = document.querySelector("[data-action_open]");

class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async getAllCats() {
    try {
      const response = await fetch(`${this.baseUrl}/show`);
      return response.json();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getDeleteCats(idCat) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${idCat}`, {
        method: "DELETE",
      });
      if (response.status !== 200) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async addCat(data) {
    try {
      const response = await fetch(`${this.baseUrl}/add`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async change(data, idCat) {
    try {
      const response = await fetch(`${this.baseUrl}/update/${idCat}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getIdCat(idCat) {
    const response = await fetch(`${this.baseUrl}/show/${idCat}`);
    return response.json();
  }
}

const generatorHTMLTemplateForCat = (cat) =>
  `<div data-card_id=${cat.id} class="card">
      <h3>${cat.name}</h3>
      <img src = ${cat.img_link}>
      <p>Возраст - ${cat.age}</p>
      <p>${cat.description}</p>
      <div class ="favorite">
      ${
        '<i class="fa-solid fa-star"></i>'.repeat(cat.rate) +
        '<i class="fa-regular fa-star"></i>'.repeat(10 - cat.rate)
      }</div>
      <div class="like">
      ${likes(cat)}
      </div>
      <div class="button">
          <button data-action="open" type="button">Открыть</button>
          <button data-action="change" type="button">Изменить</button>
          <button data-action="delete" type="button">Удалить</button>
        </div>
      </div>`;

const generatorHTMLTemplateForOpenCardCat = (cat) =>
  `<div class="img_cat">
  <img src="${cat.img_link}" alt="">
</div>
  <div class="open__name">
    <p>Имя кота</p>
    <p>Возраст кота</p>
    <p>Описание</p>
    <p>Ретинг</p>
    <p>Фаворит</p>
  </div>
  <div class="open_value">
    <p>${cat.name}</p>
    <p>${cat.age}</p>
    <p>${cat.description}</p>
    <div class ="favorite">
      ${
        '<i class="fa-solid fa-star"></i>'.repeat(cat.rate) +
        '<i class="fa-regular fa-star"></i>'.repeat(10 - cat.rate)
      }</div>
    <p class="like">
      ${likes(cat)}
    </p>
    <div>
          <button data-action="closed_open" type="button">Закрыть</button>
    </div>
  </div>`;

const api = new API("http://sb-cats.herokuapp.com/api/2/sergey-levagin");

//генереруем card
api.getAllCats().then((responseData) =>
  responseData.data.forEach((cat) => {
    return $cont.insertAdjacentHTML(
      "beforeend",
      generatorHTMLTemplateForCat(cat)
    );
  })
);

function likes(element) {
  if (element.favourite) {
    return `<i class="fa-solid fa-heart"></i>`;
  } else {
    return `<i class="fa-regular fa-heart"></i>`;
  }
}

//удаление и редактирование card
$cont.addEventListener("click", (event) => {
  switch (event.target.dataset.action) {
    case "delete":
      const $cardWr = event.target.closest("[data-card_id]");
      const cardId = $cardWr.dataset.card_id;
      api
        .getDeleteCats(cardId)
        .then(() => {
          $cardWr.remove();
        })
        .catch(alert);
      break;
    case "change":
      const $cardWrChange = event.target.closest("[data-card_id]");
      const cardIdChange = $cardWrChange.dataset.card_id;
      api
        .getIdCat(cardIdChange)
        .then((recponseData) => {
          valueForFormChangeCat(recponseData);
        })
        .catch(alert);
      $models_wr.classList.remove("hidden");
      $model_formChange.classList.remove("hidden");
      break;
    case "open":
      const $cardWrOpen = event.target.closest("[data-card_id]");
      const cardIdOpen = $cardWrOpen.dataset.card_id;
      console.log(cardIdOpen);
      api
        .getIdCat(cardIdOpen)
        .then((response) => {
          return (
            $open.insertAdjacentHTML(
              "beforeend",
              generatorHTMLTemplateForOpenCardCat(response.data)
            ),
            $open.classList.remove("hidden"),
            $models_wr.classList.remove("hidden")
          );
        })
        .catch(alert);
  }
});

const valueForFormChangeCat = (recponseData) => {
  return (
    (document.querySelector("#id_cat").value = recponseData.data.id),
    (document.querySelector("#name_change").value = recponseData.data.name),
    (document.querySelector("#age").value = recponseData.data.age),
    (document.querySelector("#rate_text").value = recponseData.data.rate),
    (document.querySelector("#description").value =
      recponseData.data.description),
    (document.querySelector("#img_link").value = recponseData.data.img_link),
    (document.querySelector("#favourite").checked = recponseData.data.favourite)
  );
};

//изменение кота
document.forms.change_cat.addEventListener("submit", (event) => {
  event.preventDefault();
  const idCat = new FormData(document.forms.change_cat).get("id");
  const data = {
    age: new FormData(document.forms.change_cat).get("age"),
    rate: new FormData(document.forms.change_cat).get("rate"),
    description: new FormData(document.forms.change_cat).get("description"),
    favourite: new FormData(document.forms.change_cat).get("favourite"),
    img_link: new FormData(document.forms.change_cat).get("img_link"),
  };
  data.rate = +data.rate;
  data.age = +data.age;
  data.favourite = data.favourite == "on";
  api
    .change(data, idCat)
    .then(
      () => $models_wr.classList.add("hidden"),
      $model_formChange.classList.add("hidden"),
      setTimeout(() => window.location.reload(), 250)
    )
    .catch(alert);
});

//добавление кота
document.forms.add_cat.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  data.id = +data.id;
  data.rate = +data.rate;
  data.age = +data.age;
  data.favourite = data.favarite == "on";

  api
    .addCat(data)
    .then(() => {
      $cont.insertAdjacentHTML("beforeend", generatorHTMLTemplateForCat(data));
      $model_form.classList.add("hidden");
      $models_wr.classList.add("hidden");
      event.target.reset();
      localStorage.removeItem(document.forms.add_cat);
    })
    .catch(alert);
});

//открытие модалки
$openModel.addEventListener("click", () => {
  $models_wr.classList.remove("hidden");
  $model_form.classList.remove("hidden");
});

//Закрытие модалки
$models_wr.addEventListener("click", (event) => {
  switch (event.target.dataset.action) {
    case "closed":
      $models_wr.classList.add("hidden");
      $model_form.classList.add("hidden");
      break;
    case "closed_change":
      $models_wr.classList.add("hidden");
      $model_formChange.classList.add("hidden");
      break;
    case "closed_open":
      $models_wr.classList.add("hidden");
      $open.classList.add("hidden");
      $open.innerHTML = "";
  }
});

//функция значение rate
function showSliderValue() {
  var sliderValue = document.querySelector("#slider").value;
  var text = document.querySelector("#text");
  text.value = sliderValue;
}

function SliderValueChange() {
  var sliderValue = document.querySelector("#slider_change").value;
  var text = document.querySelector("#rate_text");
  text.value = sliderValue;
}

//Local Storage
const formAddCatLocalStorage = localStorage.getItem(document.forms.add_cat);
const formDataAddCat = formAddCatLocalStorage
  ? JSON.parse(formAddCatLocalStorage)
  : undefined;
if (formDataAddCat) {
  Object.keys(formDataAddCat).forEach((key) => {
    document.forms.add_cat[key].value = formDataAddCat[key];
  });
}
document.forms.add_cat.addEventListener("input", (event) => {
  const formDataObject = Object.fromEntries(
    new FormData(document.forms.add_cat).entries()
  );
  localStorage.setItem(document.forms.add_cat, JSON.stringify(formDataObject));
});
