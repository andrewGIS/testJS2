var profileMaker = function (){

    // copy vars in module
    function copyVars() {
        
    }

    // make html elements
    function initProfileMaker(){

        $("#map").css("bottom","calc(20px + 25% + 2px)");
        $("#profileContainer").show();
        $("#profileContainer").append("<div id = 'options'></div>")
        
    }

    // clear dom element of Profile
    function resetProfileMaker() {
        $("#profileContainer").hide();
        $("#map").css("bottom","20px");
    }

    return {
        initProfileMaker: initProfileMaker,
        copyVars: copyVars,
        resetProfileMaker: resetProfileMaker
    }
}()