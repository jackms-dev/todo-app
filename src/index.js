// Helper functions

// Checks if str is a valid string
function isValidString(str) {
  return typeof str == "string" && str.length > 0;
}

// Checks if priority is a valid priority
// 0 = high, 1 = medium, 2 = low
function isValidPriority(priority) {
  return typeof priority == "number" && priority >= 0 && priority < 3;
}

// Converts obj to an array
// Does not flatten values
function normalizeToArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

// Factory function to create todo objects
class Todo {
  #id;
  #isComplete;
  constructor(description, priority) {
    this.#id = Symbol("id");
    this.#isComplete = false;
    this.priority = isValidPriority(priority) ? priority : null;
    this.description = isValidString(description) ? description : null;
  }
  summary() {
    return {
      id: this.#id,
      isComplete: this.#isComplete,
      priority: this.priority,
      description: this.description,
    };
  }
  markComplete() {
    this.#isComplete = true;
  }
  setComplete(bol) {
    if (typeof bol == "boolean") this.#isComplete = bol;
  }
  toggleComplete() {
    this.#isComplete = !this.#isComplete;
  }
  setDescription(descripton) {
    if (isValidString(descripton)) this.description = descripton;
  }
  removeDescription() {
    this.description = null;
  }
  setPriority(priority) {
    if (isValidPriority(priority)) this.priority = priority;
  }
  removePriority() {
    this.priority = null;
  }
  setTodo(todo, settings = {}) {
    const { description, priority, isComplete } = settings;
    if (description) todo.setDescription(description);
    if (priority) todo.setPriority(priority);
    if (isComplete) todo.setComplete(isComplete);
  }
  stringifyToDo() {
    return JSON.stringify(this);
  }
}

const todoGroup = (todos = []) => {
  return {
    list: new Set(normalizeToArray(todos).filter((e) => e instanceof Todo)),
    hasTodo(todo) {
      return this.list.has(todo);
    },
    addTodo(todo) {
      if (todo instanceof Todo) this.list.add(todo);
    },
    deleteTodo(todo) {
      this.list.delete(todo);
    },
    getAllTodos() {
      for (let e of this.list) {
        console.log(e);
      }
      return [...this.list];
    },
  };
};

function renderTodo(obj) {
  if (obj instanceof Todo) {
    let todo = document.createElement("div");
    todo.classList.add("todo");

    let checker = document.createElement("div");
    checker.style.width = "32px";
    checker.style.height = "32px";
    checker.style.border = "1px solid black";

    let descriptionLabel = document.createElement("div");
    descriptionLabel.classList.add("todo-label");

    let description = document.createElement("p");
    description.innerHTML = obj?.description;

    descriptionLabel.append(description);

    let priorityLabel = document.createElement("div");
    priorityLabel.classList.add("priority");

    let priority = document.createElement("p");
    priority.innerHTML = obj?.priority;

    priorityLabel.append(priority);

    todo.append(checker, descriptionLabel, priorityLabel);

    return todo;
  }
}

function renderGroup() {
  const group = todoGroup();
  for (let i = 1; i <= 5; i++) {
    let todo = new Todo(
      `Description for task ${i}`,
      Math.floor(Math.random() * 3)
    );
    group.addTodo(todo);
  }
  return group;
}

function renderApp() {
  const app = document.getElementById("app");
  const group = renderGroup();
  const wrapper = document.createElement("div");

  const todoNodes = group.getAllTodos().map((e) => renderTodo(e));

  wrapper.id = "group";
  wrapper.append(...todoNodes);
  app.append(wrapper);
}

renderApp();
