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
	const delButton = createDelButton();
	noticeWrapper.append(notice);
	noticeWrapper.append(delButton);
	container.append(noticeWrapper);

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
		const noticeWrapperElements = document.querySelectorAll('.noticeWrapper');
		noticeWrapperElements.forEach(elem => {
			elem.querySelector('.notice').style.borderWidth = '1px';
			elem.style.zIndex = 'auto';
		});
		// set max zIndex for noticeWrapper
		noticeWrapper.style.zIndex = `${noticeWrapperElements.length}`;
		// set current notice a bold border
		noticeWrapper.querySelector('.notice').style.borderWidth = '3px';
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
		});
	});
}

class LocalStorageManager {
	#localStorageKey = 'notice';
	create() {}
}

function createDelButton() {
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

addNoticeButtonFn();
