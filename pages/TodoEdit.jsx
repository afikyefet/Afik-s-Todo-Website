import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import {
	loadTodos,
	saveTodo,
	setIsLoading,
	setSelectedTodo,
} from "../store/actions/todo.actions.js"

const { useState, useEffect } = React
const { useSelector } = ReactRedux
const { useNavigate, useParams } = ReactRouterDOM

export function TodoEdit() {
	const todo = useSelector((storeState) => storeState.todoModule.selectedTodo)
	const isLoading = useSelector((storeState) => storeState.todoModule.isLoading)
	const navigate = useNavigate()
	const params = useParams()
	const [todoToEdit, setTodoToEdit] = useState(todo)

	useEffect(() => {
		if (params.todoId) {
			setIsLoading(true)
			loadTodos()
				.then(() => setSelectedTodo(params.todoId))
				.catch((err) => {
					console.error("err:", err)
					showErrorMsg("Cannot load todo")
					navigate("/todo")
				})
				.finally(setIsLoading(false))
		} else {
			setTodoToEdit((todo) => (todo = todoService.getEmptyTodo()))
		}
	}, [params.todoId])

	useEffect(() => {
		if (todo && params.todoId) setTodoToEdit({ ...todo })
	}, [todo])

	function handleChange({ target }) {
		const field = target.name
		let value = target.value

		switch (target.type) {
			case "number":
			case "range":
				value = +value || ""
				break

			case "checkbox":
				value = target.checked
				break

			default:
				break
		}

		setTodoToEdit((prevTodo) => ({ ...prevTodo, [field]: value }))
	}

	function onSaveTodo(ev) {
		ev.preventDefault()
		setIsLoading(true)
		saveTodo(todoToEdit)
			.then((savedTodo) => {
				navigate("/todo")
				showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
			})
			.catch((err) => {
				showErrorMsg("Cannot save todo")
				console.log("err:", err)
			})
			.finally(setIsLoading(false))
	}

	if (isLoading) return <div>Loading...</div>

	const { txt, importance, isDone } = todoToEdit

	return (
		<section className="todo-edit">
			<form onSubmit={onSaveTodo}>
				<label htmlFor="txt">Text:</label>
				<input
					onChange={handleChange}
					value={txt}
					type="text"
					name="txt"
					id="txt"
				/>

				<label htmlFor="importance">Importance:</label>
				<input
					onChange={handleChange}
					value={importance}
					type="number"
					name="importance"
					id="importance"
				/>

				<label htmlFor="isDone">isDone:</label>
				<input
					onChange={handleChange}
					checked={isDone}
					type="checkbox"
					name="isDone"
					id="isDone"
				/>

				<button>Save</button>
			</form>
		</section>
	)
}
