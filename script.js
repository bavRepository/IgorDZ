'use strict';

let shiftX;
let shiftY;
const container = document.querySelector('.container');
const wrappers = document.querySelectorAll('.noticeWrapper');

class NoticeManager {
	create() {
		const noticeWrapper = document.createElement('div');
		const notice = document.createElement('textarea');

		noticeWrapper.classList.add('noticeWrapper');
		notice.classList.add('notice');
		const delButton = createDelButton();
		noticeWrapper.append(notice);
		noticeWrapper.append(delButton);
		container.append(noticeWrapper);
	}
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
			alert('Е бой!');
		}
	});
}
const nm = new NoticeManager();
setAddButtonListener();
setNoticeListeners();
