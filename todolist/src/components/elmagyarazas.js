<div className="container">
    <h3>Todo name</h3>
    <input
        onChange={e => setTodoName(e.target.value)}
        value={todoName}
        type="text"
    />

    <h3>Todo importance</h3>
    <select
        value={importance}
        onChange={e => setImportance(e.target.value)}
    >
        <option value={0}>Select Importance!</option>
        <option value={1}>Less important</option>
        <option value={2}>More important</option>
        <option value={3}>Highly important</option>
    </select>
</div>


/*
Todo Name Input:

<h3>Todo name</h3>: A heading indicating the purpose of the following input field.
<input onChange={e => setTodoName(e.target.value)} value={todoName} type="text" />: 
An input field where the user can enter the name of the todo. 
The onChange event is used to update the state (setTodoName) as the user types. 
The value attribute is set to todoName, ensuring that the input reflects the state.

Todo Importance Dropdown:

<h3>Todo importance</h3>: A heading indicating the purpose of the following dropdown.
<select value={importance} onChange={e => setImportance(e.target.value)}>: 
A dropdown (select element) where the user can choose the importance level of the todo. 
The onChange event is used to update the state (setImportance) when the user selects a different option. 
The value attribute is set to importance, reflecting the current state.
<option> elements: 
Dropdown options representing different levels of importance. 
The value attribute of each option corresponds to the associated importance level.
*/

/*
Megcsináltuk a container-t css-ben
*/
.container {
    max-width: 1080px;
    margin: auto;
    padding: 15px;
}
/*
max-width: 1080px; sets the maximum width of the container to 1080 pixels.
margin: auto; centers the container horizontally within its parent.
padding: 15px; adds 15 pixels of padding on all sides of the container.

Miért kell a padding a containerben ->

Adding padding to a container can serve several purposes in web design:

1. Aesthetic Design:

Padding provides space between the container's content and its border. 
It can enhance the visual appearance of the webpage by giving the content some breathing room.

2. Readability and Clarity:

Padding helps in separating the content from the container's edges. 
This separation can improve readability and make the content more visually distinct,
especially when there are elements like text or images within the container.

3. Responsive Design:

Adding padding can contribute to responsive design. 
When the screen size changes, having padding allows the content to be spaced out appropriately, 
preventing it from appearing too close to the container's edges.
*/
const addTodo = async ()=> {
    const todo = {
        TodoName: todoName,
        Importance: importance
    };

    const docRef = await addDoc(collection(db, "todos"), todo);

    todo.ID = docRef.id

    setTodos([...todos, todo]);
};
/*
Creating a Todo Object:
You create a todo object with TodoName and Importance properties based on the values of todoName and importance from the component's state.

Adding Todo to Firestore:
You use addDoc to add the todo object to the "todos" collection in Firestore. This returns a document reference (docRef).

Updating Todo with Document ID:
You update the todo object by adding a new property (ID) with the document ID obtained from Firestore.

Updating Component State:
You update the component's state (todos) by spreading the existing todos array and adding the new todo object to it. 
This is done using setTodos([...todos, todo]).
*/