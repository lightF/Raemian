let menu_btn = document.querySelector("#menus");

menu_btn.addEventListener("click",function(e){
     let lis = document.querySelectorAll("#menus>li");
     var menu_node = [].indexOf.call(lis,e.target);
     var go_page="";
     switch(menu_node){
        case 0:
        go_page = "";
        break;
        case 1:
        go_page = "";
        break;
        case 2:
        go_page = ""; 
        break;
        case 3:
        go_page = ""; 
        break;
        case 4:
        go_page = "";    
        break;
     }
     location.href=go_page;
});