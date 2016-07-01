$(document).ready(function(){
    var controller = new Controller(movies["movies"]);
    //$("#search_button").on('click',search);
});

function Controller(data){
    this.movies = data;
    
    /*** constants ***/
    this.movies_div="#movies";
    this.grid_icon="#grid_icon";
    this.list_icon="#list_icon";
    this.combo_box="#combo_box";
    this.field="#field";
    this.search_button="#search_button"
    this.movie_template="#movie-template";
    
    //bind some events
    var self = this; //pass a reference to controller
    var make_grid_function=function(){
        self.make_grid.call(self);
    };
    
    var make_list_function=function(){
        self.make_list.call(self);
    };
    
    var sort_movies=function(){
        self.sort_movies.call(self);
    };
    
    var search_movies=function(){
        self.search.call(self);
    };
    
    var search_click=function(){
        self.search.call(self);
        self.search_click.call(self);
    };
    
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change',sort_movies);
    $(this.field).on('keyup',search_movies);
    $(this.search_button).on('click',search_click);
    
    this.sort_movies();
};

Controller.prototype.load_movies=function(){
    //get the template
    var template=$(this.movie_template).html(); //get the template
    var html_maker = new htmlMaker(template); //create an html Maker
    var html = html_maker.getHTML(this.movies); //generate dynamic HTML based on the data
    $(this.movies_div).html(html);
};

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
    
    this.load_movies();
    this.adjust_content();
};

Controller.prototype.make_grid=function(){
    $(this.movies_div).attr("class", "grid");
    $(this.grid_icon).attr("src", "images/grid_pressed.jpg");
    $(this.list_icon).attr("src", "images/list.jpg");
};

Controller.prototype.make_list=function(){
    $(this.movies_div).attr("class", "list");
    $(this.grid_icon).attr("src", "images/grid.jpg");
    $(this.list_icon).attr("src", "images/list_pressed.jpg");
};

Controller.prototype.adjust_content=function(){
    this.adjust_year();
    this.adjust_hd();
    this.adjust_rating();
};

Controller.prototype.adjust_year=function(){
    for(var i=0; i < $("#movies").children().length; i++)
    {
        $("div.year").eq(i).text("("+$("div.year").eq(i).text()+")");
    }
};

Controller.prototype.adjust_hd=function(){
    $("img.hd").each(function()
    {
        if($(this).prop("alt")=="false")
        {
            $(this).toggleClass("hd hd_hide");
        }
    });
};

Controller.prototype.adjust_rating=function(){
    var numStars = 5;
    
    for(var i=0; i < $("#movies").children().length; i++)
    {
        var rating=parseInt($("div.rating").eq(i).text());
        $("div.rating").eq(i).text("");
        var stars = "";
        
        for(var j=0; j < rating; j++)
        {
            stars += "<img class='star' src='images/gold_star.png'>";
        }
        
        rating = numStars - rating;
        
        for(var j=0; j < rating; j++)
        {
            stars += "<img class='star' src='images/regular_star.png'>";
        }
        
        $("div.rating").eq(i).html(stars);
    }
};

Controller.prototype.search=function()
{
    var movie_list = this.movies;
    var movie_search = []; //array for search data
    var movie_string = ""; // holds movie information for search array
    var html = ""; //stores the html for suggestions box
    var value = $("#field").val(); //gets the value of the text box
    var show=false; //toggles suggestions box

    for(var i=0; i < $("#movies").children().length; i++)
    {
        movie_string = movie_list[i].title + ' ';
        movie_string += '(' + movie_list[i].year + '), ';
        movie_string += movie_list[i].starring + '; ';
        movie_string += movie_list[i].description;
        
        movie_search.push(movie_string);
    }
    
    $.each(movie_search, function (i, val) {
        var start = movie_search[i].toLowerCase().search(value.toLowerCase().trim());
        if (start != -1)
        { //if there is a search match
            html += "<div class='sub_suggestions' data-item='" + i + "' >";
            html += "<b>"+movie_search[i].substring(0, movie_search[i].indexOf(' ('))+"</b>";
            html += movie_search[i].substring(movie_search[i].indexOf(' ('),movie_search[i].indexOf(')')+1);
            html += " Starring: "+movie_search[i].substring(movie_search[i].indexOf(')') + 2,movie_search[i].indexOf('; '));
            html += "</div>";
            show=true; //show suggestions
        }
    });
    
    if(show)
    {
        $("#suggestions_box").html(html);
        //get the children of suggestions_box with .sub_suggestions class
        $("#suggestions_box").children(".sub_suggestions").on('click',function(){
            var item=parseInt($(this).attr('data-item')); //get the data
            $("#field").val(movie_list[item].title); //show it in the field
            $("#suggestions_box").hide(); //hide the suggestion box
        });
        
        $("#suggestions_box").show();
    }
    else
       $("#suggestions_box").hide();
};

Controller.prototype.search_click=function()
{
    $("#suggestions_box").hide();
    var matches = [];
    
    for(var i=0; i < $("#suggestions_box").children().length; i++)
    {
        matches.push(parseInt($("div.sub_suggestions").eq(i).attr('data-item')));
    }
    
    $("#movies").children().hide();
    
    for(var i=0; i < matches.length; i++)
    {
        $("div.movie").eq(matches[i]).show();
    }
};