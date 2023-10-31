'use strict';

import '../index.html';
import '../styles/style.scss';

class LocalStorageManager {
	#localStorageKey = 'notice';

	create(noticeDataObj) {
		// console.log("perviy vtoroi");
		// const noticeFromLocal =
		// 	localStorage.getItem(`${this.#localStorageKey}`) ?? '[]';

		// const noDuplicateObjects = JSON.parse(noticeFromLocal).filter(item => {
		// 	if (item.elemId !== noticeDataObj.elemId) {
		// 		item.zIndex = 'auto';
		// 		return item;
		// 	}
		// });

		// noDuplicateObjects.push(noticeDataObj);

		localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(noticeDataObj)
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

	const withoutDeleted = JSON.parse(noticeFromLocal).filter(item => {
		return noticeDataObj.elemId !== item.elemId;
	});

	localStorage.setItem(
			`${this.#localStorageKey}`,
			JSON.stringify(withoutDeleted)
		);
	}
}

class NoticeManager {
	#text;

	constructor(text = '') {
		this.#text = text;
	}

	createAndGetHtmlElem(text = this.#text, timeCreating = Date.now(), ...classes) {
		const htmlNotice = document.createElement('textarea');
		htmlNotice.value = text;
		htmlNotice.style.border = '3px solid black';
		htmlNotice.setAttribute('data-id', timeCreating);
		if (classes.length === 0) {
			htmlNotice.classList.add('notice');
	} else {
			classes.forEach(item => {
				htmlNotice.classList.add(item);
			});
	}
		return htmlNotice;
	}

	addListener(elem, inputEvent){
		elem.addEventListener('input', inputEvent);
	}

	set text(value) {
		this.#text = value;
	}
}

class Desktop {
	#currentNoticeAndDragAbleElemData;
	#storageService;
	#noticeService;
	#arrayWrapAndNoteInformation = [];
	constructor(serviceObj) {
		this.#storageService = serviceObj.storageService;
		this.#noticeService = serviceObj.noticeService;
	}

	// get currentNoticeAndDragAbleElemData(){
	// 	return this.#currentNoticeAndDragAbleElemData;
	// }
	
	get storageService(){
		return this.#storageService;
	}

	get noticeService(){
		return this.#noticeService;
	}

	// get arrayWrapAndNoteInformation() {
	// 	return this.#arrayWrapAndNoteInformation;
	// }

	pushNewNoticeDate(newObjData) { 
		this.#arrayWrapAndNoteInformation = this.#arrayWrapAndNoteInformation.filter((el) => {
			if (newObjData.elemId !== el.elemId) {
				el.zIndex = 'auto'
				return el;
			}
		});
		this.#arrayWrapAndNoteInformation.push(newObjData);
	}

	getElemInfo(splittedObjects) {
		return {
			left: splittedObjects.dragAbleUnderNoticeElem.style.left,
			top: splittedObjects.dragAbleUnderNoticeElem.style.top,
			zIndex: splittedObjects.dragAbleUnderNoticeElem.style.zIndex,
			value: splittedObjects.noticeElem.value,
			elemId: splittedObjects.noticeElem.getAttribute('data-id'),
			border: splittedObjects.noticeElem.style.border,
		};
	}


	resetNoticesStyle(fixStyleDataObj) {
		this.#arrayWrapAndNoteInformation = this.#arrayWrapAndNoteInformation.filter(oldElem => {
		if (oldElem.elemId != fixStyleDataObj.elemId) {
			oldElem.zIndex = 'auto';
			oldElem.border = '1px';
			return oldElem;
		}
		});

		this.#arrayWrapAndNoteInformation.forEach(item => {
			console.log(item); 
	});

		fixStyleDataObj.zIndex = '10';
		fixStyleDataObj.border = '3px';
		this.#arrayWrapAndNoteInformation.push(fixStyleDataObj);
		document.querySelectorAll('.wrapperNotice').forEach(item => {
			item.remove();
	});
	this.init();
		// const fixedStyleHtmlElem = document.querySelector(`div[data-id="${fixStyleDataObj.elemId}"]`);

		// fixedStyleHtmlElem.style.zIndex = 10;
		// fixedStyleHtmlElem.querySelector('.notice').style.borderWidth = '3px';
	}


	removeNotice(deletedElem) {
		this.#arrayWrapAndNoteInformation = this.#arrayWrapAndNoteInformation.filter(oldElem => {
			return oldElem.elemId != deletedElem.elemId;
		});
		document.querySelectorAll('.wrapperNotice').forEach(item => {
			item.remove();
	});
	this.#storageService.delete(deletedElem);
	this.init();

}

// 	this.#arrayWrapAndNoteInformation.forEach(item => {
//     const noticeInfoFromDataArray = this.#noticeService.createAndGetHtmlElem(item.text, item.timeCreating);
// 		  this.createDragAbleElemWithNotice(noticeElem)
// });

// 	noticeElem,
// 		wrapperLeft = '40%',
// 		wrapperTop = '40%',
// 		wrapperZIndex = 'auto'
// 	}



	init() {
		this.#arrayWrapAndNoteInformation = this.#storageService.read();
		if (this.#arrayWrapAndNoteInformation.length > 0) {
			this.#arrayWrapAndNoteInformation.forEach(objDataFromLocal => {
				const noticeElem = this.#noticeService.createAndGetHtmlElem(objDataFromLocal.value, objDataFromLocal.elemId);

				this.createDragAbleElemWithNotice(
					noticeElem,
					objDataFromLocal.left,
					objDataFromLocal.top,
					objDataFromLocal.zIndex
				);
			});
		}

		const elem = document.querySelector('.addNotice');

		elem.addEventListener('click', () => {
			this.createDragAbleElemWithNotice(this.#noticeService.createAndGetHtmlElem());
		});
	}

   getDelButton() {
		const delButton = document.createElement('button');
		delButton.classList.add('delBtn');
		delButton.textContent = 'Удалить';
		return delButton;
	}

	createDragAbleElemWithNotice(
		noticeElem,
		wrapperLeft = '40%',
		wrapperTop = '40%',
		wrapperZIndex = 'auto'
	) {

	 this.#currentNoticeAndDragAbleElemData = {
			left: wrapperLeft,
			top: wrapperTop,
			zIndex: wrapperZIndex,
			value: noticeElem.value,
			elemId: noticeElem.getAttribute('data-id'),
			border: noticeElem.style.border,
		};
		



	this.pushNewNoticeDate(this.#currentNoticeAndDragAbleElemData);
	let dragAbleUnderNoticeElem,
      delButton;
		// this.#arrayWrapAndNoteInformation.forEach(item => {
			dragAbleUnderNoticeElem = document.createElement('div'),
			delButton = desktop.getDelButton();
    
		dragAbleUnderNoticeElem.classList.add('wrapperNotice');
		dragAbleUnderNoticeElem.style.position = 'absolute';
		dragAbleUnderNoticeElem.style.left = this.#currentNoticeAndDragAbleElemData.left;
		dragAbleUnderNoticeElem.style.top = this.#currentNoticeAndDragAbleElemData.top;
		dragAbleUnderNoticeElem.style.zIndex = this.#currentNoticeAndDragAbleElemData.zIndex;
		// dragAbleUnderNoticeElem.setAttribute('data-id', this.#currentNoticeAndDragAbleElemData.elemId);
		dragAbleUnderNoticeElem.append(noticeElem);
		dragAbleUnderNoticeElem.append(delButton);
		document.body.append(dragAbleUnderNoticeElem);
		
		// desktop.pushNewNoticeDate(desktop.getElemInfo(splittedObjects));
	
		// desktop.resetNoticesStyle();

	

		noticeElem.focus();
		// });

		this.#storageService.create(this.#arrayWrapAndNoteInformation);

		dragAbleUnderNoticeElem.addEventListener('click', (e) => {
			const target = e.target;
			if (target.classList == 'delBtn') {
				this.removeNotice(this.#currentNoticeAndDragAbleElemData);
			}
		});

		this.#noticeService.addListener(noticeElem, () => inputNoticeEvent(this.#arrayWrapAndNoteInformation));

		function inputNoticeEvent(arrWrapAndNote){
			arrWrapAndNote.forEach(item => {
				if (noticeElem.getAttribute('data-id') === item.elemId) {
					item.value = noticeElem.value;
				}
		});
			desktop.storageService.create(arrWrapAndNote);
		}

		dragAbleUnderNoticeElem.addEventListener('mousedown', (e) => {
			this.resetNoticesStyle(this.#currentNoticeAndDragAbleElemData);
			
			const shiftX = e.clientX - dragAbleUnderNoticeElem.getBoundingClientRect().left;
			const shiftY = e.clientY - dragAbleUnderNoticeElem.getBoundingClientRect().top;

			document.addEventListener('mousemove', (e) => mMove(this.#arrayWrapAndNoteInformation));
			function mMove(arrWrapAndNote) {
					arrWrapAndNote.forEach(item => {
					if (noticeElem.getAttribute('data-id') === item.elemId) {
						console.log("da est' je suka " + e.pageX);
						item.left = e.pageX - shiftX + 'px';
						item.top = e.pageY - shiftY + 'px';

						dragAbleUnderNoticeElem.style.left = item.left;
						dragAbleUnderNoticeElem.style.top = e.pageY - item.top;
					}
					
			});
				
				// desktop.#currentNoticeAndDragAbleElemData.left = 
				// desktop.#currentNoticeAndDragAbleElemData.right = 
				// console.log(desktop.#currentNoticeAndDragAbleElemData.right);
				
			}
			dragAbleUnderNoticeElem.addEventListener('mouseup', function () {
				desktop.storageService.create(desktop.#arrayWrapAndNoteInformation);
				document.removeEventListener('mousemove', mMove);
				localServiceManager.create(desktop.#arrayWrapAndNoteInformation);
			});
		});
	}
}
const localServiceManager = new LocalStorageManager();
const desktop = new Desktop({'storageService' : new LocalStorageManager(), 'noticeService' : new NoticeManager()});
desktop.init();
