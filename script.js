'use strict';

class LocalStorageManager {
	#localStorageKey = 'notice';

	create(noticeDataObj) {
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';

		const noDuplicateObjects = JSON.parse(noticeFromLocal).filter(item => {
			if (
				Number.parseInt(item.elemId) != Number.parseInt(noticeDataObj.elemId)
			) {
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
				if (
					Number.parseInt(item.elemId) != Number.parseInt(noticeDataObj.elemId)
				) {
					return item;
				}
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
	constructor(text, timeCreating) {
		this.#text = text;
		this.#timeCreating = timeCreating;
	}
	set textValue(value) {
		this.#text = value;
	}
	get textValue() {
		return this.#text;
	}
	get timeCreating() {
		return this.#timeCreating;
	}
}

function readNoticesFromLocal() {
	const arrayNoticesFromLocal = lsm.read();
	if (arrayNoticesFromLocal.length > 0) {
		arrayNoticesFromLocal.forEach(localStorageObj => {
			const notice = new Notice(localStorageObj.value, localStorageObj.elemId);
			creatingNoticeElement(
				notice,
				localStorageObj.left,
				localStorageObj.top,
				localStorageObj.zIndex
			);
		});
	}
}

class Desktop {
	#noticesWrappersList = [];
	createNotice(elem) {
		this.#noticesWrappersList.push(elem);
	}
	resetNoticesStyle() {
		this.#noticesWrappersList.forEach(elem => {
			elem.style.zIndex = 'auto';
			elem.querySelector('.notice').style.borderWidth = '1px';
		});
	}
	removeNotice(elemId) {
		this.#noticesWrappersList.forEach(elem => {
			if (elem.getAttribute('data-id') == elemId) {
				elem.remove();
			}
		});
	}
}

function creatingNoticeElement(
	notice,
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
		noticeElem = document.createElement('textarea'),
		delButton = getDelButton();

	// Set notice css style and get value from localStorage if not then ''
	noticeElem.classList.add('notice');
	noticeElem.value = notice?.textValue ?? '';
	noticeElem.style.border = '3px solid black';

	// Set noticeWrapper css properties
	noticeWrapper.classList.add('noticeWrapper');
	noticeWrapper.style.position = 'absolute';
	noticeWrapper.style.left = wrapperLeft;
	noticeWrapper.style.top = wrapperTop;
	noticeWrapper.setAttribute('data-id', notice?.timeCreating);
	noticeWrapper.style.zIndex = wrapperZIndex;
	// Add elements into noticeWrapper
	noticeWrapper.append(noticeElem);
	noticeWrapper.append(delButton);
	// Add noticeWrapper to body
	dsk.resetNoticesStyle();
	dsk.createNotice(noticeWrapper);
	document.body.append(noticeWrapper);
	// Set active notice text area
	noticeElem.focus();
	lsm.create(noticeObjCreating(noticeWrapper));
	// this.#noticeElementList.push(noticeWrapper);
	// Set event on Click on noticeWrapper
	noticeWrapper.addEventListener('click', function (e) {
		const target = e.target;
		// Is it delBtn? Performing removing noticeWrapper fn as an elem from html
		if (target.classList == 'delBtn') {
			lsm.delete(noticeObjCreating(noticeWrapper));
			dsk.removeNotice(notice?.timeCreating);
		}
	});
	// Every time when we enter any symbol into text field there is creating a new notice obj in localStorage
	noticeElem.addEventListener('input', function () {
		lsm.create(noticeObjCreating(noticeWrapper));
	});

	noticeWrapper.addEventListener('mousedown', function (e) {
		const target = e.target;
		// Is it delBtn? Performing removing noticeWrapper fn as an elem from html
		if (target.classList == 'notice') {
			dsk.resetNoticesStyle();
			noticeWrapper.style.zIndex = 1;
			target.style.borderWidth = '3px';
		}

		// Get a shift's coordinates inside the element
		const shiftX = e.clientX - noticeWrapper.getBoundingClientRect().left;
		const shiftY = e.clientY - noticeWrapper.getBoundingClientRect().top;
		//
		document.addEventListener('mousemove', mMove);
		function mMove(e) {
			// Remove transform translate with x50% and y50% to set correct element position
			noticeWrapper.style.transform = 'none';
			// Repeat mouse position for notice
			noticeWrapper.style.left = e.pageX - shiftX + 'px';
			noticeWrapper.style.top = e.pageY - shiftY + 'px';
		}
		// When we do 'mouseup' event above the noticeWrapper there is removing mousemove event
		noticeWrapper.addEventListener('mouseup', function () {
			document.removeEventListener('mousemove', mMove);
			lsm.create(noticeObjCreating(noticeWrapper));
		});
	});
	function noticeObjCreating(elem) {
		// Return object with css fields to send it to localStorage
		return {
			left: elem.style.left,
			top: elem.style.top,
			zIndex: elem.style.zIndex,
			value: elem.querySelector('.notice').value,
			elemId: elem.getAttribute('data-id'),
		};
	}
}

function addElemEventInitialization(sel) {
	const elem = document.querySelector(sel);
	elem.addEventListener('click', function () {
		dsk.resetNoticesStyle();
		const notice = new Notice('', Date.now());
		creatingNoticeElement(notice);
	});
}

const dsk = new Desktop();
const lsm = new LocalStorageManager();
readNoticesFromLocal();
addElemEventInitialization('.addNotice');
