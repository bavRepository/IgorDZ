'use strict';

let shiftX;
let shiftY;
let noticeID = 0;
const container = document.querySelector('.container');
const wrappers = document.querySelectorAll('.noticeWrapper');

class NoticeManager {
	create() {
		const noticeWrapper = document.createElement('div');
		const notice = document.createElement('textarea');
		noticeWrapper.classList.add('noticeWrapper');
		noticeWrapper.setAttribute('data-id', `${++noticeID}`);
		notice.classList.add('notice');
		const delButton = createDelButton();
		noticeWrapper.append(notice);
		noticeWrapper.append(delButton);
		container.append(noticeWrapper);
	}
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

function setAddButtonListener() {
	const addButton = document.querySelector('.addNotice');
	addButton.addEventListener('click', function () {
		nm.create();
	});
}

function setNoticeListeners() {
	container.addEventListener('click', function (e) {
		const target = e.target;
		if (target.classList == 'delBtn') {
		}
	});
	container.addEventListener('mousedown', function (e) {
		const target = e.target;
		if (target.classList == 'delBtn' || target.classList == 'notice') {
			console.log('DA');
			shiftX =
				e.clientX -
				target.closest('.noticeWrapper').getBoundingClientRect().left;
			shiftY =
				e.clientY -
				target.closest('.noticeWrapper').getBoundingClientRect().top;

			document.addEventListener('mousemove', function (e) {
				target.closest('.noticeWrapper').style.left = e.pageX - shiftX + 'px';
				target.closest('.noticeWrapper').style.top = e.pageY - shiftY + 'px';
			});
		}
	});
}
const nm = new NoticeManager();
setAddButtonListener();
setNoticeListeners();
// setDragAndDropListeners();
