let c = document.getElementById("color-canvas");
let ctx = c.getContext("2d", { willReadFrequently: true });
let colorPreview = document.getElementById("colour-preview");
let colorCodeRGB = document.getElementById("color-code-rgb");
let colorCodeHex = document.getElementById("color-code-hex");
let colourDropperBtn = document.getElementById("colour-dropper");
let saveColourBtn = document.getElementById("save-colour");
let rootContainer = document.getElementById("root");
let puck = document.getElementById("puck");
let puckSlider = document.getElementById("puck-slider");
let palletMain = document.getElementById("collapse");
let collapseIcon = document.getElementById("collapse-icon");

let colorSlider = document.getElementById("colour-slider");
let sliderCtx = colorSlider.getContext("2d", { willReadFrequently: true });

// Saved pallets
// localStorage.removeItem("savedCol")
let savedCol = localStorage.getItem("savedCol");
console.log(savedCol);

const addPellet = () => {
  if (!savedCol) {
    localStorage.setItem("savedCol", "[]");
  } else {
    console.log("FULL");
    let palletEle = localStorage.getItem("savedCol");
    let parsedPalletEle = JSON.parse(palletEle);
    parsedPalletEle.map((ele) => {
      console.log(ele);
      const pellet = document.createElement("div");
      pellet.classList.add("pallet");
      pellet.style.backgroundColor = ele;
      const codeText = document.createElement("h6");
      codeText.textContent += ele;
      pellet.appendChild(codeText);
      document.getElementById("pallet-grid-container").appendChild(pellet);
    });
  }
};

addPellet();

// Save colour button

const checkAddBtnStatus = () => {
  let palletEle = localStorage.getItem("savedCol");
  let parsedPalletEle = JSON.parse(palletEle);
  if (parsedPalletEle.length == 9) {
    saveColourBtn.style.backgroundColor = "#04c45e8a";
    saveColourBtn.style.cursor = "default";
  }
};

checkAddBtnStatus();

saveColourBtn.addEventListener("click", () => {
  let palletEle = localStorage.getItem("savedCol");
  let parsedPalletEle = JSON.parse(palletEle);
  if (parsedPalletEle.length < 9) {
    parsedPalletEle.push(colorCodeHex.innerText);
    localStorage.setItem("savedCol", JSON.stringify(parsedPalletEle));
    const pellet = document.createElement("div");
    pellet.classList.add("pallet");
    pellet.style.backgroundColor = colorCodeHex.innerText;
    const codeText = document.createElement("h6");
    codeText.textContent += colorCodeHex.innerText;
    pellet.appendChild(codeText);
    document.getElementById("pallet-grid-container").appendChild(pellet);
    checkAddBtnStatus();
  }
});

// Click to copy

colorCodeHex.onclick = () => {
  document.execCommand("copy");
};

colorCodeHex.addEventListener("copy", (e) => {
  e.preventDefault();
  if (e.clipboardData) {
    e.clipboardData.setData("text/plain", colorCodeHex.textContent);
    console.log(e.clipboardData.getData("text"));
  }
});

const updateColour = () => {
  let xPos = puck.offsetLeft + 7;
  let yPos = puck.offsetTop + 7;
  let pixel = ctx.getImageData(xPos, yPos, 1, 1)["data"];
  let rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
  colorPreview.style.background = rgb;
  colorCodeRGB.innerText = rgb;
  colorCodeHex.innerText = rgbToHex(pixel[0], pixel[1], pixel[2]);
};

colorCodeRGB.onclick = () => {
  document.execCommand("copy");
};

colorCodeRGB.addEventListener("copy", (e) => {
  e.preventDefault();
  if (e.clipboardData) {
    e.clipboardData.setData("text/plain", colorCodeRGB.textContent);
    console.log(e.clipboardData.getData("text"));
  }
});

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
  puck.style.left = `${x}px`;
  puck.style.top = `${y}px`;
});

colorSlider.addEventListener("click", (e) => {
  let rect = colorSlider.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let pixel = sliderCtx.getImageData(x, y, 1, 1)["data"];
  let color = rgbToHex(pixel[0], pixel[1], pixel[2]);
  createCanvas(color);
  puckSlider.style.left = `${x}px`;
  updateColour();
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

let collapsed = true;

collapseIcon.addEventListener("click", (e) => {
  if (collapsed) {
    palletMain.style.display = "block";
    collapsed = !collapsed;
  } else {
    palletMain.style.display = "none";
    collapsed = !collapsed;
  }
});
