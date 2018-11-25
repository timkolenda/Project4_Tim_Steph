// APP OBJECT
const movieApp = {}

movieApp.userSelectionObject = {};

//VARIABLES
movieApp.baseURL = "https://api.themoviedb.org/3/";
movieApp.accessKey = "f0ba00aa70aa95e488fb89869bf99a39";


//SEARCH TYPES
movieApp.discoverMovie = 'discover/movie';
movieApp.searchForActor = `search/person`;
movieApp.searchConfig = 'configuration';
// movieApp.searchMovieTrailor = 'movie/383498/videos'
// movieApp.searchMovieTrailor = 'movie/338952/videos?api_key=f0ba00aa70aa95e488fb89869bf99a39'
movieApp.searchMovieTrailer = `movie/${movieApp.userSelectionObject.movieID}/videos`;
// console.log('up here', movieApp.userSelectionObject);


// USER SELECTION
// movieApp.userActorSelection = "Brad Pitt";

//Data Objects
movieApp.APIOnly = {
    api_key: movieApp.accessKey,
}


movieApp.getPersonInfoDataObject = {
    api_key: movieApp.accessKey,
    // query: movieApp.userActorSelection,
};
movieApp.getMovieInfoDataObject = {
    api_key: movieApp.accessKey,
    sort_by: 'vote_average.asc',
    //CURRENTLY DROPPING THE ACTOR ID DIRECTLY IN
};



//APP INIT
movieApp.init = function () {
    movieApp.search();
    movieApp.showVideo();
    movieApp.hideVideo();
    // .then(movieApp.getMovieInfo())
    // .then(movieApp.getConfiguration())
    // .then(movieApp.getVideos())
};

$(function () {
    movieApp.init();
});

// movieApp.displaySearch = function(){
//     $('.hero__form--btn').on('click', function(){
//         $('.results').addClass('')
//     });
// }

// movieApp.search = function () {
//     $('.hero__form').on('submit', function (event) {
//         event.preventDefault();
//         $('.results').removeClass('visuallyhidden');
//         console.log('set');
//         console.log(`${$('.hero__form--input').val()}`);
//         movieApp.userActorSelection = $('.hero__form--input').val();
//         // movieApp.getPersonInfo();

//     })
// }

movieApp.search = function(){
    $('.hero__form').on('submit', function(event){
        event.preventDefault();
        // console.log('set');
        // console.log(`${$('.hero__form--input').val()}`);
        movieApp.getPersonInfoDataObject.query = $('.hero__form--input').val();
        movieApp.getPersonInfo();
        // alert the user if they do not enter any actor name
        // $('.results').removeClass('visuallyhidden');
        // $('.hero__heading--blue').addClass('animate');
        // $('html, body').animate({ scrollTop: $('header').height() }, 3000);
        // $('.hero__heading--blue').removeClass('animate');
        //some stuff
        })
}

movieApp.displayMovieInfo = function(){
    $('.results').removeClass('visuallyhidden');
    $('.hero__heading--blue').addClass('animate');
    $('html, body').animate({ scrollTop: $('header').height() }, 3000);
}



movieApp.getData = function(searchType, data, callback){
    console.log('good');
    return $.ajax({
        url: `${movieApp.baseURL}${searchType}`,
        dataType: 'jsonp',
        method: 'GET', 
        data: data
    }).then((res) => {
        // console.log(movieApp.userSelectionObject);
        // console.log(res);
        // return res;
        callback(res);
    })
}

movieApp.getPersonInfo = function(){
    console.log('good');
    movieApp.getData(movieApp.searchForActor, movieApp.getPersonInfoDataObject, movieApp.extractPersonInfo);
    // const personInfoPromise = movieApp.getData(movieApp.searchForActor, movieApp.getPersonInfoDataObject);
    // personInfoPromise.then((res) => {
    //     movieApp.getMovieInfoDataObject.with_person = res.results[0].id;
    //     console.log('when actor is chosen',movieApp.getMovieInfoDataObject.with_person);
    //     movieApp.userSelectionObject.profilePath = res.results[0].profile_path;
    //     movieApp.userSelectionObject.name = res.results[0].name;
    //     console.log('1');
    // });
    // return personInfoPromise;
}

movieApp.extractPersonInfo = function(theDataWeGot){
    console.log('it fuckin worked')
    
    movieApp.getMovieInfoDataObject.with_cast = theDataWeGot.results[0].id;
    console.log(theDataWeGot);
    if (theDataWeGot === undefined) {
        swal("Error", "Please enter a valid actor name!", "error");
    } else {
    // console.log('when actor is chosen', movieApp.getMovieInfoDataObject);
    movieApp.userSelectionObject.profilePath = theDataWeGot.results[0].profile_path;
    movieApp.userSelectionObject.name = theDataWeGot.results[0].name;
    // console.log('worked', theDataWeGot);
    // movieApp.getMovieInfo();    
    }
}


movieApp.getMovieInfo = function(){
    movieApp.getData(movieApp.discoverMovie, movieApp.getMovieInfoDataObject, movieApp.movieSelector);
}

movieApp.movieSelector = function (theDataWeGot){
    movieApp.userSelectionObject.movieList = theDataWeGot.results.filter(function(film){
        return film.vote_count >= 25;
    });
    console.log('list', movieApp.userSelectionObject.movieList);
    movieApp.extractMovieInfo();
}

movieApp.extractMovieInfo = function (){
    console.log("made it this far")
    // movieApp.movieSelector();
    movieApp.userSelectionObject.movieTitle = movieApp.userSelectionObject.movieList[0].title;
    // console.log(movieApp.userSelectionObject.movieTitle);
    movieApp.userSelectionObject.movieOverView = movieApp.userSelectionObject.movieList[0].overview;
    // console.log(movieApp.userSelectionObject.movieOverView);
    movieApp.userSelectionObject.movieID = movieApp.userSelectionObject.movieList[0].id;
    // console.log(movieApp.userSelectionObject.movieID);
    movieApp.userSelectionObject.moviePosterEndPoint = movieApp.userSelectionObject.movieList[0].poster_path;
    // console.log(movieApp.userSelectionObject.moviePosterEndPoint);
    movieApp.userSelectionObject.moviePopularity = movieApp.userSelectionObject.movieList[0].popularity;
    // console.log(movieApp.userSelectionObject.moviePopularity);
    movieApp.userSelectionObject.movieRating = movieApp.userSelectionObject.movieList[0].vote_average;
    // console.log(movieApp.userSelectionObject.movieRating);
    // console.log(movieApp.userSelectionObject.movieList);
    movieApp.getConfiguration();
        // return
    // }
}


//use to get config data
movieApp.getConfiguration = function(){
    movieApp.getData(movieApp.searchConfig, movieApp.APIOnly, movieApp.extractConfigData);
}

movieApp.extractConfigData = function (theDataWeGot){
    movieApp.userSelectionObject.imageBaseURL = theDataWeGot.images.secure_base_url;
    movieApp.userSelectionObject.posterSize = theDataWeGot.images.poster_sizes[2];
    movieApp.userSelectionObject.stillSize = theDataWeGot.images.still_sizes[1];
    movieApp.userSelectionObject.profileSize = theDataWeGot.images.profile_sizes[1];
    console.log(theDataWeGot);
    // console.log(movieApp.userSelectionObject.movieID);
    // console.log(movieApp.searchMovieTrailor);
    movieApp.getVideos();
    
}


movieApp.getVideos = function(){
    movieApp.getData(`movie/${movieApp.userSelectionObject.movieID}/videos`, movieApp.APIOnly, movieApp.extractVideoInfo);
}

movieApp.extractVideoInfo = function (theDataWeGot){
    console.log('worked',theDataWeGot);
    if(theDataWeGot.results.toString()){
        movieApp.userSelectionObject.videoKey = theDataWeGot.results[Math.floor(Math.random() * theDataWeGot.results.length)].key;
    }
    movieApp.organizeData();
}

movieApp.organizeData = function(){
    movieApp.userSelectionObject.videoLink = `https://www.youtube.com/embed/${movieApp.userSelectionObject.videoKey}`
    
    // console.log(movieApp.userSelectionObject.videoLink);
    movieApp.userSelectionObject.moviePoster = `${movieApp.userSelectionObject.imageBaseURL}${movieApp.userSelectionObject.posterSize}${movieApp.userSelectionObject.moviePosterEndPoint}`
    // console.log(movieApp.userSelectionObject.moviePoster);
    console.log(movieApp.userSelectionObject);
    console.log('done');
    movieApp.addMovieInfoToSite();
}

movieApp.addMovieInfoToSite = function(){
    movieApp.addTitleToSite();
    movieApp.addPosterImageToSite();
    movieApp.addOverViewToSite();
    movieApp.addRatingToSite();
    movieApp.addTrailerToSite();
    movieApp.displayMovieInfo()
}

movieApp.addTitleToSite = function(){
    $('.content-container__title').html(`${movieApp.userSelectionObject.movieTitle}`);
}

movieApp.addPosterImageToSite = function(){
    $('.content-container__left--img').attr('src', movieApp.userSelectionObject.moviePoster);
}

movieApp.addOverViewToSite = function(){
    $('.content-container__text').html(`${movieApp.userSelectionObject.movieOverView}`);
}

movieApp.addRatingToSite = function(){
    $('.content-container__rating').html(`${movieApp.userSelectionObject.movieRating}/10`)
}

movieApp.addTrailerToSite = function(){
    $('.video-trailer').attr('src', movieApp.userSelectionObject.videoLink);
}



movieApp.showVideo = function(){
    $('.content-container__button').on('click', function(){
        $('.video').toggleClass('video--active');
    });
}

movieApp.hideVideo = function(){
    $('.video').on('click', function(){
        $('.video').toggleClass('video--active');
        $('.video-trailer').each(function () {
            var el_src = $(this).attr("src");
            $(this).attr("src", el_src);
        });
    });
}









// movieApp.getData(movieApp.discoverMovie, null, movieApp.userSelectionObject.userActorSelectionID);
//^^^^^^ Technically this function pulls movies based on the actor that saved in user actor selection - wonky though


//ask the api for an actor's data
//push the id and poster end point to the actor object
//use the id to ask the api for a list of movies
//push the movie id, poster endpoint, video endpoint, movie rating, popularity, synopsis to the object


//questions
//is this readable
//should I just create multiple functions that talk to the API
//}