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
		this.#text;
	}
	set text(value) {
		this.#text = value;
	}
	get text() {
		return this.#text;
	}
	get timeCreating() {
		return this.#timeCreating;
	}
}

function readNoticesFromLocal() {
	const arrayNoticesFromLocal = lsm.read();
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

class Desktop {
	constructor() {
		const addButton = document.querySelector('.addNotice');
		addButton.addEventListener('click', function () {
			creatingNotice();
		});
	}

	creatingNotice() {}
}

readNoticesFromLocal();
