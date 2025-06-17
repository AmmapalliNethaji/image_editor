const fileInput = document.querySelector(".file-input");
const filterButtons = document.querySelectorAll(".filter button");
const rotateButtons = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const resetBtn = document.querySelector(".reset-filter");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const container = document.querySelector(".container");

let brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0;

let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;
let activeFilter = "brightness";

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const updateSlider = () => {
  filterName.innerText = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
  let value = 100;
  if (activeFilter === "brightness") value = brightness;
  else if (activeFilter === "saturation") value = saturation;
  else if (activeFilter === "inversion") value = inversion;
  else if (activeFilter === "grayscale") value = grayscale;
  filterSlider.value = value;
  filterValue.innerText = `${value}%`;
};

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    button.classList.add("active");
    activeFilter = button.id;
    updateSlider();
  });
});

filterSlider.addEventListener("input", () => {
  const value = filterSlider.value;
  filterValue.innerText = `${value}%`;
  if (activeFilter === "brightness") brightness = value;
  else if (activeFilter === "saturation") saturation = value;
  else if (activeFilter === "inversion") inversion = value;
  else if (activeFilter === "grayscale") grayscale = value;
  applyFilters();
});

rotateButtons.forEach(button => {
  button.addEventListener("click", () => {
    switch (button.id) {
      case "left":
        rotate -= 90;
        break;
      case "right":
        rotate += 90;
        break;
      case "horizontal":
        flipHorizontal *= -1;
        break;
      case "vertical":
        flipVertical *= -1;
        break;
    }
    applyFilters();
  });
});

const resetFilters = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterButtons[0].click();
  applyFilters();
};

resetBtn.addEventListener("click", resetFilters);

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    container.classList.remove("disable");
    resetFilters();
  });
});

chooseImgBtn.addEventListener("click", () => fileInput.click());

saveImgBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipHorizontal, flipVertical);

  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "edited-image.jpg";
  link.href = canvas.toDataURL();
  link.click();
});