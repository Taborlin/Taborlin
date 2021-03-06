/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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
    after(function() {
      if (fs.existsSync(this.outputDir)) {
        return fs.removeSync(this.outputDir);
      }
    });
    it('exists', function() {
      var taborlin;
      Taborlin.should.be.ok;
      taborlin = new Taborlin({source: this.srcDir});
      taborlin.should.be.instanceOf(Taborlin);
    });
    it('should accept a source in the constructor', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir
      });
      taborlin.source.should.equal(this.srcDir);
    });
    it('should accept a destination in the constructor', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir
      });
      taborlin.destination.should.equal(this.outputDir);
    });
    it('should accept a project title', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir,
        templateData: {
          title: 'awesomeness'
        }
      });
      taborlin.projectTitle.should.equal('Awesomeness');
    });
    it('should pass data through to the template', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir,
        templateData: {
          title: 'awesomeness'
        }
      });
      JSON.stringify(taborlin.templateData, null, 2).should.equal(JSON.stringify({title: 'awesomeness'}, null, 2));
    });
    it('should find all the css files in a directory', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir
      });
      taborlin.files[0].should.equal(path.join('test', 'cases', 'simple', 'button.css'));
    });
    it('should ignore .min.css files in directory', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir
      });
      taborlin.files.length.should.equal(2);
    });
    it('should generate an index.html', function(done) {
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
    it('should use npm installed template', function(done) {
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
    it('should not overwrite an existing README.md file', function(done) {
      var generatedDoc, taborlin;
      fs.createFileSync(path.join('fulldocs','README.md'));
      fs.writeFileSync(path.join('fulldocs','README.md'), 'original readme');
      // read(path.join('test', 'docs', 'index.html'), 'utf8');
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

        var expectedReadme = read(path.join('fulldocs','README.md'), 'utf8');
        expectedReadme.should.equal('original readme');

        if(fs.existsSync('fulldocs')){
          fs.removeSync('fulldocs');
        }
        done();
      });
    });
    it('should duplicate all the contents of the template folder', function(done) {
      var taborlin;
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
        fs.existsSync(path.join('fulldocs','css')).should.equal(true);
        if(fs.existsSync('fulldocs')){
          fs.removeSync('fulldocs');
        }
        done();
      });
    });
    it('should work with defaults and no stuff', function(done) {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: 'fulldocs/',
        template: path.join("node_modules", "topdoc-theme"),
        templateData: {}
       });
      taborlin.generate(function(){
        fs.existsSync(path.join('fulldocs','css')).should.equal(true);
        if(fs.existsSync('fulldocs')){
          fs.removeSync('fulldocs');
        }
        done();
      });
    });
    it('should find all the css documents', function() {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir
      });
      taborlin.generate(function(){
        return taborlin.files.should.be.ok;
      });
    });
    it('should return an error when template is missing', function(done) {
      var taborlin;
      taborlin = new Taborlin({
        source: this.srcDir,
        destination: this.outputDir,
        template: './'
      });
      try {
        taborlin.generate(function(){
        });
      } catch (err) {
        done();
      }
    });
    it('should generate iframe html files', function(done){
      var taborlin;
      taborlin = new Taborlin({
        source: path.join('test', 'cases', 'iframe'),
        destination: 'fulldocs/',
        template: path.join("node_modules", "topdoc-theme")
      });
      taborlin.generate((function(){
        var caseTaborliniFrame, resultiFrame;
        caseTaborliniFrame = read(path.join('test', 'cases', 'iframe', 'overlay.overlay.html'), 'utf8').trim();
        resultiFrame = read(path.join('fulldocs/', 'overlay.overlay.html'), 'utf8').trim();        resultiFrame.should.equal(caseTaborliniFrame);
        if(fs.existsSync('fulldocs')){
          fs.removeSync('fulldocs');
        }
        done();
      }).bind(done));
    });
  });

}).call(this);
