//Cameron L'Ecuyer, Project 1
//Several function based on examples provided by instructor

//Called on document ready, establishes controller object
$(document).ready(function(){
    var controller = new Controller(movies["movies"]);
});

//Main contolling function for webpage
function Controller(data){
    this.movies = data; // stores the data in a variable for use
    
    /*** constants ***/
    //store various ids of html elements
    this.movies_div="#movies";
    this.grid_icon="#grid_icon";
    this.list_icon="#list_icon";
    this.combo_box="#combo_box";
    this.field="#field";
    this.search_button="#search_button";
    this.movie_template="#movie-template";
    
    //bind some events
    var self = this; //pass a reference to controller
    //make_grid caller wrapper
    var make_grid_function=function(){
        self.make_grid.call(self);
    };
    //make_list caller wrapper
    var make_list_function=function(){
        self.make_list.call(self);
    };
    //sort_movies caller wrapper
    var sort_movies=function(){
        self.sort_movies.call(self);
    };
    //search_movies caller wrapper
    var search_movies=function(){
        $("#movies").children().show(); // displays all movies
        self.search.call(self);
    };
    //search_on_button_click caller wrapper
    var search_click=function(){
        self.search.call(self); // calls search first to populate search box
        self.search_click.call(self);
    };
    
    //event listeners
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change',sort_movies);
    $(this.field).on('keyup',search_movies);
    $(this.search_button).on('click',search_click);
    //listens for click on element to hide suggestions
    $("html").on('click',function(){
        $("#suggestions_box").hide();
     });
    
    //calls sort_movies instead of load_movies
    //as to sort movies on launch
    this.sort_movies();
};

//load_movies loads the data into the template for the webpage
Controller.prototype.load_movies=function(){
    //get the template
    var template=$(this.movie_template).html(); //get the template
    var html_maker = new htmlMaker(template); //create an html Maker
    var html = html_maker.getHTML(this.movies); //generate dynamic HTML based on the data
    $(this.movies_div).html(html);
};

//sort_movies sorts the movies in ascending order
Controller.prototype.sort_movies=function(){
    var by=$(this.combo_box).val().toLowerCase();
    this.movies=this.movies.sort(
            function(a,b){
                if(a[by]<b[by])
                    return -1;
                if(a[by]==b[by])
                    return 0;
                if(a[by]>b[by])
                    return 1;
            }            
            );
    
    //after sorting calls load_movies based on sorted data
    this.load_movies();
    //is called to adjust inaccurate data for template creation
    this.adjust_content();
};

//make_grid changes display style
Controller.prototype.make_grid=function(){
    $(this.movies_div).attr("class", "grid");
    $(this.grid_icon).attr("src", "images/grid_pressed.jpg");
    $(this.list_icon).attr("src", "images/list.jpg");
};

//make_list changes display style
Controller.prototype.make_list=function(){
    $(this.movies_div).attr("class", "list");
    $(this.grid_icon).attr("src", "images/grid.jpg");
    $(this.list_icon).attr("src", "images/list_pressed.jpg");
};

//adjust_content is a wrapper function for various adjustments
Controller.prototype.adjust_content=function(){
    this.adjust_year();
    this.adjust_hd();
    this.adjust_rating();
};

//adjust_year places parenthesis around the year
Controller.prototype.adjust_year=function(){
    //loops through all the children in the movies section
    for(var i=0; i < $("#movies").children().length; i++)
    {
        //finds all the year classed divs to adjust text
        $("div.year").eq(i).text("("+$("div.year").eq(i).text()+")");
    } // end loop
};

//adjust_hd changes the display settings for the hd image
Controller.prototype.adjust_hd=function(){
    //loops through every hd image
    $("img.hd").each(function()
    {
        //compares the alt tag which holds the display status from the
        //input data
        if($(this).prop("alt")=="false")
        {
            //if the display status is false, the class is changed
            $(this).toggleClass("hd hd_hide");
        } // end if
    });
};

//adjust_rating changes the rating from a number to the star images 
Controller.prototype.adjust_rating=function(){
    //max number of stars
    var numStars = 5;
    
    //loops through all the children of the movies section
    for(var i=0; i < $("#movies").children().length; i++)
    {
        //gets the data from the template creation
        var rating=parseInt($("div.rating").eq(i).text());
        //empties the rating div
        $("div.rating").eq(i).text("");
        //holder variable for the stars
        var stars = "";
        
        //loops through to place the gold stars
        for(var j=0; j < rating; j++)
        {
            stars += "<img class='star' src='images/gold_star.png'>";
        } // end loop
        
        //switches from gold stars to empty stars
        rating = numStars - rating;
        
        //loops through to place the empty stars
        for(var j=0; j < rating; j++)
        {
            stars += "<img class='star' src='images/regular_star.png'>";
        } // end loop
        
        //places the stars in the rating div
        $("div.rating").eq(i).html(stars);
    } // end loop
};

//search searches the movie list
Controller.prototype.search=function()
{
    var movie_list = this.movies; //saves the data from the controller
    var movie_search = []; //array for search data
    var movie_string = ""; // holds movie information for search array
    var html = ""; //stores the html for suggestions box
    var value = $("#field").val(); //gets the value of the text box
    var show=false; //toggles suggestions box

    //loops through all the children in the movies section
    for(var i=0; i < $("#movies").children().length; i++)
    {
        //gets the title, year, starring, and description data and saves
        //it to a string for easy searching
        movie_string = movie_list[i].title + ' ';
        movie_string += '(' + movie_list[i].year + '), ';
        movie_string += movie_list[i].starring + '; ';
        movie_string += movie_list[i].description;
        
        //pushes the string into an array
        movie_search.push(movie_string);
    } // end loop
    
    //restricts the number of displayed elements
    var count=0;
    
    //loops through the array of strings to find matches
    $.each(movie_search, function (i, val) {
        //saves the search result
        var start = movie_search[i].toLowerCase().search(value.toLowerCase().trim());
        //if a match is found, creates the element to display
        if (start != -1)
        {
            //create the sub_suggestion div and save its position in data-item
            html += "<div class='sub_suggestions' data-item='" + i + "' >";
            //bolds the title
            html += "<b>"+movie_search[i].substring(0, movie_search[i].indexOf(' ('))+"</b>";
            //adds the year
            html += movie_search[i].substring(movie_search[i].indexOf(' ('),movie_search[i].indexOf(')')+1);
            //places the Starring tag before the starring actors/actresses
            html += " Starring: "+movie_search[i].substring(movie_search[i].indexOf(')') + 2,movie_search[i].indexOf('; '));
            html += "</div>";
            show=true; //show suggestions
            count++; // icrements count to limit results
        } // end if
    });
    
    //if show is toggles display suggestions
    if(show)
    {
        //populates the suggestions box
        $("#suggestions_box").html(html);
        
        // if count is more than 5, hide some results
        if(count >= 5)
        {
            //loops through the sub_suggestions and hides all after the 5th result
            for(var i=5; i < $("#suggestions_box").children(".sub_suggestions").length; i++)
            {
                $("div.sub_suggestions").eq(i).hide();
            } // end loop
        } // end if
        
        //get the children of suggestions_box with .sub_suggestions class
        $("#suggestions_box").children(".sub_suggestions").on('click',function(){
            var item=parseInt($(this).attr('data-item')); //get the data
            $("#field").val(movie_list[item].title); //show it in the field
            $("#suggestions_box").hide(); //hide the suggestion box
        });
        
        // show the suggestions
        $("#suggestions_box").show();
    }
    else
    {
        // hides the suggestions
       $("#suggestions_box").hide();
   } // end if
};

//search_click is used when the user clicks the search button
//search is based on the suggestions box results
Controller.prototype.search_click=function()
{
    //hides the suggestions box
    $("#suggestions_box").hide();
    //holds the matches index
    var matches = [];
    
    //loops through suggestions box and gathers all matches
    for(var i=0; i < $("#suggestions_box").children().length; i++)
    {
        // pushes the matches index to an array
        matches.push(parseInt($("div.sub_suggestions").eq(i).attr('data-item')));
    } // end loop
    
    //hides all the movies
    $("#movies").children().hide();
    
    //loops through results to display matched movies
    for(var i=0; i < matches.length; i++)
    {
        //shows the movies that match the results
        $("div.movie").eq(matches[i]).show();
    } // end loop
};