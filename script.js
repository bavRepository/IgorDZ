'use strict'

const addNotice = document.querySelector('.addNotice'),
	noticeParent = document.querySelector('.noticeWrapper');

let notice;
let delButton;
let parentNotice;
let elemCoordX;
let elemCoordY;
let createdNoticeCounter = 0;
let maxZInd = 0;
let noticeValue;
let notices;

if (localStorage.length > 0) {

	for (let i = 0; i < localStorage.length; i++) {

		elemCoordX = localStorage.getItem(`elemCoord${i + 1}`).split(" ")[0];
		elemCoordY = localStorage.getItem(`elemCoord${i + 1}`).split(" ")[1];
		noticeValue = localStorage.getItem(`elemCoord${i + 1}`).split(" ").slice(2).join(" ");
		addNewNotice();
	}
} else {
	elemCoordX = "50%";
	elemCoordY = "50%";
}

function setUpNoticeSettings() {
	const noticesWrapper = document.querySelectorAll('.noticeWrapper');
	noticesWrapper.forEach(elem => {
		const notice = elem.querySelector('.notice');

		localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${notice.value}`);
		elem.addEventListener('click', (e) => {
			const target = e.target;

			if (target.matches('button')) {
				localStorage.removeItem(`elemCoord${elem.getAttribute('data-index')}`);
		
					e.preventDefault();
					elem.remove();

					if (createdNoticeCounter >= 1) {
						createdNoticeCounter--;
					}
			}

			if (target.matches('.notice')) {
				target.addEventListener('input', () => {
					localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${target.value}`);
				});
			}

			if (target.matches('.notice')) {
				target.addEventListener('change', () => {
					localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${target.value}`);
				});
			}


		});
		elem.addEventListener('mousedown', () => {
			noticesWrapper.forEach(elem => {
				if (maxZInd < Number(elem.style.zIndex)) {
					maxZInd = Number(elem.style.zIndex);
				}
			});

			elem.style.zIndex = maxZInd + 1;
			notice.style.border = '2px solid black';

			function withMouseMoove(e) {

				if (e.pageX >= 0 && e.pageY >= 0) {
					elem.style.top = `${e.pageY}px`;
					elem.style.left = `${e.pageX}px`;
				}
			}
			document.addEventListener('mousemove', withMouseMoove);

			elem.addEventListener("mouseup", function () {
				maxZInd = 0;
				localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${notice.value}`);
				notice.style.border = '1px solid blue';
				document.removeEventListener('mousemove', withMouseMoove);

			});
		});


	});
}

function createNoticeParent() {
	parentNotice = document.createElement('div');
	parentNotice.classList.add('noticeWrapper');
	parentNotice.setAttribute('data-index', createdNoticeCounter);
	return parentNotice;
}

function createDelButton() {
	delButton = document.createElement('button');
	delButton.style.cssText = `
		width: 120px;
		height: 30px;
		display: block;
	`;
	delButton.textContent = 'Удалить';
	return delButton;
}

function createElemNotice() {
	notice = document.createElement('textarea');
	notice.value = noticeValue ?? "";
	notice.classList.add('notice');

	return notice;
}

function addNewNotice() {
	createdNoticeCounter++;

	const noticeParant = createNoticeParent();
	noticeParant.style.top = elemCoordY;
	noticeParant.style.left = elemCoordX;
	const delButton = createDelButton();
	const notice = createElemNotice();


	noticeParant.append(notice);
	noticeParant.append(delButton);
	document.body.append(noticeParant);
	setUpNoticeSettings();
}

function createActionAddNotice() {
	addNotice.addEventListener('click', () => {
		noticeValue = undefined;
		elemCoordX = "50%";
		elemCoordY = "50%";
		addNewNotice();
	});
}

createActionAddNotice();

