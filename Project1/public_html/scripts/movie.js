$(document).ready(function(){
    var controller = new Controller(movies["movies"]);
    $("#search_button").on('click',search);
});

function search(){
    var names = ["Sab", "Sam", "Samir", "Samorai", "Sap"];
    var html = "";
    var value = $("#field").val(); //get the value of the text field
    var show=false; //don't show suggestions

    $.each(names, function (i, val) {
        var start = names[i].toLowerCase().search(value.toLowerCase().trim());
        if (start != -1) { //if there is a search match
            html += "<div class='sub_suggestions' data-item='" + names[i] + "' >";
            html += names[i].substring(0,start)+"<b>"+names[i].substring(start,start+value.length)+"</b>"+names[i].substring(start+value.length,names[i].length);
            html += "</div>";
            show=true; //show suggestions
        }
    });
    if(show){
        $("#suggestions_box").html(html);
        //get the children of suggestions_box with .sub_suggestions class
        $("#suggestions_box").children(".sub_suggestions").on('click',function(){
            var item=$(this).attr('data-item'); //get the data
            $("#field").val(item); //show it in the field
            $("#suggestions_box").hide(); //hide the suggestion box
        });
        
        $("#suggestions_box").show();
    }
    else
       $("#suggestions_box").hide();
}

function Controller(data){
    this.movies = data;
    
    /*** constants ***/
    this.movies_div="#movies";
    this.grid_icon="#grid_icon";
    this.list_icon="#list_icon";
    this.combo_box="#combo_box";
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
    
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change',sort_movies);
    
    this.load_movies();
    this.adjust_content();
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
};

Controller.prototype.adjust_year=function(){
    for(var i=0; i < $("#movies").children().length; i++)
    {
        $("div.year").eq(i).text("("+$("div.year").eq(i).text()+")");
    }
};

Controller.prototype.adjust_starring=function(){
    
};

Controller.prototype.adjust_rating=function(){
    
};