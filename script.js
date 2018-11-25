// APP OBJECTS
const movieApp = {}

movieApp.userSelectionObject = {};

//VARIABLES
movieApp.baseURL = "https://api.themoviedb.org/3/";
movieApp.accessKey = "f0ba00aa70aa95e488fb89869bf99a39";


//SEARCH TYPES
movieApp.discoverMovie = 'discover/movie';
movieApp.searchForActor = `search/person`;
movieApp.searchConfig = 'configuration';

//Data Objects
movieApp.APIOnly = {
    api_key: movieApp.accessKey,
}


movieApp.getPersonInfoDataObject = {
    api_key: movieApp.accessKey,
    // QUERY ADDED IN W/ JS
}

movieApp.getMovieInfoDataObject = {
    api_key: movieApp.accessKey,
    sort_by: 'vote_average.asc',
    //CURRENTLY DROPPING THE ACTOR ID DIRECTLY IN
}



//APP INIT
movieApp.init = function () {
    movieApp.search();
    movieApp.showVideo();
    movieApp.hideVideo();
};

$(function () {
    movieApp.init();
});


movieApp.search = function(){
    $('.hero__form').on('submit', function(event){
        event.preventDefault();
        movieApp.getPersonInfoDataObject.query = $('.hero__form--input').val();
        if (movieApp.getPersonInfoDataObject.query === "") {
            swal("Error", "Please enter a valid actor name!", "error");
        } else {
            movieApp.getPersonInfo();
            }
        })
}

movieApp.getData = function(searchType, data, callback){
    return $.ajax({
        url: `${movieApp.baseURL}${searchType}`,
        dataType: 'jsonp',
        method: 'GET', 
        data: data
    }).then((res) => {
        callback(res);
    })
}

movieApp.getPersonInfo = function(){
    movieApp.getData(movieApp.searchForActor, movieApp.getPersonInfoDataObject, movieApp.extractPersonInfo);
}

movieApp.extractPersonInfo = function(theDataWeGot){
    if (theDataWeGot.total_results === 0) {
        swal("Error", "Please enter a valid actor name!", "error");
    } else {
    movieApp.getMovieInfoDataObject.with_cast = theDataWeGot.results[0].id;
    movieApp.userSelectionObject.profilePath = theDataWeGot.results[0].profile_path;
    movieApp.userSelectionObject.name = theDataWeGot.results[0].name;
    movieApp.getMovieInfo();    
    }
}


movieApp.getMovieInfo = function(){
    movieApp.getData(movieApp.discoverMovie, movieApp.getMovieInfoDataObject, movieApp.movieSelector);
}

movieApp.movieSelector = function (theDataWeGot){
    movieApp.userSelectionObject.movieList = theDataWeGot.results.filter(function(film){
        return film.vote_count >= 25;
    });
    movieApp.extractMovieInfo();
}

movieApp.extractMovieInfo = function (){
    movieApp.userSelectionObject.movieTitle = movieApp.userSelectionObject.movieList[0].title;
    movieApp.userSelectionObject.movieOverView = movieApp.userSelectionObject.movieList[0].overview;
    movieApp.userSelectionObject.movieID = movieApp.userSelectionObject.movieList[0].id;
    movieApp.userSelectionObject.moviePosterEndPoint = movieApp.userSelectionObject.movieList[0].poster_path;
    movieApp.userSelectionObject.moviePopularity = movieApp.userSelectionObject.movieList[0].popularity;
    movieApp.userSelectionObject.movieRating = movieApp.userSelectionObject.movieList[0].vote_average;
    movieApp.getConfiguration();
}

movieApp.getConfiguration = function(){
    movieApp.getData(movieApp.searchConfig, movieApp.APIOnly, movieApp.extractConfigData);
}

movieApp.extractConfigData = function (theDataWeGot){
    movieApp.userSelectionObject.imageBaseURL = theDataWeGot.images.secure_base_url;
    movieApp.userSelectionObject.posterSize = theDataWeGot.images.poster_sizes[2];
    movieApp.userSelectionObject.stillSize = theDataWeGot.images.still_sizes[1];
    movieApp.userSelectionObject.profileSize = theDataWeGot.images.profile_sizes[1];
    movieApp.getVideos();
    
}

movieApp.getVideos = function(){
    movieApp.getData(`movie/${movieApp.userSelectionObject.movieID}/videos`, movieApp.APIOnly, movieApp.extractVideoInfo);
}

movieApp.extractVideoInfo = function (theDataWeGot){
    if(theDataWeGot.results.toString()){
        movieApp.userSelectionObject.videoKey = theDataWeGot.results[Math.floor(Math.random() * theDataWeGot.results.length)].key;
    }
    movieApp.organizeData();
}

movieApp.organizeData = function(){
    movieApp.userSelectionObject.videoLink = `https://www.youtube.com/embed/${movieApp.userSelectionObject.videoKey}`
    movieApp.userSelectionObject.moviePoster = `${movieApp.userSelectionObject.imageBaseURL}${movieApp.userSelectionObject.posterSize}${movieApp.userSelectionObject.moviePosterEndPoint}`
    movieApp.addMovieInfoToSite();
}

movieApp.addMovieInfoToSite = function(){
    movieApp.displayMovieInfo()
    movieApp.addTitleToSite();
    movieApp.addPosterImageToSite();
    movieApp.addOverViewToSite();
    movieApp.addRatingToSite();
    movieApp.addTrailerToSite();
}

movieApp.displayMovieInfo = function () {
    $('.results').removeClass('visuallyhidden');
    $('.hero__heading--blue').addClass('animate');
    $('html, body').animate({ scrollTop: $('header').height() }, 3000);
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



