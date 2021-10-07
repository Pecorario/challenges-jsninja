(function($, doc) {
  'use strict';
  /*
  Já temos as funcionalidades de adicionar e remover um carro. Agora, vamos persistir esses dados, 
  salvando-os temporariamente na memória de um servidor.
  Nesse diretório do `challenge-32` tem uma pasta `server`. É um servidor simples, em NodeJS, para 
  que possamos utilizar para salvar as informações dos nossos carros.
  Para utilizá-lo, você vai precisar fazer o seguinte:
  - Via terminal, acesse o diretório `server`;
  - execute o comando `npm install` para instalar as dependências;
  - execute `node app.js` para iniciar o servidor.
  Ele irá ser executado na porta 3000, que pode ser acessada via browser no endereço: 
  `http://localhost:3000`
  O seu projeto não precisa estar rodando junto com o servidor. Ele pode estar em outra porta.
  As mudanças que você irá precisar fazer no seu projeto são:
  - Para listar os carros cadastrados ao carregar o seu projeto, faça um request GET no endereço
  `http://localhost:3000/car`
  - Para cadastrar um novo carro, faça um POST no endereço `http://localhost:3000/car`, enviando
  os seguintes campos:
    - `image` com a URL da imagem do carro;
    - `brandModel`, com a marca e modelo do carro;
    - `year`, com o ano do carro;
    - `plate`, com a placa do carro;
    - `color`, com a cor do carro.
  Após enviar o POST, faça um GET no `server` e atualize a tabela para mostrar o novo carro cadastrado.
  Crie uma branch `challenge-32` no seu projeto, envie um pull request lá e cole nesse arquivo a URL
  do pull request.
  */
  var app = (function() {
    return {
      init: function init() {
        this.companyInfo();
        this.tableCars();
        this.initEvents();
      },

      initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        app.createNewCar();
      },

      createNewCar: function createNewCar() {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        var img = $('[data-js="image"]').get().value;
        var brand = $('[data-js="brand-model"]').get().value;
        var year = $('[data-js="year"]').get().value;
        var plate = $('[data-js="plate"]').get().value;
        var color = $('[data-js="color"]').get().value;

        ajax.send(`image=${img}&brandModel=${brand}&year=${year}&plate=${plate}&color=${color}`);
        window.location.reload();
      },

      setCar: function setCar(img, brand, year, plate, color) {
        const $fragment = doc.createDocumentFragment();
        var $tr = doc.createElement('tr');
        var $tdImage = doc.createElement('td');
        var $image = doc.createElement('img')
        var $tdBrand = doc.createElement('td');
        var $tdYear = doc.createElement('td');
        var $tdPlate = doc.createElement('td');
        var $tdColor = doc.createElement('td');
        var $tdDelete = doc.createElement('td');
        var $buttonDelete = doc.createElement('button');

        $tr.setAttribute('data-js', 'table-line');

        $image.setAttribute('src', img);
        $tdImage.appendChild($image);
        $tdBrand.textContent = brand;
        $tdYear.textContent = year;
        $tdPlate.textContent = plate;
        $tdColor.textContent = color;

        $buttonDelete.textContent = 'Deletar';
        $buttonDelete.setAttribute('data-js', 'button-delete');
        $buttonDelete.addEventListener('click', this.deleteLine, false);
        $tdDelete.appendChild($buttonDelete);
        
        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdDelete);

        return $fragment.appendChild($tr);
      },

      deleteLine: function deleteLine() {
        var index = this.parentNode.parentNode.rowIndex;
        return $('[data-js="table-line"]').get(index-1).remove();;
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'company.json');
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if (!app.isReady.call(this)) {
          return;
        }

        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();
        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },

      tableCars: function tableCars() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();
        ajax.addEventListener('readystatechange', this.getTableCars, false);
      },

      getTableCars: async function getTableCars() {
        if (!app.isReady.call(this)) {
          return;
        }

        var data = await JSON.parse(this.responseText);
        var $tableCar = $('[data-js="table-car"]').get();
        
        data.map((item) => {
          $tableCar.appendChild(app.setCar(item.image, item.brandModel, item.year, item.plate, item.color));
        })

      },
    };
  })();

  app.init();
})(window.DOM, document);