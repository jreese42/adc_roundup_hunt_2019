//wow.js
// new WOW().init();

var parallaxElement = document.querySelector('.slide_section');
var parallaxContainer = parallaxElement.parentNode;
var containerHeight = parallaxContainer.offsetHeight;

/**
 * The speed of the parallax element. Currently ony working
 * with positive values. 
 */
var parallaxSpeed = 0.5;

/**
 * This calculates the new height of the given parallax element.
 * The height is used to fill up the gap between the two sections.
 * It allows the parallax element to move without showing a space.
 * The height is calculated by the given speed
 */
function setParallaxHeight(element) {
  var gapHeight = containerHeight - window.innerHeight;
  var newHeight = 0;
 
  if (parallaxSpeed < 0) {
  	gapHeight = (containerHeight + window.innerHeight) / (1 + parallaxSpeed);
  }
  
  newHeight = containerHeight + gapHeight * Math.abs(parallaxSpeed);

  element.style.height = newHeight + 'px';
}

/**
 * This simply sets the translation value of the parallax element.
 */
function updateElement() {
  var scrollY = window.scrollY;
  var elementOffset = parallaxElement.getBoundingClientRect();
  var elementTop = elementOffset.top + scrollY;

  /**
   * This is the translation value on the y axis. This will start 
   * the element moving above the lower bound of the viewport after 
   * the user scrolled to the edge of the element.
   */
  var translateY = 0;
	
  if (parallaxSpeed < 0) {
    translateY = parallaxSpeed * (scrollY + window.innerHeight - elementTop);
  }
  else {
  	translateY = parallaxSpeed * (scrollY - elementTop);
  }

  parallaxElement.style.transform = 'translate3d(0,' + translateY + 'px,0)';
}

setParallaxHeight(parallaxElement);
window.onscroll = updateElement;
