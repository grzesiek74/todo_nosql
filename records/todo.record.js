const { ObjectId } = require("mongodb");
const { todos } = require("../utils/db");
const { ValidationError } = require("../utils/errors");


class TodoRecord {
    constructor(obj){
        this._id = ObjectId(obj._id); 
        this.title = obj.title;

        this._validate();
    }
    _validate(){
        if(this.title.trim().length < 5){
            throw new ValidationError('Todo title should be at least 5 characters.')
        }

        if(this.title.length > 150){
            throw new ValidationError('Todo title should be less than 150 characters.')
        }
    }

    // this bo mówimy o tym obiektcie, w którym aktualnie jesteśmy!!!
    async insert(){
        // dodawanie ręcznie tego co potrzebujemy a nie całego obiektu czyli this; po to aby nikt nam nic nie dopisał - kwestia bezpieczeństwa
        const {insertedId} = await todos.insertOne({
            _id: this._id,
            title: String(this.title),
        });
        this._id = insertedId; 

        return insertedId; 
    }

    async delete(){
        if(!this._id) {
            throw new ValidationError('Todo has no ID');
        }

        await todos.deleteOne({
            _id: this._id,
        })
    }

    //    find może być statyczny bo nie jest związany z żadnym pojedynczym obiektem tylko z klasą, czyli chcemy czegoś poszukać w TodoRecordzie
    static async find(id){
        const item = await todos.findOne({_id: ObjectId(String(id))}); 
        return item === null ? null : new TodoRecord(item); 
    }

    // metoda ogólna, która służy do pobierania wielu rekordów dlatego też może być static
    static async findAll(){
        // const result = await todos.find(); // rezultat znajdowania poszczególnych elementów
        // const resultArray = await result.toArray() // rezultat zmieniamy w tablicę - musi być await, ponieważ toArray() nie zwraca tablicy tylko Promise'a z tablicą
        // return resultArray.map(obj => new TodoRecord(obj)) // rezultat otrzymany z mongo zmieniamy; zmienamy w nim każdy poszczególny obiekt na obiekt typu TodoRecord i zwracamy
        

        // powyższy zapis oznacza to samo co poniżej ale jest bardziej rozpisany żeby zrozumieć
        return (await (await todos.find()).toArray()).map(obj => new TodoRecord(obj)); // zmieniamy zwykły obiekt w obiekt TodoRecord za pomocą map; robimy to po to aby potem można było wykonać inne metody np. update
    }

    // metoda na znajdowanie wszystkich rekordów bez obciążania programu tzn. z użyciem kursorów
    // da nam ten zapis to, że zamiast mieć wszystko w dużym findAll to możemy zrobić for await w index.js
    static async findAllWithCursor(){
        // jeżeli zwracamy w metodzie asynchronicznej awaita to jest on niepotrzebny
        return todos.find(); // await niepotrzebny
    }    


    async update(){
        if(!this._id) {
            throw new ValidationError('Todo has no ID');
        }

        this._validate();

        await todos.replaceOne({
            _id: this._id, // czego szukamy aby podmienić
        }, {
            title: String(this.title), // rzutowanie; dane które zmieniamy
        })
    }
}


module.exports = {
    TodoRecord,
}