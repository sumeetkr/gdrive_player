var drivePlayer = drivePlayer || {};

(function(){
  drivePlayer = {
    googleAuthInstance : {},

    initialize : function(){
      this.googleAuth();
      this.loadFirstSong();
      this.createPlaylist();
    },
    googleAuth : function(callback){
      this.googleAuthInstance = new OAuth2('google', {
        client_id: '359878478762.apps.googleusercontent.com',
        client_secret: '8mTXIIQD9zXgVAHfAESOzfh8',
        api_scope: 'https://www.googleapis.com/auth/drive'
      });
      this.googleAuthInstance.authorize(callback);
    },

    // A sample function...
    loadFirstSong : function(){
      $.get("https://www.googleapis.com/drive/v2/files?access_token="+this.googleAuthInstance.getAccessToken(), function(data){
//        console.log(data);
        // iterate and find the first mp3 file
        var fileLink;
        for(var i=0; i<data.items.length; ++i){
          if(data.items[i].fileExtension === "mp3"){
            fileLink = data.items[i].webContentLink;
            break;
          }
        }
        // load the mp3 file into the audio element
        $('audio source').attr('src', fileLink);
        $('audio')[0].load();
      });
    },

    createPlaylist : function(){
        $.get("https://www.googleapis.com/drive/v2/files?access_token="+this.googleAuthInstance.getAccessToken(), function(data){

            var playlistContainer = document.getElementById('playlist');

            // iterate and find the first mp3 file
            var fileLinks = new Array();

            var count = 1;
            for(var i=0; i<data.items.length; ++i){
                if(data.items[i].fileExtension === "mp3"){

                    fileLink = data.items[i].webContentLink;
                    fileLinks.push(fileLink);

                    var song = document.createElement("tr");

                    var index = document.createElement("td");
                    index.appendChild(document.createTextNode(String(count)));
                    song.appendChild(index);

                    var title = document.createElement("td");
                    title.appendChild(document.createTextNode(data.items[i].title));
                    song.appendChild(title);

                    var share = document.createElement("td");
                    share.innerHTML ="<button>share</button>";
                    song.appendChild(share);

                    var play = document.createElement("td");
                    play.innerHTML ="<button type='button'>Play</button>";
                    song.appendChild(play);

                    playlistContainer.appendChild(song);

                    count++;
                }
            }
        });
    }
  };
})();

drivePlayer.initialize();
//
//function clickHandler(e) {
//    setTimeout(playSong, 1000);
//}
//
//function playSong(fileLink){
////
//    $('audio source').attr('src', fileLink);
//    $('audio')[0].load();
//}
//
//document.addEventListener('DOMContentLoaded', function () {
//    document.querySelector('button').addEventListener('click', clickHandler);
//});






/* Information Backup
var CLIENT_ID = '359878478762.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
*/
