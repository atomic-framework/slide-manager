/**
 * === CLASS SlideManager ===
 *
 * A class that will manage a structure of slides
 * 
 * REQUIRES SlideList Class
 *
 */

function SlideManager(id, model) {
    if (!id || !model) {
        console.log('SlideManager parameter is missing');
    }
    else {
        this.initialize(id, model);
    }
}

// Register a SlideManager instance
SlideManager.prototype.initialize = function (id, model) {
    this.id = id;
    this.model = model;
    this.previousSlide = "";
    this.previousChapter = "";
    this.previousIndex = {};
    this.content = []; // Will hold original content array
    this.slideshow = new SlideList(this.resolveChapters());
}

// Resolve SlideList from model
SlideManager.prototype.resolveChapters = function() {
    var sb = this.model.structures[this.id];
    this.content = sb.content || [];
    var slides = this.content.slice(0);
    if (slides.length) {
        this.chapterMap = {};
        slides.forEach(function(slide, i) {
            if (this.model.structures[slide]) {
                if (!this.model.slides[slide]) { // If same id is used then slideId is used
                    slides.splice(i, 1, this.model.structures[slide].content.slice(0));
                    this.chapterMap[i] = slide; // So that we can find structure in model
                }
            }
        }.bind(this));
    }
    return slides;
}

SlideManager.prototype.resolve = function(index) {
    index = index || this.slideshow.getIndex();
    var info = {};
    info.id = this.id;
    info.chapter = this.chapterMap[index.h] || null;
    info.slide = this.slideshow.get(index.h, index.v);
    info.index = index;
    info.previousSlide = this.previousSlide;
    info.previousChapter = this.previousChapter;
    info.previousIndex = this.previousIndex;
    return info;
}

// Get the array index of a chapter in a slideshow
SlideManager.prototype.getChapterPosition = function(chapter) {
    if (!chapter) return -1;
    var index;
    return this.content.indexOf(chapter);
}

SlideManager.prototype.navigate = function(method, params) {
    var prevIndex = this.slideshow.getIndex();
    this.previousSlide = this.slideshow.get();
    this.previousIndex = this.slideshow.getIndex();
    this.previousChapter = this.chapterMap[prevIndex.h] || "";
    this.slideshow[method].apply(this.slideshow, params);
}

SlideManager.prototype.goTo = function(chapter, slide) {
    var chapterIndex = this.getChapterPosition(chapter);
    var searchIndex = {v: 0};
    if (chapterIndex > -1) {
        searchIndex.h = chapterIndex;
        if (slide) {
            // find slide index
            if (this.slideshow.list[searchIndex.h].indexOf) {
                searchIndex.v = this.slideshow.list[searchIndex.h].indexOf(slide);
                if (searchIndex.v < 0) searchIndex.v = 0;
            }
        }
        this.navigate("goTo", [searchIndex]);
    }
    // ignore as chapter wasn't found (can't find slide then)
    else if (slide) {
        return;
    }
    // treat the chapter param as the slide
    else {
        this.navigate("goTo", [chapter]);
    }
}

SlideManager.prototype.next = function() {
    this.navigate("next");
}

SlideManager.prototype.previous = function() {
    this.navigate("previous");
}

SlideManager.prototype.left = function() {
    this.navigate("left");
}

SlideManager.prototype.right = function() {
    this.navigate("right");
}

SlideManager.prototype.up = function() {
    this.navigate("up");
}

SlideManager.prototype.down = function() {
    this.navigate("down");
}

