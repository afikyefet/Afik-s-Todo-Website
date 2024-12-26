import { TodoPreview } from "./TodoPreview.jsx"
const {useState, useEffect} = React
const { Link } = ReactRouterDOM

export function TodoList({ todos=[], onRemoveTodo, onToggleTodo }) {
    const [pageNumber, setPageNumber] = useState(0)

    useEffect(()=>{
        console.log("test");
        
    },[])

    useEffect(() => {
        console.log('Todos after reset:', todos);
    }, [todos]);

    function nextPage(ev) {
        ev.preventDefault();
        setPageNumber(num => Math.min(num + 1, todos.length - 1));
    }
    
    function prevPage(ev) {
        ev.preventDefault();
        setPageNumber(num => Math.max(num - 1, 0));
    }

    return (
        <section>
            <button onClick={(ev)=> prevPage(ev)} hidden={pageNumber === 0}>prev page</button>
            <span>Page number: {pageNumber + 1} / {todos.length ? todos.length : "1"}</span>
            <button onClick={(ev)=> nextPage(ev)} hidden={todos.length == 0 || pageNumber === (todos.length - 1)}>next page</button>
            {todos.length > 0 ? (todos[pageNumber] || []).map((todo, idx) => {
        return (
            <ul key={idx} className="todo-list">
                    <li key={todo._id}>
                        <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                        <section className="btn-container">
                            <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                            <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                            <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                        </section>
                    </li>
            </ul>
        );
    }) : <h2 style={{fontSize:'2em'}}>No todo's on the list...</h2>}
        </section>
    )
}