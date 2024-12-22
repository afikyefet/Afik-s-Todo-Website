import { todoService } from "../services/todo.service.js"
import { debounce } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function TodoFilter({ filterBy, onSetFilterBy, onResetFilter }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
	const onSetFilterDebaunce = useRef(debounce(onSetFilterBy)).current

	useEffect(() => {
		onSetFilterDebaunce(filterByToEdit)
	}, [filterByToEdit])

	function handleChange({ target }) {
		let { value, name: field } = target
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

		setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
	}

	function setFilterReset() {
		onResetFilter()
		setFilterByToEdit(todoService.getDefaultFilter())
	}

	function onSubmitFilter(ev) {
		ev.preventDefault()
		onSetFilterBy(filterByToEdit)
	}

	const { txt, importance, isDone, sortBy, descending } = filterByToEdit
	return (
		<section className="todo-filter">
			<h2>Filter Todos</h2>
			<form onSubmit={onSubmitFilter}>
				<input
					value={txt}
					onChange={handleChange}
					type="search"
					placeholder="By Txt"
					id="txt"
					name="txt"
				/>
				<label htmlFor="importance">Importance: </label>
				<input
					value={importance}
					onChange={handleChange}
					type="number"
					placeholder="By Importance"
					id="importance"
					name="importance"
				/>
					<label htmlFor="is-done">Show:</label>
				<select
					name="isDone"
					id="is-done"
					value={isDone}
					onChange={handleChange}
				>
					<option value="All">All</option>
					<option value="Active">Active</option>
					<option value="Done">Done</option>
				</select>
				<label htmlFor="sort-by">Sort by:</label>
				<select
				name="sortBy"
				id="sort-by"
				value={sortBy}
				onChange={handleChange}
				>
					<option name="none" id="none">none</option>
					<option name="importance" id="importance">importance </option>
					<option name="alphabet" id="alphabet">alphabet</option>
				</select>
				<label htmlFor="descending">descending:</label>
				<input
					onChange={handleChange}
					checked={descending}
					value={descending}
					type="checkbox"
					name="descending"
					id="descending"
				/>
				<button hidden>Set Filter</button>
			</form>
			<button onClick={(ev) => setFilterReset()}>Reset Filter</button>
		</section>
	)
}
