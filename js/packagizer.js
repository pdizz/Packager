GrowingPacker = function(maxW, maxH) {
    this.maxW = maxW;
    this.maxH = maxH;
};

GrowingPacker.prototype = {

    fit: function(blocks) {
        var n, node, block, len = blocks.length;
        var w = len > 0 ? blocks[0].w : 0;
        var h = len > 0 ? blocks[0].h : 0;
        this.root = {
            x: 0, 
            y: 0, 
            w: w, 
            h: h
        };
    
    
    
        for (n = 0; n < len ; n++) {
            block = blocks[n];
            if (node = this.findNode(this.root, block.w, block.h)) {
                block.fit = this.splitNode(node, block.w, block.h);        
            }    
            else {
                block.fit = this.growNode(block.w, block.h);
            }
        }
    },

    findNode: function(root, w, h) {
        if (root.used) {
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        }
        else if ((w <= root.w && w <= this.maxW) && (h <= root.h && w <= this.maxW)) {
            this.binWidth = this.root.w <= this.maxW ? this.root.w : this.maxW;
            this.binHeight = this.root.h <= this.maxH ? this.root.h : this.maxH;
            return root;
        }
        else {
            return null;
        }
    },

    splitNode: function(node, w, h) {
        node.used = true;
        node.down  = {
            x: node.x,     
            y: node.y + h, 
            w: node.w,     
            h: node.h - h
        };
        node.right = {
            x: node.x + w, 
            y: node.y,     
            w: node.w - w, 
            h: h
        };
        return node;
    },

    growNode: function(w, h) {
        var canGrowRight  = (w <= this.root.w && this.root.w + w <= this.maxW);
        var canGrowDown = (h <= this.root.h && this.root.h + h <= this.maxH);

        if (canGrowRight) {
            return this.growRight(w, h);
        }
        else if (canGrowDown) {
            return this.growDown(w, h);
        }
        else    
            return null; // need to ensure sensible root starting size to avoid this happening
    },

    growRight: function(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w + w,
            h: this.root.h,
            down: this.root,
            right: {
                x: this.root.w, 
                y: 0, 
                w: w, 
                h: this.root.h
            }
        };
        if (node = this.findNode(this.root, w, h))
            return this.splitNode(node, w, h);
        else
            return null;
    },

    growDown: function(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w,
            h: this.root.h + h,
            down:  {
                x: 0, 
                y: this.root.h, 
                w: this.root.w, 
                h: h
            },
            right: this.root
        };
        if (node = this.findNode(this.root, w, h))
            return this.splitNode(node, w, h);
        else
            return null;
    }
}

Packagizer = function(sheetWidth, sheetHeight) {
    this.sheetWidth = sheetWidth;
    this.sheetHeight = sheetHeight;
    this.sheets = [];
    this.nofit = [];
    
    this.run = function(blocks) {
        //remove any blocks that are too big for sheet size and move them to nofit array
        for (var i=blocks.length-1; i>=0; i--) {
            if (blocks[i].w > sheetWidth || blocks[i].h > sheetHeight) {
                this.nofit.unshift(blocks[i]);
                blocks.splice(i, 1);
            }
        }
        
        while(blocks.length) {
            var packer = new GrowingPacker(sheetWidth,sheetHeight);
            packer.fit(blocks);

            var sheet = [];
            for (var i=blocks.length-1; i>=0; i--) {
                if (blocks[i].fit !== undefined && blocks[i].fit !== null) {
                    //console.log(blocks[i].fit);
                    sheet.unshift(blocks[i]);
                    blocks.splice(i,1);
                }
            }

            sheet.sheetWidth = packer.maxW; //Always printing to 10xH. Use packer.binWidth; for WxH
            sheet.sheetHeight = packer.binHeight;
            //console.log(sheet);
            this.sheets.push(sheet);
        }
    }
}

/************************** demo *******************************************/

var blocks = [
    {w: 1000, h: 80}, //this wont fit
    {w: 100, h: 81}, //this wont fit
    {w: 1000, h: 800}, //this wont fit
    {w: 100, h: 80},
    {w: 100, h: 80},
    {w: 100, h: 80},
    {w: 50, h: 70},
    {w: 50, h: 70},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 50, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35},
    {w: 25, h: 35}
];

var packagizer = new Packagizer(100, 80)

packagizer.run(blocks);

console.log(packagizer.sheets);
console.log(packagizer.nofit);