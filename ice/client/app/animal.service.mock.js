/*
 *  Service constructor
 */
function AnimalService() {
    function initAnimals(){
        let animals = [];
        let index = 0;
        while(animals.length<300) {
            animals.push({
                "name": `name ${index++}`,
                "breed": "Grizzly Bear",
                "legs": 4,
                "eyes": 2,
                "sound": "Moo"
              });
        }
        return animals;
    }
    // if there is no entry for animals in local storage
    if (!localStorage.getItem('animals')) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage  
        // create a new entry in local storage and put an empty array in it        
        localStorage.setItem('animals', JSON.stringify([]))
    }    
}
/*
 *
 */
AnimalService.prototype.getAnimals = function() {
    // this will always be set, because we did it in the constructor
    return JSON.parse(localStorage.getItem('animals'));
}
AnimalService.prototype.getAnimalPage = function({page = 1, perPage = 15}) {
    // this will always be set, because we did it in the constructor
    let records = JSON.parse(localStorage.getItem('animals'));
    let pagination = {
        page: page,
        perPage: perPage,
        pages: Math.ceil(records.length/perPage)
    }
    if(pagination.page < 1) pagination.page = 1;
    if(pagination.page > pagination.pages) pagination.page=pagination.pages;
    let start = (pagination.page-1)*perPage;
    let end = start + perPage
    return {
        records: records.slice(start, end),
        pagination
    };
}
/*
 *
 */
AnimalService.prototype.saveAnimal = function(animal) {
    // get a list of animals
    const animals = this.getAnimals();
    // see if this animal already exists
    if (animals.find(a => a.name == animal.name)) {
        // tell the caller we're not going to save this
        throw new Error('An animal with that name already exists!');
    }
    // if it doesn't, add it to the array
    animals.push(animal);
    // and save it in storage again
    localStorage.setItem('animals', JSON.stringify(animals));
    // tell the caller all was well
    return true;
}
/*
 *
 */
AnimalService.prototype.findAnimal = function(animalName) {
    return null;
}

/*
 *
 */
AnimalService.prototype.updateAnimal = function(animal) {

    return false;
}

/*
 *
 */
AnimalService.prototype.deleteAnimal = function(animal) {
    const animals = this.getAnimals();
    const idx = animals.findIndex(a => a.name == animal.name);
    if (idx === -1) {
        throw new Error('That animal does not exist!');
    }
    animals.splice(idx, 1);
    localStorage.setItem('animals', JSON.stringify(animals));
    return true;
}

export default new AnimalService();