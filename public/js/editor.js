//Editor related
let editGrid = document.getElementById('editGrid');
let ratioContainer1 = document.getElementById('ratioContainer1');
let savePageBtn = document.getElementById('savePageBtn');
let loadprevBtn = document.getElementById('loadprevBtn');
let loadnextBtn = document.getElementById('loadnextBtn');
let newTextBoxBtn = document.getElementById('newTextBoxBtn');
let presNameInput = document.getElementById('presNameInput');
let currentPageTxt = document.getElementById('currentPageTxt');
let notesTxt = document.getElementById('notesTxt');

//Text toolbar stuff
let textToolBar = document.getElementById('textToolBar');
let toolbar_font = document.getElementById('toolbar_font');
let toolbar_fontSize = document.getElementById('toolbar_fontSize');
let toolbar_bold = document.getElementById('toolbar_bold');
let toolbar_italic = document.getElementById('toolbar_italic');
let toolbar_shadow = document.getElementById('toolbar_shadow');
let toolbar_txtColor = document.getElementById('toolbar_txtColor');
let toolbar_hiliteColor = document.getElementById('toolbar_hiliteColor');
let toolbar_bgColor = document.getElementById('toolbar_bgColor');
let toolbar_underline = document.getElementById('toolbar_underline');
let toolbar_bulletList = document.getElementById('toolbar_bulletList');
let toolbar_numberList = document.getElementById('toolbar_numberList');
let toolbar_alignLeft = document.getElementById('toolbar_alignLeft');
let toolbar_alignCenter = document.getElementById('toolbar_alignCenter');
let toolbar_alignRight = document.getElementById('toolbar_alignRight');

//Extra stuff for toolbar
let colorPicker = document.getElementById('colorPicker');
let shadowPicker = document.getElementById('shadowPicker');
document.execCommand('styleWithCSS', false, true);
colorPicker.style.display = "none";
shadowPicker.style.display = "none";

//Globals
let presentation = {
	page_1: {
		content: '',
		notes: ''
	}
}

let originX = 0;
let originY = 0;
let editing = false;
let presmode = false;
let currentPage = 1;
let selected, content, presLength;

// -- Initalize content
let init = {
	loadGrid: function () {
		let pressedDelKey = false;

		//editGrid.style.width = (screen.width * 0.5) + "px";  Changed to ratioContainer and CSS
		//editGrid.style.height = (screen.height * 0.5) + "px";

		editGrid.addEventListener('mousedown', e => {
			if (e.target === editGrid && selected != undefined) {
				domEvent.removeSelected();
			}
		});

		editGrid.addEventListener('dragenter', e => {
			e.preventDefault();
		});

		editGrid.addEventListener('dragover', e => {
			e.preventDefault();
		});

		editGrid.addEventListener('drop', e => {
			domEvent.dropFile(e);
		});

		editGrid.addEventListener('input', e => {
			// Save events coming
		});

		notesTxt.addEventListener('input', e => {
			presentation["page_" + currentPage].notes = notesTxt.value;
		});

		document.addEventListener('keydown', e => {
			if (!pressedDelKey && !presmode) {
				let key = e.which || e.keyCode;
				if (key == 46) {
					if (!editing && selected != undefined) {
						selected.remove();
						domEvent.savePage();
					}
				}
				pressedDelKey = true;
			}
		});

		document.addEventListener('keyup', e => {
			pressedDelKey = false;
		});
	},

	loadToolbar: function () {
		// Add font size options to selector
		let lastSelected;
		let toolbar_fontSize_selector = toolbar_fontSize.firstElementChild;
		let colorPickerChildren = colorPicker.getElementsByTagName('input');
		let shadowPickerChildren = shadowPicker.getElementsByTagName('input');
		let colorPickerSat = colorPicker.querySelector('[name = sat]');
		let removeShadowBtn = document.getElementById('removeShadowBtn');

		let colors = {
			hue: 150,
			light: 50,
			alpha: 1.0,
			sat: 50
		}

		let shadows = {
			cordX: 5,
			cordY: 5,
			feather: 5
		}

		colorPickerSat.style = `background-color: hsla(${colors.hue}, ${colors.light}%, ${colors.sat}%, ${colors.alpha});`;

		for (let i = 1; i <= 7; i++) {
			toolbar_fontSize_selector.innerHTML += `<option value=${i}>${i}</option>`;
		}

		toolbar_font.addEventListener('change', e => {
			document.execCommand("fontName", false, e.target.value);
		});

		toolbar_fontSize.addEventListener('change', e => {
			document.execCommand("fontSize", false, parseInt(e.target.value));
		});

		toolbar_bold.addEventListener('mousedown', e => {
			document.execCommand('bold');
		});

		toolbar_italic.addEventListener('mousedown', e => {
			document.execCommand('italic');
		});

		toolbar_underline.addEventListener('mousedown', e => {
			document.execCommand('underline');
		});

		toolbar_shadow.addEventListener('mousedown', e => {
			lastSelected = toolbar_shadow;
			domEvent.toggleShadowPicker();
		});

		toolbar_txtColor.addEventListener('mousedown', e => {
			lastSelected = toolbar_txtColor;
			domEvent.toggleColorPicker();
		});

		toolbar_hiliteColor.addEventListener('mousedown', e => {
			lastSelected = toolbar_hiliteColor;
			domEvent.toggleColorPicker();
		});

		toolbar_bgColor.addEventListener('mousedown', e => {
			lastSelected = toolbar_bgColor;
			domEvent.toggleColorPicker();
		});

		for (let element of colorPickerChildren) {
			element.addEventListener('input', e => {
				let name = element.parentElement.getAttribute('name');
				colors[name] = element.value;

				let shadow = `${shadows.cordX}px ${shadows.cordY}px ${shadows.feather}px`;
				let hsla = `hsla(${colors.hue}, ${colors.light}%, ${colors.sat}%, ${colors.alpha})`;
				colorPickerSat.style.backgroundColor = hsla;

				if (lastSelected === toolbar_txtColor) {
					document.execCommand('foreColor', false, hsla);
				} else if (lastSelected === toolbar_hiliteColor) {
					document.execCommand('HiliteColor', false, hsla);
				} else if (lastSelected === toolbar_shadow) {
					selected.style.textShadow = `${shadow} ${hsla}`;
				} else if (lastSelected === toolbar_bgColor) {
					selected.style.backgroundColor = hsla;
				}
			});
		}

		for (let element of shadowPickerChildren) {
			element.addEventListener('input', e => {
				let name = element.parentElement.getAttribute('name');
				shadows[name] = element.value;

				let shadow = `${shadows.cordX}px ${shadows.cordY}px ${shadows.feather}px`;
				let hsla = `hsla(${colors.hue}, ${colors.light}%, ${colors.sat}%, ${colors.alpha})`;

				if (lastSelected === toolbar_shadow) {
					selected.style.textShadow = `${shadow} ${hsla}`;
				}
			});
		}

		removeShadowBtn.addEventListener('click', e => {
			selected.style.textShadow = '';
		});


		toolbar_bulletList.addEventListener('mousedown', e => {
			document.execCommand("insertunorderedlist");
		});

		toolbar_numberList.addEventListener('mousedown', e => {
			document.execCommand("insertorderedlist");
		});

		toolbar_alignLeft.addEventListener('mousedown', e => {
			document.execCommand("JustifyLeft", false);
		});

		toolbar_alignCenter.addEventListener('mousedown', e => {
			document.execCommand("JustifyCenter", false);
		});

		toolbar_alignRight.addEventListener('mousedown', e => {
			document.execCommand("JustifyRight", false);
		});
	},

	loadContent: function () {
		let presObject = presentation["page_" + currentPage];
		notesTxt.value = "";

		currentPageTxt.innerHTML = 'Current page: ' + currentPage;
		editGrid.innerHTML = presObject.content;
		notesTxt.value = presObject.notes;

		content = editGrid.getElementsByTagName("*");
		presLength = Object.keys(presentation).length;

		for (let element of content) {
			let parent = domEvent.getParent(editGrid, element);
			let name = parent.getAttribute("name");

			this.addDefaultEvents(parent);

			if (name === "text") {
				this.addEventsText(parent);
			}
		}
	},

	addDefaultEvents: function (element) {
		element.addEventListener('mousedown', e => {
			if (!editing && e.target != undefined) {
				let element = domEvent.getParent(editGrid, e.target);
				originX = e.clientX;
				originY = e.clientY;
				domEvent.setSelected(element);
				document.onmousemove = (e) => {
					domEvent.dragElement(e, selected);
				}
			}
		});

		element.addEventListener('mouseup', e => {
			domEvent.closeDragElement(e);
		});

		element.addEventListener('blur', e => {
			if (!domEvent.checkClickedToolbar()) {
				domEvent.removeEditMode(e.target);
			} else if (editing && selected != undefined) {
				selected.focus();
			}
		});
	},

	addEventsText: function (element) {
		element.addEventListener('dblclick', e => {
			e.preventDefault();

			let element = domEvent.getParent(editGrid, e.target);
			domEvent.setEditMode(element, true);
		});
	}
}

// -- Button functions
let btnEvent = {
	saveCurrentPage: function () {
		domEvent.removeSelected();
	},

	prevPage: function () {
		domEvent.removeSelected();
		if (currentPage > 1) {
			currentPage--;
			init.loadContent(currentPage);
		}
	},

	nextPage: function () {
		domEvent.removeSelected();

		presLength = Object.keys(presentation).length;

		if (currentPage < presLength) {
			currentPage++;
			init.loadContent(currentPage);
		}
	},

	newPage: function () {
		for (let i = presLength; i >= currentPage + 1; i--) {
			presentation['page_' + (i + 1)] = presentation['page_' + i];
		}
		presentation['page_' + (currentPage + 1)] = { content: '', notes: '' };
		btnEvent.nextPage();
	},

	newTextBox: function () {
		domEvent.removeSelected();

		let box = document.createElement('div');
		let top = parseInt(ratioContainer1.style.height) / 2;
		console.log(ratioContainer1.style.height);
		let left = parseInt(ratioContainer1.style.width) / 2;
		box.className = 'content';
		box.setAttribute('name', 'text');
		box.style = `font-size: 2rem; width: 150px; border-color: transparent; left: ${left - 75}px; top: ${top - 30}px;`;
		box.innerHTML = 'Enter text';
		editGrid.appendChild(box);
		init.addDefaultEvents(box);
		init.addEventsText(box);
	},

	exportToFile: function () {
		domEvent.removeSelected();

		let presObject = JSON.stringify(presentation);
		let download = document.createElement('a');
		let presName = presNameInput.value.replace(/\s/g, "").length > 0 ? presNameInput.value : 'no_name';

		download.setAttribute('download', presName + '.slyderweb');
		download.setAttribute('href', 'data:text;charset=utf-8,' + presObject);
		editGrid.appendChild(download);
		download.click();
		editGrid.removeChild(download);
	}
}

// -- Element events
let domEvent = {
	toggleColorPicker() {
		if (colorPicker.style.display == "none") {
			shadowPicker.style.display = "none";
			let top = parseInt(textToolBar.style.top);
			let left = parseInt(textToolBar.style.left);
			colorPicker.style.top = (top - 220) + "px";
			colorPicker.style.left = (left) + "px";
			colorPicker.style.display = "inline-block";
		} else {
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";
		}
	},

	toggleShadowPicker() {
		if (shadowPicker.style.display == "none" && colorPicker.style.display == "none") {
			let top = parseInt(textToolBar.style.top);
			let left = parseInt(textToolBar.style.left);
			colorPicker.style.top = (top - 220) + "px";
			colorPicker.style.left = (left) + "px";
			colorPicker.style.display = "inline-block";
			shadowPicker.style.top = colorPicker.style.top;
			shadowPicker.style.left = (left + parseInt(colorPicker.offsetWidth) + 2) + "px";
			shadowPicker.style.display = "inline-block";
		} else {
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";
		}
	},

	setToolbarPos: function (element) {
		let top = parseInt(element.style.top);
		let left = parseInt(element.style.left);
		let offsetTop = parseInt(editGrid.offsetTop);
		let offsetLeft = parseInt(editGrid.offsetLeft);
		textToolBar.style.top = (top + offsetTop - 50) + "px";
		textToolBar.style.left = (left + offsetLeft) + "px";
	},

	checkClickedToolbar: function () {
		let clicked = false;
		let mTarget = document.querySelectorAll(":hover");

		for (let element of mTarget) {
			if (element === textToolBar || element === colorPicker || element === shadowPicker) {
				clicked = true;
			}
		}

		return clicked;
	},

	getParent: function (parent, element) {
		if (parent != undefined && element != undefined) {
			while (element.parentElement != parent) {
				element = element.parentElement;
			}
			return element;
		}
	},

	savePage: function () {
		let presObject = presentation["page_" + currentPage];
		presObject.content = editGrid.innerHTML;
		presObject.notes = notesTxt.value;
	},

	dropFile: function (e) {
		e.preventDefault();

		let files = e.dataTransfer.files;

		for (let obj of files) {
			if (parseInt(obj.size) > 10485760) {
				alert('Files over 10mb is not allowed');
			} else {
				if (obj.type.includes("image")) {
					let reader = new FileReader();

					reader.readAsDataURL(obj);

					reader.onload = (e => {
						let img = document.createElement('img');

						img.className = 'content'
						img.name = 'img';
						img.src = e.target.result;
						img.style.width = "50px";
						img.style.height = "auto";
						img.draggable = false;

						editGrid.appendChild(img);
						init.addDefaultEvents(img);
					});
				} else if (obj.name.split('.').pop() === 'slyderweb') {
					let reader = new FileReader();

					reader.readAsDataURL(obj);

					reader.onload = (e => {
						let result = e.target.result;
						let base64 = result.split(',').pop();
						let decoded = window.atob(base64);
						presentation = JSON.parse(decoded);
						currentPage = 1;
						init.loadContent();
					});
				} else {
					console.log(`Cannot import file '${obj.name}' :'(`);
				}
			}
		}
	},


	setEditMode: function (element, editable) {
		if (!presmode && !editing) {
			element.setAttribute("contenteditable", editable);
			element.focus();
			element.style.resize = "both";
			element.style.cursor = "auto";
			textToolBar.style.display = "inline-block";
			this.setToolbarPos(element);

			editing = true;
		}
	},

	removeEditMode: function (element) {
		if (!presmode && editing) {
			element.contentEditable = false;
			element.style.resize = "none";
			element.style.cursor = "pointer";
			textToolBar.style.display = "none";
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";

			editing = false;
		}
	},

	setSelected: function (element) {
		if (!presmode) {
			if (selected != undefined) {
				this.removeSelected();
			}

			selected = element;
			selected.style.borderColor = "lightblue";
		}
	},

	removeSelected: function () {
		if (!presmode) {
			if (selected != undefined) {
				this.removeEditMode(selected);

				selected.readonly = true;
				selected.style.borderColor = "transparent";
				selected = undefined;

				this.savePage();
			}
		}
	},

	dragElement: function (e, element) {
		if (!presmode && element != undefined) {
			document.onmouseup = this.closeDragElement;

			let x = originX - e.clientX;
			let y = originY - e.clientY;
			let offsetX = element.offsetLeft - x;
			let offsetY = element.offsetTop - y;

			originX = e.clientX;
			originY = e.clientY;
			element.style.left = offsetX + "px";
			element.style.top = offsetY + "px";
		}
	},

	closeDragElement: function (e) {
		if (!presmode) {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
}


savePageBtn.onclick = btnEvent.saveCurrentPage;
loadprevBtn.onclick = btnEvent.prevPage;
loadnextBtn.onclick = btnEvent.nextPage;
newPageBtn.onclick = btnEvent.newPage;
newTextBoxBtn.onclick = btnEvent.newTextBox;
exportToFileBtn.onclick = btnEvent.exportToFile;


init.loadGrid();
init.loadContent();
init.loadToolbar();

/*******************  */
/* SILJES KODE START */

// global vars
let demotextbox;



// localStorage: behold elementene selv om reloader siden
/*
//dom pars hack https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function htmlToElement(html){
  var element = document.createElement('div');
  element.innerHTML = html;
  return(element);
}
*/
/*
//load local storage 
if (localStorage.getItem("demotextbox")) {
	let demotextboxString = localStorage.getItem("demotextbox");
	console.log(demotextboxString);
	var demotextbox = htmlToElement(demotextboxString);
	console.log(demotextbox);
	editGrid.innerHTML = demotextbox;
}
//else create journal object
else {
	lagTextBox();
}
*/


// lag demotekstbox
lagTextBox();

function lagTextBox() {
	domEvent.removeSelected();

	var demotextbox = document.createElement('div');
	let top = parseInt(ratioContainer1.offsetHeight) / 2;
	let left = parseInt(ratioContainer1.offsetWidth) / 2;
	let topFraction = top * 0.58;
	let leftFraction = left * 0.56;
	let fontSize = 5 * top * 0.04;  // 5 er utgangspunktet
	console.log(fontSize);
	demotextbox.className = 'content';
	demotextbox.setAttribute('name', 'text');
	demotextbox.style = `color: red; position: relative; font-size: ${fontSize}px; width: ${fontSize*7}px; border-color: transparent; left: ${leftFraction}px; top: ${topFraction}px;`;
	demotextbox.innerHTML = 'DemoTextBox';
	editGrid.appendChild(demotextbox);
	init.addDefaultEvents(demotextbox);
	init.addEventsText(demotextbox);
	console.log("Dette er koden");
	console.log(demotextbox);
	//	console.log(demotextbox.outerHTML);
	//	localStorage.setItem("demotextbox", demotextbox.outerhtml);
}


// RESIZING ELEMENTS UPON WINDOW RESIZE -----------------------------------------
/* hacky stuff */
// original editgrid size
let editGridHeight = parseFloat(ratioContainer1.offsetHeight);
let editGridWidth = parseFloat(ratioContainer1.offsetWidth);
const OriginalEditGridHeight = parseFloat(ratioContainer1.offsetHeight);
const OriginalEditGridWidth = parseFloat(ratioContainer1.offsetWidth);
console.log("original egw: " + editGridWidth);

window.onresize = function () {
	
	// defining sizes
	let halfHeight = parseFloat(ratioContainer1.offsetHeight) / 2;
	let halfWidth = parseFloat(ratioContainer1.offsetWidth) / 2;
	let Height = parseFloat(ratioContainer1.offsetHeight);
	let Width = parseFloat(ratioContainer1.offsetWidth);
	let topFraction = halfHeight * 0.58;
	//console.log("topfraction" + topFraction);
	let leftFraction = halfWidth * 0.56;
	let fraction = 0.04;
	let gridFraction = 0.004;
	let storedFontsize = 5; // how to get this
	let fontSize = storedFontsize * topFraction * fraction;
	let fractionOfOriginal = Width/OriginalEditGridWidth;
	console.log("fOO: " + fractionOfOriginal);
	//console.log(fontSize);
	
	// retrieving text elements
	let textArray = document.getElementsByName('text')
	
	// updating text elements size
	for (i = 0; i < textArray.length; i++) {
		
		//hent elements plassering
		let leftpos = parseFloat(textArray[i].offsetLeft);
		let toppos = parseFloat(textArray[i].offsetTop);
		//console.log("toppos: " + toppos);
		
		// brøkdel av opprinnelig editGrid-størrelse
		//console.log("edHeight: " + editGridHeight)
		let leftposFraction = leftpos/editGridWidth;
		let topposFraction = toppos/editGridHeight;
		
		// finn ny posisjon
		let left = leftposFraction * Width;
		let top = topposFraction * Height;
		//console.log("top" + top);
		//console.log("Height " + halfHeight * 2);
		
		//textstørrelse
		textArray[i].style.fontSize = `${fontSize}px`;
		textArray[i].style.width = `${fontSize*7}px`;

		//angi ny posisjon
		textArray[i].style.left = `${left}px`;
		textArray[i].style.top = `${top}px`;

	}
	
	// retrieving image elements
	var imgArray = document.getElementsByName('img')
	//console.log(imgArray);
	
	// updating image size
	for (i = 0; i < imgArray.length; i++) {
		
		//hent elements plassering
		let leftpos = parseFloat(imgArray[i].offsetLeft);
		let toppos = parseFloat(imgArray[i].offsetTop);
		//console.log("toppos: " + toppos);
		
		// brøkdel av opprinnelig editGrid-størrelse
		//console.log("edHeight: " + editGridHeight)
		let leftposFraction = leftpos/editGridWidth;
		let topposFraction = toppos/editGridHeight;
		
		// finn ny posisjon
		let left = leftposFraction * Width;
		let top = topposFraction * Height;
		//console.log("top" + top);
		//console.log("Height " + halfHeight * 2);
	
		//angi ny posisjon
		imgArray[i].style.left = `${left}px`;
		imgArray[i].style.top = `${top}px`;
		
		//bredde
		let width = parseFloat(imgArray[i].offsetWidth);
		console.log("w: " + width);
		/*let widthFraction = width/editGridWidth;
		console.log("egw: " + editGridWidth);
		console.log("wf: " + widthFraction);*/
		width = width * fractionOfOriginal;
		console.log("w2: " + width);
		imgArray[i].style.width = `${width}px`;
		
	}
	// andre typer element
	

	// angi ny størrelse for editGrid
	editGridHeight = parseFloat(ratioContainer1.offsetHeight);
	editGridWidth = parseFloat(ratioContainer1.offsetWidth);
	halfHeight = editGridHeight/2;
	halfWidth = editGridWidth/2;
	
}