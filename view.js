function toggleTitle(){
  if (document.hasFocus()){
    document.title = 'SeedBin';
    clearInterval(window.toggle);
    return;
  }
  switch (document.title){
    case 'SeedBin':
      document.title = 'SeedBin - Paste';
      break;
    case 'SeedBin - Paste':
      document.title = 'SeedBin - Loaded!';
      break;;
    case 'SeedBin - Loaded!':
      document.title = 'SeedBin - Paste';
      break;
  }
}

var client = new WebTorrent();
if (WebTorrent.WEBRTC_SUPPORT == false){
  $.notify("Unfortunately, your browser does not support WebRTC.", "error", {autoHide: false})
}
var hash = window.location.hash.replace('#', '');
hash = 'magnet:?xt=urn:btih:' + hash + '&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';
client.add(hash, function (torrent) {
    var file = torrent.files[0];
      file.getBuffer(function (err, buffer){
        buffer = buffer.toString('utf8');
        buffer = buffer.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
          return '&#' + i.charCodeAt(0) + ';';
        });
        $('#output').html(buffer);
        $('#loading').css('display', 'none');
        $('#output').css('display', 'block');
        $('#pasteTitle').css('display', 'block');
        $('footer').css('display', 'block');
        $('#pasteTitle').text("Title: " + file.name);
      });
      torrent.on('done', function(){
        console.log('done downloading ' + torrent.infoHash);
        if (document.hasFocus() == false) {
          window.toggle = setInterval(toggleTitle, 500);
        }
      });
  });
