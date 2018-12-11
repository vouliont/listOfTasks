'use strict';

class DropDownMenu {
  constructor(props) {
    this.menu = props.menu;
    this.menu.onclick = this.clickMenu.bind(this);
    
    this.defaultItem = props.defaultItem;
    this.itemClassName = props.itemClassName;
    if (props.onclickCallback) this.callback = props.onclickCallback;
    
    this.activeItem = this.menu.querySelector('.active') || null;
    this.menuOpen = false;
    
    this.closeMenu = () => {
      this.menu.classList.remove('open');
      this.menuOpen = false;
      document.removeEventListener('click', this.closeMenu);
    };
  }
  
  clickMenu(e) {
    let target = e.target;
    
    // Меню закрыто
    if (!this.menuOpen) {
      this.menu.classList.add('open');
      this.menuOpen = true;
      
      setTimeout(() => {
        document.addEventListener('click', this.closeMenu);
      }, 0);
      
      return;
    }
    
    // Меню открыто
    while (!target.classList.contains(this.itemClassName)) {
      if (target.id == this.menu.id) return;
      
      target = target.parentNode;
    }
    
    // Нажатие произошло по полю по умолчанию или по уже активному пункту меню
    if (target == this.defaultItem) return;
    if (target == this.activeItem) {
      this.closeMenu();
      return;
    }
    
    // Нажатие произошло по пункту меню
    e.preventDefault();
    e.stopPropagation();
    
    if (this.activeItem) {
      this.activeItem.classList.remove('active');
    }
    this.activeItem = target;
    this.activeItem.classList.add('active');
    
    this.defaultItem.textContent = this.activeItem.textContent;
    
    this.closeMenu();
    if (this.callback) this.callback();
  }
}