

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
movieApp.searchMovieTrailor = 'movie/338952/videos'
// movieApp.searchMovieTrailor = 'movie/338952/videos?api_key=f0ba00aa70aa95e488fb89869bf99a39'
// movieApp.searchMovieTrailor = `movie/${movieApp.userSelectionObject.movieID}/videos`;


// USER SELECTION
movieApp.userActorSelection = "Brad Pitt";

//Data Objects
movieApp.APIOnly = {
    api_key: movieApp.accessKey,
}

movieApp.empty = {}

movieApp.getPersonInfoDataObject = {
    api_key: movieApp.accessKey,
    query: movieApp.userActorSelection,
};
movieApp.getMovieInfoDataObject = {
    api_key: movieApp.accessKey,
    // sort_by: 'popularity.asc',
    //CURRENTLY DROPPING THE ACTOR ID DIRECTLY IN
    // with_people: movieApp.userSelectionObject.userActorSelectionID
};



//APP INIT
movieApp.init = function () {
    movieApp.getPersonInfo()
    .then(movieApp.getMovieInfo())
    .then(movieApp.getConfiguration())
    .then(movieApp.getVideos())

    

};

$(function () {
    movieApp.init();
});


movieApp.getData = function(searchType, data){
    return $.ajax({
        url: `${movieApp.baseURL}${searchType}`,
        dataType: 'jsonp',
        method: 'GET', 
        data: data
    }).then((res) => {
        // console.log(movieApp.userSelectionObject);
        console.log(res);
        return res;
    })
}

movieApp.getPersonInfo = function(){
    const personInfoPromise = movieApp.getData(movieApp.searchForActor, movieApp.getPersonInfoDataObject);
    personInfoPromise.then((res) => {
        // console.log('res', res);
        movieApp.getMovieInfoDataObject.with_person = res.results[0].id;
        // movieApp.userSelectionObject.userActorSelectionID = res.results[0].id;
        movieApp.userSelectionObject.profilePath = res.results[0].profile_path;
        movieApp.userSelectionObject.name = res.results[0].name;
        console.log(movieApp.getMovieInfoDataObject.with_person);
    });
    return personInfoPromise;
}

movieApp.getMovieInfo = function(){
    // console.log('person number called right befor movie info promise',movieApp.getMovieInfoDataObject.with_person);
    const movieInfoPromise = movieApp.getData(movieApp.discoverMovie, movieApp.getMovieInfoDataObject);
    movieInfoPromise.then((res) =>{
        // console.log('movie info object after getMovieInfo is called', movieApp.getMovieInfoDataObject);
        movieApp.userSelectionObject.movieTitle = res.results[0].title;
        movieApp.userSelectionObject.movieOverView = res.results[0].overview;
        movieApp.userSelectionObject.movieID = res.results[0].id;
        movieApp.userSelectionObject.moviePoster = res.results[0].poster_path;
        movieApp.userSelectionObject.moviePopularity = res.results[0].popularity;
    });
    return movieInfoPromise;
}

//use to get config data
movieApp.getConfiguration = function(){
    const configPromise = movieApp.getData(movieApp.searchConfig, movieApp.APIOnly);
    configPromise.then((res) => {
        movieApp.userSelectionObject.imageBaseURL = res.images.secure_base_url;
        movieApp.userSelectionObject.posterSize = res.images.poster_sizes[1];
        movieApp.userSelectionObject.stillSize = res.images.still_sizes[1];
        movieApp.userSelectionObject.profileSize = res.images.profile_sizes[1];
        // console.log(res);
    });
    return configPromise;
    // console.log(res)
}


movieApp.getVideos = function(){
    const videoPromise = movieApp.getData(movieApp.searchMovieTrailor, movieApp.APIOnly);
    // movieApp.getData(movieApp.serchMovieTrailor, movieApp.APIOnly);
    // movieApp.getData(movieApp.serchMovieTrailor, `/movie/${movieApp.userSelectionObject.movieID}/videos`);
    videoPromise.then((res) => {
        console.log('getVids', res);
    });
    return videoPromise;
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
//