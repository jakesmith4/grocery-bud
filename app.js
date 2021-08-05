// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// Edit Option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
// Submit Form
form.addEventListener('submit', addItem);
// Clear Items
clearBtn.addEventListener('click', clearItems);
// Load Items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
// AddItem
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  if (!value) {
    console.log('value is falsy');
  }
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value);
    // Display Alert
    displayAlert('item added to the list', 'success');
    // Show Container
    container.classList.add('show-container');
    // Add To Local Storage
    addToLocalStorage(id, value);
    // Set Back To Default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert('Value Changed', 'success');
    // Edit Local Storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert('please enter value', 'danger');
  }
}
// Submit Form
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // Remove Alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Clear Items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  console.log(items);
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove('show-container');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}

// Delete Function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert('Item Removed', 'danger');
  setBackToDefault();
  // Remove From Local Storage
  removeFromLocalStorage(id);
}

// Edit Function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // Set Edit Item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // Set Form Value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = 'edit';
}
// Set Back To Default
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  console.log(items);
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

function createListItem(id, value) {
  // Create Element
  const element = document.createElement('article');
  // Add Class
  element.classList.add('grocery-item');
  // Add Id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="del-btn" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const deleteBtn = element.querySelector('.del-btn');
  const editBtn = element.querySelector('.edit-btn');
  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);
  // Append Child
  list.appendChild(element);
}
