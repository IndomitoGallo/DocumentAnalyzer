function selectFrameAnnotator(color) {

    console.log("Chiamata a selectFrameAnnotator() --> " + color);

    selectAll = document.getElementById("selectAll");
    check = selectAll.checked;
    condition = false;
    checkboxes = document.getElementsByClassName("ckbx");
    for(var i = 0; i < checkboxes.length; i++) {
        //se ce n'è almeno una uguale a selectAll non devo modificare niente
        if(checkboxes[i].checked == check) {
            condition = true;
        }
    }
    //modifico selectAll
    if(!condition) {
        if(check) {
            document.getElementById("selectAllLabel").innerHTML = "Select All";
            selectAll.checked = false;
        }
        else {
            document.getElementById("selectAllLabel").innerHTML = "Deselect All";
            selectAll.checked = true;
        }
    }

    annotations = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName(color);
    var i;
    for(i = 0; i < annotations.length; i++) {
        if(annotations[i].style.backgroundColor != "transparent") {
            annotations[i].style.backgroundColor = "transparent";
        }
        else {
            annotations[i].style.backgroundColor = color;
        }
    }

    buttons = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName('btn' + color);
    var j;
    for(j = 0; j < buttons.length; j++) {
        if(buttons[j].style.display != "none") {
            buttons[j].style.display = "none";
        }
        else {
            buttons[j].style.display = "inline"
        }
    }
}
