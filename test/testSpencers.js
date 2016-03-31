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
        destination: 'fulldocs/',
        template: path.join("node_modules", "topdoc-theme"),
        templateData: {
          title: "Topcoat",
          subtitle: "CSS for clean and fast web apps",
          download: {
            url: "#",
            label: "Download version 0.4"
            },
          homeURL: "http://topcoat.io",
          siteNav: [
            {
              url: "http://www.garthdb.com",
              text: "Usage Guidelines"
            },
            {
              url: "http://bench.topcoat.io/",
              text: "Benchmarks"
            },
            {
              url: "http://topcoat.io/blog",
              text: "Blog"
            }
          ]
        }
      });
      taborlin.generate(function(){
        generatedDoc = read(path.join('fulldocs', 'index.html'), 'utf8');
        generatedDoc.should.be.ok;
        if(fs.existsSync('fulldocs')){
          fs.removeSync('fulldocs');
        }
        done();
      });
    });
  })
}).call(this);
