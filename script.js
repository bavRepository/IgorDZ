'use strict'

window.addEventListener('DOMContentLoaded', function () {

	const addNotice = document.querySelector('.addNotice');

	function setUpNoticeSettings() {

		const notices = document.querySelectorAll('.notice');
		notices.forEach(elem => {
			elem.addEventListener('mousedown', (e) => {
				const target = e.target;
				function elemMooving(pageX, pageY) {
					target.style.top = `${pageY}px`;
					target.style.left = `${pageX}px`;
				}
				function withMouseMoove(e) {
					elemMooving(e.pageX, e.pageY);
				}
				document.addEventListener('mousemove', withMouseMoove);
				elem.addEventListener("mouseup", function () {
					document.removeEventListener('mousemove', withMouseMoove);
				});
			});
		});


	}

	function createNotice() {
		const notice = document.createElement('div');
		notice.classList.add('notice');
		notice.textContent = "ВЖУХ—ВЖУХ";
		notice.style.zIndex = counter;
		document.body.append(notice);
		counter++;
		setUpNoticeSettings();
	}


	let counter = 1;

	function createActionAddNotice() {
		addNotice.addEventListener('click', () => {
			createNotice();
		});
	}


	// 1.
	createActionAddNotice();

});