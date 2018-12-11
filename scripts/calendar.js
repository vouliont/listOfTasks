/**
 * return table calendar
 */
function createCalendar(id, year, month) {
  let date = new Date(year, month);
  let day = date.getDay() || 7;
  
  date.setDate(date.getDate() - day + 1);
  
  let tasksThisMonth = (tasks[year] || null) && (tasks[year][month] || null);
  
  let table = document.createElement('table');
  table.id = id;
  
  let innerTable = '<tbody>';
  
  if (date.getMonth() != month) {
    innerTable += '<tr>';
  }
  while (date.getMonth() != month) {
    innerTable += `<td class="other-month">${date.getDate()}</td>`;  
    date.setDate(date.getDate() + 1);
  }

  while (date.getMonth() == month) {
    if (day % 7 == 1) innerTable += '<tr>';
    
    innerTable += `<td data-option="${date.getDate()}">${date.getDate()}`;
    
    if (tasksThisMonth && tasksThisMonth[date.getDate()]) {
      innerTable += `<div class="count-tasks">${tasksThisMonth[date.getDate()].length}</div>`;
    }
    
    innerTable += '</td>';
    
    if (day % 7 == 0) innerTable += '</tr>';
    
    date.setDate(date.getDate() + 1);
    day++;
  }
  
  while (day % 7 - 1 != 0) {
    innerTable += `<td class="other-month">${date.getDate()}</td>`;
    date.setDate(date.getDate() + 1);
    day++;
  }
  
  innerTable += '</tr></tbody>';
  
  table.innerHTML = innerTable;
  
  return table;
}