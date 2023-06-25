'use strict'

const addNotice = document.querySelector('.addNotice'),
	  noticeClickedStyleBorder = '3px solid black',
	  noticeUNClickedStyleBorder = '1px solid black';

let elemCoordX = '40%';
let elemCoordY = '40%';
let zIndex;
let createdNoticeCounter = 0;
let noticeValue;
let shiftX;
let shiftY;

function getLocalNoticeInfo(data, i) {
	let storageValue;
	const localItems = localStorage.getItem(`elemCoord${i + 1}`).split(" ");

	switch (data) {
		case 'x': storageValue = localItems[0];
			break;
		case 'y': storageValue = localItems[1];
			break;
		case 'z': storageValue = localItems[2];
			break;
		case 'value': storageValue = localItems.slice(3).join(" ");
			break;
		default: console.error("Вы запросили несуществующую инструкцию у LocalStorage. Таких данных нет");
	}

	return storageValue;
}

function startApplicationWork() {
	if (localStorage.length > 0) {
		for (let i = 0; i < localStorage.length; i++) {

			elemCoordX = getLocalNoticeInfo('x', i);
			elemCoordY = getLocalNoticeInfo('y', i);
			zIndex = getLocalNoticeInfo('z', i);
			noticeValue = getLocalNoticeInfo('value', i);
			addNewNotice();
		}
	}
}

function clearZIndex(wrapArr, notices) {
	wrapArr.forEach((wrap, i) => {
		wrap.style.zIndex = 'auto';
		setDataToLocal(wrap, notices[i]);
	});
}

function setDataToLocal(wrap, notice) {
	localStorage.setItem(`elemCoord${wrap.getAttribute('data-index')}`, `${wrap.style.left} ${wrap.style.top} ${wrap.style.zIndex} ${notice?.value ?? ""}`);
}

function delDataFroLocal(elem) {
	localStorage.removeItem(`elemCoord${elem.getAttribute('data-index')}`);
}

function setUpNoticeSettings() {

	const delButton = document.querySelector('button');
	const notices = document.querySelectorAll('.notice');
	const wrappers = document.querySelectorAll('.noticeWrapper');

	wrappers.forEach((elem, i) => {

		let currentNotice = notices[i];
		setDataToLocal(elem, currentNotice);

		// add Bold border if element is last cicked
		if (Number(elem.style.zIndex) === 1) {
			currentNotice.style.border = noticeClickedStyleBorder;
		}
		
		elem.addEventListener('mousedown', (e) => {
			shiftX = e.clientX - elem.getBoundingClientRect().left;
			shiftY = e.clientY - elem.getBoundingClientRect().top;

			// unset zIndex from all wrapper elements 
			clearZIndex(wrappers, notices);
			elem.style.zIndex = 1;
			// unset Bold border from all elements
			notices.forEach(elem => {
				elem.style.border = noticeUNClickedStyleBorder;
				
			});
			currentNotice.style.border = noticeClickedStyleBorder;
			
			function withMouseMoove(e) {
				elem.style.left = e.pageX - shiftX + 'px';
				elem.style.top = e.pageY - shiftY + 'px';
			}
			document.addEventListener('mousemove', withMouseMoove);

			elem.addEventListener("mouseup", function () {
				setDataToLocal(elem, currentNotice);


				document.removeEventListener('mousemove', withMouseMoove);
			});
		});
		elem.addEventListener('input', () => {
			setDataToLocal(elem, currentNotice);
		});
	});

	delButton.addEventListener('click', (e) => {
		delDataFroLocal(e.target);
		e.target.parentElement.remove();
	});
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
