const pdf2pic = require("pdf2pic");

const options = {
  density: 100,
  format: "png",
  width: 600,
  height: 600
};
const storeAsImage = pdf2pic.fromPath("C:/Users/bhara/Desktop/document.pdf", options);
const pageToConvertAsImage = 1;

async function convert() {
const a = await storeAsImage(pageToConvertAsImage)
// console.log(a);
}

convert();