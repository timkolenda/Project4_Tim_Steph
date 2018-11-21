
//Example API Request
//https://api.themoviedb.org/3/movie/550?api_key=f0ba00aa70aa95e488fb89869bf99a39

const movieApp = {}

movieApp.baseURL = "https://api.themoviedb.org/3/";
movieApp.accessKey = "f0ba00aa70aa95e488fb89869bf99a39";
movieApp.readAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGJhMDBhYTcwYWE5NWU0ODhmYjg5ODY5YmY5OWEzOSIsInN1YiI6IjViZjQ3YjM2MGUwYTI2NDMyMDAwYWFiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PszxkV4DdxWG7lJcIh0PcGSnmleRcQy8m7s3fIydQ8M";
movieApp.discoverMovie = 'discover/movie';
movieApp.searchForActor = 'search/person';
movieApp.find = 'find/movie';
movieApp.userActorSelection = "Tom Hanks";
movieApp.userSelectionObject = {};




$(function () {
    movieApp.init();
    //NEED TO ASK WHY THE BELOW DOES NOT WORK
    // $.when(movieApp.getData)
    //     .then((res) => {
    //         movieApp.getUserActorSelectionID(res);
    //     })
});

movieApp.init = function () {
    movieApp.getData(movieApp.searchForActor, movieApp.userActorSelection);
};

movieApp.getData = function(searchType, actorName, actorID){
    return $.ajax({
        url: `${movieApp.baseURL}${searchType}`,
        dataType: 'jsonp',
        method: 'GET',
        data: {
            api_key: 'f0ba00aa70aa95e488fb89869bf99a39',
            query: actorName,
            with_people: actorID,
            vote_average: null,
            page: null
            //^^^^^^page and vote_average will be needed once we are pulling movie list
        }
    })
    .then((res) => {
        movieApp.getUserActorInfo(res);
        // console.log(res);
    })
    //THIS THEN STATEMENT SHOULD BE COVERED IN THE DOC READY AREA WITH THE WHEN STATEMENT
}

movieApp.getUserActorInfo = function(res){
    // console.log(res);
    //^^^^^RUN CONSOLE LOG TO GET MORE INFO ON ACTOR
    movieApp.userSelectionObject.userActorSelectionID = res.results[0].id;
    movieApp.userSelectionObject.profilePath = res.results[0].profile_path;
    console.log(movieApp.userSelectionObject);
}

// movieApp.getData(movieApp.discoverMovie, null, movieApp.userActorSelectionID);
//^^^^^^ Technically this function pulls movies based on the actor that saved in user actor selection - wonky though



