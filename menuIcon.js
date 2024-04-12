$(".menuIcon").click(function(){
    $(this).toggleClass("active");
    $(".navButtons").toggleClass("active");
    $(".navigation").toggleClass("active");
    $(".menuIcon i").toggleClass("fi-rr-menu-burger fi-rr-cross-small");
});