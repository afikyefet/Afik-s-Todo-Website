export function TodoPreview({ todo, onToggleTodo }) {
	return (
		<article className="todo-preview" style={{ color: todo.color }}>
			<h2 className="todo-importance">{todo.importance}</h2>
			<h2 className={`todo-name ${todo.isDone ? "done" : ""}`} onClick={onToggleTodo}>
				Todo: {todo.txt}
			</h2>
			{/* <img src={`../assets/img/${"todo"}.png`} alt="" /> */}
		</article>
	)
}
