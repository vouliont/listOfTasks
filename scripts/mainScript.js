'use strict';

let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let countTasks = +localStorage.getItem('countTasks') || 0;

let tasksThisDay = null;

let isAddingTask = false;
let isExecutingTask = false;
let isEditingTask = false;

let editingTask = null;

let menuMonth = new DropDownMenu({
  menu: document.querySelector('#menu-month'),
  defaultItem: document.querySelector('.menu-month__item--default'),
  itemClassName: 'menu-month__item',
  onclickCallback: selectedYearMonth
});

let menuYear = new DropDownMenu({
  menu: document.querySelector('#menu-year'),
  defaultItem: document.querySelector('.menu-year__item--default'),
  itemClassName: 'menu-year__item',
  onclickCallback: selectedYearMonth
});

let changedDay = null;

let filter = new DropDownMenu({
  menu: document.querySelector('#filter-tasks'),
  defaultItem: document.querySelector('.filter-tasks__item--default'),
  itemClassName: 'filter-tasks__item',
  onclickCallback: filterTasks
});

/**
 * Выбрано год и месяц - нужно отобразить календарь
 */
function selectedYearMonth() {
  if (!menuMonth.activeItem || !menuYear.activeItem) return;
  
  let month = menuMonth.activeItem.getAttribute('data-option');
  let year = menuYear.activeItem.getAttribute('data-option');
  
  let calendar = createCalendar('calendar', year, month);
  calendar.onclick = changeDate;
  
  removeListTasks();
  
  document.querySelector('.filter-tasks-wrapper').style.display = '';
  
  changedDay = null;
    
  appendCalendar(calendar);
}

/**
 * Вставить календарь. Если нужно, удалить существующий
 */
function appendCalendar(calendar) {
  let oldCalendar = document.getElementById(calendar.id);

  if (oldCalendar) {
    oldCalendar.parentNode.removeChild(oldCalendar);
  }
  
  
  document.querySelector('#calendar-wrapper').appendChild(calendar);
}

function removeListTasks() {
  let oldListTasks = document.querySelector('.list-tasks-wrapper');
  if (oldListTasks) {
    oldListTasks.parentNode.removeChild(oldListTasks);
  }
}

/**
 * Выбрано дату - нужно сгенерировать и отобразить список задач
 */
function changeDate(e) { 
  let target = e.target;
  
  while (target.tagName != 'TD') {
    if (target == this) return;
    
    target = target.parentNode;
  }
  
  if (target.classList.contains('other-month')) return;

  if (target.classList.contains('active')) {
    if (!isExecutingTask) {
      return;
    } else {
      isExecutingTask = false;
    }
  }
  
  let activeItem = this.querySelector('td.active');
  if (activeItem) {
    activeItem.classList.remove('active');
  }
  
  target.classList.add('active');
  
  removeListTasks();
  
  
  let year = +menuYear.activeItem.getAttribute('data-option');
  let month = +menuMonth.activeItem.getAttribute('data-option');
  let day = +target.getAttribute('data-option');
  
  changedDay = target;
  
  let option = filter.activeItem.getAttribute('data-option');
  
  if (confirmBlockChangedDate.classList.contains('visible')) return;
  
  document.querySelector('.filter-tasks-wrapper').style.display = 'block';
  
  showTasks(
    'list-tasks',
    year,
    month,
    day,
    option
  );
}

/**
 * Сгенерировать список задач на заданую дату
 */
function showTasks(id, year, month, day, option) {
  tasksThisDay = null;
  
  if (tasks[year] && tasks[year][month] && tasks[year][month][day]) {
    tasksThisDay = tasks[year][month][day];
  }
  
  // Задач не назначено
  let tasksList = document.createElement('div');
  tasksList.className = id + '-wrapper';
  
  if (!tasksThisDay) {
    tasksList.innerHTML = '<h2>Задач на этот день не назначено</h2>';
    
    appendTasks(tasksList);
    return;
  }
  
  // Задачи назначены
  let innerList = `<h2>Задачи</h2><ul id="${id}">`;
  
  tasksThisDay.map((task) => {
    innerList += `<li data-id="${task.id}" class="${id}__item`;
    
    if (task.executed) {
      innerList += ' executed" data-status="executed"';
    } else {
      let now = new Date();
      
      if (
        (task.date.year < now.getFullYear())
        ||
        (task.date.year == now.getFullYear() && task.date.month < now.getMonth())
        ||
        (task.date.year == now.getFullYear() && task.date.month == now.getMonth() && task.date.day < now.getDate())
      ) {
        innerList += ' overdue';
      }
      innerList += '" data-status="in-work"';
    }
    
    if ((option == 'executed' && !task.executed) || (option == 'in-work' && task.executed)) {
      innerList += ' style="display: none"';
    }
    
    innerList += '>';
    innerList += `<p class="task-name">${task.name}</p>`;
    innerList += (task.description !== '') ? `<p class="task-description">${task.description}</p>` : '';
    
    innerList += '<div class="task-buttons">';
    
    if (!task.executed) {
      innerList += `
        <button class="btn-task-execute"><img src="images/execute.png" alt="execute"></button>
        <button class="btn-task-edit"><img src="images/edit.png" alt="edit"></button>
      `;
    }
    
    innerList += `
        <button class="btn-task-remove"><img src="images/bucket.png" alt="remove"></button>
      </div>
    `;
    
    innerList += '</li>'
  });
    
  innerList += '</ul>';
  
  tasksList.innerHTML = innerList;
  
  tasksList.onclick = clickTasksBlock;
    
  appendTasks(tasksList);
}

/**
 * Вставить список задач. Если нужно, удалить старый список
 */
function appendTasks(list) {
  let oldList = document.getElementById(list.id);
  
  if (oldList) {
    oldList.parentNode.removeChild(oldList);
  }
  
  document.querySelector('#tasks-block').insertAdjacentElement('afterBegin', list);
}

/**
 * Фильтр задач
 */
function filterTasks() {
  let tasks = document.querySelectorAll('.list-tasks__item');
  
  if (!tasks) return;
  
  let option = filter.activeItem.getAttribute('data-option');
  
  Array.prototype.map.call(tasks, (task) => {
    switch (option) {
      case 'all':
        task.style.display = '';
        break;
      case 'in-work':
        if (task.getAttribute('data-status') == 'in-work') {
          task.style.display = '';
        } else {
          task.style.display = 'none';
        }
        break;
      case 'executed':
        if (task.getAttribute('data-status') == 'executed') {
          task.style.display = '';
        } else {
          task.style.display = 'none';
        }
        break;
    }
  });
}