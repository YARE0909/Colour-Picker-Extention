let c = document.getElementById("color-canvas");
let ctx = c.getContext("2d", { willReadFrequently: true });
let colorPreview = document.getElementById("colour-preview");
let colorCodeRGB = document.getElementById("color-code-rgb");
let colorCodeHex = document.getElementById("color-code-hex");
let colourDropperBtn = document.getElementById("colour-dropper");
let rootContainer = document.getElementById("root");

let colorSlider = document.getElementById("colour-slider");
let sliderCtx = colorSlider.getContext("2d", { willReadFrequently: true });

// rgb to hex converter
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Colour slider
let grdSlider = sliderCtx.createLinearGradient(0, 0, sliderCtx.canvas.width, 0);
grdSlider.addColorStop(0, "rgb(255, 0, 0)");
grdSlider.addColorStop(0.15, "rgb(255, 0, 255)");
grdSlider.addColorStop(0.33, "rgb(0, 0, 255)");
grdSlider.addColorStop(0.49, "rgb(0, 255, 255)");
grdSlider.addColorStop(0.67, "rgb(0, 255, 0)");
grdSlider.addColorStop(0.84, "rgb(255, 255, 0)");
grdSlider.addColorStop(1, "rgb(255, 0, 0)");
sliderCtx.fillStyle = grdSlider;
sliderCtx.fillRect(0, 0, sliderCtx.canvas.width, sliderCtx.canvas.height);

// Main colour picker
const createCanvas = (color) => {
  let grdH = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  grdH.addColorStop(0, "#ffffff");
  grdH.addColorStop(1, color);
  ctx.fillStyle = grdH;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(1, "#000");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

createCanvas("#ff0000");

c.addEventListener("click", (e) => {
  let rect = c.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let pixel = ctx.getImageData(x, y, 1, 1)["data"];
  let rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
  colorPreview.style.background = rgb;
  colorCodeRGB.innerText = rgb;
  colorCodeHex.innerText = rgbToHex(pixel[0], pixel[1], pixel[2]);
});

colorSlider.addEventListener("click", (e) => {
  let rect = colorSlider.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let pixel = sliderCtx.getImageData(x, y, 1, 1)["data"];
  console.log(pixel);
  let red = sliderCtx.getImageData(x, y, 1, 1).data[0];
  let green = sliderCtx.getImageData(x, y, 1, 1).data[1];
  let blue = sliderCtx.getImageData(x, y, 1, 1).data[2];
  let alpha = sliderCtx.getImageData(x, y, 1, 1).data[3];
  console.log(red);
  console.log(green);
  console.log(blue);
  console.log(alpha);
  // console.log(pixel[1]);
  // console.log(pixel[2]);
  let color = rgbToHex(pixel[0], pixel[1], pixel[2]);
  // console.log(color);
  createCanvas(color);
});

// Colour picker eye dropper
colourDropperBtn.addEventListener("click", () => {
  rootContainer.hidden = true;
  const eyeDropper = new EyeDropper();

  eyeDropper
    .open()
    .then((result) => {
      colorCodeHex.innerText = result.sRGBHex;
      let rgbCol = hexToRgb(result.sRGBHex);
      let rgbFin = `rbg(${rgbCol.r}, ${rgbCol.g}, ${rgbCol.b})`;
      rootContainer.hidden = false;
      colorCodeRGB.innerText = rgbFin;
      colorPreview.style.background = result.sRGBHex;
    })
    .catch((err) => {
      colorCodeHex.innerText = err;
    });
});
