import { utilService } from "./util.service.js"
import { storageService } from "./async-storage.service.js"

const TODO_KEY = "todoDB"
// _createTodos()

export const todoService = {
	query,
	get,
	remove,
	save,
	getEmptyTodo,
	getDefaultFilter,
	getFilterFromSearchParams,
	getProgressPercentage,
	getImportanceStats,
	getQuickTodo,
	createUserTodos,
}
// For Debug (easy access from console):
window.cs = todoService

function query(filterBy = {}) {
	return storageService.query(TODO_KEY).then((todos) => {
		if (filterBy.txt) {
			const regExp = new RegExp(filterBy.txt, "i")
			todos = todos.filter((todo) => regExp.test(todo.txt))
		}

		if (filterBy.importance) {
			todos = todos.filter((todo) => todo.importance >= filterBy.importance)
		}

		if (filterBy.isDone) {
			switch (filterBy.isDone) {
				case "Active":
					return todos.filter((todo) => !todo.isDone)
				case "Done":
					return todos.filter((todo) => todo.isDone)
				default:
					return todos
			}
		}

		const sortOrder = filterBy.descending ==='true' ? -1 : 1;
		if (filterBy.sortBy === "alphabet") {
            todos.sort((a, b) => sortOrder * a.txt.localeCompare(b.txt));
        } else if (filterBy.sortBy === "importance") {
            todos.sort((a, b) => sortOrder * (a.importance - b.importance));
        }

		// console.log(_paginateTodos(todos));
		

		// return todos
		return _paginateTodos(todos)
	})
}

function get(todoId) {
	return storageService.get(TODO_KEY, todoId).then((todo) => {
		todo = _setNextPrevTodoId(todo)
		return todo
	})
}

function remove(todoId) {
	return storageService.remove(TODO_KEY, todoId)
}

function save(todo, isUpdate = true) {
	if (todo._id && isUpdate) {
		// TODO - updatable fields
		todo.updatedAt = Date.now()
		return storageService.put(TODO_KEY, todo)
	} else {
		todo.createdAt = todo.updatedAt = Date.now()

		return storageService.post(TODO_KEY, todo)
	}
}

function getEmptyTodo(txt = "", importance = 5) {
	return { txt, importance, isDone: false, color: "#000000" }
}

function getDefaultFilter() {
	return { txt: "", importance: 0, isDone: "All", sortBy:"none", descending: false }
}

function getFilterFromSearchParams(searchParams) {
	const defaultFilter = getDefaultFilter()
	const filterBy = {}
	for (const field in defaultFilter) {		
		filterBy[field] = searchParams.get(field) || ""
	}
	return filterBy
}

function getImportanceStats() {
	return storageService.query(TODO_KEY).then((todos) => {
		const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
		const data = Object.keys(todoCountByImportanceMap).map((speedName) => ({
			title: speedName,
			value: todoCountByImportanceMap[speedName],
		}))
		return data
	})
}

function getProgressPercentage(todos) {
	const totalTodosNum = todos.length
	const doneTodosNum = todos.filter((todo) => todo.isDone).length
	const todoIsDonePercentage = Math.round((doneTodosNum / totalTodosNum) * 100)

	if (totalTodosNum === 0 || doneTodosNum === 0) {
		return 0
	} else {
		return todoIsDonePercentage
	}
}

function setQuickTodoAdd() {
	const todo = _createTodo("quick todo", 5)
	return save(todo)
}

function getQuickTodo(){
	const num = utilService.getRandomIntInclusive(0,10)
	return _createTodo('Quick Todo', num)
}

function _createTodos() {
	let todos = utilService.loadFromStorage(TODO_KEY)
	if (!todos || !todos.length) {
		todos = []
		const txts = ["Learn React", "Master CSS", "Practice Redux"]
		for (let i = 0; i < 20; i++) {
			const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
			todos.push(
				_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10))
			)
		}
		utilService.saveToStorage(TODO_KEY, todos)
	}
}
function createUserTodos(userId, num = 7) {
	let todos = utilService.loadFromStorage(TODO_KEY)
	if (!todos || !todos.length) {
		todos = []
		const txts = ["Learn React", "Master CSS", "Practice Redux"]
		for (let i = 0; i < num; i++) {
			const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
			todos.push(
				_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10))
			)
		}
		utilService.saveToStorage(TODO_KEY, todos)
	}
}

function _createTodo(txt, importance) {
	const todo = getEmptyTodo(txt, importance)
	todo._id = utilService.makeId()
	todo.createdAt = todo.updatedAt =
		Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
	return todo
}

function _setNextPrevTodoId(todo) {
	return storageService.query(TODO_KEY).then((todos) => {
		const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
		const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
		const prevTodo = todos[todoIdx - 1]
			? todos[todoIdx - 1]
			: todos[todos.length - 1]
		todo.nextTodoId = nextTodo._id
		todo.prevTodoId = prevTodo._id
		return todo
	})
}

function _getTodoCountByImportanceMap(todos) {
	const todoCountByImportanceMap = todos.reduce(
		(map, todo) => {
			if (todo.importance < 3) map.low++
			else if (todo.importance < 7) map.normal++
			else map.urgent++
			return map
		},
		{ low: 0, normal: 0, urgent: 0 }
	)
	return todoCountByImportanceMap
}

function _paginateTodos(todos, pageSize = 10){
	const pages = []
	for(let i = 0; i < todos.length; i += pageSize){
		pages.push(todos.slice(i, i+ pageSize))
	}
	return pages
}

// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }
