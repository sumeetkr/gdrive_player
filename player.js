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

      // var config = {
      //   'client_id': '359878478762.apps.googleusercontent.com',
      //   'scope': 'https://www.googleapis.com/auth/drive'
      // };
      // gapi.auth.authorize(config, function() {
      //   console.log('login complete');
      //   console.log(gapi.auth.getToken());
      // });
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

                    fileId = data.items[i].id;

                    var song = document.createElement("tr");

                    var index = document.createElement("td");
                    index.appendChild(document.createTextNode(String(count)));
                    song.appendChild(index);

                    var title = document.createElement("td");
                    title.appendChild(document.createTextNode(data.items[i].title));
                    song.appendChild(title);

                    var share = document.createElement("td");
                    var shareButton = document.createElement("button");
                    shareButton.innerHTML = "share";
                    shareButton.addEventListener('click', shareHandler);
                    shareButton.id = fileId;
                    share.appendChild(shareButton);
                    song.appendChild(share);

                    playlistContainer.appendChild(song);

                    count++;
                }
            }
        });
    },

    /**
     * Start the file sharing.
     *
     * @param {string} fileId the ID of the file to share.
     */
    shareFile2 : function(fileId){
      var playlistContainer = document.getElementById('playlist');
      var shareMsg = document.createElement('p');
      shareMsg.appendChild(document.createTextNode('What?'));
      playlistContainer.appendChild(shareMsg);

      var body = {
        'type': 'user',
        'role': 'reader'
      };

      $.ajax({
            type: "POST",
            url: "https://www.googleapis.com/drive/v2/files/"+fileId+"/permissions?access_token="+this.googleAuthInstance.getAccessToken(),
            data: body,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
               console.log(msg)
            },
            error: function (errormessage) {

                console.log(errormessage)

            }
        });

      // $.post("https://www.googleapis.com/drive/v2/files/"+fileId+"/permissions?access_token="+this.googleAuthInstance.getAccessToken(), body, function(resp) {
      //     console.log(resp)
      // });
    },

    /**
     * Start the file sharing.
     *
     * @param {string} fileId the ID of the file to share.
     */
    shareFile : function(fileId){
      var playlistContainer = document.getElementById('playlist');
      var shareMsg = document.createElement('p');
      shareMsg.appendChild(document.createTextNode('What?'));
      playlistContainer.appendChild(shareMsg);

      handle = this.insertPermission;

      gapi.auth = this.googleAuthInstance;

      gapi.client.load('drive', 'v2', function() {
        var fileID = fileId;
        var type = 'user';
        var role = 'reader';
        handle(fileID, type, role);
      });
    },

    /**
     * Insert a new permission.
     *
     * @param {String} fileId ID of the file to insert permission for.
     * @param {String} value User or group e-mail address, domain name or
     *                       {@code null} "default" type.
     * @param {String} type The value "user", "group", "domain" or "default".
     * @param {String} role The value "owner", "writer" or "reader".
     */
    insertPermission : function(fileId, type, role, callback) {
      var body = {
        'value': value,
        'type': type,
        'role': role
      };
      var request = gapi.client.drive.permissions.insert({
        'fileId': fileId,
        'resource': body
      }); 
      if (!callback) {
        callback = function(resp) {
          console.log(resp)
        };
      }
      request.execute(callback);
    }

  };
})();

drivePlayer.initialize();


/**
 * Event handler for file sharing.
 *
 * @param {Object} evt Arguments from the share button.
 */
function shareHandler(evt){
    var playlistContainer = document.getElementById('playlist');
    var shareMsg = document.createElement('p');
    shareMsg.appendChild(document.createTextNode('Wait...'));
    playlistContainer.appendChild(shareMsg);

    drivePlayer.shareFile2(evt.target.id);
}


/* Information Backup
var CLIENT_ID = '359878478762.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
*/
