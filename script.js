'use strict'

const addNotice = document.querySelector('.addNotice'),
	noticeClickedStyleBorder = '3px solid black',
	noticeUnClickedStyleBorder = '1px solid black';

let elemCoordX = '40%';
let elemCoordY = '40%';
let zIndex;
let createdNoticeCounter = 0;
let noticeValue;
let shiftX;
let shiftY;



class NoticeService {

	#localStorageKey = 'notice';

	delete(noticeId) {
		localStorage.removeItem(this.#localStorageKey);
	}

	create(noticeObj) {
		localStorage.setItem(this.#localStorageKey, JSON.stringify(noticeObj));
	}

	read(noticeId) {
		// let storageValue;
		const localItems = JSON.parse(localStorage.getItem(this.#localStorageKey));



	}

	update(data) {
		localStorage.setItem(this.#localStorageKey);
	}


}
function setUpNoticeSettings() {

	

	const notices = document.querySelectorAll('.notice');
	const wrappers = document.querySelectorAll('.noticeWrapper');

	wrappers.forEach((elem) => {
	
		const notice = elem.querySelector('.notice');
		const delButton = elem.querySelector('button');
	
		noticeObj.create(getNoticeObjData(elem, notice));
		
		// add Bold border if element is last cicked
		if (Number(elem.style.zIndex) === 1) {
			notice.style.border = noticeClickedStyleBorder;
		}

		elem.addEventListener('mousedown', (e) => {

			shiftX = e.clientX - elem.getBoundingClientRect().left;
			shiftY = e.clientY - elem.getBoundingClientRect().top;

			// unset zIndex from all wrapper elements 
			clearZIndex();
			elem.style.zIndex = 1;
			// unset Bold border from all elements

			notices.forEach(elem => {
				elem.style.border = noticeUnClickedStyleBorder;
			});
			notice.style.border = noticeClickedStyleBorder;

			function withMouseMoove(e) {
				elem.style.left = e.pageX - shiftX + 'px';
				elem.style.top = e.pageY - shiftY + 'px';
			}
			document.addEventListener('mousemove', withMouseMoove);

			elem.addEventListener("mouseup", function () {
				noticeObj.create(getNoticeObjData(elem, notice));

				document.removeEventListener('mousemove', withMouseMoove);
			});
		});
		elem.addEventListener('input', () => {
			noticeObj.create(getNoticeObjData(elem, notice));
		});
		delButton.addEventListener('click', () => {
			getNoticeFromLocalStorage(elem);
			elem.remove();
		});
	});


}




const noticeObj = new NoticeService();

function getNoticeObjData(elem, notice) {

	return {
		id: `id${elem.getAttribute('data-index')}`,
		x: `${elem.style.left}`,
		y: `${elem.style.top}`,
		z: `${elem.style.zIndex}`,
		message: `${notice?.value ?? ""}`,
	};
	
}



function addNoticeToLocalStorage(wrap, notice) {

	const elemsData = {
		id: `id${wrap.getAttribute('data-index')}`,
		x: `${wrap.style.left}`,
		y: `${wrap.style.top}`,
		z: `${wrap.style.zIndex}`,
		message: `${notice?.value ?? ""}`,
	};

	localStorage.setItem(`${elemsData.id}`, JSON.stringify(elemsData));
}

function getLocalNoticeInfo(data, i) {
	let storageValue;
	const localItems = JSON.parse(localStorage.getItem(`id${i + 1}`));

	switch (data) {
		case 'x': storageValue = localItems.x;
			break;
		case 'y': storageValue = localItems.y;
			break;
		case 'id': storageValue = localItems.id;
			break;
		case 'z': storageValue = localItems.z;
			break;
		case 'message': storageValue = localItems.message;
			break;
		default: console.error("Вы запросили несуществующую инструкцию у LocalStorage. Таких данных нет");
	}

	return storageValue;
}

// function startApplicationWork() {
// 	if (localStorage.length > 0) {
// 		for (let i = 0; i < localStorage.length; i++) {

// 			elemCoordX = getLocalNoticeInfo('x', i);
// 			elemCoordY = getLocalNoticeInfo('y', i);
// 			zIndex = getLocalNoticeInfo('z', i);
// 			noticeValue = getLocalNoticeInfo('message', i);
// 			addNewNotice();
// 		}
// 	}
// }


function startApplicationWork() {
	if (localStorage.length > 0) {
		for (let i = 0; i < localStorage.length; i++) {

			elemCoordX = notice.read('x', i);
			elemCoordY = getLocalNoticeInfo('y', i);
			zIndex = getLocalNoticeInfo('z', i);
			noticeValue = getLocalNoticeInfo('message', i);
			addNewNotice();
		}
	}
}



function clearZIndex() {
	const notices = document.querySelectorAll('.notice');
	const wrappers = document.querySelectorAll('.noticeWrapper');
	wrappers.forEach((wrap, i) => {
		wrap.style.zIndex = 'auto';
		// noticeObj.create(wrap, notices[i]);
	});
}



function getNoticeFromLocalStorage(elem) {
	localStorage.removeItem(`id${elem.getAttribute('data-index')}`);
}


function createNoticeWrapper() {

	const noticeWrapper = document.createElement('div');
	noticeWrapper.style.cssText = `
		z-index: ${zIndex ?? 0};
		top: ${elemCoordY};
		left: ${elemCoordX};
	`;
	noticeWrapper.setAttribute('data-index', createdNoticeCounter);
	noticeWrapper.classList.add('noticeWrapper');
	return noticeWrapper;
}

function createDelButton() {
	const delButton = document.createElement('button');
	delButton.style.cssText = `
		position: absolute;
		bottom: -25px;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 30px;
		display: block;
	`;
	delButton.textContent = 'Удалить';
	return delButton;
}
function createElemNotice() {
	const notice = document.createElement('textarea');
	notice.value = noticeValue ?? "";
	notice.classList.add('notice');
	return notice;
}

function addNewNotice() {
	createdNoticeCounter++;
	const noticeWrapper = createNoticeWrapper(),
		notice = createElemNotice(),
		delButton = createDelButton();

	noticeWrapper.append(notice);
	noticeWrapper.append(delButton);
	document.body.append(noticeWrapper);
	setUpNoticeSettings();
}

function createActionAddNotice() {
	addNotice.addEventListener('click', () => {
		noticeValue = undefined;
		elemCoordX = '40%';
		elemCoordY = '40%';
		addNewNotice();
	});
}

/////__IMPLEMENTATION__/////
startApplicationWork();
createActionAddNotice();
///////////////////////////
