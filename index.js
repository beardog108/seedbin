/* Copyright 2017 Kevin Froman, MIT license (expat) */

function peerCount(torrent){
  $('#peerCount').html(client.get(torrent).numPeers);
}

  if (WebTorrent.WEBRTC_SUPPORT == false){
    $.notify("Unfortunately, your browser does not support WebRTC.", "error", {autoHide: false})
  }
  var base = document.location.href;
  client = new WebTorrent();
  var clipboard = new Clipboard('.btn');
  clipboard.on('success', function(e) {
      $.notify('Copied!', 'success');
      e.clearSelection();
  });

  clipboard.on('error', function(e) {
    $.notify('Failed to copy :(', 'error');
  });
  $('footer').css('display', 'block');

function createPaste(){
  sharedBefore = true;
  var text = [new Blob ([$('#text').val()], { type: 'text/plain'})];
  var title = $('#title').val();
  var file = new File(text, title);
  $.notify('Now seeding your paste! Keep your browser open at least until others join!', 'success');
  client.seed(file, onseed = function(torrent){
    window.location = '#' + 'modal-text';
    console.log(torrent.magnetURI);
    $('#infoHash').val(torrent.infoHash);
    $('#shareLink').val(location.protocol+'//'+location.host+location.pathname.replace('index.html', '') + 'view.html#' + torrent.infoHash);
    setInterval(peerCount, 1000, torrent.infoHash);
  });
  return false;
}

window.location.hash = '#!';
