var slideIndex = 0;
var numGames = 0;
var auto;

$(document).ready(function(){
    loadSlides();
    // automatically cycle through the slides
    var auto = setInterval(function(){plusSlides(1);}, 3000);
});

// load the slides from the json file
function loadSlides(){
    $(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "resources/games.json",
        dataType: "json",
        success: function(data, status){

            // loop through each game
            var games = data["games"];
            numGames = games.length;
            for(var i = 0; i < numGames; i++){
                var title = games[i]["title"];
                var img = games[i]["image"];
                var filename = games[i]["filename"];

                // construct the slide for this game
                var slide = $("<div class='mySlides fade'></div>");
                slide.append("<div class='numbertext'>" + (i+1) + "/" + numGames + "</div>");
                slide.append("<a href='game.php?game=" + filename + "'><img src='resources/" + img + "'/></a>");
                slide.append("<div class='game-title'>" + title + "</div>");

                //add to slideshow
                $("#slideshow-container").append(slide);
                showSlides(slideIndex);
            }
        },
        error: function(msg){
            alert("There was a problem: " + msg.status + " " + msg.statusText);
        }
    });
});
}


// Next/previous controls
function plusSlides(n) {
    // reset the interval so it doesn't double switch
    clearInterval(auto);
    auto = setInterval(function(){plusSlides(1);}, 3000);

    slideIndex += n;
    showSlides();
}

function showSlides() {

    if(slideIndex < 0)
        slideIndex = numGames-1;
    if(slideIndex >= numGames)
        slideIndex = 0;
    console.log(slideIndex);
    $(".mySlides").hide();
    $(".mySlides:nth-of-type(" + (slideIndex+1) + ")").show();
}



