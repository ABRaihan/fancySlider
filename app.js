const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = (images) => {
	// making select items and all select section
	const selected = `<span>Select Items: <span id="selectItem"
		>${sliders.length}</span></span>
		<input id="allSelect" type="checkbox"> <label for="allSelect">Select All</label>
	`;
	const div = document.createElement('div');
	div.innerHTML = selected;
	// when i click search button this section create repeatedly that's why this condition
	if (!document.querySelector('#selectItem')) {
		document
			.querySelector('.gallery')
			.insertAdjacentElement('beforebegin', div);
	}
	imagesArea.style.display = 'block';
	gallery.innerHTML = '';
	// show gallery title
	galleryHeader.style.display = 'flex';
	images.forEach((image) => {
		let div = document.createElement('div');
		div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
		div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
		gallery.appendChild(div);
	});
	loader(false);
	selectAll();
};

const getImages = (query) => {
	loader(true);
	fetch(
		`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
	)
		.then((response) => response.json())
		.then((data) => showImages(data.hits))
		.catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
	let element = event.target;
	element.classList.add('added');
	let item = sliders.indexOf(img);
	// for checking that is image already have in sliders
	const isImgAdded = sliders.some((img) => {
		return element === img;
	});
	if (item === -1 && !isImgAdded) {
		sliders.push(img);
		document.querySelector('#selectItem').innerText = sliders.length;
	} else if (item > -1 || isImgAdded) {
		element.classList.remove('added');
		sliders.splice(item, 1);
		document.querySelector('#selectItem').innerText = sliders.length;
	}
};
var timer;
const createSlider = (duration) => {
	// check slider image length
	if (sliders.length < 2) {
		alert('Select at least 2 image.');
		return;
	}
	// crate slider previous next area
	sliderContainer.innerHTML = '';
	const prevNext = document.createElement('div');
	prevNext.className =
		'prev-next d-flex w-100 justify-content-between align-items-center';
	prevNext.innerHTML = `
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

	sliderContainer.appendChild(prevNext);
	document.querySelector('.main').style.display = 'block';
	// hide image aria
	imagesArea.style.display = 'none';
	sliders.forEach((slide) => {
		let item = document.createElement('div');
		item.className = 'slider-item';
		item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
		sliderContainer.appendChild(item);
	});
	changeSlide(0);

	timer = setInterval(function () {
		slideIndex++;
		changeSlide(slideIndex);
	}, duration);
};

// change slider index
const changeItem = (index) => {
	changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
	const items = document.querySelectorAll('.slider-item');
	if (index < 0) {
		slideIndex = items.length - 1;
		index = slideIndex;
	}

	if (index >= items.length) {
		index = 0;
		slideIndex = 0;
	}

	items.forEach((item) => {
		item.style.display = 'none';
	});

	items[index].style.display = 'block';
};

searchBtn.addEventListener('click', function () {
	document.querySelector('.main').style.display = 'none';
	clearInterval(timer);
	const search = document.getElementById('search');
	getImages(search.value);
	sliders.length = 0;
});

sliderBtn.addEventListener('click', function () {
	const duration = document.getElementById('duration').value || 1000;
	if (duration >= 1000) {
		createSlider(duration);
	} else {
		alert('You have to set the time minimum 1000ms');
	}
});
document.querySelector('#search').addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		document.querySelector('.main').style.display = 'none';
		clearInterval(timer);
		const search = document.getElementById('search');
		getImages(search.value);
		sliders.length = 0;
	}
});

// select all function
function selectAll() {
	document
		.getElementById('allSelect')
		.addEventListener('change', function (e) {
			document.querySelectorAll('img').forEach((img) => {
				img.classList.remove('added');
			});
			sliders = [];
			if (e.target.checked) {
				document.querySelectorAll('img').forEach((img) => {
					img.classList.add('added');
					sliders.push(img.src);
				});
				document.querySelector('#selectItem').innerText =
					sliders.length;
			} else {
				document.querySelectorAll('img').forEach((img) => {
					img.classList.remove('added');
					sliders.pop();
				});
				document.querySelector('#selectItem').innerText =
					sliders.length;
			}
		});
}
// this function show loader
function loader(isShow) {
	if (isShow) {
		document.getElementById('loader').classList.remove('d-none');
		document.getElementById('loader').classList.add('d-flex');
	} else {
		document.getElementById('loader').classList.add('d-none');
		document.getElementById('loader').classList.remove('d-flex');
	}
}
