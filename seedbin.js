function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function showOutput(dataType, data){
  var shareLink = '';
  switch (dataType){
    case 'links':
      shareLink = '#{"ipfs":"' + data[0] + '","torrent":"' + data[1] +'"}';
      console.log(data);
      $('#ipfsHash').val(data[0]);
      $('#webtorrentHash').val(data[1]);
      $('#shareURI').val(loc + shareLink);
      window.location = loc + '#show-links';
      return;
    break;
    case 'paste':
      window.location = loc + '#show-paste';
      return;
    default:
    alert('an error occured');
    break;
  }
  window.location = loc + '#modal-text';
}

var localInstall = true;

var submitURI = 'https://www.chaoswebs.net/ipfs-paste/paste.php';
var file = '';
var text = '';
var fd = new FormData();
var hash = '';
var ipfsHash = '';
var webrtc = false;
var loc = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"")+location.pathname+(location.search?location.search:"");
window.onload = function() {
  $.ajax({url: 'http://127.0.0.1:8080/ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg?v=' + Math.random(),
      success: function (data, textstatus, xhr) {
        localInstall = true;
      },
      error: function( xhr, status) {
        localInstall = false;
  	      }
      });
  if (WebTorrent.WEBRTC_SUPPORT) {
    webrtc = true;
    client = new WebTorrent();
  } else {
    $.growl.warning({ message: 'Browser has no WebRTC support<br><br>You will not be able to use WebTorrent!' });
  }
  $('#pasteform').attr('submit', submitURI);

  if (document.location.hash != ''){
    var shared = decodeURIComponent(document.location.hash.replace('#', ''));
    if (isJsonString(shared)){
      shared = $.parseJSON(shared);
      console.log('ipfs: ' + shared.ipfs);
      if (localInstall){
        console.log('is local install, downloading');
        $.get('http://127.0.0.1:8080/ipfs/' + shared.ipfs, function( data ) {
          $('#pasteOutput').text(data);
          showOutput('paste', data);
        });
      }
    }
  }

  document.getElementById('pasteform').onsubmit = function(){
    $('#submit').css('display', 'none');
    var infoHash = '';
    var fd = new FormData();
    text = $('#text').val();
    filee = new Blob([text], {type: 'text/plain'});
    fd.append('fname', 'paste.txt');
    fd.append('data', filee);
    client.seed(filee, function (torrent) {
        console.log('Client is seeding ' + torrent.magnetURI);
        infoHash = torrent.infoHash;
    });
    $('#pasteform').attr('submit', submitURI);

    $.ajax({url: submitURI, type: 'POST', data: fd, processData: false, contentType: false, cache: false,
        success: function (data, textstatus, xhr) {
          console.log(data);
          if (data.startsWith('data:')){
            data = data.replace('data:', '');
            showOutput('links', [data, infoHash]);
            $('#submit').css('display', 'inline');
          }
          else{
            $.growl.error(data);
          }
        },
        error: function( xhr, status) {
          $.growl.error('An error occured: ' + status);
          $('#submit').css('display', 'inline');
    	      }
        });
    return false;
  }

}
