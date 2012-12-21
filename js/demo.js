function deserialize(val) {
      var i, j, block, blocks = val.split("\n"), result = [];
      for(i = 0 ; i < blocks.length ; i++) {
        block = blocks[i].split("x");
        if (block.length >= 2)
          result.push({w: parseInt(block[0]), h: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2]))});
      }
      var expanded = [];
      for(i = 0 ; i < result.length ; i++) {
        for(j = 0 ; j < result[i].num ; j++)
          expanded.push({w: result[i].w, h: result[i].h, area: result[i].w * result[i].h});
      }
      return expanded;
    }

function drawSheet(sh) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', sh.sheetWidth);
    canvas.setAttribute('height', sh.sheetHeight);
    document.getElementById('preview').appendChild(canvas);
    var context = canvas.getContext('2d');

    for (var k = 0; k < sh.length; k++) {
        context.fillStyle = 'cyan';
        context.fillRect(sh[k].fit.x, sh[k].fit.y, sh[k].w, sh[k].h);
        context.strokeStyle = 'grey';
        context.strokeRect(sh[k].fit.x, sh[k].fit.y, sh[k].w, sh[k].h);
		console.log("Sheet = " + k + " Width = " + sh[k].w + ", Height = " + sh[k].h + ", X = " + sh[k].fit.x + ", Y = " + sh[k].fit.y);
		
    }
    
}


function demoRun(blocks) {
    $nofit = $('#nofit');
    $nofit.html('');
    
    var pack = new Packagizer(100, 80);
    
    pack.run(blocks);
    

    if (pack.nofit.length) {

        var o = 'The following wont fit. They exceed the maximum sheet size.</br>';
        for (var i=0; i<pack.nofit.length; i++) {
            o += "BLOCK - W: " + pack.nofit[i].w + " H: " + pack.nofit[i].h + "</br>"; 
            $nofit.html(o);
        }
        }
    
    document.getElementById('preview').innerHTML = '';
    for (var i=0; i<pack.sheets.length; i++) {
        drawSheet(pack.sheets[i]);
    }
	console.log(JSON.stringify(pack.sheets));
	
	
    

}

$blocks = $('#blocks');
blocks = [];

$blocks.keypress(function(ev) {
    if (ev.which == 13) {
        blocks = deserialize($blocks.val());
        //console.log(JSON.stringify(blocks));//Demo.run(); // run on <enter> while entering block information
        demoRun(blocks);
    }
});

$(document).ready(
	function() {
		blocks = deserialize($blocks.val());
		demoRun(blocks);
	}
);

