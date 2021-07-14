/* Constants and Veriables
 *****************************************/

//URLs Settings
const base_url = `https://lighthouse-user-api.herokuapp.com`;
const friends_url = `/api/v1/users`;
const users_per_page = 12;

// DOM Elements
const friendList = document.querySelector("#friendList");
const paginator = document.querySelector("#paginator");
const inputContent = document.querySelector("#inputContent");
const getValBtn = document.querySelector("#getValBtn");
const favCount = document.querySelector("#favCount");
const viewButton = document.querySelector("#viewButton");

// Data and Variables
// 如果favoriteUsers裡面是空的，則值會回傳null，null==false
const myFriendList = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
const dataArray = [];
let filterArray = [];
let mode = "card";

/* functions
 *****************************************/

//函式:回傳特定筆數的資料(陣列結構)
function getUserByPage(page) {
  const data = filterArray.length ? filterArray : dataArray;
  const startIndex = (page - 1) * users_per_page;
  return data.slice(startIndex, startIndex + users_per_page);
}

// 函式:製作好li template 放入ul渲染在畫面上
function renderUserList(array) {
  let dataCard = "";
  array.forEach((data) => {
    const id = data.id;
    const name = data.name;
    const surName = data.surname;
    const image = data.avatar;
    dataCard += `
    <div class="friend" id="userCard">
    <img src="${image}" class="friend__img" />
    <h3 class="friend__name">${name}&nbsp;${surName}</h3>
    <button
      data-id="${id}"
      ;
      data-toggle="modal"
      data-target="#user-modal"
      class="f-btn f-btn--orange friend__seemore show-userCard"
    >
      See more
    </button>
    <button class="f-btn f-btn--grey friend__add btn-add-favorite " data-id="${id}">
      +
    </button>
  </div>
     `;
  });
  friendList.innerHTML = dataCard;
  // showRenderMode();
}
// 函式:分頁器渲染
function myPaginator(totalPages) {
  let page = "";
  for (let i = 1; i <= totalPages; i++) {
    page += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }
  paginator.innerHTML = page;
}
// 函式: 抓取input值
function getInputValue() {
  let inputVal = inputContent.value;
  if (inputVal.length) {
    // 篩選符合條件的物件放入陣列->filterArray
    //string.includes()方法
    // 把要比對的字串全部變小寫 toLowerCase()
    //函式:回傳特定筆數的資料(陣列結構)

    // 每次的搜尋，都會重新產生一個新的filterArray，但dataArray的內容不變
    filterArray = dataArray.filter((item) => {
      return (item.surname + " " + item.name)
        .toLowerCase()
        .includes(inputVal.trim().toLowerCase());
    });

    // 判斷篩選過陣列是否含有資料:有->渲染;沒有->提醒使用者
    if (filterArray.length) {
      const total_filter_pages = Math.ceil(filterArray.length / users_per_page);
      renderUserList(getUserByPage(1));
      myPaginator(total_filter_pages);
    } else {
      friendList.innerText =
        "Sorry,we don't find any people matching this search.";
      myPaginator(0);
    }
    // 清空輸入的內容
    inputContent.value = "";
  } else {
    alert("the searching info can not be empty!");
  }
}

// 加入最愛
// 0.設一個全域變數空陣列:myFriendList，拿來存放被新增的摯友資料
// 1.點擊加號按鈕，帶上點擊的個人資料id 進入函式
// 2.從朋友清單的陣列裡逐一搜尋把特定資料找出來
// 3.錯誤處理：已經在摯友清單的朋友，不應被重複加
function addToFavorite(favId) {
  const favUser = dataArray.find((item) => {
    return item.id === favId;
  });
  console.log(typeof favUser);

  if (myFriendList.some((item) => item.id === favId)) {
    return alert("nonono you've choosed");
  }
  myFriendList.push(favUser);
  localStorage.setItem("favoriteUsers", JSON.stringify(myFriendList));
  favCount.innerHTML = myFriendList.length; // 重新渲染收藏好友的個數
}

// 切換瀏覽模式
// function showRenderMode() {
//     const userCard = document.querySelectorAll("#userCard");
//     const cardBtn = document.querySelector('[data-modal="card"]');
//     const listBtn = document.querySelector('[data-modal="list"]');
//     if (mode === "card") {
//         cardBtn.classList.add("colorBrown");
//         listBtn.classList.remove("colorBrown");
//         friendList.className = "friends";
//         userCard.forEach((item) => {
//             item.className = "friend";
//         });
//     } else if (mode === "list") {
//         listBtn.classList.add("colorBrown");
//         cardBtn.classList.remove("colorBrown");
//         friendList.className = "friendContainerByList";
//         userCard.forEach((item) => {
//             item.className = "friendCardByList";
//         });
//     }
// }

/* Event Listeners
 *****************************************/

// 分頁器掛監聽器-點擊
// getUserByPage:根據被點擊的頁數，取出特定電影資料
// renderUserList:將資料渲染在畫面上
paginator.addEventListener("click", (e) => {
  if (e.target.matches(".page-link")) {
    const selectedPage = e.target.dataset.page;
    renderUserList(getUserByPage(selectedPage));
  }
});

// 卡片掛監聽器-點擊
//1.點擊More按鈕獲取個人資料
//2.點擊愛心按鈕將user加入最愛清單
friendList.addEventListener("click", (e) => {
  if (e.target.matches(".show-userCard")) {
    const userName = document.querySelector("#show-modal-name");
    const userAge = document.querySelector("#show-modal-age");
    const userBirth = document.querySelector("#show-modal-birth");
    const userEmail = document.querySelector("#show-modal-email");
    const userImage = document.querySelector("#show-modal-pic");
    const selectedId = parseInt(e.target.dataset.id);
    const PersonInfo = dataArray.find((item) => item.id === selectedId);
    userName.innerText = PersonInfo.name + " " + PersonInfo.surname;
    userAge.innerText = PersonInfo.age + " years old";
    userBirth.innerText = PersonInfo.birthday;
    userImage.innerHTML = `
                  <img src="${PersonInfo.avatar}" alt="圖片">
                  `;
    userEmail.innerText = PersonInfo.email;
  } else if (e.target.matches(".btn-add-favorite")) {
    const favId = parseInt(e.target.dataset.id);
    addToFavorite(favId);
  }
});

// 搜尋按鈕掛監聽器-點擊
getValBtn.addEventListener("click", () => {
  getInputValue();
});

// 搜尋盒子掛監聽器-Enter
inputContent.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getInputValue();
  }
});

// 對顯示模式區塊掛監聽器-點擊
// viewButton.addEventListener("click", (e) => {
//     if (e.target.matches(".fa-th")) {
//         mode = "card";
//     } else if (e.target.matches(".fa-bars")) {
//         mode = "list";
//     }
//     showRenderMode();
// });

// 從API抓取資料
axios
  .get(base_url + friends_url)
  .then((response) => {
    dataArray.push(...response.data.results); //ES新語法 展開運算子
    const total_pages = Math.ceil(dataArray.length / users_per_page); //資料總筆數/每頁呈現筆數
    renderUserList(getUserByPage(1)); //渲染資料(首頁)
    myPaginator(total_pages); //分頁器
    favCount.innerText = myFriendList.length; // 畫面進入會先計算現在local storage有幾個Fav資料
  })
  .catch((err) => console.log(err));
