const {useSelector} = ReactRedux
const {useEffect, useState} = React

export function ProgressBar(){
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const [progressPercentage, setProgressPercentage] = useState(0)
    useEffect(()=>{
        setProgressPercentage(percentage => percentage = getProgressPercentage(todos))
    },[todos])

    function getProgressPercentage(todos) {
        const totalTodosNum = todos.flat().length
        const doneTodosNum = todos.flat().filter((todo) => todo.isDone).length
        const todoIsDonePercentage = Math.round((doneTodosNum / totalTodosNum) * 100)
    
        if (totalTodosNum === 0 || doneTodosNum === 0) {
            return 0
        } else {
            return todoIsDonePercentage
        }
    }


    return <section className="progress-bar">
    Todo progress: {progressPercentage}%
    <div className="progress-container">
        <div
            className="progress-percentage"
            style={{ width: `${progressPercentage}%` }}
        ></div>
    </div>
</section>
}