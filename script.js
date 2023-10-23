'use strict';

const dsk = new Desktop();

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
			const notice = new Notice(
				localStorageObj.noticeText,
				localStorageObj.noticeTimeCreating
			);
			dsk.creatingNotice(
				notice,
				localStorageObj.wrapperLeft,
				localStorageObj.wrapperTop,
				localStorageObj.wrapperZIndex
			);
		});
	}
}

class Desktop {
	constructor() {
		const addButton = document.querySelector('.addNotice');
		addButton.addEventListener('click', function () {
			const notice = new Notice('', new Date.now());
			creatingNotice(notice);
		});
	}
	noticesWrappersList = [];
	creatingNotice(
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

		// Set noticeWrapper css properties
		noticeWrapper.classList.add('noticeWrapper');
		noticeWrapper.style.position = 'absolute';
		noticeWrapper.style.left = localNoticeData?.left ?? '40%';
		noticeWrapper.style.top = localNoticeData?.top ?? '40%';
		noticeWrapper.setAttribute('data-id', notice?.timeCreating);
		noticeWrapper.style.zIndex = localNoticeData?.zIndex ?? '1';
		// Add elements into noticeWrapper
		noticeWrapper.append(notice);
		noticeWrapper.append(delButton);
		// Add noticeWrapper to body
		document.body.append(noticeWrapper);
		// Set active notice text area
		notice.focus();
		noticesWrappersList.push(noticeWrapper);
		// Set event on Click on noticeWrapper
		noticeWrapper.addEventListener('click', function (e) {
			const target = e.target;
			// Is it notice? Set bold border
			if (target.classList == 'notice') {
				target.style.borderWidth = '3px';
			}
			// Is it delBtn? Performing removing noticeWrapper fn as an elem from html
			if (target.classList == 'delBtn') {
				lsm.delete(noticeObjCreating(noticeWrapper));
				noticeWrapper.remove();
			}
		});
		// Every time when we enter any symbol into text field there is creating a new notice obj in localStorage
		notice.addEventListener('input', function () {
			lsm.create(noticeObjCreating(noticeWrapper));
		});

		noticeWrapper.addEventListener('mousedown', function (e) {
			// Every 'mousedown' on the noticeWrapper we are updating our element's data
			//setUpCurrentElementsSettings();

			this.clearNoticesElementsStyle();
			noticeWrapper.style.zIndex = wrapperZIndex;
			noticeWrapper.querySelector('.notice').style.borderWidth = '3px';

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
	clearNoticesElementsStyle() {
		noticesWrappersList.forEach(elem => {
			elem.querySelector('.notice').style.borderWidth = '1px';
			elem.style.zIndex = 'auto';
		});
		// Set max zIndex for current noticeWrapper
		// noticeWrapper.style.zIndex = `${noticeWrapperElements.length}`;
		// Set bold border for current notice
		// noticeWrapper.querySelector('.notice').style.borderWidth = '3px';
	}
}

readNoticesFromLocal();
