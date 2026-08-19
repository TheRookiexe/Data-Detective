console.log("Data Detective frontend loaded")
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
item.addEventListener('click', function(e) {
    document.querySelector('.menu-item.active')?.classList.remove('active');
    this.classList.add('active');
});
});