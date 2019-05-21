/**
 * @file
 * Quiz UI JS.
 */

!(function ($) {
  'use strict';

  Drupal.behaviors.quizUI = {
    container: '.quiz',
    attach: function(context, settings) {
      $(this.container).not(".quiz-processed").each(function(index) {
        $(this).quiz({
          id: $(this).data('quiz')
        });
      });
    }
  }
})(jQuery);
