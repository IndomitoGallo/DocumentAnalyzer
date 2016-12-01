function selectAllFrameAnnotators(...colors) {

    console.log("Chiamata a selectAllFrameAnnotators()");

    selectAll = document.getElementById("selectAll");
    if(selectAll.checked == false) {
        document.getElementById("selectAllLabel").innerHTML = "Select All";
    } else {
        document.getElementById("selectAllLabel").innerHTML = "Deselect All";
    }

    checkboxes = document.getElementsByClassName("ckbx");

    iframe = document.getElementsByTagName("iframe")[0].contentWindow.document;

    var j;
    for(j = 0; j < checkboxes.length; j++) {
        if(selectAll.checked != checkboxes[j].checked) {
            annotations = iframe.getElementsByClassName(colors[j]);
            var i;
            for(i = 0; i < annotations.length; i++) {
                if(annotations[i].style.backgroundColor != "transparent") {
                    annotations[i].style.backgroundColor = "transparent";
                }
                else {
                    annotations[i].style.backgroundColor = colors[j];
                }
            }
        }
        if(selectAll.checked == true) {
            checkboxes[j].checked = true;
        } else {
            checkboxes[j].checked = false;
        }
    }

    buttons = iframe.getElementsByClassName('ann-btn');
    if(selectAll.checked == true) {
        for(var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = "inline";
        }
    } else {
        for(var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = "none";
        }
    }
    
}
