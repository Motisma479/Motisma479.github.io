$(document).on("click", ".projectDescriptionButton", function(){
    var id = $(this).attr('id'); // Get the ID of the clicked button
    $("#" + id + ".projectDescription").toggle(100); // Toggle the element with the corresponding ID
});

var colors;

function LinkToAPI(url) {
    // Extract the repository path from the input URL
    var repoPath = url.split("github.com/")[1];
    // Construct the GitHub API URL for the languages endpoint
    var apiURL = "https://api.github.com/repos/" + repoPath + "/languages";
    return apiURL;
}

async function GetLanguagesList(apiURL) {
    const response = await fetch(`https://get-repo-data.robion-mathieu-16.workers.dev/?repolink=${apiURL}`);
    const languages = await response.json();


    var languagesList = [];
    var totalLanguages = Object.values(languages).reduce((a, b) => a + b, 0);
    var totalLanguagesRounded = 0;

    Object.keys(languages).forEach(function(key) {
        var language = key;
        var languageObject = {
            name: language,
            percentage: ((languages[key] / totalLanguages) * 100).toFixed(1)
        };
        totalLanguagesRounded+=Number(languageObject.percentage);
        languagesList.push(languageObject);
    });

    if(totalLanguagesRounded > 100)
    {
        languagesList[0].percentage -= (totalLanguagesRounded - 100);
    }

    return languagesList
}

function GetLanguageColor(language) {
    if(language in colors)
    {
        var color = colors[language]["color"];
        if(color == null)
           color = "#ededed";
        return color;
    }
    return "#ededed";
}

function formatNumberWithLeadingZero(number, maxNumber) {
    const maxDigits = maxNumber.toString().length;
    const leadingZeros = maxDigits - number.toString().length + 1;
    return number.toString().padStart(leadingZeros, '0');
}

$(document).ready(function() {
    $.ajax({
        url: 'data/colors.json',
        dataType: 'json',
        async: false, // Make the request synchronous
        success: function(data) {
            colors = data;
        }
    });

    var projects; // Variable to store the JSON data

    $.ajax({
    	url: 'data/projects.json',
    	dataType: 'json',
    	async: false, // Make the request synchronous
    	success: function(data) {
    		projects = data;
    	}
    });

    var projectBlockId = 0;
    projects.forEach(function(project) {
        
        var projectName = project["name"];
        var repoUrl = project["url"];
        var previewArray = project["preview"];
        var description = project["description"];

        languagesList = GetLanguagesList(LinkToAPI(repoUrl));

       var Block = "";

        Block += ("<div class= \"projectBlock\">\
                            <div class =\"projectPreview\">");
        if(previewArray.length > 1)
        {
            Block += (" <div class=\"previousImage imageButton\" id=\""+projectBlockId+"\" btndir=\"-1\"><i class=\"fi fi-rr-angle-left\"></i></div>\
            <div class=\"nextImage imageButton\" id=\""+projectBlockId+"\" btndir=\"1\"><i class=\"fi fi-rr-angle-right\"></i></div>\
            <p id=\""+projectBlockId+"\" class=\"numberImage\">"+formatNumberWithLeadingZero(1,previewArray.length)+"/"+previewArray.length+"</p>");
        }
        Block += ("             <div>\
                                    <img id=\""+projectBlockId+"\" class=\"preview\" src=\""+previewArray[0]+"\", width=\"100%\", height=\"100%\" imageArray=\""+previewArray+"\" position=\"0\"/>\
                                    <img id=\""+projectBlockId+"\" class=\"newImage\" src=\""+previewArray[0]+"\" />\
                                </div>\
                            </div>\
                            <table style= \"width: 95%; margin: 0px auto; margin-bottom: 5px;\">\
                                <th style= \"width: 50%;\">\
                                    <a href=\""+repoUrl+"\"><h2 class= \"projectTitle\">"+projectName+"</h2></a>\
                                </th>\
                                <th>\
                                    <div class= \"LanguagesBlock\">\
                                        <h2 class= \"LanguagesTitle\">Languages</h2>\
                                        <div class= \"LanguagesBar\">\
                                            <span data-view-component= \"true\" class= \"Progress\">");
                                            languagesList.forEach(function(language) {
                                                Block +=("<span style=\"background-color:"+GetLanguageColor(language.name)+"!important; width: "+language.percentage+"%;\" class=\"Progress-item\"></span>");    
                                            })
        Block += ("                  </span>\
                                        </div>\
                                        <ul class = \"LanguagesList\">");
                                        languagesList.forEach(function(language) {
                                            Block +=("<li>\
                                                        <a class=\"Language\">\
                                                        <svg style=\"color:"+GetLanguageColor(language.name)+";\"  height=\"16\" width=\"16\"  class=\"LanguageDot\">\
										                    <path d=\"M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z\"></path>\
									                    </svg>\
                                                        <span class=\"LanguageName\">"+language.name+"</span>\
                                                        <span class=\"LanguagePercentage\">"+language.percentage+"%</span>\
                                                        </a>\
                                                    </li>");
                                        })
        Block += ("              </ul>\
                                    </div>\
                                </th>\
                            </table>\
                            <div id=\""+projectBlockId+"\" class=\"projectDescription\" hidden>\
                                <p>"+description+"</p>\
                            </div>\
                            <div id=\""+projectBlockId+"\" class=\"projectDescriptionButton\" >\
                                <i class=\"fi fi-rr-menu-dots\"></i>\
                            </div>\
                        </div>");

        $("main").append(Block);
        projectBlockId += Number(1);
    });

    //-----------------------------------------------------------------------------------

});

let clickButtonPlay = false;
$(document).on("click", ".imageButton", function(){
    if(clickButtonPlay)
    {
        // stop the user from clicking more than once;
        return;
    }
    clickButtonPlay = true;
    

    var id = $(this).attr('id'); // Get the ID of the clicked button
    
    var preview = $("#" + id + ".preview");
    var newImage = $("#" + id +".newImage");

    var imageArray = preview.attr('imageArray').split(",");
    var position = Number(preview.attr('position')) + Number($(this).attr('btndir'));

    if(position > imageArray.length-1)
    {
        position = 0;
    }
    else if(position < 0)
    {
        position = imageArray.length-1;
    }

    preview.attr("position", position);
    $("#" + id + ".numberImage").text(formatNumberWithLeadingZero(position+1,imageArray.length)+'/'+imageArray.length);

    var newImg = new Image();
    newImg.src = imageArray[position];
    newImg.onload = function() {
        newImage.attr("src", newImg.src);
        newImage.animate({ opacity: 1 }, "slow", function()
        {
            preview.attr("src", newImg.src);
            $(this).css("opacity", 0);
            clickButtonPlay = false;
        });
    }
    
});
