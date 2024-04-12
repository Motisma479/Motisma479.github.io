$(document).on("click", ".menuIcon", function(){
    $(this).toggleClass("active");
    $(".navButtons").toggleClass("active");
    $(".navigation").toggleClass("active");
    $(".menuIcon i").toggleClass("fi-rr-menu-burger fi-rr-cross-small");
});