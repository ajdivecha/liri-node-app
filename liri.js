// we are creating a liri bot in node that will take commands and return information from the 3 apis we requested keys for
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");
var inquirer = require("inquirer");
var keys = require("./keys.js");

inquirer
.prompt([
    {
        type: "input",
        name: "username",
        message: "What's your name?"  
    },

    {
        type: "list",
        name: "command",
        message: "What would you like me to search?",   
        choices: ["Tweets", "Songs", "Movies", "Random"],
    } 
])
.then(function(userInput) {
    console.log("Hey there " + userInput.username);
    console.log(userInput.command);


    // Twitter
    if (userInput.command === "Tweets") {
        // twitter node grab tweet by username and return
        var client = new Twitter(keys);
        var params = {screen_name: "Rocky86595561"};
        client.get("statuses/user_timeline", params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++)
                console.log(tweets[i].text);
            }
        });
    }


    // Spotify
    else if (userInput.command === "Songs") {
        // inquirer: song title
        inquirer
        .prompt ([
            {
                type: "input",
                name: "song",
                message: "What song would you like to look for?"
            },
        ])
        .then(function(songSearch) {
            var songTitle = songSearch.song;

            if (songTitle === "") {
                songTitle = "Ace of Base The Sign";
            }                        

            var spotify = new Spotify ({
                id: "769427f003b340a487b64a8e0a3d4fc0",
                secret: "49ed81d7cf1d4bf0b447cc31bcd5cc2e",
            });

            spotify.search({ type: 'track', query: songTitle, limit: 1}, function(err, data) {
                if (err) {
                  return console.log('Error occurred: ' + err);
                }
                var songInfo = data.tracks.items[0];
                console.log(songInfo.name);
                console.log(songInfo.artists[0].name);
                console.log(songInfo.preview_url);
                console.log(songInfo.album.name); 
              });
            })
        }


    // OMDB
    else if (userInput.command === "Movies") {
        // inquirer: movie title
        inquirer
        .prompt ([
            {
                type: "input",
                name: "movie",
                message: "What movie are you looking for?"
            },
        ])
        .then(function(movieSearch) {
            var movieTitle = movieSearch.movie;

            if (movieTitle === "") {
                movieTitle = "Mr. Nobody";
            }
            // use movieTitle to search
            var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=d294d450";  

            request (queryUrl, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("Movie: " + JSON.parse(body).Title);
                    console.log("Year debut: " + JSON.parse(body).Year);
                    console.log("IMDB rating: " + JSON.parse(body).Ratings[0].Value);
                    console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("The movie was filmed in: " + JSON.parse(body).Country);
                    console.log("Languages: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Stars of the film: " + JSON.parse(body).Actors);
                }
            }
    )}
)}


    // random.txt
    else if (userInput.command === "Random") {
        console.log("If you don't make your own choices, someone else is going to end up making choices for you!");
        // use random.txt data to search spotify
        fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
            // Break the string down by comma separation and store the contents into the output array.
            var output = data.split(",");
            console.log(output[1]);

            var liri = output[1];

            var spotify = new Spotify ({
                id: "769427f003b340a487b64a8e0a3d4fc0",
                secret: "49ed81d7cf1d4bf0b447cc31bcd5cc2e",
            });

            spotify.search({ type: 'track', query: liri, limit: 1}, function(err, data) {
                if (err) {
                  return console.log('Error occurred: ' + err);
                }
                var songInfo = data.tracks.items[0];
                console.log(songInfo.name);
                console.log(songInfo.artists[0].name);
                console.log(songInfo.preview_url);
                console.log(songInfo.album.name); 
              });
            })
        }

    else {
        console.log("Error");
    }
});