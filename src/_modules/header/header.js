'use strict';

// Constructor
var Header = function() {
    var header = $('.header');
    var body = $('body');
    var menuOpen = $('.header__hamburguer');
    var menuLinks = $('.header__menu a');

    menuOpen.on('click', function(){
        header.toggleClass('-open');
        body.toggleClass('-hideOverflow');
    });

    menuLinks.on('click', function(){
        header.removeClass('-open');
        body.removeClass('-hideOverflow');
    });

    $('a[href="#"]').click(function(e){
        e.preventDefault();
    });

    $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top + -20
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                });
            }
        }
    });

    $.fn.moveIt = function() {
        var $window = $(window);
        var instances = [];

        $(this).each(function() {
            instances.push(new moveItItem($(this)));
        });

        window.addEventListener('scroll', function() {
            var scrollTop = $window.scrollTop();
            instances.forEach(function(inst) {
                inst.update(scrollTop);
            });
        }, {
            passive: true
        });
    }

    var moveItItem = function(el) {
        this.el = $(el);
        this.speed = parseInt(this.el.attr('data-scroll-speed'));
    };

    moveItItem.prototype.update = function(scrollTop) {
        this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
    };

    // Initialization
    $(function() {
        $('[data-scroll-speed]').moveIt();
    });

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    function getUrlParam(parameter, defaultvalue){
        var urlparameter = defaultvalue;
        if(window.location.href.indexOf(parameter) > -1){
            urlparameter = getUrlVars()[parameter];
            }
        return urlparameter;
    }

    var hideIntro = sessionStorage.getItem('chakana');;
    var canvas = document.getElementById('canvas');
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;

    if (!hideIntro) {
        var url;

        if (clientWidth < 700) {
            url = '/images/home/intro-mobile.jpg';
        } else {
            url = '/images/home/intro.jpg';
        }

        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.src = url;
        img.onload = function () {
          var width = clientWidth;
          var height = clientHeight;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
        };

        var isPress = false;
        var old = null;
        var count = 0;
        canvas.addEventListener('mouseenter', function (e){
          setTimeout(function() {
              isPress = true;
              old = {x: e.offsetX, y: e.offsetY};
          }, 3000);

        });
        canvas.addEventListener('touchstart', function (e){
          isPress = true;
          old = {x: e.offsetX, y: e.offsetY};
        });

        canvas.addEventListener('mousemove', function (e){
          erase(e);
        });
        canvas.addEventListener('touchmove', function (e){
          erase(e);
        });

        canvas.addEventListener('mouseleave', function (e){
          isPress = false;
        });
        canvas.addEventListener('touchend', function (e){
          isPress = false;
        });

        function erase(e) {
            if (isPress) {
              var x;
              var y;

              if (e.type === 'mousemove') {
                  x = e.offsetX;
                  y = e.offsetY;
              } else if (e.type === 'touchmove') {
                  x = e.touches[0].clientX;
                  y = e.touches[0].clientY;
              }

              ctx.globalCompositeOperation = 'destination-out';

              ctx.beginPath();
              //ctx.arc(x, y, 150, 0, 2 * Math.PI);
              if (clientWidth < 700) {
                  ctx.arc(x, y, 50, 0, 2 * Math.PI);
              } else {
                  ctx.arc(x, y, 150, 0, 2 * Math.PI);
              }
              //ctx.fillStyle = "rgba(0,0,0,.1)";
              ctx.fill();

              ctx.lineWidth = 20;
              ctx.beginPath();
              ctx.moveTo(old.x, old.y);
              ctx.lineTo(x, y);
              ctx.stroke();

              old = {x: x, y: y};
              count++;
              checkCount();
            }
        }

        function checkCount() {
            if (count >= 250) {
                body.removeClass('-hideOverflow');
                canvas.classList.add('-hidden');
                sessionStorage.setItem('chakana', true);
                setTimeout(function() {
                    if (canvas.parentNode) {
                        canvas.parentNode.removeChild(canvas);
                    }
                }, 500);
            } else {
                return false;
            }
        }

        body.addClass('-hideOverflow');
        setTimeout(function() {
            $('.home').removeClass('-hidden');
        }, 500);
    } else {
        setTimeout(function() {
            $('.home').removeClass('-hidden');
            canvas.parentNode.removeChild(canvas);
        }, 500);
    }

    var sections = $('section');
    var navItems = $('.home__nav li');
    var visible;

    function isVisible(el) {
        var top = el.get(0).getBoundingClientRect().top;

        if ( top <= 100 && top >= 0 ) {
            visible = true;
        } else {
            visible = false;
        }

        return visible;
    }

    function scrollCheck(el) {
        el.each(function(){
            var $this = $(this);

            $(window).on('scroll', function(){
                _.debounce(isVisible($this), 300);

                if (visible === true) {
                    checkSection($this);
                }
            });
        });
    }

    function setActiveNavItem() {
        var sectionsArray = $.makeArray(sections);
        var activeSectionINdex = sectionsArray.findIndex(function(el) {
            return el.className.includes('-visible');
        });

        navItems.removeClass('-active');

        $(navItems.get(activeSectionINdex)).addClass('-active');
    }

    function checkSection(el) {
        var activeSection = $('section.-visible');

        if (!el.hasClass('-visible')) {
            el.addClass('-visible');
            setActiveNavItem();
        } else {
            isVisible(activeSection);

            if (visible === false) {
                sections.removeClass('-visible');
                return false;
                scrollCheck(sections);
            }
        }
    }

    scrollCheck(sections);
};

module.exports = Header;
