

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
movieApp.searchMovieTrailor = `movie/${movieApp.userSelectionObject.movieID}/videos`;
console.log('up here', movieApp.userSelectionObject);


// USER SELECTION
movieApp.userActorSelection = "Brad Pitt";

//Data Objects
movieApp.APIOnly = {
    api_key: movieApp.accessKey,
}



movieApp.getPersonInfoDataObject = {
    api_key: movieApp.accessKey,
    query: movieApp.userActorSelection,
};
movieApp.getMovieInfoDataObject = {
    api_key: movieApp.accessKey,
    sort_by: 'vote_average.asc',
    //CURRENTLY DROPPING THE ACTOR ID DIRECTLY IN
};



//APP INIT
movieApp.init = function () {
    movieApp.getPersonInfo()
    // .then(movieApp.getMovieInfo())
    // .then(movieApp.getConfiguration())
    // .then(movieApp.getVideos())

    

};

$(function () {
    movieApp.init();
});


movieApp.getData = function(searchType, data, callback){
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
    console.log('when actor is chosen', movieApp.getMovieInfoDataObject);
    movieApp.userSelectionObject.profilePath = theDataWeGot.results[0].profile_path;
    movieApp.userSelectionObject.name = theDataWeGot.results[0].name;
    movieApp.getMovieInfo();    

}


movieApp.getMovieInfo = function(){
    movieApp.getData(movieApp.discoverMovie, movieApp.getMovieInfoDataObject, movieApp.extractMovieInfo);
}

movieApp.extractMovieInfo = function (theDataWeGot){
    // console.log("made it this far")
    // for(let i = 0; i > 21; i++)
    // if (theDataWeGot.results[i].poster_path !== true){  
    //     console.log('loop it!')      
    // } else {
        movieApp.userSelectionObject.movieTitle = theDataWeGot.results[0].title;
        movieApp.userSelectionObject.movieOverView = theDataWeGot.results[0].overview;
        movieApp.userSelectionObject.movieID = theDataWeGot.results[0].id;
        movieApp.userSelectionObject.moviePosterEndPoint = theDataWeGot.results[0].poster_path;
        movieApp.userSelectionObject.moviePopularity = theDataWeGot.results[0].popularity;
        console.log(theDataWeGot);
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
    console.log(movieApp.userSelectionObject.movieID);
    console.log(movieApp.searchMovieTrailor);

    movieApp.getVideos();
    
}


movieApp.getVideos = function(){
    movieApp.getData(`movie/${movieApp.userSelectionObject.movieID}/videos`, movieApp.APIOnly, movieApp.extractVideoInfo);
}

movieApp.extractVideoInfo = function (theDataWeGot){
    movieApp.userSelectionObject.videoKey = theDataWeGot.results[Math.floor(Math.random() * theDataWeGot.results.length)].key;
    console.log('worked',theDataWeGot);
    console.log(movieApp.userSelectionObject.videoKey);
}


movieApp.organizeData = function(){
    movieApp.userSelectionObject.videoLink = `https://www.youtube.com/watch?v=${movieApp.userSelectionObject.videoKey}`
    console.log(movieApp.userSelectionObject.videoLink);
    movieApp.userSelectionObject.moviePoster = `${movieApp.userSelectionObject.imageBaseURL}${movieApp.userSelectionObject.posterSize}${moviePosterEndPoint}`
    console.log(movieApp.userSelectionObject.moviePoster);
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