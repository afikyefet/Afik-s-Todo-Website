import { TodoPreview } from "./TodoPreview.jsx"
const {useState, useEffect} = React
const { Link } = ReactRouterDOM

export function TodoList({ todos=[], onRemoveTodo, onToggleTodo }) {
    const [pageNumber, setPageNumber] = useState(0)
    const [todosPage, setTodosPage] = useState([])

    useEffect(()=>{
        setTodosPage(todosPage => todosPage = [...todos])
        console.log(todosPage);
    },[pageNumber])

    useEffect(()=>{
        console.log(todos);
    },[todos])

    function nextPage(ev){
        ev.preventDefault()
        setPageNumber(num => num + 1)
    }
    function prevPage(ev){
        ev.preventDefault()
        setPageNumber(num => num - 1)
    }

    return (
        <section>
            <button onClick={prevPage} hidden={pageNumber === 0}>prev page</button>
            <span>Page number: {pageNumber + 1} / {todos.length}</span>
            <button onClick={nextPage} hidden={pageNumber === (todos.length - 1)}>next page</button>
            {todos.length > 0 && todos[pageNumber].map((todo, idx) => {
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
    })}
        </section>
    )
}