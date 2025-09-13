const express = require("express");
const CryptoJS = require("crypto-js");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = 17465;

app.get("/", (req, res) => {
  return res.status(200).send("Hello World");
});

app.post("/encrypt", (req, res) => {
  let text = req.body.plaintext;
  let key = req.body.key;
  try {
    let encryptedText = CryptoJS.AES.encrypt(text, key).toString();
    res.status(200).send(encryptedText);
  } catch (e) {;
  }
});
app.post("/decrypt", (req, res) => {
  let text = req.body.encryptedtext;
  let key = req.body.key;
  try {
    let decryptedText = CryptoJS.AES.decrypt(text, key).toString(
      CryptoJS.enc.Utf8
    );
    res.status(200).send(decryptedText);
  } catch (e) {
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
