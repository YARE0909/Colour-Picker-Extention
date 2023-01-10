let c = document.getElementById("color-canvas");
let ctx = c.getContext("2d");
let colorPreview = document.getElementById("colour-preview");
let colorCodeRGB = document.getElementById("color-code-rgb");
let colorCodeHex = document.getElementById("color-code-hex");

let colorSlider = document.getElementById("colour-slider");

// rgb to hex converter
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Main colour picker
let color = "#0000ff";
let grdH = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
grdH.addColorStop(0, "#fff");
grdH.addColorStop(1, color);
ctx.fillStyle = grdH;
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

let grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
grd.addColorStop(0, "rgba(0,0,0,0)");
grd.addColorStop(1, "#000");
ctx.fillStyle = grd;
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

c.addEventListener("click", (e) => {
  let x = e.clientX;
  let y = e.clientY;
  let pixel = ctx.getImageData(x, y, 1, 1)["data"];
  let rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
  colorPreview.style.background = rgb;
  colorCodeRGB.innerText = rgb;
  colorCodeHex.innerText = rgbToHex(pixel[0], pixel[1], pixel[2]);
});

colorSlider.addEventListener("click", (e) => {
  let x = e.clientX;
  let y = e.clientY;
  let pixel = colorSlider.getImageData(x, y, 1, 1)["data"];
  color = rgbToHex(pixel[0], pixel[1], pixel[2]);
});
