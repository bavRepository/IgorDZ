'use strict';

class NoticeManager {
	create() {
		const noticeWrapper = document.createElement('div');
		const notice = document.createElement('textarea');

		noticeWrapper.classList.add('noticeWrapper');
		notice.classList.add('notice');

		noticeWrapper.append(notice);
		document.body.append(noticeWrapper);
	}
}

function setAddButtonListener() {
	const addButton = document.querySelector('.addNotice');
	addButton.addEventListener('click', function () {
		nm.create();
	});
}
const nm = new NoticeManager();
setAddButtonListener();
