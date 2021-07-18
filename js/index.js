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

// Data and Variables
// 如果favoriteUsers裡面是空的，則值會回傳null，null==false
const myFriendList = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
const dataArray = [];
let filterArray = [];


/* functions
 *****************************************/

//函式:回傳特定筆數的資料(陣列結構)
function getUserByPage(page) {
  const data = filterArray.length ? filterArray : dataArray;
  const startIndex = (page - 1) * users_per_page;
  return data.slice(startIndex, startIndex + users_per_page);
}

// 函式:製作friend card template 
function renderUserList(array) {
  let dataCard = "";
  array.forEach((data) => {
    const { id , name , surname , avatar } = data;
  
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
     <button class="f-btn f-btn--grey friend__add add-to-favorite " data-id="${id}">
       +
     </button>
   </div>
     `;
  });
  friendList.innerHTML = dataCard;

}


// 函式:分頁器渲染
function myPaginator(totalPages) {
  let page = "";
  for (let i = 1; i <= totalPages; i++) {
    page += `
              <li class="page-nav__item">
                <a class="page-nav__link" href="#" data-page="${i}">${i}</a>
              </li>
            `;
  }
  paginator.innerHTML = page;
}


// 函式: 抓取input值
function getInputValue() {
  let inputVal = inputContent.value;
  if (!inputContent.value.trim().length) {
    searchArray = [];
    renderUserList(getUserByPage(1));
  }
  
    // 篩選符合條件的物件放入陣列->filterArray
    //string.includes()方法
    // 把要比對的字串全部變小寫 toLowerCase()
    //函式:回傳特定筆數的資料(陣列結構)

    // 每次的搜尋，都會重新產生一個新的filterArray，但dataArray的內容不變
    filterArray = dataArray.filter((user) => {
      return (user.surname + " " + user.name)
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
  // console.log(typeof favUser);

  if (myFriendList.some((item) => item.id === favId)) {
    return alert("nonono you've choosed");
  }
  myFriendList.push(favUser);
  localStorage.setItem("favoriteUsers", JSON.stringify(myFriendList));
  favCount.innerHTML = myFriendList.length; // 重新渲染收藏好友的個數
}

/* Event Listeners
 *****************************************/

// 分頁器-點擊監聽-
// getUserByPage:根據被點擊的頁數，取出特定電影資料
// renderUserList:將資料渲染在畫面上
paginator.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.matches(".page-nav__link")) {
    const selectedPage = e.target.dataset.page;
    renderUserList(getUserByPage(selectedPage));
  }
});

// 卡片掛監聽器-點擊
//1.點擊More按鈕獲取個人資料
//2.點擊+按鈕將user加入最愛清單
friendList.addEventListener("click", (e) => {
  // console.log(e.target);
  if (e.target.matches(".show-userCard")) {
    const selectedId = parseInt(e.target.dataset.id);
    const userName = document.querySelector("#show-modal-name");
    const userAge = document.querySelector("#show-modal-age");
    const userBirth = document.querySelector("#show-modal-birth");
    const userEmail = document.querySelector("#show-modal-email");
    const userImage = document.querySelector("#show-modal-pic");
   
    const userInfo = dataArray.find((item) => item.id === selectedId); //特定資料物件
    userName.innerText = "Name: " + userInfo.name + " " + userInfo.surname;
    userAge.innerText =  "Birth: " + userInfo.age + " years old";
    userBirth.innerText = "Age: " + userInfo.birthday;
    userImage.innerHTML = `
                  <img class='user-info__img' src="${userInfo.avatar}" alt="圖片">
                  `;
    userEmail.innerText = userInfo.email;
  } else if (e.target.matches(".add-to-favorite")) {
    const favId = parseInt(e.target.dataset.id);
    addToFavorite(favId);
  }
});

// 搜尋按鈕-點擊監聽-
getValBtn.addEventListener("click", () => {
  getInputValue();
});

// 搜尋盒子-鍵盤Enter監聽-
inputContent.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getInputValue();
  }
});

// 從API抓取資料
axios
  .get(base_url + friends_url)
  .then((response) => {
    console.log(response.data.results) // target array
    dataArray.push(...response.data.results); //ES新語法 展開運算子 （把陣列的[]拿掉的意思）
    const total_pages = Math.ceil(dataArray.length / users_per_page); //資料總筆數/每頁呈現筆數
    renderUserList(getUserByPage(1)); //渲染資料(首頁)
    myPaginator(total_pages); //分頁器
    favCount.innerText = myFriendList.length; // 畫面進入會先計算現在local storage有幾個Fav資料
  })
  .catch((err) => console.log(err));
