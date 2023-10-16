'use strict';

class NoticeManager {
	create() {}
}

function setAddButtonListener() {
	const addButton = document.querySelector('.addNotice');
	addButton.addEventListener('click', function () {
		nm.create();
	});
}
const nm = new NoticeManager();
setAddButtonListener();
