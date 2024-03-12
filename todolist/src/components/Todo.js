import { useState } from "react";
import { db } from "../App/fb";
import { addDoc, deleteDoc, collection, doc, getDocs } from "firebase/firestore";

function Todo() {
    const [todoName, setTodoName] = useState("");
    const [todos, setTodos] = useState([]);
    const [importance, setImportance] = useState(0);
    const [errors, setErrors] = useState([]);

    const getTodos = async ()=> {
        const snapshots = await getDocs(collection(db, "todos"));
        console.log(snapshots);
    };

    useEffect(()=> {
        getTodos();
    }, []);

    const addTodo = async () => {
        const es = [];

        if(todoName.length === 0)
            es.push("You must fill out the 'Todo name' field");

        if(importance === 0)
            es.push("You must select the importance of the task!")

        setErrors(es);

        if(es.length !== 0)
            return;


        const todo = {
            TodoName: todoName,
            Importance: importance
        };

        const docRef = await addDoc(collection(db, "todos"), todo);

        todo.ID = docRef.id

        setTodos([...todos, todo]);
        setTodoName("");
        setImportance(0);
    };

    const deleteTodo = async (id)=> {
        try {
            await deleteDoc(doc(db, "todos", id));

            setTodos(todos.filter(todo=>todo.ID !== id));
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="container center-text" style={{display:errors.length === 0 ? "none" : "block"}}> 
            <div className="error-messages">
                {
                    errors.map((e, i)=>
                    <div key={i} className="error-message">{e}</div>
                    )
                }
            </div>

            <h3>Todo name</h3>
            <input onChange={e => setTodoName(e.target.value)}
                value={todoName} type="text" className="center-input w-350" />

            <h3>Todo importance</h3>
            <select value={importance} className="center-input"
                onChange={e => setImportance(parseInt(e.target.value))}>
                <option value={0}>Select Importance!</option>
                <option value={1}>Less important</option>
                <option value={2}>More important</option>
                <option value={3}>Highly important</option>
            </select>

            <button className="center-input"
                onClick={addTodo}
            >Add todo</button>

            <ul className="todo-list">
                {
                    todos.map((t, i) => {
                        let cls = "less-important";

                        if(t.Importance === 2) {
                            cls = "more-important";
                        } else if(t.Importance === 3) {
                            cls = "highly-important";
                        }

                        return <li key={i} className={cls}>
                            <div>{t.TodoName}</div>
                            <button onClick={()=>deleteTodo(t.ID)}>Delete</button>
                            </li>
                    })
                }
            </ul>
        </div>
    );
}

export default Todo;

/*
Ez megint egy todo applikáció lesz, csak ezt majd adatbázisban fogjuk tárolni!!!!!!!!!!!!!!!!!!!
megcsináljuk azokat a dolgokat, amik szükségesek egy todo-hoz 
1. egy input mező, ahova felvisszük, hogy miket kell csinálni 
2. importance - hogy milyen fontos a dolog, amit felvittünk 
    ez egy select mező optionökkel!!!!!!!!!!!!!!!!!!!!!!!!!!!
3. button - hogy felvigyük a dolgokat

így fog kinézni, fontos, hogy az első option az a Select importance legyen!!!!!!!!!!!!!!!!!!!

böngésdzőben a firestore-ban van egy olyan, hogy Firebase Database vagy Cloud Firestore!!!!!!!!!!!!!!!!!!!!!!!!
1. Create database (Location-t azt itt átállítjuk Europe-ra, ne United States)
2. Start in test mode és akkor itt rámegyünk, hogy create

Itt collection-öket tudunk készíteni
A collection az egy dokumentumgyüjtemény, mert ez egy ugynevezett sqr databázis, ez gyakorlatilag JSON fájlokban!!!!!!!!!!!!!!!!!!
taárolja magát az adatbázisunkat, kulcs-értékpárokban 
olyan, mint itt a package.json-ban 
{
  "name": "todolist",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
ilyen formátumban tárolja magát az adatbázist!!!!!!!!!!!!!!!!!!!!!!!!

Azt mondjuk, hogy start collection 
1. itt meg kell adni egy collection id-t (mondjuk todo_list)
2. és akkor ebben a collection-ben ilyen dokumentumok lesznek(generálunk egy auto id-t, hogy mi legyen a neve)
-> ez lesz a dokumentumnak az egyedi azonosítója 
még ugyanitt ki tudjuk vélasztani, hogy mi legyen benne 
   field                       type                            value 
  TodoName                    string                          mosogatas
 Importance                   number                             3 (mondjuk, itt legyenek a dolgok 1-3-ig)

A type-nál mindenféle adattípusok vannak pl. string, number, boolean, map, array
string - az egy karakterlánc, boolean, number, array egyértelmű 
map - kulcs-értékpár típus 
null - az az üres 
timestamp - datatime-os dolog 
geopoint - ezzel lehet koordinátákat tárolni (hosszúságú és szélességi fokok)
reference - ezzel lehet más dokumentumokra referálni!!!!!!!!!!!!!!!
és akkor felvesszük azokat a dolgokat, amikre nekünk ebben a todo-ban szükségünk lesz (todo, importance), feljebb 

és most egy dolumentumot fogunk elkészíteni, nem egy sémát 

Elkészült egy todo_list nevű colectionünk, amiben van egy dokumentum(azzal a névvel vagy id-val, amit generáltunk)
és azután meg ott lesz, hogy mik találhatóak benne 
Importance: 3 
TodoName: 'mosogatas'

Ezt a dokumentumot ki is töröljük, szóval csak egy üres collection fog megmaradni 
Majd a programunkkal fogunk felvinni dokumentumokat!!!!!!!!!!!!!!!!!!!!!!!
*************************************************************************************************************************************
Mire lesz szükségünk itt ebben a todo-ban 
1. egy useState-s változó todoName-re const [todoName, setTodoName] = useState("");
egy useState-s változó, ami maga a lista, egy tömb, ami tartalmazza a todoName-ket -> const [todos, setTodos] = useState([]);
meg egy importance useState-s változó, aminek az értéke az alapból nulla lesz -> const [importance, setImportance] = useState(0);

Szóval ez a 3 useState -> !!!!!!!!!!!!!!!!!!!!!!!!!!
    const [todoName, setTodoName] = useState("");
    const [todos, setTodos] = useState([]);
    const [importance, setImportance] = useState(0);

2. az fb.js-ben csináltunk egy forestore objektumot, amit db-nek neveztünk el 
ezt be kell importálni!!!!
-> 
import { db } from "../App/fb";
és firestore-ból ezeket a különboző beépített dolgokat importáljuk 
  - addDoc -> amivel hozzá tudunk adni dolumentumokat ehhez az adatbázishoz, amit csináltunk (todo_list collection)
  - deleteDoc -> töröljük
  - collection -> ami egy teljes collection, mint nálunk a todo_list, azt reprezentálja 
  - doc -> ez egy dolumentumot reprezentál, ami bent van a collection-ben 
  - getDocs -> ami több dokumentumot tud nekünk lehozni, gyakorlatilag az összeset 

import { addDoc, deleteDoc, collection, doc, getDocs } from "firebase/firestore";

3. Hogy tudunk hozzáadni, erre készítünk egy addTodo metódust 
    const addTodo = async ()=> {
        const docRef = await addDoc();
    };
Ez az addDoc vár két paramétert 
1. egy collection, collection (az egy ilyen collection reprezentál), de honnan tudja, hogy melyik collectionről van szó 
elöször is megadjuk neki a db-t, hogy tudjon az adatbázishoz csatlakozni!!!!!!!!!!!!!!!!!!!!!!!!!! 
és másodszor pedig beírjuk neki a collection nevét "todos", amit szeretnénk neki adni 
collection(db, todos)
2. a második paraméter egy objektum, aminek beállítunk különböző kulcsértékpárokat
pl. {
    todoName: "asdf"
    Importance: 3
}
és van egy visszatérési értékünk, ez a docRef és innen tudjuk meg pl. a dokumentumnak az id-ját 
cosnt addTodo = async ()=> {
    const docRef = await addDoc(collection(db, "todos"), {
        TodoName: "asdf",
        Importance: 3
    });

    console.log(docRef);
};

felmegyünk az App.ja-re, itt behívjuk a Todo-t 

Azt szeretnénk, hogy gombnyomásra ez a megadott nevű todo ez felmenjen 
ezért a button-nek megadjuk onClick(addTodo)
    <button onClick={addTodo}
    >Add todo</button>

most ugye csak kézzel megadtunk neki értéket, szóval tökmindegy, hogy mi van az input mezőkben 
        TodoName: "asdf",
        TodoImportance: 3

és ha most megnyomjuk a gombot, akkor meg kell, hogy jelenjen a Cloud Forestore-ban 
Collection                      Document                              Fields
  todos                      XEJGEIM54543jigef                      Importance: 3
                                                                   TodoName: "asdf"

És az a furcsa, hogyha a Cloud Firestore-ban kitöröljük a collection 
itt pedig a gombnyomással megadjuk neki, akkor ujra megcsinálja 

docRef az a dolog, ami számunkra érdekes, elöszöris van egy id
DocumentReference {.....}
converter: null
type: "document"
_key: DocumentKey {path: ResourcePath}
id: "vsinNUFD4t5er"
parent: (...)
path: (...)
[[Prototype]]: Object

Szóval itt az id lesz a fontos ebben a függvényben -> 
    const addTodo = async ()=> {
        const docRef = await addDoc(collection(db, "todos"), {
            TodoName: "asdf",
            Importance: 3
        });
    
        console.log(docRef.id);
    };
!!!!!
Azért lesz fontos, mert itt berakosgatjuk az id-kat
Szóval, hogyha nyomunk egy gombot, akkor a Cloud Firestore-on csinál egy documentumot, azzal a dologgal, ami benne van, 
itt a mi esetünkben mindig ezt TodoName: "asdf", Importance: 3 lesz, mert ezt kézzel vittük be, de majd ha ez hozzá lesz kötve a jsx 
elemekhez, akkor ugye az lesz a TodoName meg az Importance amit ott beírunk meg kiválasztunk 
most, hogy néz ki ez az egész, úgy, hogy kézzel van kitöltve, tehát a field, az mindig ugyanaz marad, de a Document mindig kap egy id-t 
minden gombnyomásra!!!! -> (ugye a collection todos nem változik )
Collection                      Document                              Fields
  todos                      XEJGEIM54543jigef                      Importance: 3
                                                                   TodoName: "asdf"
                            MFCbudvufbn3439543g                     Importance: 3
                                                                   TodoName: "asdf"
                            NKCDjvnbdf34545nugnf                     Importance: 3
                                                                   TodoName: "asdf"

És ezt nekünk úgy kell megcsinálnunk
1. Az input mezőnek adunk egy onChange-t, amivel TodoName useState-s változót frissítjük, megkapja azt az értéket, ami be van írva 
az input mezőben 
onChange={e=>setTodoName(e.target.value)} 
Itt fontos, hogy ami az input mezőben található, az legyen az értékünk   
!!!! meg kell adni az input mezőnek value-ként a todoName-et!!!!!!!!!!!!!!!!!!!!!!!!!!     
2. select-ben, csinálunk még optionöket, ugye az első option mező (Select an importance) az lesz a value={0} és még lesz  
3 darab fontosság, aminek a value.ja 1,2,3 lesz és még nagyon fontos, hogy a select mező is kap egy onChange-t, ugyanugy, mint a 
todoName, csak itt ugye az importance useState-s vőáltozónak az értékét szeretnénk kiszedni belöle és még hogy itt a select mezőnek is 
legyen egy értéke, ami az importance lesz 
->                                 
    <select value={importance} 
    onChange={e=>setImportance(e.target.value)}>
        <option value={0}>Select Importance!</option>
        <option value={1}>Less important</option>
        <option value={2}>More important</option>
        <option value={3}>Highly important</option>
    </select>
Tehát itt fontos három dolog, hogy be legyenek állítva a value-k az option-öknek és az onChange és a value pedig a select mezőnek!!!!!!!!!

így néz ki most a jsx elemek a returnben -> 
    <div className="container">
        <h3>Todo name</h3>
        <input onChange={e=>setTodoName(e.target.value)} 
        value={todoName} type="text" />

        <h3>Todo importance</h3>
        <select value={importance}
        onChange={e=>setImportance(e.target.value)}>
            <option value={0}>Select Importance!</option>
            <option value={1}>Less important</option>
            <option value={2}>More important</option>
            <option value={3}>Highly important</option>
        </select>
*******************************************************************************************************************************************
Adunk neki valamilyen kinézetet a css-ben 
megcsináltuk az alapbeállításokat
1. container (max-width, padding, margin: auto)
2. Ezenkívül csináltunk még egy center-input-ot (amit majd meg fog kapni az input mező, button és a select)!!!!
    display: block, hogy be tudjuk majd tenni középre
    margin: 10px auto -> ez teszi be majd középre horizontálisan, meg 10px lesz alul-felül a távolság az elemektől 
    padding: 8px -> meg ennek is adtunk egy padding-et, miért jó a padding -> elmagyarazas.js
3. Csináltunk egy center-text-et, amit majd megadunk a container-nek, hogy a benne lévő text (<h3>Todo importance</h3>, <h3>Todo name</h3>)
az is középen legyen a containerben, ne csak azok a dolgok, amik megkapták a center-input-ot (input meg a select)
    text-align: center
4. Csináltunk külön egy w-350 
    width: 350px;
Ezt majd megadjuk az input mezőnek és ez majd azért kell, mert ha felhasználó valami hosszabb szöveget akar beírni, akkor az kiférjen 
*******************************************************************************************************************
És akkor most beírunk valamit az input mezőben pl. azt, hogy kutyasetaltatas 
és mivel az input mezőnek a value-ja, az hozzá van kötve a todoName-hez, ezért azt megkapja értéknek 
így fog kinézni a böngészö konzol elements-nél az input mező, miután beírtuk azt, hogy kutyasetaltatas
<input class="center-input w-350 type="text" value="kutyasetaltatas">
Tehát ott a value-ben már meg is jelent az amit beírtunk oda

és mivel a függvényben még a kézzel beír verzió maradt, ezt át kell írni, arra, hogy megkapja a useState-s változók értékét(todoName, importance)
    const docRef = await addDoc(collection(db, "todos"), {
        TodoName: "asdf",
        Importance: 3
    });

    ->

    const docRef = await addDoc(collection(db, "todos"), {
        TodoName: todoName,
        Importance: importance
    });

ha most beírunk neki valamit az input mezőben pl. kutya sétáltatás és kiválasztunk neki egy importance-t pl. 2 
és felvisszük, akkor ez ilyen formában fog megjelenni a Cloud Firestore-ban 
ugye ez a todos collection-be megy, mert ezt adtuk meg neki az addDoc beépitett függvényben 
és ami a 2-dik paramétere, ennek pedig az amit itt csináltunk objektum, amihez hozzá van adva a useState-s változók(todoName, importance)
a kulcsok meg az lesznek, amit mi akarunk (de nyilván azt írtuk, hogy TodoName meg Importance, hogy tudjuk miről van szó) ez lesz a field
és ennek a docRef-nek van egy id-ja, amit generál, minden eggyes feltöltésnél, gombnyomásnál 
így fog kinézni ->
Collection                      Document                              Fields
  todos                      DFBFU45hunf34334                      Importance: "2"
                                                                   TodoName: "kutya sétáltatás"

még az a hiba, hogy az importance az egy string lett nem egy number, ezért az importance-t, amikor setteljük, akkor parseInt-eljük 
hogy az importance useState-s változó már egy number legyen és akkor a Cloud Firestore-ban is egy number lesz!!!!!!!!!!!!!
->
onChange={e=>setImportance(parseInt(e.target.value))}>
kiprobáltuk, felvittünk egy valamit (mosogatas), aminek kiválasztottunk egy 1 importance-t és ez már number lett nincs ""
-> 
Collection                      Document                              Fields
  todos                      JFDBH4545nfdhb3f                      Importance: 1
                                                                   TodoName: "mosogatas"

és, akkor ezeket a dolgokat, amiket felvittünk a Cloud Firestore-ba, ezeket ki is lehet ott törölni (delete document)
********************************************************************************************************************************
Mi az aminek még itt végbe kellene, hogy menjen, annak, hogy ezeket a dolgokat hozzá kell adni a todos-hoz 
-> const [todos, setTodos] = useState([]);
de fontos, hogy úgy, hogy a todos-ban is bent kell, hogy legyen az id!!!!!(docRef.id), mert ha nincsen benne, akkor 
nem tudunk majd törölni, mert az id, az szükséges a törléshez 
-> 
Ezért csinálunk egy todo nevű objektumot (addTodo async függvény elejére), amivel majd setteljük a todos useState-s változót!!!!
    const addTodo = async ()=> {
        const todo = {
            TodoName: todoName,
            Importance: importance
        };

        const docRef = await addDoc(collection(db, "todos"), todo);

        todo.ID = docRef.id
    
        setTodos([...todos, todo]);
        setTodoName("");
        setImportance(0);
    };

3 változtatást csináltunk 
1. csináltunk ezt a todo objektumot és majd ezt fogjuk megadni a docRef addDoc második paraméterének 
az teljesen, mindegy, hogy ezt az objektumot második paraméternek hozzuk létre vagy elöbb, amit majd átadunk második paraméternek 
ahogy itt van most 
2. az id-ra majd szükségünk lesz, de ezt az id-t majd csak a docRef függvényből fogjuk megkapni, hiszen ennek van egy olyanja, hogy id
todo.ID = docRef.id
és amikor már meg van ez az id, akkor csak azt mondjuk, hogy todo.ID = docRef.id
tehát a docRef.id, amit ebből a docRef-ből megszereztünk, azt átadjuk majd a todo tömbnek, amit legfelül csináltunk, úgy, hogy 
csinálunk neki még egy kulcs-értékpárt, ennek az objektumnak, a kulccsa az ID lesz az értéke pedig a docRef.id
3. már csak az a dolgunk, hogy setteljük a todos változót, ami egy tömb, ezzekkel a objektumokkal, amiket majd készítünk, úgyhogy 
beírunk valamit az input mezőben ez lesz a TodoName értéke, meg importance-t is kiválasztunk, ez lesz az Importance értéke és 
még, amikor megkaptuk az id-t akkor lesz egy id is, aminek az értéke a docRef.id
és ezzel a todo objektummal frissítjük a todos-t -> setTodos([...todos, todo]);
ezt úgy updateljük, hogy kibontjuk a dolgokat a spread operator-val, amik benne vannak a todos tömb-be, 
majd hozzáadjuk a todo-t(objektum), amit itt csináltunk 
leírás -> elmagyarazas.js

Ráadusul itt ég azt is meg kell csinálni, hogy kiüritsük az input mezőket, mert ha benne marad az adat, az nem olyan szép
meg az importance-t is nullának, alapértéknek megadjuk 
ezért miután setteltük a dolgokat a todos useState-s változóban, azután kiürítjük 
és mivel ez hozzá van kötve ugye value-val a jsx elemekhez (input, select), ezek a useState-s változók (todoName, importance)
ezért, úgy tudjuk őket üríteni, hogy ezeknek a useState-s változóknak beállítjuk az értékét miután betöltöttünk mindent a todos 
useState-s tömbünkbe -> 
    setTodoName("");
    setImportance(0);
****************************************************************************************************************************************
És akkor már szépen, megjelennek a dolgaink a Cloud Firestore-ban a todos collection, minden elem, document kap egy külön id-t 
és ott lesznek a fields-ek 
fontos, hogy itt a fields-nél nem lesz id!!!, csak azok a dolgok amiket csináltunk ebben ->
        const todo = {
            TodoName: todoName,
            Importance: importance
        };
mert ezt adjuk meg a const docRef = await addDoc(collection(db, "todos"), todo);
és csak utána egészítjük ki ezt az objektumot az id kulcs-értékpárral -> todo.ID = docRef.id
amivel ugye updateljük a helyi todos useState-s változónkat és akkor az majd csak itt fog megjelenni 
*************************************************************************************************************************
és azt szeretnénk, hogy megjelenítsük azokat a dolgokat, amik itt vannak a todos useState-s tömbben a return-ben jsx elemként
méghozzá egy listában (ul, li) 
    {
        todos.map((t, i) =>
            <li key={i}>{t.TodoName}</li>
        )
    }
és akkor ezt a szokásos módon csináltuk, fontos, hogy legyen {} kapcsoszárójel és akkor ebben a kapcsoszárójelben 
csináljuk a todos tömbre a map-ot, ami fogad egy t meg egy i és akkor szokásos módon megadjuk az i key-nek és nem 
a t íratjuk ki, mert ez egy objektum, nekünk annak az objektumnak csak a TodoName-e kulcsa kell!!!!!!!
**************************************************************************************************************
és akkor szépen kiírta, de ezt is meg kell majd formázni css-ben 
todo-list, amit megadtunk az ul-nak className-ként meg az ebben lévő li-ket is 
    
1. todo-list kapott 
    - egy max-width: 500px-et, tehát nem lehet ez szélesebb, mint 500px
    - meg egy margin: 15px auto-t, hogy 15px-re legyen a körülőtte lévő elemektől és, hogy horizontálisan középen legyen 

2. todo-list li pedig kapott 
    - egy magasságot (height: 40px)
    - display: flex-et, mert itt amellett, hogy ki akarjuk írni, hogy mi a teendő (todoName), amellett még azt is szeretnénk, hogy
    legyen egy button is a teendő melett, ezért kell a displax: flex
    - és ha ez a két dolog most már horizontálisan egymás mellett lesz még azt is szeretnénk, hogy különöljenek el egymástól 
    ezért kap egy justify-content: space-between, hogy horizontálisan az elején legyen a teendő a végén meg a button
    - és ha már be van állítva a horizontális elhelyezkedés, akkor az align-items (center) meg beállítjuk ezt középre
    vertikálisan
.todo-list {
    max-width: 500px;
    margin: 15px auto;
}

.todo-list li {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center; 
    padding: 5px;
}

és még azt szeretnénk, hogy attól függően, hogy egy teendő milyen fontos, tehát, hogy milyen importance van neki beállítva 
kapjon egy háttérszínt (mondjuk szürke a less important, narancssárga a more és a highly meg piros)
ezért létrehoztunk 3 class!!!!! background-color-val és border-vel
**********************************************************************************************
a mapba beleteszünk egy {} és ha az benne van, akkor kell a return is!!!!!!!!!!!!!!
mert ha nincs ott a {}, akkor az a rész maga a return de ha viszont ott van a {}, akkor ez egy eljárás és kell a return!!!
és ez {} azért kell, mert itt több dolgot is szeretnénk csinálni 
-> 
    {
        todos.map((t, i) => {
            let cls = "less-important";

            if(t.Importance === 2) {
                cls = "more-important";
            } else if(t.Importance === 3) {
                cls = "highly-important";
            }

            return <li key={i} className={cls}>{t.TodoName}</li>
        })
    }
Fontos, hogy itt a map-on belül létrehoztunk egy változót, aminek az az értéke, hogy less-important 
szóval alapból ez lesz az értéke, de viszont, hogyha (if) a t.Importance az === 2, tehát a második importance van 
kiválasztva, akkor ez a változónak az értéke more-important-ra módosul, if else, ha viszont a t.Importance az === 3
akkor a cls változó highly-important lesz 
!!!!! és akkor a az li-nek megadjuk className-ként ezt a cls változót 
Szóval az importance-től függően lesz beállítva az li-nek a className-je, ezeket a class-okat, ugye megcsináltuk más 
színnel már css-ben pl. a highly-important 
->
.highly-important {
    background-color: #ff6a00;
    border: 1px solid #da5b00;
}
*******************************************************************************************************************************
Most le szeretnénk szedni a dolumentumokat az adatbázisból (Cloud Firestore)
-> erre készítünk egy getTodos-t!!!!
ezt majd a getDocs segítségével tesszük és a getDocs az vár nekünk egy collection-t, mert ez a dokumentumokat fogja leszedni 
egy bizonyos collection-ből, a mi collectionünk pedig a todos és kell még a db is, hogy tudjunk csatlakozni az adatbázishoz 
és beírjuk, hogy a todos adatbázisból jönnek ezek le 
tehát, így fog kinézni a getDocs(collection(db, "todos"))
így néz ki az egész függvény, amit meghívunk egy useEffect-ben 
-> 
    const getTodos = async ()=> {
        const snapshots = await getDocs(collection(db, "todos"));
        console.log(snapshots);
    };

    useEffect(()=> {
        getTodos();
    }, []);
console.log(snapshots), mi lesz a snapshots ->
QuerySnapshot 
    netdata: ...
    query: ...
    _firestore: ...
    _snapshots: ...
    _userDataWriter: ...
        docs: Array(5)
    [[Prototype]]: Object
lejött nekünk a database snapshot és ebből nekünk docs(dokumetumok) a fontossak, többi az mindegy!!!!!!!!!
És akkor a dokumentumokból fogjuk betölteni az adatokat a todos tömbünkbe!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Méghozzá ebben a database-ben megtalálható a dokumentomunk id-ja, tehát ha lenyitjuk a docs-ot ott lesz egy olyan, hogy _document
és annak van egy data-ja!!!!!!!
ezért ebben a függvényben (getTodos) csinálunk egy olyan változtót, hogy todoData
const todoData = snapshots.docs.map() 
A map az azt csinálja, hogy visszaad egy tömbben értékeket 
és ha ide azt írnánk be, hogy snapshots.docs.map(a=>1) 
lebontásban, hogy mi micsoda 
1. snapshots -> az egy firestore query, amit a getDocs-val kaptunk meg 
2. snapshots.docs -> ennek a snapshots-nak objektumnak van egy olyan kulcsa, hogy docs, amiben van a data, ami majd nekünk kell
3. map meg végigmegy a tömbön és ugye map csinál egy tömböt, ugyanolyan hosszúságut, mint a tömb, amin végigmegy és mindegyiknek 
az értéke egy lesz, szóval egy tömb tele egyesekkel 

Visszaad egy tömbben értékeket, snapshots.docs.map(a=>1), az lenne mindig egy-egy dokumentum, végigmegy szépne rajta egyenként 
és akkor egy csomo eggyes lenne a todoData az értéke egy tömbben 
de nekünk nem ez kell, hanem az, hogy kiszedjük minden egyes dokumentumnak az id-jét 
ezért -> 
const todoData = snapshots.docs.map(doc => ({ ID: doc.id, ...doc.data() }));
Tehát itt végigmegy a dokumentumokon és csinálunk egy objektumot, amiben kiszedi az id-t, minden eggyes dokumentumnak 
ez a része, meg ...doc.data azért kell, mert, hogy megtartsa vagyis beletedje abba az object-be, amit most mi csináltunk az id-val 
az összes többi dolgot, ami még benne van ebbe a dokumentumban, valahogy így -> 
{
  ID: 'documentID',
  field1: 'value1',
  field2: 'value2',
  // ... more fields
}
Tehát létrehozunk egy id nevű kulcsot, ami a doc.id-ját fogja felvenni, mint értéket és a ...doc.data() pedig annyit tesz, 
hogy a data-nak az adatait szépen kibontja, a data pedig egy kulcs-értékpár, egy objektum és ezeket az adatokat fogja tartalmazni, hogy 
importance és todoName és ide szépen kibontjuk 
és akkor, így szépen összeraktuk ezt az objektumot, belerakosgattuk a todoData-ba 
és akkor innentől kezdve, már csak annyit kell mondanunk, hogy a todos helyi useState-s változonkat setteljük erre a todoData-ra,
ami tartalmazni fogja akkor az id-t meg a todoName-t és az importance-t 

és így már meg is jelennek azok az adatok, amik fent vannak a Cloud Firestore-ban és akkor, olyan színt kapnak, mint amilyen 
importance meg van adva nekik 
*************************************************************************************************************************
és akkor még szükségünk van egy törlés gombra, hogy a teendőket ki tudjuk, törölni, ugye ezért csináltuk a display: flex-et 
a todoName-t beletettük egy div-be és mellé betettünk egy button-t, delete szöveggel 

    return <li key={i} className={cls}>
        <div>{t.TodoName}</div>
        <button>Delete</button>
        </li>

és ahozz, hogy ezeket a teendőket majd ki tudjuk törölni, ahhoz csinálunk egy függvényt (deleteTodo)
amit majd megadunk ennek a button-nek 
a törlést pedig a deleteDoc-val tudjuk megoldani és a deleteDoc vár nekünk egy doc()-ot, dokumentumot 
és a doc-ban pedig azt mondjuk, hogy a db-vel csatlakozzon az adatbázishoz ez a dokumetum todos collection-ben van benne 
és az id-ja pedig az lesz, amit a deleteTodo-ból az id paraméterből megkap 
és ennek nincsen visszatérési értéke (promise void)!!!!! tehát nem kell a const valami, amiben lementenénk a visszatérési értékét 
3 paramétert vár a docs tehát 
1. db (db, hogy csatlakozzon az adatbázishoz)
2. todos (collection neve)
3. id (amit majd megkap a függvény paraméteréből)

és úgy érdemes, megcsinálni az összeset ugy érdemes megcsinálni, hogy benne legyen egy try-catch blokban
-> 
const deleteTodo = async (id)=> {
    try {
        await deleteDoc(doc(db, "todos", id))
    } catch(err) {
        console.log(err);
    }
}
és akkor ezt átadjuk a button-nek egy onClick-vel, méghozzá ilyen arrow function formában, hogy ez ne akkar hajtodjon végre, 
amikor a komponens betöltödik, hanem akkor, amikor meg van hívva a függvény, amit szeretnék 
fontos!!!!
itt át kell adni a függvénynek az id-t, mert az ugye várja paraméterként és majd az lesz a docs-ban a harmadik dolog amit meg kell adni 
ezért ezt mi itt átadjuk neki, méghozzá olyan formában, hogy t.ID!!!!!!! 
-> 
<button onClick={()=>deleteTodo(t.ID)}>Delete</button>
mert ugye a todos helyi useState-s változónak, amin itt végigmegyünk a map-val, annak megadtuk az id-t, ugye ezzel a snapshot-os 
dologgal, tehát abban bent van mindegyik dokumentumnak az id-je, itt mi egy másik map segítségével létrehoztunk egy todoData-t 
aminek van egy olyan kulcsa, hogy id és azzal pedig setteltük a todos helyi változónkat, tehát már abban is ott van az id
és akkor itt mi ez az id alapján töröljük azt a bizonyos elemet, amit akarunk a deleteTodo segítségével, ami meg a ugye ezt a 
deleteDoc-val törli ki majd a Cloud Firestore-ból 
*******************************************************************************************************************************
ez igy még nem lesz jó, mert nem akkor törölte az elemet, amikor rányomtunk a gombra, hanem amikor utána frissítettük az oldalt 
Nekünk ilyenkor két lehetőségünk van, hogy a törlésnek a ténye az megerősítve legyen a felhasználó számára, tehát ténylegesen eltünjön
innen 
1. Leszedjük az összes todo-t újra, de ez a rosszabb megoldás, mert hogyha tudjuk, hogy le van törölve, mert nem mentünk be a catch
ágba a deleteDoc után, akkor csinálhatjuk azt, hogy ->
setTodos(todos.filter(todo=>todo.ID !== id))
Tehát végigmegyünk a todo-kon és filterrel kiszürjük azokat, amiknek az id-ja az nem az amit kitöröltünk 
mert ugye itt a deleteTodo-ban az id-t azt megkapja paraméterként a t.ID (todos-tömbböl) 
és akkor itt megnézi, egyezik-e az id-ja annak, amit kitöröltünk 
majd a todos a setTodos-val updateli, azokkal, amik ugye nem lettek kitörölve
a filter is csinál egy új tömböt és akkor ebben az esetben azok az elemek (todos) lesznek benne amiknek az id-ja ugye nem egyezik meg 
annak az id-jével amit ki lesz törölve!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

és ha most újratölti az oldalt, akkor csak a legfrissebeket fogja leszedni, azokat amik benne vannak az adatbázisban és ha most 
megnyomjuk a delete-t, akkor ténylegesen eltűnik a böngészőben és az adatbázisból is el fog tünni 
*************************************************************************************************************************************
Még azt lehet viszont csinálni, hogyha nem írunk be semmit és rányomunk a gombra, akkor is fel fog vinni egy üres valamit 
és éppen ezért kell egy errorhandling, tehát jelezni a felhasználó számára, hogy valami hülyeséget csinál 
ezért csinálunk egy errors useState-s változót, aminek az értéke egy tömb lesz
->
const [errors, setErrors] = useState([]);
és akkor ezt az addTodo-ban kell majd megcsinálnunk, hiszen, itt adjuk hozzá a dolgokat a collection-höz 
1. létrehozunk egy üres tömböt (es)
2. if-ben ha a todoName length-je az nulla, akkor itt es.push és ida beírjuk, a megfelelő hibaüzenetet
és csinálunk egy másik hibaüzenetet is, ha a felhasználó nem választott importance-t és akkor ide egy másik hibaüzenet lesz push-olva 
Szóval, ha a felhasználó nem töltötte ki, illetve nem választott importance-t, akkor mindegyik hibaüzenet be lesz push-olva ebbe a 
tömbbe, de ha viszont, csak az egyik nem teljesül, akkor annak a hibaüzenete, ezeket meg meg lehet jeleníteni a return-ben 
miután set-teltük az error-t 
és a végén meg azt mondjuk setErrors(es)
ott keletkezik mindig egy üres tömb és nem megyünk be az if ágakban, tehát nincsen error, de korábban már voltak hibák akkor 
a setErrors-val üresre állítjuk a tömbünket!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
tehát akkor ha valaki probálkozik és jól kitölt mindent, akkor nem fognak megjelenni ezek a hibaüzenetek, mert nem mentünk 
be akkor már semelyik if ágba a tömb meg üres lesz 
Ha pedig az es-nek a length-je nem egyenlő nullával, akkor return, hogy ne probálja meg felvenni az üres mezőket 
->
    const es = [];

    if(todoName.length === 0)
        es.push("You must fill out the 'Todo name' field");

    if(importance === 0)
        es.push("You must select the importance of the task!")

    setErrors(es);

    if(es.length !== 0)
        return;

és akkor a return-ben legfelül a containeren belül pedig kiírjuk ezeket a hibaüzeneteket 
            <div className="error-messages">
                {
                    errors.map((e, i)=>
                    <div key={i} className="error-message">{e}</div>
                    )
                }
            </div>
className lapján meg megformázzuk őket css-ben 
.error-messages {
    max-width: 500px;
    margin: 15px auto;
    background-color: #efefef;
    border: 1px solid #d8d8d8;
    padding: 15px;
}

.error-message {
    background-color: #e1300d;
    border: 1px solid #c32a0c;
    border-radius: 5px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    margin-bottom: 10px;
}

Fontos, azt szeretnénk, hogy ez az egész csak akkor jelenjen meg, hogyha az errors-ban van valami!!!!!!
mert különben ott lesz egy szürke valami 
ezt ugy lehet megoldani, hogy csinálunk egy display: block-ot az className="error-messages" div-nek 
-> 
<div className="container center-text" style={{display:errors.length === 0 ? "none" : "block"}}> 

ezt style-val megcsináltuk, hogyha az errors tömbnek a length-je az nulla, akkor display: none legyen, tehát ne jelenjen meg 
egyébként meg jelenjen meg display: block-ként!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
************************************************************************************************************************************
Ha most kitörlünk valamit a firestore-ban, akkor az csak akkor fog kitörlödni a böngészőben is 
ha frissítjük az oldalt, mert ez adatbázisból fog lejönni, tehát nem azonnal törlödik, amikor mi kitöröljuk firestore-ból 

Végigmegyünk az egészen 
App.js-ben 
getFirestore(app)
Ezzel kapjuk meg az adatbázis csatlakozáshoz szükséges firestore objektumonkat 
az import { addDoc, deleteDoc, collection, doc, getDocs } from firebase/firestore
Ezek a firestore-nak a beépített függvényei 
1. addDoc - ezzel tudunk egy dokumentumot felrakni az adatbázisba 
2. deleteDoc - adatbázisból törlés 
3. collection - ez reprezentál nekünk egy collection-t, mint ez a todos, ez egy dokumentumgyüjtemény gyakorlatilag 
4. doc - az egy darab dokumentum 
5. getDocs - pedig arra szolgál, hogy egy bizonyos gyüjteményből leszedjük a dokumentumokat 

1. getTodos-ban van a getDocs - az mit vár nekünk -> 
egy collection-t, hogy tudja, hogy melyik collectionből kell neki a dokumentumokat leszedni 
Visszaad nekünk snapshot-okat, azon belül vannak dokumentumok 
és a dokumentumnak van id-je meg data-ja!!!!!!!
ezt belerakosgatjuk a todoData-ba és onnantól kezdve a setTodos-val pedig feltöltjük
nagyon fontos!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const getTodos = async ()=> {
        const snapshots = await getDocs(collection(db, "todos"));
        console.log(snapshots);
    };

    useEffect(()=> {
        getTodos();
    }, []);

2. addTodo függvény 
addDoc van benne - mit vár ->
egy collection-t és mellette még egy dokumentumot is, egészen pontosan egy objektumot, ami majd egy dokumentumot fog 
reprezentálni, aminek azok a kulcsai vannak, hogy TodoName és Importance 
és ez visszaad egy dokumentum referenciát, ami nekünk csak azért kell, hogy 
!!!!!!! a dokumentumnak az id-ját (azokat a random generált stringeket a firestoreban) megszerezzük, mert ez alapján tudunk
törölni meg pl. update-elni is, tehát a docRef alapján tudunk törölni és updatelni is!!!!!!!!!!!


   const addTodo = async () => {
        const es = [];

        if(todoName.length === 0)
            es.push("You must fill out the 'Todo name' field");

        if(importance === 0)
            es.push("You must select the importance of the task!")

        setErrors(es);

        if(es.length !== 0)
            return;


        const todo = {
            TodoName: todoName,
            Importance: importance
        };

        const docRef = await addDoc(collection(db, "todos"), todo);

        todo.ID = docRef.id

        setTodos([...todos, todo]);
        setTodoName("");
        setImportance(0);

3. deleteDoc 
Ez már nem egy collection-t vár, hanem egy dokumentumot, a dokumentum(doc), pedig azt várja tólünk 3 paraméter
1. db -> hogyan csatlakozzon az adatbázishoz 
2. "todos" -> mi a collection 
3. id -> és mi a dokumentum id-ja a collectionön belül 

    const deleteTodo = async (id)=> {
        try {
            await deleteDoc(doc(db, "todos", id));

            setTodos(todos.filter(todo=>todo.ID !== id));
        } catch(err) {
            console.log(err);
        }
    }
********************************************************************************************************************************************
!!!!!!!!
beírtuk a terminálba, hogy npm run build 
és miután build-eljük azután deploy-ojuk is és akkor meg tudjuk nézni élesben, hogy hogyan müködik adatbázisban 
firebase deployűmeg elötte kell a firebase init 
    itt kell az első firestore
    meg a harmadik, az első hostingos 
    build mappa kell majd nem a public

    és miután deploy-oltuk utána bemegyünk a project settingsbe 
    utána manage hostings (Linked Firebase Hosting Site)
    Domain és akkor arra rákattintunk 
*/