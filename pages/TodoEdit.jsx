import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveTodo, setSelectedTodo } from "../store/actions/todo.actions.js"

const { useState, useEffect } = React
const { useSelector } = ReactRedux
const { useNavigate, useParams } = ReactRouterDOM

export function TodoEdit() {
	let todo = useSelector((storeState) => storeState.todoModule.selectedTodo)
	const navigate = useNavigate()
	const params = useParams()
	const [todoToEdit, setTodoToEdit] = useState(todo)

	useEffect(() => {
		if (params.todoId) {
			loadTodo()
		} else {
			setTodoToEdit((todo) => (todo = todoService.getEmptyTodo()))
		}
	}, [params.todoId, todo])

	useEffect(() => {
		if (todo && params.todoId) setTodoToEdit({ ...todo })
	}, [todo])

	function loadTodo() {
		try {
			setSelectedTodo(params.todoId)
		} catch (err) {
			console.error("err:", err)
			showErrorMsg("Cannot load todo")
			navigate("/todo")
		}
	}

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
		saveTodo(todoToEdit)
			.then((savedTodo) => {
				navigate("/todo")
				showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
			})
			.catch((err) => {
				showErrorMsg("Cannot save todo")
				console.log("err:", err)
			})
	}

	if (!todoToEdit) return <div>Loading...</div>

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
					value={isDone}
					type="checkbox"
					name="isDone"
					id="isDone"
				/>

				<button>Save</button>
			</form>
		</section>
	)
}
