import { isValidPriority, isValidString, normalizeToArray } from "./helpers.js";

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

// Group to manage a collection of todos
const todoGroup = (todos = []) => {
  return {
    list: new Set(
      normalizeToArray(todos).filter(
        (e) => e instanceof Todo && isValidString(e.description)
      )
    ),
    findTodo(todo) {
      return [...this.list].find((e) => e.description == todo);
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

function renderTodo(obj) {
  if (obj instanceof Todo) {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.dataset.todo = obj?.description;

    const checkWrap = document.createElement("div");
    checkWrap.classList.add("todo-data-wrap");
    // Styles – delete
    checkWrap.style.display = "flex";
    checkWrap.style.gap = "8px";

    const checker = document.createElement("div");
    checker.classList.add("checker");
    // Styles – delete
    checker.style.width = "32px";
    checker.style.height = "32px";
    checker.style.border = "1px solid black";

    const descriptionLabel = document.createElement("div");
    descriptionLabel.classList.add("todo-label");

    const description = document.createElement("p");
    description.innerHTML = obj?.description;

    descriptionLabel.append(description);

    checkWrap.append(checker, descriptionLabel);

    const priorityLabel = document.createElement("div");
    priorityLabel.classList.add("priority");

    const priority = document.createElement("p");
    priority.innerHTML = obj?.priority;

    checkWrap.addEventListener("click", markComplete);

    priorityLabel.append(priority);

    todo.append(checkWrap, priorityLabel);

    return todo;
  }
}

function formTextInput(settings = {}) {
  let {
    formid,
    id,
    classes = [],
    name,
    placeholder,
    required,
    autofocus,
  } = settings;

  let input = document.createElement("input");
  input.type = "text";

  if (id && isValidString(id)) input.id = id;
  if (formid && isValidString(formid)) input.setAttribute("form", formid);
  if (name && isValidString(name)) input.name = name;
  if (placeholder && isValidString(placeholder))
    input.placeholder = placeholder;
  if (typeof required == "boolean") input.required = required;
  if (typeof autofocus == "boolean") input.autofocus = autofocus;

  normalizeToArray(classes)
    .filter((e) => isValidString(e))
    .forEach((e) => input.classList.add(e));

  return input;
}

function formSelect(settings = {}) {
  let {
    formid,
    id,
    classes = [],
    options = [],
    name,
    multiple,
    required,
    placeholder,
  } = settings;

  let select = document.createElement("select");
  select.classList = "select";

  if (id && isValidString(id)) select.id = id;
  if (formid && isValidString(formid)) select.setAttribute("form", formid);
  if (name && isValidString(name)) select.name = name;
  if (typeof multiple == "boolean") select.multiple = multiple;
  if (typeof required == "boolean") select.required = required;

  if (placeholder && isValidString(placeholder)) {
    let placeholderOpt = document.createElement("option");
    placeholderOpt.value = "";
    placeholderOpt.selected = true;
    placeholderOpt.textContent = placeholder;
    select.append(placeholderOpt);
  }

  normalizeToArray(classes)
    .filter((e) => isValidString(e))
    .forEach((e) => select.classList.add(e));

  options.forEach((e) => {
    let option = document.createElement("option");
    option.classList.add("select-option");
    option.value = `${e}`;
    option.textContent = e[0].toUpperCase() + e.slice(1);
    select.append(option);
  });

  return select;
}

// Renders a button for the todo form
function formButton(settings = {}) {
  let { formid, type, value, id, action } = settings;

  let button = document.createElement("input");
  button.classList = "button";

  if (id && isValidString(id)) button.id = id;
  if (formid && isValidString(formid)) button.setAttribute("form", formid);
  if (type && isValidString(type)) button.type = type;
  if (value && isValidString(value)) button.value = value;
  if (action && typeof action == "function")
    button.addEventListener("click", action);

  return button;
}

// Renders to todo creation form
function renderTodoForm() {
  let form = document.createElement("form");
  form.id = "new-todo";

  let todoDescription = formTextInput({
    formid: form.id,
    id: "new-todo-description",
    classes: ["text-input"],
    name: "description",
    placeholder: "Add description",
    required: true,
    autofocus: true,
  });

  let todoPriority = formSelect({
    formid: form.id,
    id: "new-todo-priority",
    classes: ["select"],
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
  });

  let cancelButton = formButton({
    formid: form.id,
    id: "new-todo-cancel",
    type: "button",
    value: "Cancel",
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

function cancelTodo(event) {
  let form = document.getElementById("new-todo");
  let addTodoButton = document.getElementById("add-todo");
  if (form && !addTodoButton) form.replaceWith(renderAddTodoButton());
  dispatchEvent(new CustomEvent("cancel-todo"), {
    bubbles: true,
    detail: {
      target: event?.target,
    },
  });
}

// Runs when new todo form is submitted
function submitNewTodo(event) {
  event.preventDefault();

  // Retrieve form data
  let form = document.getElementById("new-todo");
  let formData = new FormData(form);

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
  const todoSum = todo.summary();

  let todos = [];
  const stored = localStorage.getItem("todos");
  if (stored) todos = JSON.parse(stored);

  let el = todos.find((e) => e?.id == todoSum.id);

  if (el) {
    todos[todos.indexOf(el)] = todo.summary();
  } else {
    todos.push(todo.summary());
  }
  localStorage.setItem("todos", JSON.stringify(todos));
}

function markComplete(event) {
  const closestSrc = event.target.closest("[data-todo]").dataset.todo;
  const todo = group.findTodo(closestSrc);

  if (todo) {
    todo.toggleComplete();
    updateStorage(todo);
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
