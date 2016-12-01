function selectAllAnnotators(...colors) {

    console.log("Chiamata a selectAllAnnotators()");

    selectAll = document.getElementById("selectAll");
    if(selectAll.checked == false) {
        document.getElementById("selectAllLabel").innerHTML = "Select All";
    } else {
        document.getElementById("selectAllLabel").innerHTML = "Deselect All";
    }

    checkboxes = document.getElementsByClassName("ckbx");
    var j;
    for(j = 0; j < checkboxes.length; j++) {
        if(selectAll.checked != checkboxes[j].checked) {
            annotations = document.getElementsByClassName(colors[j]);
            buttons = document.getElementsByClassName('btn' + colors[j]);
            console.log(buttons);
            var i;
            for(i = 0; i < annotations.length; i++) {
                if(annotations[i].style.backgroundColor != "transparent") {
                    annotations[i].style.backgroundColor = "transparent";
                    buttons[i].style.display = "none";
                }
                else {
                    annotations[i].style.backgroundColor = colors[j];
                    buttons[i].style.display = "inline";
                }
            }
        }
        if(selectAll.checked == true) {
            checkboxes[j].checked = true;
        } else {
            checkboxes[j].checked = false;
        }
    }
    
}
