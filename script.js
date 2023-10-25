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
	#border = '3px solid black';
	#timeCreating;
	#customClassName;

	constructor(text = '', timeCreating = Date.now(), customClassName = '') {
		this.#text = text;
		this.#timeCreating = timeCreating;
		this.customClassName = customClassName;
	}

	createAndGetNotice() {}
	set timeCreating(value) {
		this.#timeCreating = timeCreating;
	}

	get timeCreating() {
		return this.#timeCreating;
	}

	set customClassName(value) {
		this.#customClassName = value;
	}

	get customClassName() {
		return this.#customClassName;
	}

	set border(value) {
		this.#border = value;
	}

	get border() {
		return this.#border;
	}

	set text(value) {
		this.#text = value;
	}
	get text() {
		return this.#text;
	}
}

class Desktop {
	#arrayWrapAndNoteInformation;
	constructor(arrayWrapAndNoteInformation) {
		this.#arrayWrapAndNoteInformation = arrayWrapAndNoteInformation;
	}

	get arrayWrapAndNoteInformation() {
		return this.#arrayWrapAndNoteInformation;
	}

	set arrayWrapAndNoteInformation(WrapNoticeArray) {
		this.#arrayWrapAndNoteInformation = WrapNoticeArray;
	}

	addNotice(elem) {
		this.#arrayWrapAndNoteInformation.push(elem);
	}
	resetNoticesStyle() {
		document.querySelectorAll('.noticeWrapper').forEach(elem => {
			elem.style.zIndex = 'auto';
			elem.querySelector('.notice').style.borderWidth = '1px';
		});
	}
	removeNotice(elemId) {
		this.#arrayWrapAndNoteInformation =
			this.#arrayWrapAndNoteInformation.filter(elem => {
				if (elem.getAttribute('data-id') != elemId) {
					return elem;
				}
			});
	}
	init() {
		if (this.#arrayWrapAndNoteInformation.length > 0) {
			this.#arrayWrapAndNoteInformation.forEach(localStorageObj => {
				const noticeDescr = new Notice(
					localStorageObj.value,
					localStorageObj.elemId
				);

				const htmlNotice = document.createElement('textarea');
				htmlNotice.className = `notice ${noticeDescr.className}`.trim();
				htmlNotice.value = noticeDescr.text;
				htmlNotice.style.border = noticeDescr.border;
				htmlNotice.setAttribute('data-id', noticeDescr.timeCreating);
				function getDelButton() {
					const delButton = document.createElement('button');
					delButton.classList.add('delBtn');
					delButton.textContent = 'Удалить';
					return delButton;
				}

				const noticeWrapper = document.createElement('div'),
					delButton = getDelButton();

				noticeWrapper.classList.add('noticeWrapper');
				noticeWrapper.style.position = 'absolute';
				noticeWrapper.style.left = localStorageObj.left;
				noticeWrapper.style.top = localStorageObj.top;
				noticeWrapper.style.zIndex = localStorageObj.zIndex;
				noticeWrapper.append(htmlNotice);
				noticeWrapper.append(delButton);
				desktop.resetNoticesStyle(htmlNotice);
				document.body.append(noticeWrapper);

				htmlNotice.addEventListener('click', function (e) {
					desktop.resetNoticesStyle();
					noticeWrapper.style.zIndex = 10;
					e.target.style.borderWidth = '3px';
				});

				htmlNotice.focus();
				noticeWrapper.addEventListener('click', function (e) {
					const target = e.target;
					if (target.classList == 'delBtn') {
						noticeWrapper.remove();
						localServiceManager.delete(noticeObjCreating(noticeWrapper));
						desktop.removeNotice(htmlNotice?.timeCreating);
					}
				});
				htmlNotice.addEventListener('input', function () {
					localServiceManager.create(noticeObjCreating(noticeWrapper));
				});

				noticeWrapper.addEventListener('mousedown', function (e) {
					desktop.resetNoticesStyle();
					noticeWrapper.style.zIndex = 10;
					noticeWrapper.querySelector('.notice').style.borderWidth = '3px';
					const shiftX = e.clientX - noticeWrapper.getBoundingClientRect().left;
					const shiftY = e.clientY - noticeWrapper.getBoundingClientRect().top;
					document.addEventListener('mousemove', mMove);
					function mMove(e) {
						noticeWrapper.style.transform = 'none';
						noticeWrapper.style.left = e.pageX - shiftX + 'px';
						noticeWrapper.style.top = e.pageY - shiftY + 'px';
					}
					noticeWrapper.addEventListener('mouseup', function () {
						document.removeEventListener('mousemove', mMove);
						localServiceManager.create(noticeObjCreating(noticeWrapper));
					});
				});
			});
		}
		const elem = document.querySelector('.addNotice');
		elem.addEventListener('click', function () {
			const noticeDescr = new Notice();
			desktop.createNotice(noticeDescr);
		});
		function noticeObjCreating(elem) {
			return {
				left: elem.style.left,
				top: elem.style.top,
				zIndex: elem.style.zIndex,
				value: elem.querySelector('.notice').value,
				elemId: elem.getAttribute('data-id'),
			};
		}
	}
	createNotice(
		noticeDescr,
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

		const htmlNotice = document.createElement('textarea');
		htmlNotice.className = `notice ${noticeDescr.className}`;
		htmlNotice.value = noticeDescr.text;
		htmlNotice.style.border = noticeDescr.border;
		htmlNotice.setAttribute('data-id', noticeDescr.timeCreating);

		const noticeWrapper = document.createElement('div'),
			delButton = getDelButton();

		noticeWrapper.classList.add('noticeWrapper');
		noticeWrapper.style.position = 'absolute';
		noticeWrapper.style.left = wrapperLeft;
		noticeWrapper.style.top = wrapperTop;
		noticeWrapper.append(htmlNotice);
		noticeWrapper.append(delButton);
		this.#arrayWrapAndNoteInformation.push(noticeObjCreating(noticeWrapper));
		noticeWrapper.style.zIndex = wrapperZIndex;
		desktop.resetNoticesStyle();
		document.body.append(noticeWrapper);
		localServiceManager.create(noticeObjCreating(noticeWrapper));

		htmlNotice.focus();

		noticeWrapper.addEventListener('click', function (e) {
			const target = e.target;
			if (target.classList == 'delBtn') {
				noticeWrapper.remove();
				localServiceManager.delete(noticeObjCreating(noticeWrapper));
				desktop.removeNotice(noticeDescr?.timeCreating);
			}
		});
		htmlNotice.addEventListener('input', function () {
			localServiceManager.create(noticeObjCreating(noticeWrapper));
		});

		noticeWrapper.addEventListener('mousedown', function (e) {
			desktop.resetNoticesStyle();
			noticeWrapper.style.zIndex = 10;
			noticeWrapper.querySelector('.notice').style.borderWidth = '3px';

			const shiftX = e.clientX - noticeWrapper.getBoundingClientRect().left;
			const shiftY = e.clientY - noticeWrapper.getBoundingClientRect().top;
			document.addEventListener('mousemove', mMove);
			function mMove(e) {
				noticeWrapper.style.transform = 'none';
				noticeWrapper.style.left = e.pageX - shiftX + 'px';
				noticeWrapper.style.top = e.pageY - shiftY + 'px';
			}
			noticeWrapper.addEventListener('mouseup', function () {
				document.removeEventListener('mousemove', mMove);
				localServiceManager.create(noticeObjCreating(noticeWrapper));
			});
		});

		function noticeObjCreating(elem) {
			return {
				left: elem.style.left,
				top: elem.style.top,
				zIndex: elem.style.zIndex,
				value: elem.querySelector('.notice').value,
				elemId: elem.querySelector('.notice').getAttribute('data-id'),
			};
		}
		return noticeWrapper;
	}
}
const localServiceManager = new LocalStorageManager();
const noticeManger = new Notice();
const desktop = new Desktop(localServiceManager.read());
desktop.init();
