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
const slugify = require("slugify");
const replaceTemplateEl = require("./modules/replaceTemplate");

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

//slugify just for understanding the package - slugify to create meaningful slugs instead of id in the url params
const slugs = devData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  console.log("show the urls", req.url);
  const { query, pathname } = url.parse(req.url, true);

  //////////////////Routing

  if (pathname === "/" || pathname === "/overview") {
    //overview page
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = devData
      .map((el) => replaceTemplateEl(cardTemplate, el))
      .join("");
    const output = overviewTemplate.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
  } else if (pathname === "/product") {
    //product page
    res.writeHead(200, { "Content-type": "text/html" });
    const product = devData[query.id];
    const output = replaceTemplateEl(productTemplate, product);

    res.end(output);
  } else if (pathname === "/api") {
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
