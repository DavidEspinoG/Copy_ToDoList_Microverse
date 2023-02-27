/* eslint-disable import/no-cycle */
import {
  deleteTodo, toggleCompleteTodo, updateTodo, toDos, switchElements,
} from './crud.js';
import { toDosContainer } from './selectors.js';
import stringToBool from './stringToBool.js';

const createTodo = (object) => {
  const addDragListeners = () => {
    const htmlToDos = document.querySelectorAll('.toDo');
    htmlToDos.forEach((element) => {
      element.addEventListener('dragstart', (e) => {
        element.classList.add('opacity');
        const context = {
          description: element.attributes.description.value,
          completed: stringToBool(element.attributes.completed.value),
          index: element.attributes.index.value,
        };
        const toSend = JSON.stringify(context);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', toSend);
      });
      element.addEventListener('dragover', (e) => {
        e.preventDefault();
        return false;
      });
      element.addEventListener('dragenter', () => {
        element.classList.add('over');
      });
      element.addEventListener('dragleave', () => {
        element.classList.remove('over');
      });
      element.addEventListener('dragend', () => {
        element.classList.remove('opacity');
        element.draggable = false;
      });
      element.addEventListener('drop', (e) => {
        e.stopPropagation();
        element.classList.remove('over');
        const target = {
          description: element.attributes.description.value,
          completed: stringToBool(element.attributes.completed.value),
          index: element.attributes.index.value,
        };
        const origin = JSON.parse(e.dataTransfer.getData('text/plain'));
        switchElements(origin, target);
        e.stopImmediatePropagation();
        return false;
      }, false);
    });
  };
  const container = document.createElement('div');
  container.tabIndex = 1;
  container.classList.add('toDo');
  container.setAttribute('index', object.index);
  container.setAttribute('description', object.description);
  container.setAttribute('completed', object.completed);
  const left = document.createElement('div');
  left.classList.add('left');
  const right = document.createElement('div');
  right.classList.add('right');
  const square = document.createElement('i');
  square.classList.add('fa-2x');
  const description = document.createElement('input');
  description.value = object.description;
  description.classList.add('description');
  description.tabIndex = -1;
  if (!object.completed) {
    square.classList.add('fa-regular', 'fa-square');
    description.classList.remove('finished');
  } else {
    description.classList.add('finished');
    square.classList.add('fa-solid', 'fa-check');
  }
  const dots = document.createElement('i');
  dots.classList.add('fa-solid', 'fa-ellipsis-vertical', 'fa-2x', 'dots');
  dots.id = 'dots';
  const trashCan = document.createElement('i');
  trashCan.classList.add('fa-solid', 'fa-trash', 'display-none');
  trashCan.addEventListener('click', () => {
    deleteTodo(object.index);
    toDosContainer.innerHTML = '';
    toDos.forEach((element) => {
      toDosContainer.appendChild(createTodo(element));
    });
  });
  // Append
  container.append(left, right);
  left.append(square, description);
  right.append(dots, trashCan);

  // Event listeners
  description.addEventListener('focusin', (e) => {
    e.stopPropagation();
    container.classList.add('focus');
  });
  description.addEventListener('focusout', (e) => {
    e.stopPropagation();
    container.classList.remove('focus');
  });
  description.addEventListener('keyup', (e) => {
    updateTodo(object.index, e.target.value);
  });
  container.addEventListener('focusin', (e) => {
    e.stopPropagation();
    trashCan.classList.remove('display-none');
    description.classList.add('focus');
  });
  container.addEventListener('focusout', (e) => {
    e.stopPropagation();
    trashCan.classList.add('display-none');
    description.classList.remove('focus');
  });
  square.addEventListener('click', () => {
    toggleCompleteTodo(object.index);
    toDosContainer.innerHTML = '';
    toDos.forEach((element) => {
      toDosContainer.appendChild(createTodo(element));
    });
  });
  dots.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    container.draggable = 'true';
    addDragListeners();
  });
  return container;
};

export default createTodo;