const fs = require("fs");

//////////////Files

const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textInput);

const textOutput = `This is what i know about : Avacado ${textInput}. \n Created on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOutput);

console.log("File Written!");

//Non blocking way Asynchronous way - This is a lot of call back -callback hell

fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) {
    console.log("ERROR");
    return;
  }
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile(
        "./txt/test.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (err, data4) => {
          console.log("wrote to test.txt");
        }
      );
    });
  });
});

/////////////////SERVER

const http = require("http");
const cors = require("cors");

const url = require("url");

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const devData = JSON.parse(data);

const replaceTemplateEl = (card, product) => {
  let output = card.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  console.log("output is", output);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
  console.log("show the urls", req.url);

  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    //overview Template
    const cardHtml = devData
      .map((el) => replaceTemplateEl(cardTemplate, el))
      .join("");
    const output = overviewTemplate.replace("{%PRODUCT_CARDS%}", cardHtml);
    console.log(output);
    res.end(output);
  } else if (pathName === "/product") {
    res.end("This is the product");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>The page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000...");
});

////////////Routing
