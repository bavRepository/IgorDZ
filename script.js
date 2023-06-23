'use strict'


const delNotice = document.querySelector('.removeNotice'),
	addNotice = document.querySelector('.addNotice'),
	noticeParent = document.querySelector('.noticeWrapper');

let elemCoordX;
let elemCoordY;
let counter = 0;
let maxZInd = 0;
let noticeValue;
let notices;
if (localStorage.length > 0) {

	for (let i = 0; i < localStorage.length; i++) {
		elemCoordX = localStorage.getItem(`elemCoord${i + 1}`).split(" ")[0];
		elemCoordY = localStorage.getItem(`elemCoord${i + 1}`).split(" ")[1];

		noticeValue = localStorage.getItem(`elemCoord${i + 1}`).split(" ").slice(2).join("");
		console.log(noticeValue);
		createNotice();
	}
} else {
	noticeValue = "ВЖУХх";
	elemCoordX = "50%";
	elemCoordY = "50%";
}



function deleteItemListener() {
	delNotice.addEventListener('click', () => {
		noticeParent.removeChild(noticeParent.lastElementChild);
		if (counter >= 1) {
			counter--;
		}
	});
}

function setUpNoticeSettings() {
	notices = document.querySelectorAll('.notice');

	notices.forEach(elem => {

		elem.addEventListener('change', () => {
			localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${elem.value}`);
		});

		localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${elem.value}`);



		elem.addEventListener('mousedown', (e) => {
			const target = e.target;
			notices.forEach(elem => {
				if (maxZInd < Number(elem.style.zIndex)) {
					maxZInd = Number(elem.style.zIndex);
				} else {
				}
			});



			target.style.zIndex = maxZInd + 1;
			target.style.border = '2px solid black';

			function withMouseMoove(e) {

				if (e.pageX >= 0 && e.pageY >= 0) {
					console.log(Number((e.target.style.height).replace(/\D/g, "")));
					target.style.top = `${e.pageY}px`;
					target.style.left = `${e.pageX}px`;
				}
			}
			document.addEventListener('mousemove', withMouseMoove);
			elem.addEventListener("mouseup", function () {
				maxZInd = 0;
				localStorage.setItem(`elemCoord${elem.getAttribute('data-index')}`, `${elem.style.left} ${elem.style.top} ${elem.value}`);
				elem.style.border = '1px solid blue';
				document.removeEventListener('mousemove', withMouseMoove);

			});

		});
	});
}

function createNotice() {
	counter++;
	const notice = document.createElement('textarea');
	notice.value = noticeValue;
	notice.setAttribute('data-index', counter);
	notice.classList.add('notice');

	notice.style.zIndex = counter;
	notice.style.top = elemCoordY;
	notice.style.left = elemCoordX;
	delNotice.classList.remove('hide');
	noticeParent.append(notice);
	setUpNoticeSettings();
}

function createActionAddNotice() {
	addNotice.addEventListener('click', () => {
		createNotice();
	});
}

createActionAddNotice();
deleteItemListener();

