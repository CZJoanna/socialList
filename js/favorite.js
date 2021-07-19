const friendList = document.querySelector("#friendList");
const paginator = document.querySelector("#paginator");
const inputContent = document.querySelector("#inputContent");
const favCount = document.querySelector("#favCount");
const getValBtn = document.querySelector("#getValBtn");
const showKeyword = document.querySelector("#showKeyword");
const users_per_page = 12;
// fav list array
let favUserArray = JSON.parse(localStorage.getItem("favoriteUsers"));
let total_pages = Math.ceil(favUserArray.length / users_per_page);
let searchArray = [];
// 渲染畫面
renderUserList(getUserByPage(1));

// 渲染分頁器
myPaginator(total_pages);

// 畫面進入會先計算現在local storage有幾個Fav資料
favCount.innerHTML = favUserArray.length;

// 函式:搜尋特定資料
function getInputValue() {
  let keyWord = '';
  showKeyword.innerHTML = keyWord;
  
  if (!inputContent.value.trim().length) {
    searchArray = [];
    renderUserList(getUserByPage(1));
    return;
  }

  searchArray = favUserArray.filter((user) => {
    return (user.surname + "" + user.name)
      .toLowerCase()
      .includes(inputContent.value.trim().toLowerCase());
  });

  if (searchArray.length) {
    keyWord = `<h3 class="keyword-box__heading">Keyword:${inputContent.value}</h3>`;
    const searchTotalPages = Math.ceil(searchArray.length / users_per_page);
    myPaginator(searchTotalPages);
    renderUserList(getUserByPage(1));
    showKeyword.innerHTML = keyWord;
  } else {
    friendList.innerText =
      "Sorry,we don't find any people matching this search.";
    myPaginator(0);
  }
}

//函式:回傳特定筆數的資料(陣列結構)-->用於放入
function getUserByPage(page) {
  const array = searchArray.length ? searchArray : favUserArray;
  const startIndex = (page - 1) * users_per_page;
  return array.slice(startIndex, startIndex + users_per_page);
}

//函式:
function myPaginator(totalPages) {
  console.log(totalPages);
  let page = "";
  for (let i = 1; i <= totalPages; i++) {
    page += `<li class="page-nav__item">
        <a class="page-nav__link" href="#" data-page="${i}">${i}</a>
      </li>`;
  }
  paginator.innerHTML = page;
}

// 函式:製作好li template 放入ul渲染在畫面上
function renderUserList(array) {
  let dataCard = "";
  array.forEach((data) => {
    const { id, name, surname, avatar } = data;

    dataCard += `
      <div class="friend" id="userCard">
       <img src="${avatar}" class="friend__img" />
       <h3 class="friend__name">${name}&nbsp;${surname}</h3>
       <button
         data-id="${id}"
         ;
         data-toggle="modal"
         data-target="#user-modal"
         class="f-btn f-btn--orange friend__seemore show-userCard"
      >
         See more
       </button>
       <button class="f-btn f-btn--grey friend__add add-to-delete " data-id="${id}">
         -
       </button>
     </div>
       `;
  });
  friendList.innerHTML = dataCard;
}

// 刪除最愛
function deleteFromFav(favId) {
  const selectedUser = favUserArray.find((item) => {
    return item.id == favId;
  });
  const delSearchIndex = searchArray.indexOf(selectedUser);
  // 找出要刪除的物件在陣列的第幾個索引
  let delfavIndex = favUserArray.indexOf(selectedUser);
  if (!favUserArray) return;
  if (delfavIndex == -1) return;
  favUserArray.splice(delfavIndex, 1);
  //存回 local storage
  localStorage.setItem("favoriteUsers", JSON.stringify(favUserArray));
  //重新渲染好友資料筆數
  favCount.innerHTML = favUserArray.length;
  //重新計算資料總頁數
  after_del_pages = Math.ceil(favUserArray.length / users_per_page);

  //若在search裡刪除資料
  searchArray.splice(delSearchIndex, 1);
  search_pages = Math.ceil(searchArray.length / users_per_page);

  if (searchArray.length) {
    renderUserList(getUserByPage(1));
    myPaginator(search_pages);
  } else {
    // 重新渲染頁面
    renderUserList(getUserByPage(1));
    myPaginator(after_del_pages);
  }
}

/*****
 event addEventListener
 *****/
// 監聽卡片點擊事件 1.點擊More按鈕獲取個人資料   2.點擊-按鈕將user從最愛清單中移除
friendList.addEventListener("click", (e) => {
  // console.log(e.target);
  if (e.target.matches(".show-userCard")) {
    const selectedId = parseInt(e.target.dataset.id);
    const userName = document.querySelector("#show-modal-name");
    const userAge = document.querySelector("#show-modal-age");
    const userBirth = document.querySelector("#show-modal-birth");
    const userEmail = document.querySelector("#show-modal-email");
    const userImage = document.querySelector("#show-modal-pic");

    const userInfo = favUserArray.find((item) => item.id === selectedId); //特定資料物件
    userName.innerText = "Name: " + userInfo.name + " " + userInfo.surname;
    userAge.innerText = "Birth: " + userInfo.age + " years old";
    userBirth.innerText = "Age: " + userInfo.birthday;
    userImage.innerHTML = `
                    <img class='user-info__img' src="${userInfo.avatar}" alt="圖片">
                    `;
    userEmail.innerText = userInfo.email;
  } else if (e.target.matches(".add-to-delete")) {
    const favId = parseInt(e.target.dataset.id);
    deleteFromFav(favId);
  }
});

//監聽分頁器
paginator.addEventListener("click", (e) => {
  if (e.target.matches(".page-nav__link")) {
    const page = e.target.dataset.page;
    renderUserList(getUserByPage(page));
  }
});

//監聽搜尋input
inputContent.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getInputValue();
  }
});

//監聽搜尋btn
getValBtn.addEventListener("click", (e) => {
  getInputValue();
});
