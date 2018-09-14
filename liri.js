// Variable Declarations and set for up for node packages.
require("dotenv").config();

var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var Spotify = require('node-spotify-api');

//LIRI Command functions and user input requests
var command = process.argv[2];
var input = process.argv[3];

function liriCommands(command, input) {
    switch (command) {
        case "concert-this":
            getBands(input);
            break;

        case "spotify-this-song":
            getSong(input);
            break;

        case "movie-this":
            getMovie(input);
            break;

        case "do-what-it-says":
            getRandom();
            break;

        //if no input is accepted, then display default:
        default:
            console.log("I'm sorry I don't recognize that command. Please try one of the following:");
            console.log("concert-this <YOUR INPUT HERE>");
            console.log("spotify-this-song <YOUR INPUT HERE>");
            console.log("movie-this <YOUR INPUT HERE>");
            console.log("do-what-it-says <YOUR INPUT HERE>");
            console.log("Please re-engage the terminal and try again with the suggested command.")

    }
};

//Function for Bands in Town API call -- `node liri.js concert-this <artist/band name here>`
function getBands(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var bandObject = JSON.parse(body);
            console.log(bandObject)
            var bandResults =
                "------------------------------------------------------------" + "\n" +
                "Lineup: " + bandObject.lineup + "\n" +
                "Venue Name: " + bandObject.venue + "\n" +
                "Location: " + bandObject.venue.city + "," + bandObject.venue.country + "\n" +
                "Date: " + bandObject.datetime + "\n" +
                "------------------------------------------------------------" + "\n";
            console.log(bandResults);
            // Appends Bands results to log.txt file
            fs.appendFile('log.txt', bandResults, function (err) {
                if (err) throw err;
            });
            console.log("Saved into log.txt!");
            logResults(response);
        }
        else {
            console.log("Error :" + error);
            return;
        }
    });
};

//Function for Spotify -- `node liri.js spotify-this-song '<song name here>'`
function getSong(songName) {
    var spotify = new Spotify(keys.spotify);
    //If no song is provided, use "The Sign" 
    if (!songName) {
        songName = "The Sign";
    };
    //Attempting to get it to accept more than one word inputs
    // var nodeArgs = process.argv;
    // for (var i = 3; i < nodeArgs.length; i++) {
    //     if (i > 3 && i < nodeArgs.length) {
    //       songName = songName + "+" + nodeArgs[i];
    //     }
    //     else {
    //       songName += nodeArgs[i];
    //     }
    //   }
    console.log(songName);
    spotify.search({ type: "track", query: songName }, function (err, data) {
        if (err) {
            return console.log("Uncaught Exception Occurred! Error: " + err);
        }
        console.log("------------------------------------------------------------" + "\n" +
            "Artist: " + data.tracks.items[0].artists[0].name +
            "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name +
            "\nPreview Link: " + data.tracks.items[0].preview_url +
            "\n------------------------------------------------------------" + "\n");
        var logSong = ("------------------------------------------------------------" + "\n" +
            "Artist: " + data.tracks.items[0].artists[0].name +
            "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name +
            "\nPreview Link: " + data.tracks.items[0].preview_url +
            "\n------------------------------------------------------------" + "\n");
        fs.appendFile('log.txt', logSong, function (err) {
            if (err) throw err;
        });

        console.log("Saved into log.txt!");
        logResults(data);
    });
};


//Function for OMDB API call - `node liri.js movie-this '<movie name here>'`
function getMovie(movieName) {
    //If no movie is called then call Mr. Nobody
    if (!movieName) {
        movieName = "mr nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieObject = JSON.parse(body);
            var movieResults =
                "------------------------------------------------------------" + "\n" +
                "Title: " + movieObject.Title + "\n" +
                "Year: " + movieObject.Year + "\n" +
                "Imdb Rating: " + movieObject.imdbRating + "\n" +
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\n" +
                "Country: " + movieObject.Country + "\n" +
                "Language: " + movieObject.Language + "\n" +
                "Plot: " + movieObject.Plot + "\n" +
                "Actors: " + movieObject.Actors + "\n" +
                "------------------------------------------------------------" + "\n";
            console.log(movieResults);

            //Appends movie results to log.txt file
            fs.appendFile('log.txt', movieResults, function (err) {
                if (err) throw err;
            });
            console.log("Saved into log.txt!");
            logResults(response);
        }
        else {
            console.log("Error :" + error);
            return;
        }
    });
};

//Function for Random `node liri.js do-what-it-says`
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        else {
            console.log(data);
            var randomData = data.split(",");
            liriCommands(randomData[0], randomData[1]);
        }
        console.log("test" + randomData[0] + randomData[1]);
    });
};

//Function to log results from all of the other functions
function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err)
            throw err;
    });
};

//Initializes the app to run
liriCommands(command, input);