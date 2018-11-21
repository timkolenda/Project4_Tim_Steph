
//Example API Request
//https://api.themoviedb.org/3/movie/550?api_key=f0ba00aa70aa95e488fb89869bf99a39

const movieApp = {}

movieApp.baseURL = "https://api.themoviedb.org/3/";
movieApp.accessKey = "f0ba00aa70aa95e488fb89869bf99a39";
movieApp.readAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGJhMDBhYTcwYWE5NWU0ODhmYjg5ODY5YmY5OWEzOSIsInN1YiI6IjViZjQ3YjM2MGUwYTI2NDMyMDAwYWFiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PszxkV4DdxWG7lJcIh0PcGSnmleRcQy8m7s3fIydQ8M";
movieApp.discoverMovie = 'discover/movie';
movieApp.searchForActor = 'search/person';
movieApp.find = 'find/movie';
movieApp.userActorSelection = "Tom Hanks"




$(function () {
    movieApp.init();
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
            with_people: actorID
        }
    }).then((res) => {
        movieApp.getUserActorSelectionID(res);
    })
}

movieApp.getUserActorSelectionID = function(res){
    movieApp.userActorSelectionID = res.results[0].id;
    console.log(movieApp.userActorSelectionID);
}





