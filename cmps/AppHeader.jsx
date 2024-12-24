const {useEffect } = React
const { Link, NavLink } = ReactRouterDOM

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from "./LoginSignup.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userLogout } from "../store/actions/user.actions.js"

import {loadTodos,} from "../store/actions/todo.actions.js"
import { ProgressBar } from "./ProgressBar.jsx"
const { useSelector } = ReactRedux

export function AppHeader() {
	const user = useSelector((storeState) => storeState.userModule.user)

	useEffect(() => {
		loadTodos()
	}, [])

	function onLogout() {
		userLogout().catch((err) => {
			showErrorMsg("OOPs try again")
		})
	}

	return (
		<header className="app-header full main-layout">
			<section className="header-container">
				<h1 className="web-logo">
					<Link to="/">Afik Todo App</Link>
				</h1>
				{user ? (
					<section className="user-info">
						<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
						<span> {user.balance}</span>
						<button onClick={onLogout}>Logout</button>
						<ProgressBar />
					</section>
				) : (
					<section className="user-login">
						<LoginSignup />
					</section>
				)}
				<nav className="app-nav">
					<NavLink className="NavLink" to="/">Home</NavLink>
					<NavLink className="NavLink" to="/about">About</NavLink>
					<NavLink className="NavLink" to="/todo">Todos</NavLink>
					<NavLink className="NavLink" to="/dashboard">Dashboard</NavLink>
				</nav>
			</section>
			<UserMsg />
		</header>
	)
}
