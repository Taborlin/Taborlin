(function() {
  "use strict";
  var Taborlin, deleteFolderRecursive, fs, path, read;
  Taborlin = require('../lib/taborlin');
  path = require('path');
  fs = require('fs-extra');
  read = fs.readFileSync;
  describe('Taborlin', function() {
    before(function() {
      this.srcDir = path.join('test', 'cases', 'simple');
      this.outputDir = path.join('test', 'docs');
    });
    it("should work on Spencer's computer", function(done) {
      var generatedDoc, taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir
      });
      taborlin.generate((function(){
        generatedDoc = read(path.join('test', 'docs', 'index.html'), 'utf8');
        generatedDoc.should.be.ok;
        done();
      }).bind(done));
    });
  })
}).call(this);
