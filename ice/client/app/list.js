import animalService from "./animal.service.mock.js";

console.log('we are on the list page');

//http://127.0.0.1:5501/ice/client/list.html?page=2&perPage=15
const params = new URL(document.location).searchParams;
//add records for pagination test
let recCount = params.get("records");
if(recCount !== null){
    let index = 0;
    while(recCount-->0) {
        animalService.saveAnimal({
            "name": `name ${index++}`,
            "breed": "Grizzly Bear",
            "legs": 4,
            "eyes": 2,
            "sound": "Moo"
          });
    }    
}

/* do table stuff */
const eleEmpty = document.getElementById('empty-message');
const eleTable = document.getElementById('animal-list');

//const records = animalService.getAnimals();
let recordPage = {
    page: Number(params.get('page') ?? 1),
    perPage: Number(params.get('perPage') ?? 7)
}
const {records, pagination} = animalService.getAnimalPage(recordPage);

if (!records.length) {
    eleEmpty.classList.remove('d-none');
    eleTable.classList.add('d-none');
} else {
    eleEmpty.classList.add('d-none');
    eleTable.classList.remove('d-none');
    drawAnimalTable(records);
    drawPagination(pagination);
}
/* 
 * 
 */
function drawPagination({ page = 1, perPage = 5, pages = 10 }) 
{
    const pagination = document.getElementById('pagination');
    if (pages > 1) { 
        pagination.classList.remove('d-none');
    }
    const ul = document.createElement("ul");
    ul.classList.add('pagination')
    ul.insertAdjacentHTML('beforeend', addPage(page-1, 'Previous', (page == 1) ? 'disabled' : ''))
    for (let i = 1; i <= pages; i++) {
        ul.insertAdjacentHTML('beforeend', addPage(i, i, (i == page) ? 'active' : ''));
    }
    ul.insertAdjacentHTML('beforeend', addPage(page+1, 'Next', (page == pages) ? 'disabled' : ''))

    pagination.append(ul);

    function addPage(number, text, style) {
      return `<li class="page-item ${style}">
        <a class="page-link" href="./list.html?page=${number}&perPage=${perPage}">${text}</a>
      </li>`
    }
}
/* 
 * 
 */
function drawAnimalTable(animals) 
{
    for (let animal of animals) {
        const row = eleTable.insertRow();
        // create some rows for each animal field

        row.insertCell().textContent = animal.name;
        row.insertCell().textContent = animal.breed;
        row.insertCell().textContent = animal.legs;
        row.insertCell().textContent = animal.eyes;
        row.insertCell().textContent = animal.sound;
        // create a cell to hold the buttons
        const eleBtnCell = row.insertCell();
        eleBtnCell.classList.add();
        // create a delete button
        const eleBtnDelete = document.createElement('button');
        eleBtnDelete.classList.add('btn', 'btn-danger', 'mx-1');
        eleBtnDelete.innerHTML = `<i class="fa fa-trash"></i>`;
        eleBtnDelete.addEventListener('click', onDeleteButtonClick(animal));
        // add the delete button to the button cell
        eleBtnCell.append(eleBtnDelete);
        // create an edit button
        const eleBtnEdit = document.createElement('a');
        eleBtnEdit.classList.add('btn', 'btn-primary', 'mx-1');
        eleBtnEdit.innerHTML = `<i class="fa fa-user"></i>`;
        eleBtnEdit.href = `./animal.html?name=${animal.name}`
        // add the edit button to the button cell
        eleBtnCell.append(eleBtnEdit);
    }
}

function onDeleteButtonClick(animal) {
    return event => {
        animalService.deleteAnimal(animal);
        window.location.reload();
    }
}