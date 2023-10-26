'use strict';

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
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';
		const arrayNoticeWithoutDeleted = JSON.parse(noticeFromLocal).filter(
			item => {
				return item.elemId !== noticeDataObj.elemId;
			}
		);

		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(arrayNoticeWithoutDeleted)
		);
	}
}

class Notice {
	#text;
	#timeCreating;
	#customClassName;

	constructor(text = '', timeCreating = Date.now(), customClassName = '') {
		this.#text = text;
		this.#timeCreating = timeCreating;
		this.customClassName = customClassName;
	}

	getHtmlElem() {
		const htmlNotice = document.createElement('textarea');
		htmlNotice.value = this.#text;
		htmlNotice.style.border = '3px solid black';
		htmlNotice.className = `notice ${this.customClassName ?? ''}`;
		htmlNotice.setAttribute('data-id', this.#timeCreating);
		return htmlNotice;
	}
	set text(value) {
		this.#text = value;
	}

	getInfo() {
		return {
			className: this.#customClassName,
			timeCreating: this.#timeCreating,
			text: this.#text,
		};
	}
}

class Desktop {
	#arrayWrapAndNoteInformation;
	constructor(arrayWrapAndNoteInformation) {
		this.#arrayWrapAndNoteInformation = arrayWrapAndNoteInformation;
	}

	get arrayWrapAndNoteInformation() {
		return this.#arrayWrapAndNoteInformation;
	}

	set arrayWrapAndNoteInformation(WrapNoticeArray) {
		this.#arrayWrapAndNoteInformation = WrapNoticeArray;
	}

	addNotice(elem) {
		this.#arrayWrapAndNoteInformation.push(elem);
	}
	resetNoticesStyle() {
		document.querySelectorAll('.noticeWrapper').forEach(elem => {
			elem.style.zIndex = 'auto';
			elem.querySelector('.notice').style.borderWidth = '1px';
		});
	}
	removeNotice(elemId) {
		this.#arrayWrapAndNoteInformation =
			this.#arrayWrapAndNoteInformation.filter(elem => {
				return elem.getAttribute('data-id') !== elemId;
			});
	}
	init() {
		if (this.#arrayWrapAndNoteInformation.length > 0) {
			this.#arrayWrapAndNoteInformation.forEach(localStorageObj => {
				const notice = new Notice(
					localStorageObj.value,
					localStorageObj.elemId
				);
				desktop.createNotice(
					notice.getHtmlElem(),
					localStorageObj.left,
					localStorageObj.top,
					localStorage.zIndex
				);
			});
		}
		const elem = document.querySelector('.addNotice');
		elem.addEventListener('click', function () {
			const notice = new Notice();
			desktop.createNotice(notice.getHtmlElem());
		});
		function noticeObjCreating(elem) {
			return {
				left: elem.style.left,
				top: elem.style.top,
				zIndex: elem.style.zIndex,
				value: elem.querySelector('.notice').value,
				elemId: elem.querySelector('.notice').getAttribute('data-id'),
			};
		}
	}
	createNotice(
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

		const noticeWrapper = document.createElement('div'),
			delButton = getDelButton();

		noticeWrapper.classList.add('noticeWrapper');
		noticeWrapper.style.position = 'absolute';
		noticeWrapper.style.left = wrapperLeft;
		noticeWrapper.style.top = wrapperTop;
		noticeWrapper.append(noticeElem);
		noticeWrapper.append(delButton);
		this.#arrayWrapAndNoteInformation.push(noticeObjCreating(noticeWrapper));
		noticeWrapper.style.zIndex = wrapperZIndex;
		desktop.resetNoticesStyle();
		document.body.append(noticeWrapper);

		localServiceManager.create(noticeObjCreating(noticeWrapper));

		noticeElem.focus();

		noticeWrapper.addEventListener('click', function (e) {
			const target = e.target;
			if (target.classList == 'delBtn') {
				noticeWrapper.remove();
				localServiceManager.delete(noticeObjCreating(noticeWrapper));
				desktop.removeNotice(noticeElem?.getInfo.timeCreating);
			}
		});
		noticeElem.addEventListener('input', function () {
			localServiceManager.create(noticeObjCreating(noticeWrapper));
		});

		noticeWrapper.addEventListener('mousedown', function (e) {
			desktop.resetNoticesStyle();
			noticeWrapper.style.zIndex = 10;
			noticeWrapper.querySelector('.notice').style.borderWidth = '3px';

			const shiftX = e.clientX - noticeWrapper.getBoundingClientRect().left;
			const shiftY = e.clientY - noticeWrapper.getBoundingClientRect().top;
			document.addEventListener('mousemove', mMove);
			function mMove(e) {
				noticeWrapper.style.transform = 'none';
				noticeWrapper.style.left = e.pageX - shiftX + 'px';
				noticeWrapper.style.top = e.pageY - shiftY + 'px';
			}
			noticeWrapper.addEventListener('mouseup', function () {
				document.removeEventListener('mousemove', mMove);
				localServiceManager.create(noticeObjCreating(noticeWrapper));
			});
		});

		function noticeObjCreating(elem) {
			return {
				left: elem.style.left,
				top: elem.style.top,
				zIndex: elem.style.zIndex,
				value: elem.querySelector('.notice').value,
				elemId: elem.querySelector('.notice').getAttribute('data-id'),
			};
		}
		return noticeWrapper;
	}
}
const localServiceManager = new LocalStorageManager();
const desktop = new Desktop(localServiceManager.read());
desktop.init();
