const imageInput = document.querySelector(".file-input"),
  preview = document.querySelector(".image-preview img"),
  editor = document.querySelector(".editor-container"),
  filterButtons = document.querySelectorAll(".filter-buttons button"),
  slider = document.querySelector(".slider-control input"),
  sliderValue = document.querySelector(".filter-value"),
  sliderLabel = document.querySelector(".filter-label"),
  transformButtons = document.querySelectorAll(".transform-buttons button"),
  resetBtn = document.querySelector(".reset-btn"),
  uploadBtn = document.querySelector(".upload-btn"),
  downloadBtn = document.querySelector(".download-btn");

let filters = {
  brightness: 100,
  saturation: 100,
  invert: 0,
  grayscale: 0,
};
let rotate = 0;
let flipH = 1;
let flipV = 1;
let activeFilter = "brightness";

function applyEdits() {
  preview.style.filter = `
    brightness(${filters.brightness}%)
    saturate(${filters.saturation}%)
    invert(${filters.invert}%)
    grayscale(${filters.grayscale}%)
  `;
  preview.style.transform = `rotate(${rotate}deg) scale(${flipH}, ${flipV})`;
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-buttons .active")?.classList.remove("active");
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    sliderLabel.textContent = btn.textContent;
    slider.max = activeFilter === "brightness" || activeFilter === "saturation" ? 200 : 100;
    slider.value = filters[activeFilter];
    sliderValue.textContent = `${slider.value}%`;
  });
});

slider.addEventListener("input", () => {
  filters[activeFilter] = slider.value;
  sliderValue.textContent = `${slider.value}%`;
  applyEdits();
});

transformButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "rotate-left") rotate -= 90;
    else if (action === "rotate-right") rotate += 90;
    else if (action === "flip-horizontal") flipH *= -1;
    else if (action === "flip-vertical") flipV *= -1;
    applyEdits();
  });
});

resetBtn.addEventListener("click", () => {
  filters = { brightness: 100, saturation: 100, invert: 0, grayscale: 0 };
  rotate = 0;
  flipH = 1;
  flipV = 1;
  filterButtons[0].click();
  applyEdits();
});

uploadBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
  preview.onload = () => {
    editor.classList.remove("disabled");
    resetBtn.click();
  };
});

downloadBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = preview.naturalWidth;
  canvas.height = preview.naturalHeight;

  ctx.filter = `
    brightness(${filters.brightness}%)
    saturate(${filters.saturation}%)
    invert(${filters.invert}%)
    grayscale(${filters.grayscale}%)
  `;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipH, flipV);
  ctx.drawImage(preview, -canvas.width / 2, -canvas.height / 2);

  const link = document.createElement("a");
  link.download = "edited-image.jpg";
  link.href = canvas.toDataURL();
  link.click();
});
