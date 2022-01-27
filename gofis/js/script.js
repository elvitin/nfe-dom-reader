function copyToClipboard(e) {
  let string = e.firstChild.nodeValue.trim();
  navigator.clipboard.writeText(string);
  e.firstElementChild.innerHTML = "Copiado: " + string;
}

function outFunc(e) {
  e.firstElementChild.innerHTML = "Copiar para o clipboard";
}

const parser = new DOMParser();
const leitor = new FileReader();
const allowedExtensions = /(\.xml)$/i;
const xmlFile = document.getElementById("xml-input");
const table = document.querySelector("[products-table]");


const xmlSelectorButton = document.getElementById("selector-xml-button");
const xmlDownButton = document.getElementById("download-xml-button");
const xmlExampleLink = document.getElementById("xml-link");

xmlSelectorButton.addEventListener("click", () => {
  xmlFile.click();
});

xmlFile.addEventListener("change", () => {
  xmlSelectorButton.value = `Nfe Selecionada: ${xmlFile.files[0].name}`;
});

xmlDownButton.addEventListener("click", () => {
  xmlExampleLink.click();
});

let itens;
let newRow;
let xmlDom;
let counter;
let parentEle;
let xmlFileNode;

let elements = [];
let htmlString = "";
let lastXmlFile = "";

let checkboxElems;

function displayCheck(e) {
  parentEle = this.parentElement.parentElement;

  if (parentEle.classList.contains("rows-disable"))
    parentEle.classList.remove("rows-disable");
  else parentEle.classList.add("rows-disable");
}

function chkFn() {
  checkboxElems = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxElems.length; i++) {
    checkboxElems[i].addEventListener("change", displayCheck);
  }
}

const uploadXmlFile = (e) => {
  e.preventDefault();

  xmlFileNode = xmlFile.files[0];

  if (xmlFileNode === undefined) return;

  //Validated logic is here
  if (!allowedExtensions.exec(xmlFile.value)) {
    alert('Apenas arquivos ".xml"');
    xmlFile.value = "";
    return;
  }

  if (xmlFileNode.name === lastXmlFile) return;

  lastXmlFile = xmlFileNode.name;

  leitor.addEventListener("load", function () {
    xmlDom = parser.parseFromString(this.result, "text/xml");
    itens = xmlDom.querySelectorAll("det");

    while (table.rows.length - 1) table.deleteRow(-1);

    counter = 1;
    Array.from(itens).forEach(function (element) {
      elements.push(element.querySelector("vProd").firstChild.nodeValue);
      elements.push(
        parseFloat(
          element.querySelector("vUnCom").firstChild.nodeValue
        ).toFixed(2)
      );
      elements.push(
        parseInt(element.querySelector("qCom").firstChild.nodeValue)
      );
      elements.push(element.querySelector("uCom").firstChild.nodeValue);
      elements.push(element.querySelector("xProd").firstChild.nodeValue);
      elements.push(element.querySelector("cEAN").firstChild.nodeValue);
      elements.push(element.querySelector("cProd").firstChild.nodeValue);

      newRow = table.insertRow(-1);
      newRow.className += "rows-enable";

      newRow.insertAdjacentHTML("beforeend", `<td>${counter.toString()}</td>`);

      while (elements.length) {
        htmlString = `<td onclick="copyToClipboard(this)" onmouseout="outFunc(this)" class="tooltip">${elements.pop()}<span class="tooltiptext">Copiar para o clipboard</span></td>`;
        newRow.insertAdjacentHTML("beforeend", htmlString);
      }

      newRow.lastElementChild.classList.add("amount");

      htmlString = `<td id="checkbox-container"><input id="verified${counter}" type="checkbox" name="verified" value="checked"></td>`;
      newRow.insertAdjacentHTML("beforeend", htmlString);
      counter++;
    });
    chkFn();
  });

  leitor.readAsText(xmlFileNode);
};

const form = document.getElementById("upload-form");
form.addEventListener("submit", uploadXmlFile);
