import {
  isValidPriority,
  isValidString,
  normalizeToArray,
  addHTMLClasses,
} from "./helpers.js";

// Factory function to create todo objects
class Todo {
  #id;
  #isComplete;
  constructor(description, priority, isComplete, id) {
    this.#id = id && isValidString(id) ? id : crypto.randomUUID();
    this.#isComplete =
      isComplete && typeof isComplete == "boolean" ? isComplete : false;
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
  setId(id) {
    if (isValidString(id)) this.#id = id;
  }
  setTodo(settings = {}) {
    const { description, priority, isComplete, id } = settings;
    if (description) this.setDescription(description);
    if (priority) this.setPriority(priority);
    if (isComplete) this.setComplete(isComplete);
    if (id) this.setId(id);
  }
  stringifyTodo() {
    return JSON.stringify(this);
  }
}

// Group to manage a collection of todos
const todoGroup = (todos = []) => {
  return {
    list: new Set(
      normalizeToArray(todos).filter(
        (e) => e instanceof Todo && isValidString(e.description)
      )
    ),
    findTodo(description) {
      return [...this.list].find((e) => e.description == description);
    },
    hasTodo(todo) {
      return this.list.has(todo);
    },
    addTodo(todo) {
      if (todo instanceof Todo && isValidString(todo.description))
        this.list.add(todo);
    },
    deleteTodo(todo) {
      this.list.delete(todo);
    },
    getAllTodos() {
      return [...this.list];
    },
  };
};

function renderTodoData(obj) {
  obj = obj.summary();
  const todoData = document.createElement("div");
  todoData.classList.add("todo-data");

  const checker = document.createElement("input");
  checker.type = "checkbox";
  checker.classList.add("checker");
  checker.name = obj?.description;
  if (obj?.isComplete) {
    checker.checked = true;
    checker.classList.add("checker-complete");
  }

  const description = document.createElement("label");
  description.htmlFor = obj?.description;
  description.classList.add("todo-label");
  description.innerHTML = obj?.description;

  todoData.append(checker, description);

  return todoData;
}

function renderTodoPriority(obj) {
  const todoPriority = document.createElement("div");
  todoPriority.classList.add("priority");

  const priority = document.createElement("p");
  priority.classList.add("priority-label");
  priority.innerHTML = obj?.priority;

  todoPriority.append(priority);

  return todoPriority;
}

function renderTodo(obj) {
  if (obj instanceof Todo) {
    const todo = document.createElement("div");
    todo.id = todo.summary().id;
    todo.classList.add("todo");
    todo.dataset.todo = obj?.description;

    const todoData = renderTodoData(obj);
    const todoPriority = renderTodoPriority(obj);

    todoData.addEventListener("click", markComplete);

    todo.append(todoData, todoPriority);

    return todo;
  }
}

function formTextInput(settings = {}) {
  const {
    formid,
    id,
    classes = [],
    name,
    placeholder,
    required,
    autofocus,
  } = settings;

  const input = document.createElement("input");
  input.type = "text";

  if (id && isValidString(id)) input.id = id;
  if (formid && isValidString(formid)) input.setAttribute("form", formid);
  if (name && isValidString(name)) input.name = name;
  if (placeholder && isValidString(placeholder))
    input.placeholder = placeholder;
  if (typeof required == "boolean") input.required = required;
  if (typeof autofocus == "boolean") input.autofocus = autofocus;

  addHTMLClasses(input, classes);

  return input;
}

function formSelect(settings = {}) {
  const {
    formid,
    id,
    classes = [],
    options = [],
    name,
    multiple,
    required,
    placeholder,
  } = settings;

  const select = document.createElement("select");

  if (id && isValidString(id)) select.id = id;
  if (formid && isValidString(formid)) select.setAttribute("form", formid);
  if (name && isValidString(name)) select.name = name;
  if (typeof multiple == "boolean") select.multiple = multiple;
  if (typeof required == "boolean") select.required = required;

  addHTMLClasses(select, classes);

  if (placeholder && isValidString(placeholder)) {
    const placeholderOpt = document.createElement("option");
    placeholderOpt.classList.add("input-select-option");
    placeholderOpt.value = "";
    placeholderOpt.selected = true;
    placeholderOpt.textContent = placeholder;
    select.append(placeholderOpt);
  }

  options
    .filter((e) => isValidString(e))
    .forEach((e) => {
      const option = document.createElement("option");
      option.classList.add("input-select-option");
      option.value = `${e}`;
      option.textContent = e[0].toUpperCase() + e.slice(1);
      select.append(option);
    });

  return select;
}

// Renders a button for the todo form
function formButton(settings = {}) {
  const { formid, type, value, id, classes = [], action } = settings;

  const button = document.createElement("input");

  if (id && isValidString(id)) button.id = id;
  if (formid && isValidString(formid)) button.setAttribute("form", formid);
  if (type && isValidString(type)) button.type = type;
  if (value && isValidString(value)) button.value = value;
  if (action && typeof action == "function")
    button.addEventListener("click", action);

  addHTMLClasses(button, classes);

  return button;
}

// Renders to todo creation form
function renderTodoForm() {
  let form = document.createElement("form");
  form.id = "new-todo";

  let todoDescription = formTextInput({
    formid: form.id,
    id: "new-todo-description",
    classes: ["input", "input-text"],
    name: "description",
    placeholder: "Add description",
    required: true,
    autofocus: true,
  });

  let todoPriority = formSelect({
    formid: form.id,
    id: "new-todo-priority",
    classes: ["input", "input-select"],
    name: "priority",
    options: ["low", "medium", "high"],
    placeholder: "Select priority",
    multiple: false,
    required: false,
  });

  let addButton = formButton({
    formid: form.id,
    id: "new-todo-add",
    type: "submit",
    value: "Add todo",
    classes: ["button"],
  });

  let cancelButton = formButton({
    formid: form.id,
    id: "new-todo-cancel",
    type: "button",
    value: "Cancel",
    classes: ["button"],
    action: cancelTodo,
  });

  form.append(todoDescription, todoPriority, addButton, cancelButton);

  form.addEventListener("submit", submitNewTodo);

  return form;
}

// Renders the button to add a new todo
function renderAddTodoButton() {
  let button = document.createElement("button");
  button.id = "add-todo";
  button.classList.add("button");
  button.textContent = "New todo";
  button.addEventListener("click", addTodo);
  return button;
}

// Renders new form to add details about todo
function addTodo(event) {
  let form = document.getElementById("new-todo");
  let addTodoButton = document.getElementById("add-todo");
  if (!form && addTodoButton) {
    addTodoButton.replaceWith(renderTodoForm());
    document.querySelector("input[name='description']")?.focus();
  }
  dispatchEvent(
    new CustomEvent("create-todo", {
      bubbles: true,
      detail: {
        target: event?.target,
      },
    })
  );
}

// Removes the new todo form if the cancel button is clicked
function cancelTodo(event) {
  let form = document.getElementById("new-todo");
  let addTodoButton = document.getElementById("add-todo");
  if (form && !addTodoButton) form.replaceWith(renderAddTodoButton());
  dispatchEvent(
    new CustomEvent("cancel-todo", {
      bubbles: true,
      detail: {
        target: event?.target,
      },
    })
  );
}

// Runs when new todo form is submitted
function submitNewTodo(event) {
  event.preventDefault();

  // Retrieve form data
  let formData = new FormData(document.getElementById("new-todo"));

  if (isValidString(formData.get("description"))) {
    // Add todo to group
    let todo = new Todo(formData.get("description"), formData.get("priority"));
    group.addTodo(todo);

    // Get or set todos to localStorage
    updateStorage(todo);

    document.getElementById("group").append(renderTodo(todo));

    cancelTodo(event);
  }
}

// Takes a Todo object as data and passes it to localStorage
function updateStorage(todo) {
  if (todo instanceof Todo && isValidString(todo.description)) {
    const todoObj = todo.summary();
    let todos = [];
    const stored = localStorage.getItem("todos");
    if (stored) todos = JSON.parse(stored);

    let todoInStorage = todos.find((e) => e?.id == todoObj.id);
    if (todoInStorage) {
      todos[todos.indexOf(todoInStorage)] = todoObj;
    } else {
      todos.push(todoObj);
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    printTodosToConsole();
  }
}

// Prints the status of both the data object (group) and localStorage to the console
function printTodosToConsole() {
  console.log(group);
  for (let i in localStorage) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
  }
}

// Event that marks the todo as complete
function markComplete(event) {
  const closestSrc = event.target.closest("[data-todo]").dataset.todo;
  const todo = group.findTodo(closestSrc);

  if (closestSrc && todo) {
    todo.toggleComplete();
    updateStorage(todo);
    updateCheckboxUI(
      event.currentTarget.querySelector(".checker"),
      todo.summary().isComplete
    );
  }

  dispatchEvent(
    new CustomEvent("mark-complete", {
      bubbles: true,
      detail: {
        target: event.target,
        isComplete: true,
      },
    })
  );
}

// Updated the check on the checkbox of the todo
function updateCheckboxUI(checkbox, isComplete) {
  checkbox.checked = isComplete;
  isComplete
    ? checkbox.classList.add("checker-complete")
    : checkbox.classList.remove("checker-complete");
}

// Renters the todo group
function renderGroup() {
  const group = todoGroup();
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos?.forEach((e) =>
    group.addTodo(new Todo(e?.description, e?.priority, e?.isComplete, e?.id))
  );
  return group;
}

// Renders the entire app

// What event listeners does app need assigned?
const app = document.getElementById("app");

const group = renderGroup();

const addButton = renderAddTodoButton();

const groupWrap = document.createElement("div");
groupWrap.id = "group";

// Event listener for todos marked complete
groupWrap.addEventListener("mark-complete", markComplete);

const todoNodes = group.getAllTodos().map((e) => renderTodo(e));

groupWrap.append(...todoNodes);
app.append(groupWrap, addButton);
