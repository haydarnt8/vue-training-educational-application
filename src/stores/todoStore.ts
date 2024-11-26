import { defineStore } from 'pinia'
import { watch, ref, computed } from 'vue'

interface Todo {
  title: string
  description: string
  completed: boolean
  index?: number
}

export const useTodoStore = defineStore('todo', () => {
  // state
  const todos = ref<Todo[]>(
    JSON.parse(localStorage.getItem('todos') || '[]') as Todo[],
  )
  const selectedTodo = ref<Todo | null>(null)

  // getters
  const completedTodos = computed(() =>
    todos.value.filter(todo => todo.completed),
  )
  const uncompletedTodos = computed(() =>
    todos.value.filter(todo => !todo.completed),
  )
  const allTodos = computed(() => todos.value)

  // actions
  function selectTodoByIndex(index: number) {
    selectedTodo.value = todos.value[index]
    selectedTodo.value.index = index
  }
  function clearSelectedTodo() {
    selectedTodo.value = null
  }
  function clearTodos() {
    todos.value = []
  }
  async function addTodo(data: Todo) {
    await new Promise(resolve => setTimeout(resolve, 1250))
    if (!data.index) data.index = todos.value.length
    todos.value.push(data)
  }
  async function removeTodo(index: number) {
    await new Promise(resolve => setTimeout(resolve, 1250))
    todos.value.splice(index, 1)
  }
  async function toggleCompleted(index: number) {
    await new Promise(resolve => setTimeout(resolve, 1250))
    todos.value[index].completed = !todos.value[index].completed
  }
  async function updateTodo(data: Todo) {
    const promise = new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(
          selectedTodo.value?.index !== undefined &&
            selectedTodo.value.index > -1,
        )
      }, 1250)
    })
    await promise
      .then((res: boolean) => {
        if (
          res &&
          selectedTodo.value &&
          selectedTodo.value.index !== undefined
        ) {
          if (data.index === undefined) data.index = selectedTodo.value.index
          todos.value[selectedTodo.value.index] = data
        }
      })
      .finally(() => {
        clearSelectedTodo()
      })
  }

  watch(
    () => todos.value,
    () => localStorage.setItem('todos', JSON.stringify(todos.value)),
    { deep: true },
  )
  return {
    todos,
    selectedTodo,
    completedTodos,
    uncompletedTodos,
    allTodos,
    addTodo,
    clearSelectedTodo,
    clearTodos,
    removeTodo,
    toggleCompleted,
    updateTodo,
    selectTodoByIndex,
  }
  // state: () => ({
  //   todos: JSON.parse(localStorage.getItem('todos') || '[]') as Todo[],
  // }),
  // getters: {
  //   selectedTodo: state => (index: number) => state.todos[index],
  //   completedTodos: state => state.todos.filter(todo => todo.completed),
  //   uncompletedTodos: state => state.todos.filter(todo => !todo.completed),
  //   allTodos: state => state.todos,
  // },
  // actions: {
  //   addTodo(data: Todo) {
  //     this.todos.push(data)
  //   },
  //   removeTodo(index: number) {
  //     this.todos.splice(index, 1)
  //   },
  //   toggleCompleted(index: number) {
  //     this.todos[index].completed = !this.todos[index].completed
  //   },
  //   updateTodo(index: number, data: Todo) {
  //     this.todos[index] = data
  //   },
  // },
})
