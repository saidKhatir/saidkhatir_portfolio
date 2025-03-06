
(function () {
   'use strict';
   
  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 900);
            return false;
          }
        }
      });

	
// Portfolio isotope filter
$(document).ready(function() {
  var $container = $('.portfolio-items');

  // Filtrer par défaut sur une catégorie spécifique (ex: .lorem)
  $container.isotope({
      filter: '.lorem', // Change ici pour la catégorie que tu veux afficher par défaut
      animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
      }
  });

  $('.cat a').click(function() {
      $('.cat .active').removeClass('active');
      $(this).addClass('active');
      
      var selector = $(this).attr('data-filter');
      $container.isotope({
          filter: selector,
          animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false
          }
      });
      return false;
  });
});

	
	
    // Nivo Lightbox 
    $('.portfolio-item a').nivoLightbox({
            effect: 'slideDown',  
            keyboardNav: true,                            
        });

}());

document.addEventListener("DOMContentLoaded", function () {
  let iframes = document.querySelectorAll(".lazy-iframe");
  let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              let iframe = entry.target;
              iframe.src = iframe.getAttribute("data-src");
              observer.unobserve(iframe);
          }
      });
  });
  iframes.forEach(iframe => observer.observe(iframe));
});

