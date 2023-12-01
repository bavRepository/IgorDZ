"use strict";

import "../index.html";
import "../styles/style.scss";

class LocalStorageManager {
  #localStorageKey = "notice";

  create(noticeDataObj) {
    const noticeFromLocal =
      localStorage.getItem(`${this.#localStorageKey}`) ?? "[]";

    const noDuplicateObjects = JSON.parse(noticeFromLocal).filter((item) => {
      if (item.elemId !== noticeDataObj.elemId) {
        item.zIndex = "auto";
        return item;
      }
    });

    noDuplicateObjects.push(noticeDataObj);

    localStorage.setItem(
      `${this.#localStorageKey}`,
      JSON.stringify(noDuplicateObjects)
    );
  }
  read() {
    const noticeFromLocal =
      localStorage.getItem(`${this.#localStorageKey}`) ?? "[]";
      return JSON.parse(noticeFromLocal);
  }
  update(noticeDataObj) {
    const noticeFromLocal =
      localStorage.getItem(`${this.#localStorageKey}`) ?? "[]";

    const noDuplicateObjects = JSON.parse(noticeFromLocal);
    noDuplicateObjects.forEach(localNoticeObj => {
      if (localNoticeObj.elemId == noticeDataObj.timeCreating){
        localNoticeObj.value = noticeDataObj.value;
      }
    });

    localStorage.setItem(
      `${this.#localStorageKey}`,
      JSON.stringify(noDuplicateObjects)
    );
  }

  delete(noticeDataObj) {
    const noticeFromLocal =
      localStorage.getItem(`${this.#localStorageKey}`) ?? "[]";

    const withoutDeleted = JSON.parse(noticeFromLocal).filter((item) => {
      return noticeDataObj.timeCreating !== item.elemId;
    });

    localStorage.setItem(
      `${this.#localStorageKey}`,
      JSON.stringify(withoutDeleted)
    );
  }
}

class Notice {
  #value;
  #timeCreating;
  #classes;
  #onDelete;
  #onInput;
  constructor(value = "", timeCreating = Date.now(), ...classes) {
    this.#value = value;
    this.#timeCreating = timeCreating;
    this.#classes = classes;
  }

  getHtmlNotice(){
    const noticeElem = document.createElement("textarea");
    noticeElem.value = this.#value;
    noticeElem.style.cssText = `
		width: 400px;
		height: 120px;
		border: 3px solid black;
		overflow-y: auto;
		`;
    noticeElem.setAttribute("data-id", this.#timeCreating);
    if (this.#classes.length === 0) {
      noticeElem.classList.add("notice");
    } else {
      this.#classes.forEach((item) => {
        noticeElem.classList.add(item);
      });
    }
    noticeElem.addEventListener('input', () => {
      this.#value = noticeElem.value;
      this.#onInput();
    });
    return noticeElem;
  }

  set onDelete(fnOnDelete) {
    this.#onDelete = fnOnDelete;
  }

  get onDelete() {
    return this.#onDelete;
  }

  set onInput(fnOnInput) {
    this.#onInput = fnOnInput;
  }

  get onInput() {
   return this.#onInput();
  }

  getDelButton() {
    const delButton = document.createElement("button");
    delButton.classList.add("delBtn");
    delButton.textContent = "Удалить";
    delButton.addEventListener("click", () => {
      this.#onDelete();
    });
    return delButton;
  }

  set value(value) {
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  set timeCreating(value) {
    this.#timeCreating = value;
  }

  get timeCreating() {
    return this.#timeCreating;
  }
}

class Desktop {
  #startPositionLeft = "40%";
  #startPositionTop = "40%";
  #startZIndex = "auto";
  #currentNoticeAndDragAbleElemData;
  #storageService;
  #arrayWrapAndNoteInformation = [];
  #notice;
  constructor(serviceObj) {
    this.#storageService = serviceObj;
    const elem = document.querySelector(".addNotice");
    elem.addEventListener("click", () => {
      desktop.createNewNotice();
    });
  }

  get storageService() {
    return this.#storageService;
  }

   getDragAble(
    wrapperLeft = this.#startPositionLeft,
    wrapperTop = this.#startPositionTop,
    wrapperZIndex = this.#startZIndex
  ) {
    const dragAbleElem = document.createElement("div");
    dragAbleElem.classList.add("wrapperNotice");
    dragAbleElem.style.position = "absolute";
    dragAbleElem.style.left = wrapperLeft;
    dragAbleElem.style.top = wrapperTop;
    dragAbleElem.style.zIndex = wrapperZIndex;
    return dragAbleElem;
  }

  deleteNotices() {
    document.querySelectorAll(".wrapperNotice").forEach((item) => {
      item.remove();
    });
  }

  init() {
    this.deleteNotices();
    this.#arrayWrapAndNoteInformation = this.#storageService.read();

    if (this.#arrayWrapAndNoteInformation.length > 0) {
      this.#notice = this.#arrayWrapAndNoteInformation.map(
        (objDataFromLocal) => {
          return new Notice(objDataFromLocal.value, objDataFromLocal.elemId);
        }
      );

      this.#notice.forEach((n, i) => {
        const wrapperElem = this.getDragAble(
          this.#arrayWrapAndNoteInformation[i].left,
          this.#arrayWrapAndNoteInformation[i].top,
          this.#arrayWrapAndNoteInformation[i].zIndex
        );
        const htmlNoticeElem = n.getHtmlNotice();
        wrapperElem.append(htmlNoticeElem);
        wrapperElem.append(n.getDelButton());
        document.body.append(wrapperElem);
        htmlNoticeElem.focus();
      });
      this.#notice.forEach((item) => {
        item.onDelete = () => {
          this.storageService.delete(item);
          this.init();
        };
        item.onInput = () => {
          this.storageService.update(item);
        };
      });
    }
  }

  createNewNotice() {
    const notice = new Notice();
    const dataForLocalObj = {
      left: this.#startPositionLeft,
      top: this.#startPositionTop,
      zIndex: this.#startZIndex,
      value: notice.value,
      elemId: notice.timeCreating,
    };

    this.#storageService.create(dataForLocalObj);
    this.init();
  }
}
const desktop = new Desktop(new LocalStorageManager());

desktop.init();
