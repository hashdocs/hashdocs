// This code requires Node.js. Do not run this code directly in a web browser.

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const formData = new FormData()
formData.append('instructions', JSON.stringify({
  parts: [
    {
      file: "document"
    }
  ],
  output: {
    type: "image",
    pages: {"start": 0, "end": -1},
    format: "jpg",
    height: 1024
  }
}))
formData.append('document', fs.createReadStream('C:/Users/bhara/Desktop/document.pdf'))

;(async () => {
  try {
    const response = await axios.post('https://api.pspdfkit.com/build', formData, {
      headers: formData.getHeaders({
          'Authorization': 'Bearer pdf_live_4QKEAsCaQwCDflXw7ibFqiGD9K4Iw4il5FCz385439Y'
      }),
      responseType: "stream"
    })

    response.data.pipe(fs.createWriteStream("images.zip"))
  } catch (e) {
    const errorString = await streamToString(e.response.data)
    console.log(errorString)
  }
})()

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on("error", (err) => reject(err))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}
