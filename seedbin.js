function isJsonString(str){
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function checkServer(){
  $.get(localStorage['seedbinURI']).done(function(data){
    $('#serverUp').text('✅ Connection with server established');
  }).fail(function(data){
    $('#serverUp').text('❌ Connection with server not established');
  });
}

function doTorrent(infoHash){
  //client = new WebTorrent();
  infoHash = 'magnet:?xt=urn:btih:' + infoHash + '&dn=Unnamed+Torrent+1495319406728&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';
  console.log('wat: ' + infoHash);
  client.add(infoHash, function (torrent) {
        torrent.on('done', function(){
          var file2 = torrent.files[0];
          file2.getBuffer(function (err, buffer){
            console.log('client is downloading: ' + infoHash);
            buffer = buffer.toString('utf8');
            $('#pasteOutput').text(buffer);
            console.log('buffer: ' + buffer);
          });
          console.log('done downloading ' + torrent.infoHash);
          window.location = loc + '#show-paste';
        });
  });
}

function getData(link, infoHash, torrentOnly){
  if (torrentOnly){
    console.log('is torrent only');
    doTorrent(infoHash);
    return;
  }
  if (localInstall){
    link = 'http://127.0.0.1:8080/ipfs/' + link;
  }
  else{
    link = requestURI + '?cat=' + link;
  }
  $.get(link).done(function(data){
    $('#pasteOutput').text(data);
    showOutput('paste', data);
  }).fail(function(data){
    $.growl.error('Could not get data from IPFS gateway(s), attempting WebTorrent');
    doTorrent(infoHash);
})}

function showOutput(dataType, ipfs, torrent){
  var shareLink = '';
  switch (dataType){
    case 'links':
      console.log(ipfs + ' - ' + torrent);
      if (ipfs.length != 46){
        ipfs = '';
      }
      else{
        ipfs = ipfs + ',';
      }
      if (torrent.length != 40){
        torrent = '';
      }
      shareLink = '#' + ipfs + torrent;
      $('#ipfsHash').val(ipfs);
      $('#webtorrentHash').val(torrent);
      $('#shareURI').val(loc + shareLink);
      window.location = loc + '#show-links';
      return;
    break;
    case 'paste':
      window.location = loc + '#show-paste';
      return;
    default:
    $.growl.error({ message: 'An error occured' });
    break;
  }
  window.location = loc + '#modal-text';
}

var localInstall = false;

var submitURI = 'https://www.chaoswebs.net/ipfs-paste/paste.php';
var requestURI = 'https://www.chaoswebs.net/ipfs-paste/paste.php';
var file = '';
var text = '';
var fd = new FormData();
var hash = '';
var ipfsHash = '';
var webrtc = false;
var loc = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"")+location.pathname+(location.search?location.search:"");

window.onload = function() {
  $('#serverURI').on('change', function(){
    submitURI = $('#serverURI').val();
    requestURI = $('#serverURI').val();
    localStorage['seedbinURI'] = $('#serverURI').val();
    console.log('changed uri');
    checkServer();
  });
  if (localStorage['seedbinURI'] == undefined){
    localStorage['seedbinURI'] = 'https://www.chaoswebs.net/ipfs-paste/paste.php';
  }
  $('#serverURI').val(localStorage['seedbinURI']);
  submitURI = $('#serverURI').val();
  requestURI = $('#serverURI').val();
  checkServer();
  $.ajax({url: 'http://127.0.0.1:8080/ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg?v=' + Math.random(),
        success: function (data, textstatus, xhr) {
          localInstall = true;
          $('#localDetected').text('✅ Detected local gateway!');
          if (location.protocol == 'https:'){$.growl.warning({message: 'This is a secure page.<br>There may be issues requesting localhost IPFS content.<br>Try disabling mixed content protection.'});}
        },
        error: function( xhr, status) {
          localInstall = false;
    	      }
        });

  if (WebTorrent.WEBRTC_SUPPORT) {
    webrtc = true;
    client = new WebTorrent();
    $('#webrtc').text('✅ WebRTC Available');
  } else {
    $.growl.warning({ message: 'Browser has no WebRTC support<br><br>You will not be able to use WebTorrent!' });
  }
  $('#pasteform').attr('submit', submitURI);

  if (document.location.hash != ''){
    var dataToGet = document.location.hash.replace('#', '').split(',');
    if (dataToGet.length == 1){
      if (dataToGet[0].length == 40){
      getData('', dataToGet[0], true);
      }
    }
    else{
      getData(dataToGet[0], dataToGet[1], false);
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
            data = data.replace('data: ', '');
            showOutput('links', data, infoHash);
            $('#submit').css('display', 'inline');
          }
          else{
            $.growl.error({ message: data});
          }
        },
        error: function(data, textstatus, xhr) {
          if (data.responseText == undefined){
            $.growl.warning({message: 'Server is down :(, will use WebTorrent'})
          }
          else{
          $.growl.warning({message: data.responseText.replace('data: ', '') });
          }
          $('#submit').css('display', 'inline');
          showOutput('links', data, infoHash);
    	      }
        });
    return false;
  }
}
