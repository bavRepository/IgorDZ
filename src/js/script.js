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

    const localAnswer = JSON.parse(noticeFromLocal);
    const withoutDeleted = localAnswer.filter((item) => {
      console.log(typeof noticeDataObj.timeCreating);
      console.log(typeof item.elemId);
      return toString(noticeDataObj.timeCreating) !== toString(item.elemId);
    });

    withoutDeleted.forEach(item => {
      console.log(item); 
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
  #startZIndex = "10";
  #currentNoticeAndDragAbleElemData;
  #storageService;
  #arrayWrapAndNoteInformation = [];
  #notice;
  constructor(serviceObj) {
    this.#storageService = serviceObj;
    const elem = document.querySelector(".addNotice");
    elem.addEventListener("click", () => {
      this.createNewNotice();
    });
  }

  get storageService() {
    return this.#storageService;
  }

   getDragAble(
     elemInd
  ) {

    const wrapperLeft = this.#arrayWrapAndNoteInformation[elemInd].left ?? this.#startPositionLeft,
    wrapperTop = this.#arrayWrapAndNoteInformation[elemInd].top ?? this.#startPositionTop,
    wrapperZIndex = this.#arrayWrapAndNoteInformation[elemInd].zIndex ?? this.#startZIndex,
    timeCreating = this.#arrayWrapAndNoteInformation[elemInd].elemId ?? 0;

    // wrapperLeft = this.#startPositionLeft,
    // wrapperTop = this.#startPositionTop,
    // wrapperZIndex = this.#startZIndex,
    // timeCreating = 0

    const dragAbleElem = document.createElement("div");
    dragAbleElem.setAttribute('data-time', `${timeCreating}`);
    dragAbleElem.classList.add("wrapperNotice");
    dragAbleElem.style.position = "absolute";
    dragAbleElem.style.left = wrapperLeft;
    dragAbleElem.style.top = wrapperTop;
    dragAbleElem.style.zIndex = wrapperZIndex;


      dragAbleElem.addEventListener('mousedown', (e) => {
    	// this.resetNoticesStyle(this.#currentNoticeAndDragAbleElemData);

    	const shiftX = e.clientX - dragAbleElem.getBoundingClientRect().left;
    	const shiftY = e.clientY - dragAbleElem.getBoundingClientRect().top;

    	function mMove(e) {
      
    	desktop.#arrayWrapAndNoteInformation[desktop.#arrayWrapAndNoteInformation.length - 1].left = e.pageX - shiftX + 'px';
    	desktop.#arrayWrapAndNoteInformation[desktop.#arrayWrapAndNoteInformation.length - 1].top = e.pageY - shiftY + 'px';

    				dragAbleElem.style.left = desktop.#arrayWrapAndNoteInformation[desktop.#arrayWrapAndNoteInformation.length - 1].left;
    				dragAbleElem.style.top = desktop.#arrayWrapAndNoteInformation[desktop.#arrayWrapAndNoteInformation.length - 1].top;

    	}
    	document.addEventListener('mousemove', mMove);
    	dragAbleElem.addEventListener('mouseup', function () {

    		document.removeEventListener('mousemove', mMove);
    		// console.log(desktop.#storageService + " desktopLcalService");
    		// console.log(desktop.#arrayWrapAndNoteInformation + " desktopNashArray");
    		desktop.#storageService.create(desktop.#arrayWrapAndNoteInformation);
    	});
    });



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
          i
          // this.#arrayWrapAndNoteInformation[i].left,
          // this.#arrayWrapAndNoteInformation[i].top,
          // this.#arrayWrapAndNoteInformation[i].zIndex,
          // this.#arrayWrapAndNoteInformation[i].elemId
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
        // item.onMove
      });
    }
  }

  updateNotice() {

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
