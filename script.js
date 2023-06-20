'use strict'



window.addEventListener('DOMContentLoaded', function () {

	const addNotice = document.querySelector('.addNotice'),
		  delNotice = document.querySelector('.removeNotice');
	function setUpNoticeSettings() {
		let counter = 0;
		const notices = document.querySelectorAll('.notice');
		notices.forEach(elem => {

			delNotice.addEventListener('click', () => {
				elem.remove();
			});

			elem.addEventListener('mousedown', (e) => {
				counter++;
				const target = e.target;

				target.style.zIndex = `${notices.length + counter}`;
				target.style.border = '2px solid black';
				function elemMooving(pageX, pageY) {
					target.style.top = `${pageY}px`;
					target.style.left = `${pageX}px`;
				}
				function withMouseMoove(e) {
					elemMooving(e.pageX, e.pageY);
				}
				document.addEventListener('mousemove', withMouseMoove);
				elem.addEventListener("mouseup", function () {
					elem.style.border = '1px solid blue';
					document.removeEventListener('mousemove', withMouseMoove);
		
				});
			});
		});
	}

	function createNotice() {
		const notice = document.createElement('input');
		notice.value = "ВЖУХ—ВЖУХ";
		notice.classList.add('notice');
		document.body.append(notice);
		setUpNoticeSettings();
	}

	function createActionAddNotice() {
		addNotice.addEventListener('click', () => {
			createNotice();
			delNotice.classList.remove('hide');

		});
	}



	// 1.
	createActionAddNotice();

});