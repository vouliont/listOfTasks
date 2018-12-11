'use strict';

let btnAddTask = document.querySelector('#btn-add-task');
let blockAddTask = document.querySelector('#add-task-wrapper');

btnAddTask.onclick = () => {
  if (isAddingTask || isEditingTask) {
    confirmTextChangedDate.classList.remove('animationText');
    setTimeout(() => {
      confirmTextChangedDate.classList.add('animationText');
    }, 0);
    return;
  }
  
  isAddingTask = true;
  blockAddTask.classList.add('active');
};

document.querySelector('.add-task-wrapper__btn-close').onclick = () => {
  if (isEditingTask) {
    if (confirm('Если вы закроете эту форму, изменения задачи не будут применены. Продолжить?')) {
      setTimeout(() => {
        btnCreateNewTask.textContent = 'Добавить';
      }, 500);
      isEditingTask = false;
      
      blockAddTask.classList.remove('active');
      
      clearFieldAddedTask();
    }
    return;
  }
  
  
  // Если хотя бы одно поле заполнено, то выводится вопрос о закрытии
  let isFieldFilled = false;
  let fields = document.querySelectorAll('.add-task__field');
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].value !== '') {
      isFieldFilled = true;
    }
  }
  if (btnChangeAddTaskDate.classList.contains('changed')) {
    isFieldFilled = true;
  }
  
  if (isFieldFilled) {
    if (!confirm('Если вы закроете эту форму, то все поля будут стерты. Продолжить?')) {
      return;
    }
  }
  
  clearFieldAddedTask();
  blockAddTask.classList.remove('active');
  
  isAddingTask = false;
}


let creatingNewTask = false;

let btnChangeAddTaskDate = document.querySelector('#change-add-task-date');

let confirmBlockChangedDate = document.querySelector('.confirm-changed-date');
let confirmTextChangedDate = confirmBlockChangedDate.querySelector('.confirm-changed-date__text');
let confirmBtnChangedDate = confirmBlockChangedDate.querySelector('.confirm-changed-date__btn');

btnChangeAddTaskDate.onclick = () => {
  selectedYearMonth();
  
  blockAddTask.classList.remove('active');
  
  setTimeout(() => {
    confirmBlockChangedDate.classList.add('visible');
    confirmTextChangedDate.classList.add('animationText');
  }, 500);
};

let dateNewTask = null;

confirmBtnChangedDate.onclick = () => {
  // Если дата не выбрана, ждем выбора
  if (!menuMonth.activeItem || !menuYear.activeItem || !changedDay) {
    confirmTextChangedDate.classList.remove('animationText');
    setTimeout(() => {
      confirmTextChangedDate.classList.add('animationText');
    }, 0);
    return;
  }
  
  confirmBlockChangedDate.classList.remove('visible');
  confirmTextChangedDate.classList.remove('animationText');
  
  dateNewTask = {
    year: +menuYear.activeItem.getAttribute('data-option'),
    month: +menuMonth.activeItem.getAttribute('data-option') + 1,
    day: +changedDay.getAttribute('data-option')
  };
  
  btnChangeAddTaskDate.textContent = `${(dateNewTask.day < 10 ? '0' : '') + dateNewTask.day}.${(dateNewTask.month < 10 ? '0' : '') + dateNewTask.month}.${dateNewTask.year}`;
  btnChangeAddTaskDate.classList.add('changed');
  
  setTimeout(() => {
    blockAddTask.classList.add('active');
  }, 300);
};


let btnCreateNewTask = document.querySelector('#create-new-task');

btnCreateNewTask.onclick = () => {
  if (isEditingTask) {
    let name = document.querySelector('.field-task-name').value;
    let description = document.querySelector('.field-task-description').value;
    let [day, month, year] = btnChangeAddTaskDate.textContent.split('.');
    day = +day;
    month = +month - 1;
    year = +year;
    
    let indexTask;
    for (let i = 0; i < tasks[editingTask.year][editingTask.month][editingTask.day].length; i++) {
      if (editingTask.id != tasks[editingTask.year][editingTask.month][editingTask.day][i].id) continue;
      
      indexTask = i;
      break;
    }
    
    // Очистка изменяемой задачи
    tasks[editingTask.year][editingTask.month][editingTask.day].splice(indexTask, 1);
    if (tasks[editingTask.year][editingTask.month][editingTask.day].length == 0) {
      delete tasks[editingTask.year][editingTask.month][editingTask.day];
      if (Object.keys(tasks[editingTask.year][editingTask.month]).length == 0) {
        delete tasks[editingTask.year][editingTask.month];
        if (Object.keys(tasks[editingTask.year]).length == 0) {
          delete tasks[editingTask.year];
        }
      }
    }
    
    // Запись измененной задачи
    // Добавляем задачу в обьект tasks
    if (tasks[year]) {
      if (tasks[year][month]) {
        if (tasks[year][month][day]) {
          writeTask(name, description, day, month, year);
        } else {
          tasks[year][month][day] = [];
          writeTask(name, description, day, month, year);
        }
      } else {
        tasks[year][month] = {};
        tasks[year][month][day] = [];
        writeTask(name, description, day, month, year);
      }
    } else {
      tasks[year] = {};
      tasks[year][month] = {};
      tasks[year][month][day] = [];
      writeTask(name, description, day, month, year);
    }
    
    blockAddTask.classList.remove('active');
    setTimeout(() => {
      btnCreateNewTask.textContent = 'Добавить';
      clearFieldAddedTask();
    }, 500);
    
    let queryString = `#calendar td[data-option="${changedDay.getAttribute('data-option')}"]`;
    selectedYearMonth();
    changeDate.call(document.querySelector('#calendar'), {
      target: document.querySelector(queryString)
    });
    
    editingTask = null;
    isEditingTask = false;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return;
  }
  
  
  let requiredFields = document.querySelectorAll('.add-task .field-required');
  
  let error = '';
  
  for (let i = 0; i < requiredFields.length; i++) {
    if (requiredFields[i].value === '') {
      error += 'Заполните обязательные поля! ';
      break;
    }
  }
  
  if (!btnChangeAddTaskDate.classList.contains('changed')) {
    error += 'Выберите дату!';
  }
  
  // Не заполнены обязательные поля
  // Не выбрана дата
  if (error !== '') {
    alert(error);
    return;
  }
  
  // Все поля заполнены и дата выбрана  
  let [day, month, year] = btnChangeAddTaskDate.textContent.split('.');
  day = +day;
  month = +month - 1;
  year = +year;
  
  let name = document.querySelector('.field-task-name').value;
  let description = document.querySelector('.field-task-description').value;
  
  // Добавляем задачу в обьект tasks
  if (tasks[year]) {
    if (tasks[year][month]) {
      if (tasks[year][month][day]) {
        writeTask(name, description, day, month, year);
      } else {
        tasks[year][month][day] = [];
        writeTask(name, description, day, month, year);
      }
    } else {
      tasks[year][month] = {};
      tasks[year][month][day] = [];
      writeTask(name, description, day, month, year);
    }
  } else {
    tasks[year] = {};
    tasks[year][month] = {};
    tasks[year][month][day] = [];
    writeTask(name, description, day, month, year);
  }

  selectedYearMonth();
  
  blockAddTask.classList.remove('active');
  
  clearFieldAddedTask();

  isAddingTask = false;
}

function writeTask(name, description, day, month, year) {
  tasks[year][month][day].push({
    id: ++countTasks,
    name,
    description,
    date: {
      year,
      month,
      day
    },
    executed: false
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('countTasks', countTasks);
}

function clearFieldAddedTask() {
  document.querySelector('.field-task-name').value = '';
  document.querySelector('.field-task-description').value = '';
  
  btnChangeAddTaskDate.textContent = 'выберите дату ...';
  btnChangeAddTaskDate.classList.remove('changed');
}