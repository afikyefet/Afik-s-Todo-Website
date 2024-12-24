import { TodoPreview } from "./TodoPreview.jsx"
const {useState, useEffect} = React
const { Link } = ReactRouterDOM

export function TodoList({ todos , onRemoveTodo, onToggleTodo }) {

    const [pageNumber, setPageNumber] = useState(0)
    const [todosPage, setTodosPage] = useState([])

    useEffect(()=>{
        setTodosPage(todosPage => todosPage = [...todos])
        console.log(todosPage);
        
    },[pageNumber])

    function nextPage(ev){
        ev.preventDefault()
        setPageNumber(num => num + 1)
    }
    function prevPage(ev){
        ev.preventDefault()
        setPageNumber(num => num - 1)
    }

    const todoPages = todos.map((todoPage, idx) => {
        return (
            <ul key={idx} className="todo-list">
                {todoPage.map(todo => (
                    <li key={todo._id}>
                        <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                        <section className="btn-container">
                            <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                            <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                            <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                        </section>
                    </li>
                ))}
            </ul>
        );
    });    

    return (
        // <ul className="todo-list">
        //     {todos.map(todo =>
        //         <li key={todo._id}>
        //             <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)} />
        //             <section className="btn-container">
        //                 <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
        //                 <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
        //                 <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
        //             </section>
        //         </li>
        //     )}
        // </ul>
        <section>
            {todoPages[pageNumber]}
    <button onClick={prevPage} disabled={pageNumber === 0}>prev page</button>
    <span>Page number: {pageNumber + 1} / {todoPages.length}</span>
    <button onClick={nextPage} disabled={pageNumber === (todoPages.length - 1)}>next page</button>
        </section>
    )
}