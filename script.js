'use strict';

let shiftX;
let shiftY;
let noticeID = 0;

function creatingNotice(localNoticeData) {
	const noticeWrapper = document.createElement('div'),
		notice = document.createElement('textarea'),
		delButton = getDelButton();

	// Set notice css style and get value from localStorage if not then ''
	notice.classList.add('notice');
	notice.value = localNoticeData?.value ?? '';

	// Set noticeWrapper css properties
	noticeWrapper.classList.add('noticeWrapper');
	noticeWrapper.style.position = 'absolute';
	noticeWrapper.style.left = localNoticeData?.left ?? '40%';
	noticeWrapper.style.top = localNoticeData?.top ?? '40%';
	noticeWrapper.setAttribute('data-id', localNoticeData?.elemId ?? ++noticeID);
	noticeWrapper.style.zIndex = localNoticeData?.zIndex ?? '1';
	// Add elements into noticeWrapper
	noticeWrapper.append(notice);
	noticeWrapper.append(delButton);
	// Add noticeWrapper to body
	document.body.append(noticeWrapper);
	// Set active notice text area
	notice.focus();

	function setUpCurrentElementsSettings() {
		const noticeWrapperElements = document.querySelectorAll('.noticeWrapper');
		// Set all elements with 1px border radius and zIndex auto for all notice
		noticeWrapperElements.forEach(elem => {
			elem.querySelector('.notice').style.borderWidth = '1px';
			elem.style.zIndex = 'auto';
		});
		// Set max zIndex for current noticeWrapper
		noticeWrapper.style.zIndex = `${noticeWrapperElements.length}`;
		// Set bold border for current notice
		noticeWrapper.querySelector('.notice').style.borderWidth = '3px';
	}

	setUpCurrentElementsSettings();
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

	// When we are creating a new notice in HTML we send its coordinates and params to local storage
	lsm.create(noticeObjCreating(noticeWrapper));

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
		setUpCurrentElementsSettings();
		// Get a shift's coordinates inside the element
		shiftX = e.clientX - noticeWrapper.getBoundingClientRect().left;
		shiftY = e.clientY - noticeWrapper.getBoundingClientRect().top;
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
}

// Creating class for manage LocalStorage data
class LocalStorageManager {
	#localStorageKey = 'notice';
	// Method create accepts data from Html elem, in our case is is 'noticeWrapper', and send it to localStorage
	create(noticeDataObj) {
		// At the first we get have already pushed information before there.
		// If there is empty in localStorage we just creating string's symbols of an empty array
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';
		// That string gets parsing for a future object. After that we creating a new array and use
		// filter for the last one. An old notice with the same ID does not fill into a new array
		const noDuplicateObjects = JSON.parse(noticeFromLocal).filter(item => {
			if (
				Number.parseInt(item.elemId) != Number.parseInt(noticeDataObj.elemId)
			) {
				// All elements that have already been there get zIndex 'auto' except the new one that is going to come to localStorage
				item.zIndex = 'auto';
				return item;
			}
		});
		// Pushing of a new notice as an object to a new array where have already been other updated objects of notices
		noDuplicateObjects.push(noticeDataObj);
		// At last we send new array of notices objects to localStorage however using stringify before that to format our structure as a string
		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(noDuplicateObjects)
		);
	}
	read() {
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';
		JSON.parse(noticeFromLocal).forEach(elem => {
			creatingNotice(elem);
		});
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

function getDelButton() {
	const delButton = document.createElement('button');
	delButton.classList.add('delBtn');
	delButton.textContent = 'Удалить';
	return delButton;
}

function addNoticeButtonFn() {
	const addButton = document.querySelector('.addNotice');
	addButton.addEventListener('click', function () {
		creatingNotice();
	});
}
const lsm = new LocalStorageManager();
lsm.read();
addNoticeButtonFn();
