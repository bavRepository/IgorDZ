'use strict';

import '../index.html';
import '../styles/style.scss';

class LocalStorageManager {
	#localStorageKey = 'notice';

	create(noticeDataObj) {
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';

		const noDuplicateObjects = JSON.parse(noticeFromLocal).filter(item => {
			if (item.elemId !== noticeDataObj.elemId) {
				item.zIndex = 'auto';
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
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';
		return JSON.parse(noticeFromLocal);
	}
	update(noticeDataObj) {}

	delete(noticeDataObj) {
		localStorage.removeItem(this.#localStorageKey);

		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(noticeDataObj)
		);
	}
}

class NoticeManager {
	#text;
	#customClassName;

	constructor(text = '', customClassName = '') {
		this.#text = text;
		this.customClassName = customClassName;
	}

	createAndGetHtmlElem(text = this.#text, eventFn,timeCreating = Date.now(), customClassName = this.#customClassName) {
		const htmlNotice = document.createElement('textarea');
		htmlNotice.value = text;
		htmlNotice.style.border = '3px solid black';
		htmlNotice.className = `notice ${customClassName}`;
		htmlNotice.setAttribute('data-id', timeCreating);
		
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
	#storageService;
	#noticeService;
	#arrayWrapAndNoteInformation;
	constructor(serviceObj) {
		this.#storageService = serviceObj.storageService;
		this.#noticeService = serviceObj.noticeService;
	}

	get storageService(){
		return this.#storageService;
	}

	get noticeService(){
		return this.#noticeService;
	}

	get arrayWrapAndNoteInformation() {
		return this.#arrayWrapAndNoteInformation;
	}

	set arrayWrapAndNoteInformation(WrapNoticeArray) {
		this.#arrayWrapAndNoteInformation = WrapNoticeArray;
	}

	getElemInfo(splittedObjects) {
		return {
			left: splittedObjects.dragAbleUnderNoticeElem.style.left,
			top: splittedObjects.dragAbleUnderNoticeElem.style.top,
			zIndex: splittedObjects.dragAbleUnderNoticeElem.style.zIndex,
			value: splittedObjects.noticeElem.value,
			elemId: splittedObjects.noticeElem.getAttribute('data-id'),
		};
	}

	addNotice(elem) {
		this.#arrayWrapAndNoteInformation.push(elem);
	}
	resetNoticesStyle() {
		document.querySelectorAll('.wrapperNotice').forEach(elem => {
			elem.style.zIndex = 'auto';
			elem.querySelector('.notice').style.borderWidth = '1px';
		});
	}
	removeNotice(elemId) {
		return this.#arrayWrapAndNoteInformation.filter(elem => {
			return elem.elemId !== elemId;
		});
	}

	init() {
		this.#arrayWrapAndNoteInformation = this.#storageService.read();
		if (this.#arrayWrapAndNoteInformation.length > 0) {
			this.#arrayWrapAndNoteInformation.forEach(localStorageObj => {
				const noticeElem = this.#noticeService.createAndGetHtmlElem(localStorageObj.value, localStorageObj.elemId);

				desktop.createDragAbleElemWithNotice(
					noticeElem,
					localStorageObj.left,
					localStorageObj.top,
					localStorage.zIndex
				);
			});
		}
		const elem = document.querySelector('.addNotice');
		elem.addEventListener('click', function () {
			const noticeElem = new NoticeManager().createAndGetHtmlElem();
			desktop.createDragAbleElemWithNotice(noticeElem);
		});
	}
	createDragAbleElemWithNotice(
		noticeElem,
		wrapperLeft = '40%',
		wrapperTop = '40%',
		wrapperZIndex = 'auto'
	) {
		function getDelButton() {
			const delButton = document.createElement('button');
			delButton.classList.add('delBtn');
			delButton.textContent = 'Удалить';
			return delButton;
		}

		const dragAbleUnderNoticeElem = document.createElement('div'),
			delButton = getDelButton();

		dragAbleUnderNoticeElem.classList.add('wrapperNotice');
		dragAbleUnderNoticeElem.style.position = 'absolute';
		dragAbleUnderNoticeElem.style.left = wrapperLeft;
		dragAbleUnderNoticeElem.style.top = wrapperTop;
		dragAbleUnderNoticeElem.append(noticeElem);
		dragAbleUnderNoticeElem.append(delButton);
		const splittedObjects = {'dragAbleUnderNoticeElem' : dragAbleUnderNoticeElem, 'noticeElem': noticeElem};
		this.#arrayWrapAndNoteInformation.push(desktop.getElemInfo(splittedObjects));
		dragAbleUnderNoticeElem.style.zIndex = wrapperZIndex;
		desktop.resetNoticesStyle();
		document.body.append(dragAbleUnderNoticeElem);

		this.#storageService.create(desktop.getElemInfo(splittedObjects));

		noticeElem.focus();

		dragAbleUnderNoticeElem.addEventListener('click', function (e) {
			const target = e.target;
			if (target.classList == 'delBtn') {
				document.querySelectorAll('.wrapperNotice').forEach(el => el.remove());
				const listWithoutRemoveElement = desktop.removeNotice(noticeElem.getAttribute('data-id'));
				new LocalStorageManager().delete(listWithoutRemoveElement);
				
			}
		});

		this.#noticeService.addListener(noticeElem, () => inputNoticeEvent(splittedObjects));

		function inputNoticeEvent(splittedObjects){
			desktop.storageService.create(desktop.getElemInfo(splittedObjects));
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
				localServiceManager.create(desktop.getElemInfo(splittedObjects));
			});
		});
	}
}
const localServiceManager = new LocalStorageManager();
const desktop = new Desktop({'storageService' : new LocalStorageManager(), 'noticeService' : new NoticeManager()});
desktop.init();
