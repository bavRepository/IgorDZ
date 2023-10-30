'use strict';

import '../index.html';
import '../styles/style.scss';

class LocalStorageManager {
	#localStorageKey = 'notice';

	create(noticeDataObj) {
		// const noticeFromLocal =
		// 	localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';

		// const noDuplicateObjects = JSON.parse(noticeFromLocal).filter(item => {
		// 	if (item.elemId !== noticeDataObj.elemId) {
		// 		item.zIndex = 'auto';
		// 		return item;
		// 	}
		// });

		// noDuplicateObjects.push(noticeDataObj);

		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(noticeDataObj)
		);
	}
	read() {
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';
		return JSON.parse(noticeFromLocal);
	}
	update(noticeDataObj) {}

	delete(noticeDataObj) {
		localStorage.removeItem(this.#localStorageKey);
		const newDataToLocal = noticeDataObj ?? '[]';
		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(newDataToLocal)
		);
	}
}

class NoticeManager {
	#text;

	constructor(text = '') {
		this.#text = text;
	}

	createAndGetHtmlElem(text = this.#text, timeCreating = Date.now(), ...classes) {
		const htmlNotice = document.createElement('textarea');
		htmlNotice.value = text;
		htmlNotice.style.border = '3px solid black';
		htmlNotice.setAttribute('data-id', timeCreating);
		if (classes.length === 0) {
			htmlNotice.classList.add('notice');
	} else {
			classes.forEach(item => {
				htmlNotice.classList.add(item);
			});
	}
		return htmlNotice;
	}

	addListener(elem, inputEvent){
		elem.addEventListener('input', inputEvent);
	}

	set text(value) {
		this.#text = value;
	}
}

class Desktop {
	#currentNoticeAndDragAbleElemData;
	#storageService;
	#noticeService;
	#arrayWrapAndNoteInformation = [];
	constructor(serviceObj) {
		this.#storageService = serviceObj.storageService;
		this.#noticeService = serviceObj.noticeService;
	}

	// get currentNoticeAndDragAbleElemData(){
	// 	return this.#currentNoticeAndDragAbleElemData;
	// }
	
	get storageService(){
		return this.#storageService;
	}

	get noticeService(){
		return this.#noticeService;
	}

	// get arrayWrapAndNoteInformation() {
	// 	return this.#arrayWrapAndNoteInformation;
	// }

	pushNewNoticeDate(newObjData) {
		this.#arrayWrapAndNoteInformation = this.#arrayWrapAndNoteInformation.filter((el) => {
			if (newObjData.elemId !== el.elemId) {
				el.zIndex = 'auto'
				return el;
			}
		});
		this.#arrayWrapAndNoteInformation.push(newObjData);
	}

	getElemInfo(splittedObjects) {
		return {
			left: splittedObjects.dragAbleUnderNoticeElem.style.left,
			top: splittedObjects.dragAbleUnderNoticeElem.style.top,
			zIndex: splittedObjects.dragAbleUnderNoticeElem.style.zIndex,
			value: splittedObjects.noticeElem.value,
			elemId: splittedObjects.noticeElem.getAttribute('data-id'),
			border: splittedObjects.noticeElem.style.border,
		};
	}


	resetNoticesStyle() {
		this.#arrayWrapAndNoteInformation.forEach((el) => {
			el.zIndex = 'auto';
			el.border = '1px';
		});
	}
	removeNotice(elemId) {
		this.#arrayWrapAndNoteInformation = this.#arrayWrapAndNoteInformation.filter(elem => {
			return elem.elemId != elemId;
		});
		this.#arrayWrapAndNoteInformation;
	}



	init() {
		this.#arrayWrapAndNoteInformation = this.#storageService.read();
		if (this.#arrayWrapAndNoteInformation.length > 0) {
			this.#arrayWrapAndNoteInformation.forEach(localStorageObj => {
				const noticeElem = this.#noticeService.createAndGetHtmlElem(localStorageObj.value, localStorageObj.elemId);

				this.createDragAbleElemWithNotice(
					noticeElem,
					localStorageObj.left,
					localStorageObj.top,
					localStorage.zIndex
				);
			});
		}
		const elem = document.querySelector('.addNotice');

		elem.addEventListener('click', () => {
			this.createDragAbleElemWithNotice(this.#noticeService.createAndGetHtmlElem());
		});
	}

   getDelButton() {
		const delButton = document.createElement('button');
		delButton.classList.add('delBtn');
		delButton.textContent = 'Удалить';
		return delButton;
	}

	createDragAbleElemWithNotice(
		noticeElem,
		wrapperLeft = '40%',
		wrapperTop = '40%',
		wrapperZIndex = 'auto'
	) {

	 this.#currentNoticeAndDragAbleElemData = {
			left: wrapperLeft,
			top: wrapperTop,
			zIndex: wrapperZIndex,
			value: noticeElem.value,
			elemId: noticeElem.getAttribute('data-id'),
			border: noticeElem.style.border,
		};
	

		if (this.#arrayWrapAndNoteInformation.length > 0){
		this.#arrayWrapAndNoteInformation.forEach(item => {
			document.querySelector(`div[data-id=${item.elemId}]`).remove();
		});
	}

	this.pushNewNoticeDate(this.#currentNoticeAndDragAbleElemData);
	let dragAbleUnderNoticeElem,
      delButton;
		this.#arrayWrapAndNoteInformation.forEach(item => {
			dragAbleUnderNoticeElem = document.createElement('div'),
			delButton = desktop.getDelButton();
    
		dragAbleUnderNoticeElem.classList.add('wrapperNotice');
		dragAbleUnderNoticeElem.style.position = 'absolute';
		dragAbleUnderNoticeElem.style.left = item.left;
		dragAbleUnderNoticeElem.style.top = item.top;
		dragAbleUnderNoticeElem.style.zIndex = item.zIndex;
		dragAbleUnderNoticeElem.setAttribute('data-id', item.elemId);
		dragAbleUnderNoticeElem.append(noticeElem);
		dragAbleUnderNoticeElem.append(delButton);
	
		
		// desktop.pushNewNoticeDate(desktop.getElemInfo(splittedObjects));
	
		// desktop.resetNoticesStyle();
		document.body.append(dragAbleUnderNoticeElem);
	

		noticeElem.focus();
		});

		this.#storageService.create(this.#arrayWrapAndNoteInformation);

		// console.log(this.#currentNoticeAndDragAbleElemData.left + " smptrim v koren");
	

		// const dragAbleUnderNoticeElem = document.createElement('div'),
		// 	delButton = desktop.getDelButton();
    
		// dragAbleUnderNoticeElem.classList.add('wrapperNotice');
		// dragAbleUnderNoticeElem.style.position = 'absolute';
		// dragAbleUnderNoticeElem.style.left = this.#arrayWrapAndNoteInformation.left;
		// dragAbleUnderNoticeElem.style.top = this.#arrayWrapAndNoteInformation.top;
		// dragAbleUnderNoticeElem.style.zIndex = this.#arrayWrapAndNoteInformation.zIndex;
		// dragAbleUnderNoticeElem.append(noticeElem);
		// dragAbleUnderNoticeElem.append(delButton);
	
		
		// desktop.pushNewNoticeDate(desktop.getElemInfo(splittedObjects));
	
		// desktop.resetNoticesStyle();
		// document.body.append(dragAbleUnderNoticeElem);
		// this.#storageService.create(this.#arrayWrapAndNoteInformation);

		// noticeElem.focus();

		dragAbleUnderNoticeElem.addEventListener('click', function (e) {
			const target = e.target;
			if (target.classList == 'delBtn') {
				document.querySelectorAll('.wrapperNotice').forEach(el => el.remove());
				const listWithoutRemoveElement = desktop.removeNotice(noticeElem.getAttribute('data-id'));
				desktop.#storageService.delete(listWithoutRemoveElement);
				desktop.init();
			}
		});

		this.#noticeService.addListener(noticeElem, () => inputNoticeEvent(this.#arrayWrapAndNoteInformation));

		function inputNoticeEvent(noticeArray){
			desktop.storageService.create(noticeArray);
		}

		dragAbleUnderNoticeElem.addEventListener('mousedown', function (e) {
			desktop.resetNoticesStyle();
			dragAbleUnderNoticeElem.style.zIndex = 10;
			dragAbleUnderNoticeElem.querySelector('.notice').style.borderWidth = '3px';

			const shiftX = e.clientX - dragAbleUnderNoticeElem.getBoundingClientRect().left;
			const shiftY = e.clientY - dragAbleUnderNoticeElem.getBoundingClientRect().top;
			document.addEventListener('mousemove', mMove);
			function mMove(e) {
				dragAbleUnderNoticeElem.style.transform = 'none';
				dragAbleUnderNoticeElem.style.left = e.pageX - shiftX + 'px';
				dragAbleUnderNoticeElem.style.top = e.pageY - shiftY + 'px';
			}
			dragAbleUnderNoticeElem.addEventListener('mouseup', function () {
				document.removeEventListener('mousemove', mMove);
				localServiceManager.create(desktop.#arrayWrapAndNoteInformation);
			});
		});
	}
}
const localServiceManager = new LocalStorageManager();
const desktop = new Desktop({'storageService' : new LocalStorageManager(), 'noticeService' : new NoticeManager()});
desktop.init();
