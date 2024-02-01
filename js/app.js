// Selectors
const containerDiv = document.querySelector(".container");
const contentDiv = document.querySelector(".container .content");
const aside = document.querySelector("aside");
const asideBtn = document.querySelector("aside .control .asideBtn");
const asideLinks = Array.from(document.querySelectorAll("aside ul li"));
const loading = document.querySelector(".loadingWrapper");

// Event listeners
asideBtn.addEventListener("click", toggleAside);
document.getElementById("switch").addEventListener("click", toggleTheme);
asideLinks.forEach(link => link.addEventListener("click", closeAside));

// Search handle
function searchHandle() {
  contentDiv.innerHTML = `
    <div class="form">
      <div class="inp">
        <input type="text" placeholder="Search By Name" class="searchNameInp"/>
        <span>no meals for this name</span>
      </div>
      <div class="inp">
        <input type="text" placeholder="Search By First Letter" class="searchLetterInp" maxlength="1"/>
        <span>no meals for this letter</span>
      </div>
    </div>
  `;
  
  // Apply styles directly to the input elements
  const nameSearchInp = document.querySelector(".form .searchNameInp");
  const letterSearchInp = document.querySelector(".form .searchLetterInp");
  nameSearchInp.style.width = "100%";
  letterSearchInp.style.width = "100%";

  // Add event listeners
  nameSearchInp.addEventListener("input", () => searchMeals(nameSearchInp.value, "name"));
  letterSearchInp.addEventListener("input", () => searchMeals(letterSearchInp.value, "letter"));

  // Append content to container
  containerDiv.appendChild(contentDiv);
}


// Async functions
async function getDefaultMeals() {
  const api = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood");
  const res = await api.json();
  const newRes = res.meals.length > 20 ? res.meals.slice(0, 20) : res.meals;
  displayDefaultMeals(newRes);
}

async function getMealsBySearch(url, inp, searchValue) {
  try {
    const api = await fetch(url);
    const res = await api.json();
    displayDefaultMeals(res.meals);
    document.querySelector(`.form .search${capitalizeFirstLetter(inp)}Inp`).nextElementSibling.classList.remove("active");
  } catch (error) {
    loading.classList.remove("active");
    const searchInput = document.querySelector(`.form .search${capitalizeFirstLetter(inp)}Inp`);
    searchInput.nextElementSibling.classList.add("active");
    searchInput.nextElementSibling.innerHTML = `no meals for ${searchValue}`;
  }
}

// Display functions
function displayDefaultMeals(meals) {
  loading.classList.add("active");
  const box = meals.map(meal => `
    <div class="box noSelect" data-id="${meal.idMeal}" onclick="getSingleMeal(${meal.idMeal})">
      <img src="${meal.strMealThumb}"/>
      <div class="overlay">
        <h2 class="title">${meal.strMeal}</h2>
      </div>
    </div>
  `).join("");
  setTimeout(() => loading.classList.remove("active"), 200);
  contentDiv.innerHTML = box;
}

function displaySingleMeal(meal) {
  loading.classList.add("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  const tags = meal.strTags ? meal.strTags.split(",") : [];
  const recipe = Object.entries(meal).reduce((acc, [key, value]) => {
    if (key.startsWith("strMeasure") && value && value !== " ") {
      acc.push(value);
    }
    return acc;
  }, []);

  setTimeout(() => loading.classList.remove("active"), 200);
  contentDiv.innerHTML = `
    <div class="single">
      <div class="left">
        <img src="${meal.strMealThumb}"/>
        <h1 class="title">${meal.strMeal}</h1>
      </div>
      <div class="right">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3>Area: <span>${meal.strArea}</span></h3>
        <h3>Category: <span>${meal.strCategory}</span></h3>
        <div class="recipes">
          <h3>Recipes:</h3>
          <ul>${recipe.map(rec => `<li>${rec}</li>`).join("")}</ul>
        </div>
        <div class="tags">
          <h3>Tags:</h3>
          <ul>${tags.map(tag => `<li>${tag}</li>`).join("")}</ul>
        </div>
        <div class="media">
          <a href="${meal.strSource}" class="src">Source</a>
          <a href="${meal.strYoutube}" class="yt">Youtube</a>
        </div>
      </div>
    </div>
  `;
}

// Other functions
function toggleAside(e) {
  aside.classList.toggle("active");
  const asideIcon = e.target;
  asideIcon.classList.replace("fa-bars", aside.classList.contains("active") ? "fa-xmark" : "fa-bars");
  asideLinks.forEach(link => (link.style.top = aside.classList.contains("active") ? "0" : "300px"));
}

function toggleTheme() {
  document.body.classList.toggle("light");
  aside.classList.toggle("light");
  containerDiv.classList.toggle("light");
}

function closeAside() {
  aside.classList.remove("active");
  asideBtn.classList.replace("fa-xmark", "fa-bars");
  asideLinks.forEach(link => (link.style.top = "300px"));
}

function searchMeals(value, type) {
  const searchUrl = type === "name"
    ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
    : `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`;
  getMealsBySearch(searchUrl, type, value);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initial actions
getDefaultMeals();
//////////////////////////////////////////////////MOHAMED YASSER !!////////////////////////////////////////////////////////////////!@@*

async function getMealsBySearch(url, inp, searchValue) {
  let nameSearchInp = document.querySelector(".form .searchNameInp");
  let letterSearchInp = document.querySelector(".form .searchLetterInp");
  try {
    let api = await fetch(url);
    let res = await api.json();
    displayDefaultMeals(res.meals);
    nameSearchInp.nextElementSibling.classList.remove("active");
    letterSearchInp.nextElementSibling.classList.remove("active");
  } catch (error) {
    loading.classList.remove("active");
    if (inp == "name") {
      nameSearchInp.nextElementSibling.classList.add("active");
      nameSearchInp.nextElementSibling.innerHTML = `no meals for ${searchValue}`;
    } else if (inp == "letter") {
      letterSearchInp.nextElementSibling.classList.add("active");
      letterSearchInp.nextElementSibling.innerHTML = `no meals for ${searchValue}`;
    }
  }
}

async function getCategories() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let res = await api.json();
  displayCategories(res.categories);
}

async function getAreas() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let res = await api.json();
  displayAreas(res.meals);
}

async function getIngredients() {
  let api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let res = await api.json();
  let ingreds = res.meals.slice(0, 20);
  displayIngredients(ingreds);
}

async function getSingleMeal(id) {
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let res = await api.json();
  displaySingleMeal(res.meals[0]);
}

async function getMealsCategory(cat) {
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  let res = await api.json();
  let newarr = res.meals.slice(0, 20);
  displayDefaultMeals(newarr);
}

async function getMealsArea(area) {
  console.log("area");
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let res = await api.json();
  let newarr = res.meals.slice(0, 20);
  displayDefaultMeals(newarr);
}

async function getMealsIngredients(ing) {
  console.log(ing);
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
  );
  let res = await api.json();
  displayDefaultMeals(res.meals);
}


function displayDefaultMeals(meals) {
  loading.classList.add("active");
  let box = "";
  meals.map((meal) => {
    box += `
          <div class="box noSelect" data-id="${meal.idMeal}" onclick=(getSingleMeal(${meal.idMeal}))>
            <img src="${meal.strMealThumb}"/>
            <div class="overlay">
              <h2 class="title">${meal.strMeal}</h2>
            </div>
          </div>
      `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

function displaySingleMeal(meal) {
  loading.classList.add("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  //   console.log(meal);
  let tags = meal.strTags ? meal.strTags.split(",") : null;
  let recipe = [];

  for (const [key, value] of Object.entries(meal)) {
    // console.log(`${key}: ${value}`);

    if (key.startsWith("strMeasure")) {
      if (value && value !== " ") {
        recipe.push(value);
      }
    }//////////////////////////////////////////////////MOHAMED YASSER !!////////////////////////////////////////////////////////////////!@@*

  }
  console.log(recipe);

  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = `
    <div class="single">
    <div class="left">
      <img
        src="${meal.strMealThumb}"
      />
      <h1 class="title">${meal.strMeal}</h1>
    </div>
    <div class="right">
      <h2>Instructions</h2>
      <p>
      ${meal.strInstructions}
      </p>
      <h3>Area: <span>${meal.strArea}</span></h3>
      <h3>Category: <span>${meal.strCategory}</span></h3>
      <div class="recipes">
        <h3>Recipes:</h3>
        <ul>
        ${
          recipe
            ? recipe
                .map((rec) => {
                  return `<li>${rec}</li>`;
                })
                .join("")
            : "no recipe :("
        }
        </ul>
      </div>
  
      <div class="tags">
        <h3>Tags:</h3>
        <ul>
        ${
          tags
            ? tags
                .map((tag) => {
                  return `<li>${tag}</li>`;
                })
                .join("")
            : "no tags :("
        }
        </ul>
      </div>
      <div class="media">
        <a href="${meal.strSource}" class="src">Source</a>
        <a href="${meal.strYoutube}" class="yt">Youtube</a>
      </div>
    </div>
  </div>
      
      `;
}
//////////////////////////////////////////////////MOHAMED YASSER !!////////////////////////////////////////////////////////////////!@@*

function dispalyContact() {
  loading.classList.remove("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);

  contentDiv.innerHTML = `
      <div class="contact">
          <div class="form">
              <div class="inp">
                  <input type="text" placeholder="Enter Your Name" data-input="name"/>
                  <span>Name input not allowed to be empty</span>
              </div>
              <div class="inp">
                  <input type="email" placeholder="Enter Your Email" data-input="email" />
                  <span>Email not valid *exemple@yyy.zzz</span>
              </div>
              <div class="inp">
                  <input type="text" placeholder="Enter Your Phone"  data-input="phone"/>
                  <span>Enter valid Phone Number</span>
              </div>
              <div class="inp">
                  <input type="number" placeholder="Enter Your Age"  data-input="age"/>
                  <span>Minumum Age 16</span>
              </div>
              <div class="inp">
                  <input type="password" placeholder="Enter Your Password"  data-input="pass"/>
                  <span>Enter valid password *Minimum eight characters, at least one letter and one number:*</span>
              </div>
              <div class="inp">
                  <input type="password" placeholder="Repassword" data-input="repass"/>
                  <span>Two passwords don't match</span>
              </div>
              <button>Sumbit</button>
          </div>
      </div>
      `;

  let inps = Array.from(document.querySelectorAll(".contact .form .inp input"));
  let btn = document.querySelector(".contact .form button");
  let totalRegex = {
    name: false,
    email: false,
    phone: false,
    age: false,
    pass: false,
    repass: false,
  };
  function showError(input, res) {
    if (res) {
      input.nextElementSibling.classList.remove("active");
    } else {
      input.nextElementSibling.classList.add("active");
    }
  }
  //////////////////////////////////////////////////MOHAMED YASSER !!////////////////////////////////////////////////////////////////!@@*


  inps.map((inp) => {
    inp.addEventListener("input", (e) => {
      if (inp.dataset.input == "name") {
        let name = inp.value;
        let regex = /^[a-z]{1,}/;
        let result = name.match(regex);
        if (result) {
          totalRegex.name = true;
        } else {
          totalRegex.name = false;
        }
        console.log(result);
        showError(inp, result);
      }
      else if (inp.dataset.input == "email") {
        let email = inp.value;
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let result = email.match(regex);
        if (result) {
          totalRegex.email = true;
        } else {
          totalRegex.email = false;
        }
        showError(inp, result);
      }
      else if (inp.dataset.input == "phone") {
        let phone = inp.value;
        let regex = /^\d{10,11}$/;
        let result = phone.match(regex);
        if (result) {
          totalRegex.phone = true;
        } else {
          totalRegex.phone = false;
        }
        showError(inp, result);
      }
      else if (inp.dataset.input == "age") {
        let age = inp.value;
        let result = age >= 16;
        if (result) {
          totalRegex.age = true;
        } else {
          totalRegex.age = false;
        }
        showError(inp, result);
      }
      else if (inp.dataset.input == "pass") {
        let pass = inp.value;
        let regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/;
        let result = pass.match(regex);
        if (result) {
          totalRegex.pass = true;
        } else {
          totalRegex.pass = false;
        }
        showError(inp, result);
      }
      else if (inp.dataset.input == "repass") {
        let result = false;
        inps.map((inpt) => {
          if (inpt.dataset.input == "pass") {
            result = true ? inpt.value == inp.value : false;
          }
        });
        if (result) {
          totalRegex.repass = true;
        } else {
          totalRegex.repass = false;
        }
        showError(inp, result);
      }
      if (
        totalRegex.name &&
        totalRegex.email &&
        totalRegex.phone &&
        totalRegex.age &&
        totalRegex.pass &&
        totalRegex.repass
      ) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  });
}
//////////////////////////////////////////////////MOHAMED YASSER !!////////////////////////////////////////////////////////////////!@@*

function displayIngredients(ingreds) {
  loading.classList.add("active");
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  let box = "";
  ingreds.map((ingred) => {
    let desc =
      ingred.strDescription.length >= 100
        ? ingred.strDescription.slice(0, 100)
        : ingred.strDescription;

    let ingredName = ingred.strIngredient.replace(/\s+/g, "_");
    box += `
        <div class="box ingredient noSelect" data-id="${ingred.ingredidIngredient}" onclick=(getMealsIngredients("${ingredName}"))>
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3 class="title">${ingred.strIngredient}</h3>
        <p>${desc}</p>
      </div>
        `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

function displayAreas(areas) {
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  loading.classList.add("active");
  let box = "";
  areas.map((area) => {
    box += `
      <div class="box area noSelect" onclick=(getMealsArea("${area.strArea}"))>
      <i class="fa-solid fa-house-laptop fa-4x"></i>
      <h3 class="title">${area.strArea}</h3>
    </div>
      `;
  });
  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

function displayCategories(cats) {
  containerDiv.innerHTML = "";
  containerDiv.appendChild(contentDiv);
  loading.classList.add("active");
  let box = "";
  cats.map((cat) => {
    // let desc = cat.strCategoryDescription
    console.log(cat);
    let desc =
      cat.strCategoryDescription.length >= 135
        ? cat.strCategoryDescription.slice(0, 135)
        : cat.strCategoryDescription;
    box += `
          <div class="box noSelect" data-id="${cat.idCategory}" onclick=(getMealsCategory('${cat.strCategory}'))>
          <img src="${cat.strCategoryThumb}"/>
          <div class="overlay category">
            <h2 class="title">${cat.strCategory}</h2>
            <p>${desc}</p>
          </div>
        </div>
          `;
  });
  //////////////////////////////////////////////////MOHAMED YASSER !!////////////////////////////////////////////////////////////////!@@*

  setTimeout(() => {
    loading.classList.remove("active");
  }, 200);
  contentDiv.innerHTML = box;
}

$(document).ready(function () {
  var lastScrollTop = 0;

  $(window).scroll(function () {
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
      // إذا كانت الحركة هي لأسفل
      $(".custom-slider").removeClass("scroll-up").addClass("scroll-down");
    } else {
      // إذا كانت الحركة هي لأعلى
      $(".custom-slider").removeClass("scroll-down").addClass("scroll-up");
    }
    lastScrollTop = st;يي
  });
});
dd

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", handleScroll);
});

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", handleScroll);
});

function handleScroll() {
  var scrollY = window.scrollY;

  // Adjust the colors based on your preference
  var handleColor = scrollY > 0 ? "#000" : "#000"; // Change colors as needed
  var handleHoverColor = scrollY > 0 ? "#ffee00" : "#ffee00"; // Change colors as needed
  var trackColor = scrollY > 0 ? "#ffee00" : "#000"; // Change colors as needed

  document.documentElement.style.setProperty("--scrollbar-handle-color", handleColor);
  document.documentElement.style.setProperty("--scrollbar-handle-hover-color", handleHoverColor);
  document.documentElement.style.setProperty("--scrollbar-track-color", trackColor);
}

document.addEventListener('DOMContentLoaded', function () {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.pageX + 'px';
      cursor.style.top = e.pageY + 'px';
  });

  document.addEventListener('mousedown', function () {
      cursor.classList.add('clicked'); // يضيف كلاس عند الضغط
  });

  document.addEventListener('mouseup', function () {
      cursor.classList.remove('clicked'); // يزيل الكلاس عند الإفراج
  });
});

document.addEventListener('mousedown', function () {
  document.body.style.cursor = 'none'; // يخفي المؤشر عند الضغط
});

document.addEventListener('mouseup', function () {
  document.body.style.cursor = 'auto'; // يستعيد المؤشر بعد الإفراج
});
