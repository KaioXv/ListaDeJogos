let btnAdd = document.querySelector('#btnAdd');
let btnImportar = document.querySelector('#btnImportar');
let btnExportar = document.querySelector('#btnExportar');
let btnFazerDownload = document.querySelector('#btnFazerDownload');
let indiceItemEdiçao = null;


let jogos = [
    
];
renderizarJogos();

function renderizarJogos(){
    document.querySelector('ul').innerHTML = '';
    jogos.forEach((jogo, indice) =>{
        let li = document.createElement('li');
        li.setAttribute('data-indice', indice);
        li.addEventListener('dblclick', function(){
            indiceItemEdiçao = indice;
            const {img, nome, preço} = jogos[indice];
               document.querySelector('#nome').value = nome;
               document.querySelector('#preço').value = preço;
               document.querySelector('#img').value = img;
               modal.adicionar();


        });


        let preçoFormatado = parseFloat(jogo.preço)
          .toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency:'BRL'
          })




        li.innerHTML = `
        <div>
            <img src="${jogo.img}" >
        </div>
        <div class="game-info">
            <h2>${jogo.nome}</h2>
            <h3>${preçoFormatado}</h3>
        </div>
        <span class="icon-remove" data-indice= "${indice}">
          <span class="material-symbols-outlined">
            delete
          </span>
        </span>`;
        document.querySelector('ul').appendChild(li);

    });

    if(jogos.length < 1) {
        document.querySelector('ul').innerHTML = `
        <li style="padding: 2rem">
          <h2 style = "text-aling: center">
          Nenhum jogo cadastrado!
          </h2>
          </li>
        
        `;

    }

    document.querySelectorAll('.icon-remove').forEach(x => {
        x.removeEventListener('click', deletar);
        x.addEventListener('click', deletar);
    })

}
function deletar(e){
    if(window.confirm('Deseja excluir?')){
        const indice = e.target.parentElement
          .getAttribute('data-indice');
          if(indice){
            jogos.splice(indice, 1);
            renderizarJogos();
          }
    }

}

document.querySelector('#btnSalvar'). addEventListener('click', function(e){
    e.preventDefault();

    const nome =  document.querySelector('#nome');
    const preço =  document.querySelector('#preço');
    const img = document.querySelector('#img');

    if(!nome.value) {
        alert('É preciso informar um nome!!!');
        return;
    }
    if(!preço.value) {
        alert('É preciso informar um preço!!!');
        return;
    }
    
    const jogo = {
        img: img.value  || 'https://via.placeholder.com/120?text=IMG',
        nome: nome.value,
        preço: preço.value
    }

    if(indiceItemEdiçao){
        jogos[indiceItemEdiçao] = jogo;
    } else {
        jogos.push(jogo);

    }

    
    modal.adicionar();
    renderizarJogos();
    indiceItemEdiçao = null;

   nome.value = '';
    preço.value = '';
    img.value = '';
})








btnAdd.addEventListener('click', ()=>{
    modal.adicionar();


});


btnImportar.addEventListener('click', () => {
    modal.importar();
   

});

btnExportar.addEventListener('click', () => {
    modal.download();
    


});







document.querySelectorAll('.btn-fechar-modal').forEach((x)=> {
    
    x.addEventListener('click', function() {
        this.parentElement.classList.toggle('abrir');
        document.querySelector('.background-modal')
          .classList.toggle('abrir');
       

    });

});

btnFazerDownload.addEventListener('click', (e)=>{
    e.preventDefault();
    const nomeArquivo = document.querySelector('#nomeArquivo').value
    if(!nomeArquivo) {
        alert('Informe um nome do arquivo!')
        return;
    }
    download()(jogos, `${nomeArquivo}.json`)
})


const download = function(){
    const a = document.createElement('a');
    a.style = "display: none";
    document.body.appendChild(a);
    return function(dados, nomeArquivo){
        const json = JSON.stringify(dados);
        const blob = new Blob([json], {type: 'octet/stream'});
        const url = window.URL.createObjectURL(blob);
        a.href=url;
        a.download = nomeArquivo;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

const modal = {
    download: function(){
    document.querySelector('[data-modal="download-jogos"]')
     .classList.toggle('abrir');
    document.querySelector('.background-modal')
     .classList.toggle('abrir');

    },
    importar: function(){
    document.querySelector('[data-modal="upload-jogos"]')
        .classList.toggle('abrir');
    document.querySelector('.background-modal')
        .classList.toggle('abrir');
   

    },
    adicionar: function(){
    document.querySelector('[data-modal="adicionar-jogo"]')
        .classList.toggle('abrir');
    document.querySelector('.background-modal')
        .classList.toggle('abrir');

      } 

      
   

    

}

document.querySelector('#arquivo')
 .addEventListener('change', (e)=>{
    const [arquivo] = e.target.files;
    const leitor = new FileReader();

    leitor.addEventListener('load', () => {
        jogos = JSON.parse(leitor.result);
        renderizarJogos();
    });

    if(arquivo){
        leitor.readAsText(arquivo);
        modal.importar();

    }
    
    
 })




