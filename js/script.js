function copyToClipboard(e) {
  var t = e.firstChild.nodeValue.trim();
  navigator.clipboard.writeText(t),
    (e.firstElementChild.innerHTML = 'Copiado: ' + t);
}
function outFunc(e) {
  e.firstElementChild.innerHTML = 'Copiar para o clipboard';
}
const parser = new DOMParser(),
  leitor = new FileReader(),
  allowedExtensions = /(\.xml)$/i,
  xmlFile = document.getElementById('xml-input'),
  table = document.querySelector('[products-table]'),
  xmlSelectorButton = document.getElementById('selector-xml-button'),
  xmlDownButton = document.getElementById('download-xml-button'),
  xmlExampleLink = document.getElementById('xml-link');
xmlSelectorButton.addEventListener('click', () => {
  xmlFile.click();
}),
  xmlFile.addEventListener('change', () => {
    xmlSelectorButton.value = 'Nfe Selecionada: ' + xmlFile.files[0].name;
  }),
  xmlDownButton.addEventListener('click', () => {
    xmlExampleLink.click();
  });
let itens,
  newRow,
  xmlDom,
  counter,
  parentEle,
  xmlFileNode,
  elements = [],
  htmlString = '',
  lastXmlFile = '',
  checkboxElems;
function displayCheck(e) {
  (parentEle = this.parentElement.parentElement),
    parentEle.classList.contains('rows-disable')
      ? parentEle.classList.remove('rows-disable')
      : parentEle.classList.add('rows-disable');
}
function chkFn() {
  checkboxElems = document.querySelectorAll('input[type="checkbox"]');
  for (let e = 0; e < checkboxElems.length; e++)
    checkboxElems[e].addEventListener('change', displayCheck);
}
const uploadXmlFile = e => {
    if (
      (e.preventDefault(),
      (xmlFileNode = xmlFile.files[0]),
      void 0 !== xmlFileNode)
    )
      return allowedExtensions.exec(xmlFile.value)
        ? void (
            xmlFileNode.name !== lastXmlFile &&
            ((lastXmlFile = xmlFileNode.name),
            leitor.addEventListener('load', function () {
              for (
                xmlDom = parser.parseFromString(this.result, 'text/xml'),
                  itens = xmlDom.querySelectorAll('det');
                table.rows.length - 1;

              )
                table.deleteRow(-1);
              (counter = 1),
                Array.from(itens).forEach(function (e) {
                  for (
                    elements.push(
                      e.querySelector('vProd').firstChild.nodeValue
                    ),
                      elements.push(
                        parseFloat(
                          e.querySelector('vUnCom').firstChild.nodeValue
                        ).toFixed(2)
                      ),
                      elements.push(
                        parseInt(e.querySelector('qCom').firstChild.nodeValue)
                      ),
                      elements.push(
                        e.querySelector('uCom').firstChild.nodeValue
                      ),
                      elements.push(
                        e.querySelector('xProd').firstChild.nodeValue
                      ),
                      elements.push(
                        e.querySelector('cEAN').firstChild.nodeValue
                      ),
                      elements.push(
                        e.querySelector('cProd').firstChild.nodeValue
                      ),
                      newRow = table.insertRow(-1),
                      newRow.className += 'rows-enable',
                      newRow.insertAdjacentHTML(
                        'beforeend',
                        `<td>${counter.toString()}</td>`
                      );
                    elements.length;

                  )
                    (htmlString = `<td onclick="copyToClipboard(this)" onmouseout="outFunc(this)" class="tooltip">${elements.pop()}<span class="tooltiptext">Copiar para o clipboard</span></td>`),
                      newRow.insertAdjacentHTML('beforeend', htmlString);
                  newRow.lastElementChild.classList.add('amount'),
                    (htmlString = `<td id="checkbox-container"><input id="verified${counter}" type="checkbox" name="verified" value="checked"></td>`),
                    newRow.insertAdjacentHTML('beforeend', htmlString),
                    counter++;
                }),
                chkFn();
            }),
            leitor.readAsText(xmlFileNode))
          )
        : (alert('Apenas arquivos ".xml"'), void (xmlFile.value = ''));
  },
  form = document.getElementById('upload-form');
form.addEventListener('submit', uploadXmlFile);
