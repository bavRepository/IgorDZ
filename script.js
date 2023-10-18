'use strict';

let shiftX;
let shiftY;
let noticeID = 0;
const container = document.querySelector('.container');

function creatingNotice() {
	const noticeWrapper = document.createElement('div');
	const notice = document.createElement('textarea');
	noticeWrapper.classList.add('noticeWrapper');
	noticeWrapper.setAttribute('data-id', `${++noticeID}`);
	notice.classList.add('notice');
	const delButton = getDelButton();
	noticeWrapper.append(notice);
	noticeWrapper.append(delButton);
	container.append(noticeWrapper);

	function setUpCurrentElementsSettings() {
		const noticeWrapperElements = document.querySelectorAll('.noticeWrapper');
		// set all elements with 1px border radius and zIndex auto for all notice
		noticeWrapperElements.forEach(elem => {
			elem.querySelector('.notice').style.borderWidth = '1px';
			elem.style.zIndex = 'auto';
		});
		// set max zIndex for current noticeWrapper
		noticeWrapper.style.zIndex = `${noticeWrapperElements.length}`;
		// set bold border for current notice
		noticeWrapper.querySelector('.notice').style.borderWidth = '3px';
	}

	setUpCurrentElementsSettings();
	function noticeObjCreating(elem) {
		return {
			left: elem.style.left,
			top: elem.style.top,
			zIndex: elem.style.zIndex,
			value: elem.querySelector('.notice').value,
			elemId: elem.getAttribute('data-id'),
		};
	}

	// When we creating a new notice we send its coordinates to local storage
	lsm.create(noticeObjCreating(noticeWrapper));

	noticeWrapper.addEventListener('click', function (e) {
		const target = e.target;

		if (target.classList == 'notice') {
			target.style.borderWidth = '3px';
		}

		if (target.classList == 'delBtn') {
			noticeWrapper.remove();
		}
	});

	noticeWrapper.addEventListener('mousedown', function (e) {
		// set all elements with 1px border radius and zIndex to auto
		setUpCurrentElementsSettings();
		// get coordinates shift inside the element
		shiftX = e.clientX - noticeWrapper.getBoundingClientRect().left;
		shiftY = e.clientY - noticeWrapper.getBoundingClientRect().top;
		// add move listener after mousedown

		document.addEventListener('mousemove', mMove);
		function mMove(e) {
			// remove transform translate with x50% and y50%
			noticeWrapper.style.transform = 'none';
			// repeat mouse position for notice
			noticeWrapper.style.left = e.pageX - shiftX + 'px';
			noticeWrapper.style.top = e.pageY - shiftY + 'px';
		}
		noticeWrapper.addEventListener('mouseup', function () {
			document.removeEventListener('mousemove', mMove);
			lsm.create(noticeObjCreating(noticeWrapper));
		});
	});
}

class LocalStorageManager {
	#localStorageKey = 'notice';
	create(noticeDataObj) {
		const noticeFromLocal =
			localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';
		const makeNoticeObjFromLocal = JSON.parse(noticeFromLocal);
		const noDuplicateObjects = makeNoticeObjFromLocal.filter(item => {
			if (
				Number.parseInt(item.elemId) != Number.parseInt(noticeDataObj.elemId)
			) {
				return item;
			}
		});
		noDuplicateObjects.push(noticeDataObj);
		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(noDuplicateObjects)
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
addNoticeButtonFn();
