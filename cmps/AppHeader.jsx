const { useState, useEffect } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from "../services/user.service.js"
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from "./LoginSignup.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userLogout } from "../store/actions/user.actions.js"
import { todoService } from "../services/todo.service.js"
// prettier-ignore
import {loadTodos,setProgressPercentage,} from "../store/actions/todo.actions.js"
const { useSelector } = ReactRedux

export function AppHeader() {
	const user = useSelector((storeState) => storeState.userModule.user)
	const todos = useSelector((storeState) => storeState.todoModule.todos)
	const progressPercentage = useSelector(
		(storeState) => storeState.todoModule.progressPercentage
	)
	useEffect(() => {
		loadTodos().then((todos) => {
			setProgressPercentage(todos)
		})
	}, [todos])

	function onLogout() {
		userLogout().catch((err) => {
			showErrorMsg("OOPs try again")
		})
	}

	return (
		<header className="app-header full main-layout">
			<section className="header-container">
				<h1>
					<Link to="/">Afik Todo App</Link>
				</h1>
				{user ? (
					<section className="user-info">
						<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
						<span> {user.balance}</span>
						<button onClick={onLogout}>Logout</button>
						<section className="progress-bar">
							Todo progress: {progressPercentage}%
							<div className="progress-container">
								<div
									className="progress-percentage"
									style={{ width: `${progressPercentage}%` }}
								></div>
							</div>
						</section>
					</section>
				) : (
					<section>
						<LoginSignup />
					</section>
				)}
				<nav className="app-nav">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
					<NavLink to="/todo">Todos</NavLink>
					<NavLink to="/dashboard">Dashboard</NavLink>
				</nav>
			</section>
			<UserMsg />
		</header>
	)
}
