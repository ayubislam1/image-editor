document.addEventListener("DOMContentLoaded", function () {
	const fileInput = document.querySelector(".file-input");
	const chooseImgBtn = document.querySelector(".choose-img");
	const previewImg = document.querySelector(".preview-img img");
	const resetFilterBtn = document.querySelector(".reset-filter");
	const saveImgBtn = document.querySelector(".save-img");
	const cameraBtn = document.querySelector(".camera-btn");
	const filterButtons = document.querySelectorAll(".filter-buttons button");
	const filterSlider = document.querySelector(".filter .slider input");
	const filterValue = document.querySelector(".filter .slider .value");
	const filterName = document.querySelector(".filter .slider .name");
	const rotateLeftBtn = document.querySelector("#left");
	const rotateRightBtn = document.querySelector("#right");
	const flipHorizontalBtn = document.querySelector("#horizontal");
	const flipVerticalBtn = document.querySelector("#vertical");

	let filterValues = {
		brightness: 100,
		saturation: 100,
		inversion: 0,
		grayscale: 0,
		contrast: 100,
		sepia: 0,
		blur: 0,
		hueRotate: 0,
		vibrant: 0,
		warm: 0,
		cool: 0,
	};

	let currentRotation = 0;
	let flipHorizontal = false;
	let flipVertical = false;

	function updateFilter() {
		const activeFilter = document.querySelector(".filter-buttons .active").id;
		filterValues[activeFilter] = filterSlider.value;

		previewImg.style.filter = `
            brightness(${filterValues.brightness}%) 
            saturate(${filterValues.saturation}%) 
            invert(${filterValues.inversion}%) 
            grayscale(${filterValues.grayscale}%) 
            contrast(${filterValues.contrast}%) 
            sepia(${filterValues.sepia}%) 
            blur(${filterValues.blur}px) 
            hue-rotate(${filterValues.hueRotate}deg)
        `;
		filterValue.innerText = `${filterSlider.value}%`;
		updateImageTransform();
	}

	function updateImageTransform() {
		previewImg.style.transform = `
            rotate(${currentRotation}deg) 
            scaleX(${flipHorizontal ? -1 : 1}) 
            scaleY(${flipVertical ? -1 : 1})
        `;
	}

	chooseImgBtn.addEventListener("click", () => {
		fileInput.click();
	});

	fileInput.addEventListener("change", () => {
		const file = fileInput.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				previewImg.src = reader.result;
				document.querySelector(".container").classList.remove("disable");
			};
			reader.readAsDataURL(file);
		}
	});

	filterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			document
				.querySelector(".filter-buttons .active")
				.classList.remove("active");
			button.classList.add("active");
			filterName.innerText = button.innerText;

			switch (button.id) {
				case "brightness":
				case "saturation":
				case "contrast":
				case "vibrant":
				case "warm":
				case "cool":
					filterSlider.max = "200";
					break;
				case "inversion":
				case "grayscale":
				case "sepia":
					filterSlider.max = "100";
					break;
				case "blur":
					filterSlider.max = "20";
					break;
				case "hueRotate":
					filterSlider.max = "360";
					break;
				default:
					filterSlider.max = "100";
			}
			filterSlider.value = filterValues[button.id];
			filterValue.innerText = `${filterSlider.value}%`;
			updateFilter();
		});
	});

	filterSlider.addEventListener("input", updateFilter);

	resetFilterBtn.addEventListener("click", () => {
		document.querySelector(".container").classList.add("disable");
		previewImg.src = "image-placeholder.svg";
		filterValues = {
			brightness: 100,
			saturation: 100,
			inversion: 0,
			grayscale: 0,
			contrast: 100,
			sepia: 0,
			blur: 0,
			hueRotate: 0,
			vibrant: 0,
			warm: 0,
			cool: 0,
		};
		currentRotation = 0;
		flipHorizontal = false;
		flipVertical = false;
		filterSlider.value = 100;
		document.querySelector(".filter-buttons #brightness").click();
	});

	saveImgBtn.addEventListener("click", () => {
		const link = document.createElement("a");
		link.href = previewImg.src;
		link.download = "edited-image.png";
		link.click();
	});

	cameraBtn.addEventListener("click", async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			const video = document.createElement("video");
			video.srcObject = stream;
			video.play();

			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			document.body.appendChild(canvas);

			video.addEventListener("loadedmetadata", () => {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
			});

			setTimeout(() => {
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				previewImg.src = canvas.toDataURL("image/png");
				document.querySelector(".container").classList.remove("disable");
				video.pause();
				video.srcObject = null;
				stream.getTracks().forEach((track) => track.stop());
				document.body.removeChild(canvas);
			}, 1000);
		} catch (err) {
			console.error("Error accessing camera: ", err);
		}
	});

	rotateLeftBtn.addEventListener("click", () => {
		currentRotation -= 90;
		updateImageTransform();
	});

	rotateRightBtn.addEventListener("click", () => {
		currentRotation += 90;
		updateImageTransform();
	});

	flipHorizontalBtn.addEventListener("click", () => {
		flipHorizontal = !flipHorizontal;
		updateImageTransform();
	});

	flipVerticalBtn.addEventListener("click", () => {
		flipVertical = !flipVertical;
		updateImageTransform();
	});
});
