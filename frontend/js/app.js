const menuItems = document.querySelectorAll('.menu-item');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('real-file-input');
const fileNameDisplay = document.getElementById('selected-file-name');
const fileDelBtn = document.getElementById('delete-file-btn');


uploadBtn.addEventListener('click', function(){
    fileInput.click();
});

fileInput.addEventListener('change', function(){
    if (fileInput.files.length>0){
        console.log(fileInput.files);
        fileNameDisplay.textContent = ' Selected: '+fileInput.files[0].name;
        fileNameDisplay.style.display = 'block';
        fileDelBtn.style.display = 'block';

    } else {
        resetFileSection();
    }   
});

fileDelBtn.addEventListener('click', function(e){
    e.stopPropagation();
    resetFileSection();
})

function resetFileSection(){
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileDelBtn.style.display = 'none';
    fileNameDisplay.style.display = 'none';
}


menuItems.forEach(item => {
item.addEventListener('click', function(e) {
    document.querySelector('.menu-item.active')?.classList.remove('active');
    this.classList.add('active');
});
});
