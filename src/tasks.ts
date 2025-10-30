// Grabbing Elements
const formElement = document.querySelector<HTMLFormElement>('.form')
const formInput = document.querySelector<HTMLInputElement>('.form-input')
const formBtn = document.querySelector<HTMLButtonElement>('.btn')
const formList = document.querySelector<HTMLUListElement>('.list')

// Task Type
interface Task{
    description: string,
    isCompleted: boolean,
    id: number
}

// Tasks Holder
const tasksHolder: Task[] = []


// Task Manager Class
class TaskManager{

    constructor(
        public formElement: HTMLFormElement | null,
        public formInput: HTMLInputElement | null,
        public formBtn: HTMLButtonElement | null,
        public formList: HTMLUListElement | null,
        public tasksHolder: Task[]
    ){
        if (!formElement || !formInput || !formList || !formBtn){
            alert('HTML element not found')
            return
        }


    }

    // Add Tasks
    addTask(task: Task): void{
        this.tasksHolder.push(task)
        localStorage.setItem('tasks', JSON.stringify(this.tasksHolder))
        return taskManager.renderOne(task)
    }

    // Render A Task
    renderOne(task: Task): void{
        const listElement = document.createElement('li')
        listElement.textContent = task.description


        const listDiv = document.createElement('div')
        listDiv.className = 'buttons'

        const checkBox = document.createElement('input')
        checkBox.type = 'checkBox'
        checkBox.id = String(task.id)

        if (task.isCompleted === true){
            checkBox.checked = true
        }

        const listElementBtn = document.createElement('button')
        listElementBtn.textContent = 'delete'
        listElementBtn.id = String(task.id)

        listDiv.appendChild(checkBox)
        listDiv.appendChild(listElementBtn)

        listElement.appendChild(listDiv)

        this.formList?.appendChild(listElement)

        this.deleteOne(listElementBtn, listElement)
        this.completeOne(checkBox)

        

    }

    // Render ALl Tasks
    renderAll(){
        const tasksInMem = localStorage.getItem('tasks')
        let parsedTasks: Task[]

        if (tasksInMem === null || tasksInMem === ''){
            return
        }
        parsedTasks = JSON.parse(tasksInMem)
        if(!parsedTasks){
            return
        }

        this.tasksHolder = parsedTasks

        parsedTasks.forEach(item => {
            return this.renderOne(item)
        })
    }

    deleteOne(button: HTMLButtonElement, listElement: HTMLLIElement): void{
        // Delete Btn Feature
        button.addEventListener('click', ()=>{

            if (confirm("Are you sure you want to delete this task")){
                const tasksInMem = localStorage.getItem('tasks')
                let parsedTasks: Task[]
                let taskID


                if (tasksInMem === null || tasksInMem === ''){
                    alert("Error, Cannot Read Database")
                    return
                }

                parsedTasks = JSON.parse(tasksInMem!)
                
                if (parsedTasks.length === 0){
                    alert("Database Empty")
                    return
                }

                taskID = parsedTasks.findIndex(item => item.id === Number(button.id))

                if (taskID === -1){
                    alert("Task Not Found")
                    return
                }

                parsedTasks.splice(taskID, 1)

                this.tasksHolder.splice(taskID, 1)

            
                localStorage.setItem('tasks', JSON.stringify(parsedTasks))
                listElement.remove()
            }
            else{
                return
            }

       })
    }
    completeOne(checkBox: HTMLInputElement){
        checkBox.addEventListener('change', ()=>{
            const tasksInMem = localStorage.getItem('tasks')
            let parsedTasks: Task[]
            let taskID


            if (tasksInMem === null || tasksInMem === ''){
                alert("Error, Cannot Read Database")
                return
            }

            parsedTasks = JSON.parse(tasksInMem)
        
            if (parsedTasks.length === 0){
                alert("Database Empty")
                return
            }

            taskID = parsedTasks.findIndex(item => item.id === Number(checkBox.id))

            if (taskID === -1){
                alert("Task Not Found")
                return
            }

            console.log(checkBox.id, parsedTasks[taskID].isCompleted)

            if (parsedTasks[taskID].isCompleted === true){
                parsedTasks[taskID].isCompleted = false
        
            }
            else{
                parsedTasks[taskID].isCompleted = true
                
            }

            localStorage.setItem('tasks', JSON.stringify(parsedTasks))

        })
    }
}

// Creating a new Instance
const taskManager = new TaskManager(formElement, formInput, formBtn, formList, tasksHolder)

// On Submit Event
formElement?.addEventListener('submit', (e)=>{
    e.preventDefault()

    if (formInput?.value === ''){
        alert('Kindly input a task description')
        return  
    }

    const mem: Task = {
        description: '',
        isCompleted: false,
        id: 0
    }
    const tasksInMem = localStorage.getItem('tasks')

    mem.description = formInput!.value
    mem.isCompleted = false

    

    let taskID: number
    let parsedTasks: Task[]

    if (tasksInMem === '' || tasksInMem === null){
        mem.id = 0

        formInput!.value = ""
        
        taskManager.addTask(mem)



    }
    else if(JSON.parse(tasksInMem).length === 0){
        mem.id = 0
        formInput!.value = ""

        taskManager.addTask(mem)
        
    }
    else{
        parsedTasks = JSON.parse(tasksInMem)
        taskID = parsedTasks[parsedTasks.length-1].id+1

        mem.id = taskID

        formInput!.value = ""

        taskManager.addTask(mem)

        



    }
    


            

})


 taskManager.renderAll()
