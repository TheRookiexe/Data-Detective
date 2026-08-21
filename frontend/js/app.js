const menuItems = document.querySelectorAll('.menu-item');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('real-file-input');
const fileNameDisplay = document.getElementById('selected-file-name');
const fileDelBtn = document.getElementById('delete-file-btn');
const submitBtn = document.getElementById('submit-btn');

uploadBtn.addEventListener('click', function(){
    fileInput.click();
});

fileInput.addEventListener('change', function(e){
    if (fileInput.files.length>0){
        e.stopPropagation();
        console.log(fileInput.files);
        fileNameDisplay.textContent = ' Selected: '+fileInput.files[0].name;
        fileNameDisplay.style.display = 'block';
        fileDelBtn.style.display = 'block';
        submitBtn.style.display = 'inline-flex'

    } else {
        resetFileSection();
    }   
});

fileDelBtn.addEventListener('click', function(e){
    e.stopPropagation();
    resetFileSection();
})

let analysisResult = null;
submitBtn.addEventListener('click', async(e)=>{
    e.stopPropagation();
    if (fileInput.files.length === 0) {
        return;
    }
    submitBtn.disabled = true;
    const formInput = new FormData();
    formInput.append('file', fileInput.files[0])
    submitBtn.textContent = "ANALYZING...";
    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            body: formInput
        });

        if (!response.ok) {
            throw new Error(`Http Error: ${response.status}`);
        }

        const result = await response.json();
        analysisResult = result;

        console.log("this is response:");
        console.log(result);

        submitBtn.textContent = "ANALYZED";

    } catch (error) {

        console.error(error);
        submitBtn.textContent = "FAILED";

    } finally {

        submitBtn.disabled = false;

    }
    
});

// helper functions
function resetFileSection(){
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileDelBtn.style.display = 'none';
    fileNameDisplay.style.display = 'none';
    submitBtn.style.display = 'none';
}


menuItems.forEach(item => {
item.addEventListener('click', function(e) {
    document.querySelector('.menu-item.active')?.classList.remove('active');
    this.classList.add('active');
});
});
