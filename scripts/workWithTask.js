'use strict';

function clickTasksBlock(e) {
  let target = e.target;
  
  while (target.tagName != 'BUTTON') {
    if (target == this) return;
    
    target = target.parentNode;
  }
  
  let task = target.closest('.list-tasks__item')
  
  switch (target.className) {
    case 'btn-task-execute':
      executeTask(task);
      break;
    case 'btn-task-edit':
      editTask(task);
      break;
    case 'btn-task-remove':
      removeTask(task);
      break;
  }
}

function executeTask(task) {
  isExecutingTask = true;
  
  let year = +menuYear.activeItem.getAttribute('data-option');
  let month = +menuMonth.activeItem.getAttribute('data-option');
  let day = +changedDay.getAttribute('data-option');
  let taskId = task.getAttribute('data-id');
  
  for (let i = 0; i < tasks[year][month][day].length; i++) {
    if (taskId != tasks[year][month][day][i].id) continue;
    
    tasks[year][month][day][i].executed = true;
    break;
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  changeDate.call(document.querySelector('#calendar'), {
    target: changedDay
  });
}

function editTask(task) {
  isEditingTask = true;
  
  let year = +menuYear.activeItem.getAttribute('data-option');
  let month = +menuMonth.activeItem.getAttribute('data-option');
  let day = +changedDay.getAttribute('data-option');
  let taskId = task.getAttribute('data-id');
  
  editingTask = {
    id: taskId,
    year,
    month,
    day
  };
  
  for (let i = 0; i < tasks[year][month][day].length; i++) {
    if (taskId != tasks[year][month][day][i].id) continue;
    
    task = tasks[year][month][day][i];
    break;
  }
  
  btnCreateNewTask.textContent = 'Редактировать';
  
  blockAddTask.classList.add('active');
  
  let name = document.querySelector('.field-task-name');
  let description = document.querySelector('.field-task-description');
  
  name.value = task.name;
  description.value = task.description;
  
  btnChangeAddTaskDate.classList.add('changed');
  btnChangeAddTaskDate.textContent = `${(day < 10 ? '0' : '') + task.date.day}.${(month + 1 < 10 ? '0' : '') + (month + 1)}.${year}`;
}

function removeTask(task) {
  let year = +menuYear.activeItem.getAttribute('data-option');
  let month = +menuMonth.activeItem.getAttribute('data-option');
  let day = +changedDay.getAttribute('data-option');
  let taskId = task.getAttribute('data-id');
  
  let indexTask;

  for (let i = 0; i < tasks[year][month][day].length; i++) {
    if (taskId != tasks[year][month][day][i].id) continue;
    
    indexTask = i;
    break;
  }
  
  tasks[year][month][day].splice(indexTask, 1);
  
  // Проводим очистку обьекта tasks, если это нужно
  if (tasks[year][month][day].length == 0) {
    delete tasks[year][month][day];
    if (Object.keys(tasks[year][month]).length == 0) {
      delete tasks[year][month];
      if (Object.keys(tasks[year]).length == 0) {
        delete tasks[year];
      }
    }
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
    
  let queryString = `#calendar td[data-option="${changedDay.getAttribute('data-option')}"]`
  
  selectedYearMonth();
  
  changeDate.call(document.querySelector('#calendar'), {
    target: document.querySelector(queryString)
  });
}