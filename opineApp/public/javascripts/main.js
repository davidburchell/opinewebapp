
async function goToPage(){
    try{
        var children = this.parentElement.children;
        var caseNumber = children[4].innerText;
        caseNumber = caseNumber.replace(/\s/g, '');
        console.log(caseNumber);
        var url = '/case/'+caseNumber;
        window.location.href = url;
    } catch (error) {
        console.error(error.message);
    }
}

function addButtonListeners() {
    var caseButtons = document.getElementsByClassName("caseLinkButton");
    for(let i = 0; i < caseButtons.length; i ++){
        caseButtons[i].addEventListener("click", goToPage);
    }
}

window.addEventListener("load", addButtonListeners);