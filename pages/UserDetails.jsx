import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { setUserLoading, userUpdate } from "../store/actions/user.actions.js"

const { useEffect , useState} = React
const { useSelector } = ReactRedux
const { useParams, useNavigate, Link } = ReactRouterDOM

export function UserDetails() {
	const user = useSelector(storeState => storeState.userModule.user)
	const userLoading = useSelector(storeState => storeState.userModule.userLoading)
	const userId = useParams().userId
	const [userPage, setUserPage] = useState(null)

	useEffect(()=>{		
		setUserLoading(true)
		userService.getByIdSafe(userId)
		.then(user => {
			setUserPage(userPage => userPage = user)			
			showSuccessMsg('user loaded')
		})
		.catch(err => {
			console.error('could not load user' , err);
			showErrorMsg("Could not find user")
		})
		.finally(()=>setUserLoading(false))
	},[userId])


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
        setUserPage((prevUserPage) => ({
            ...prevUserPage,
            prefs: {
                ...prevUserPage.prefs,
                [field]: value,
            },
            [field]: field === "fullname" ? value : prevUserPage.fullname,
        }))
	}

	function saveUserPrefs(ev){
		ev.preventDefault()
		userUpdate(userPage)
		.then(() => {
			showSuccessMsg("Preferences saved successfully");
		})
		.catch((err) => {
			console.error("Failed to save preferences", err);
			showErrorMsg("Could not save preferences");
		});
	}
	
	if(userLoading){
		return <div>Loading...</div>
	}else if(user && user._id === userId && userPage){
	return <section className="user-details"  
	style={{
		color: user.prefs.color,
		backgroundColor: user.prefs.bgColor,
	}}> 
	<form className="user-edit" onSubmit={(ev)=>saveUserPrefs(ev)}>
		<label htmlFor="fullname">Name: </label>
		<input type="text" name="fullname" value={userPage.fullname} onChange={handleChange}/>

		<label htmlFor="color"> Color: </label>
		<input type="color" name="color" value={userPage.prefs.color}  onChange={handleChange}/>

		<label htmlFor="bgColor"> BG Color: </label>
		<input type="color" name="bgColor" value={userPage.prefs.bgColor}  onChange={handleChange}/>
		<button>Save</button>
	</form>
	<h1>{user.fullname}</h1>
	<h2>{user.balance}</h2>
	<ul>
		{user.activities.map((activity, idx)=>(
			<li key={idx}>
				{activity.txt}{"   "}
				<small>{userService.getTimeStamp(activity.at)}</small>
			</li>
		))}
	</ul>
	</section>
	}else if(userPage){
		return <section className="user-details" style={{
			color: userPage.prefs.color,
			backgroundColor: userPage.prefs.bgColor,
		}}> 
		<h1>{userPage.fullname}</h1>
		<h2>{userPage.balance}</h2>
		<ul>
			{userPage.activities.map((activity, idx)=>(
				<li key={idx}>
					{activity.txt}{"   "}
					<small>{userService.getTimeStamp(activity.at)}</small>
				</li>
			))}
		</ul>
		</section>
	}
}
