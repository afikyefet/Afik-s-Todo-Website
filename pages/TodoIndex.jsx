import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import {
	REMOVE_TODO,
	UPDATE_TODO,
	SET_TODO,
} from "../store/reducers/todo.reducer.js"
// prettier-ignore
import { loadTodos, setFilterBy, removeTodo, setIsLoading, saveTodo,} from "../store/actions/todo.actions.js"
const { useSelector, useDispatch } = ReactRedux

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
	const todos = useSelector((storeState) => storeState.todoModule.todos)
	const filterBy = useSelector((storeState) => storeState.todoModule.filterBy)
	const IsLoading = useSelector((storeState) => storeState.todoModule.isLoading)

	// Special hook for accessing search-params:
	const [searchParams, setSearchParams] = useSearchParams()

	const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

	useEffect(() => {
		console.log(todos)
	}, [todos])

	useEffect(() => {
		let isFilterSet = false

		if (
			!isFilterSet &&
			JSON.stringify(filterBy) !== JSON.stringify(defaultFilter)
		) {
			setFilterBy(defaultFilter)
			setSearchParams(defaultFilter)
			isFilterSet = true
		}

		loadTodos(filterBy)
			.then(() => {
				console.log(todos)
				showSuccessMsg("Todos loaded successfully")
			})
			.catch((err) => {
				console.error("Error loading todos:", err)
				showErrorMsg("Cannot load todos")
			})
	}, [filterBy, setSearchParams])

	function onSetFilterBy(filterBy) {
		setFilterBy(filterBy)
		setSearchParams(filterBy)
	}

	function onResetFilter() {
		onSetFilterBy(todoService.getDefaultFilter())
	}

	function onRemoveTodo(todoId) {
		const confirmed = window.confirm(
			"Are you sure you want to delete this item?"
		)
		if (confirmed) {
			setIsLoading(true)
			removeTodo(todoId)
				.then(() => {
					showSuccessMsg(`Todo removed`)
				})
				.catch((err) => {
					console.log("err:", err)
					showErrorMsg("Cannot remove todo " + todoId)
				})
				.finally(setIsLoading(false))
		}
	}

	function onToggleTodo(todo) {
		const todoToSave = { ...todo, isDone: !todo.isDone }
		saveTodo(todoToSave)
			.then((savedTodo) => {
				showSuccessMsg(
					`Todo is ${savedTodo.isDone ? "done" : "back on your list"}`
				)
			})
			.catch((err) => {
				console.log("err:", err)
				showErrorMsg("Cannot toggle todo " + todoId)
			})
	}

	if (IsLoading) return <div>Loading...</div>
	return (
		<section className="todo-index">
			<TodoFilter
				filterBy={filterBy}
				onSetFilterBy={onSetFilterBy}
				onResetFilter={onResetFilter}
			/>
			<div>
				<Link to="/todo/edit" className="btn">
					Add Todo
				</Link>
			</div>
			<h2>Todos List</h2>
			<TodoList
				todos={todos}
				onRemoveTodo={onRemoveTodo}
				onToggleTodo={onToggleTodo}
				defaultFilter={defaultFilter}
			/>
			<hr />
			<h2>Todos Table</h2>
			<div style={{ width: "60%", margin: "auto" }}>
				<DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
			</div>
		</section>
	)
}
