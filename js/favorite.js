const friendList = document.querySelector("#friendList");
const paginator = document.querySelector("#paginator");
const inputContent = document.querySelector("#inputContent");
const favCount = document.querySelector("#favCount");
const getValBtn = document.querySelector("#getValBtn");
const users_per_page = 12;
// fav list array
const favUserArray = JSON.parse(localStorage.getItem("favoriteUsers"));
const total_pages = Math.ceil(favUserArray.length / users_per_page);

// 渲染畫面
renderUserList(favUserArray);
// 畫面進入會先計算現在local storage有幾個Fav資料
favCount.innerHTML = favUserArray.length;

//函式:回傳特定筆數的資料(陣列結構)-->用於放入
function getUserByPage(page) {
    const startIndex = (page - 1) * users_per_page;
    return favUserArray.slice(startIndex, startIndex + users_per_page);
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
        <button class="f-btn f-btn--grey friend__add btn-add-favorite" data-id="${id}">
          -
        </button>
      </div>
              `;
    });
    friendList.innerHTML = dataCard;
}

// 刪除最愛
function deleteFromFav(favId) {
    if (!favUserArray) return;
    const selectedUser = favUserArray.find((item) => {
        return item.id == favId;
    });
    // console.log(selectedUser);

    // 找出要刪除的物件在陣列的第幾個索引
    let userIndex = favUserArray.indexOf(selectedUser);
    if (userIndex == -1) return;
    // console.log(userIndex);
    favUserArray.splice(userIndex, 1);
    //存回 local storage
    localStorage.setItem("favoriteUsers", JSON.stringify(favUserArray));
    favCount.innerHTML = favUserArray.length;
    // 重新渲染頁面
    renderUserList(favUserArray);
}

// 監聽卡片點擊事件 1.點擊More按鈕獲取個人資料   2.點擊愛心按鈕將user從最愛清單中移除
friendList.addEventListener("click", (e) => {
    //
    if (e.target.matches(".show-userCard")) {
        const userName = document.querySelector("#show-modal-name");
        const userAge = document.querySelector("#show-modal-age");
        const userBirth = document.querySelector("#show-modal-birth");
        const userEmail = document.querySelector("#show-modal-email");
        const userImage = document.querySelector("#show-modal-pic");
        // 取得每個button上的可辨識id編號
        const selectedId = e.target.dataset.id;
        let selectedPersonInfo = favUserArray.find(
            (item) => item.id == selectedId
        );

        userName.innerText =
            selectedPersonInfo.name + " " + selectedPersonInfo.surname;
        userAge.innerText = selectedPersonInfo.age + " years old";
        userBirth.innerText = selectedPersonInfo.birthday;
        userImage.innerHTML = `
          <img src="${selectedPersonInfo.avatar}" alt="圖片">
          `;
        userEmail.innerText = selectedPersonInfo.email;
    } else if (e.target.matches(".btn-add-favorite")) {
        let favId = e.target.dataset.id;
        console.log(favId);
        deleteFromFav(favId);
    }
});
