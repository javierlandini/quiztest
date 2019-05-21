(function ( $ ) {

  $.fn.quiz = function(options) {
    var settings = $.extend(true, {}, $.fn.quiz.defaults, options);
    var self = this;
    var quiz = {
      page: 0,
      pages: 0,
      init: function() {
        if (!self.hasClass('quiz-processed')) {
          var url = settings.api_url + '?quiz=' + settings.id;
          $.getJSON(url).done(quiz.build).fail();
        }
      },
      /*
       * Build the form.
       *
       * @param {Object} data.
       */
      build: function(data) {
        if (data.hasOwnProperty('questions')) {
          var $form = $('<form>').addClass('quiz-form');
          var $quiz_title = $('<h3>').html(data.title).appendTo($form);
          var $error_msg = $('<div>').html('The option you selected is incorrect. Please select another one and try again.').addClass('error-msg').hide().appendTo($form);
          var $end_msg = $('<div>').html('You have finished this quiz. Congratulations!').addClass('end-msg').hide().appendTo($form);
          var pages = data.questions;
          quiz.pages = Object.keys(pages).length;
          $.each(pages, function(i, question) {
            var $page = $('<div>').addClass('tab').hide().appendTo($form);
            quiz.createQuestion(question, i).appendTo($page);
          });
          $form.appendTo(self);
          quiz.createNavigation().appendTo(self);
          self.addClass('quiz-processed');
          quiz.showPage(quiz.page);
        }
      },
      /*
       * Create a single question on a page.
       *
       * @param {Object} question.
       * @param {Number} page
       *
       * @return {Object} DOM element.
       */
      createQuestion: function(question, page) {
        var $element = $('<div>', {
          'data-option': question.correct_option
        }).addClass('quiz-radiogroup-wrapper');

        // Title.
        var $child = $('<div>').addClass('title').appendTo($element);
        $('<h4 class="quiz-question">').text(question.question).appendTo($child);

        // Radio group container.
        var $radiogroup = $('<div>').addClass('radio-group').appendTo($element);

        // Options.
        var options = question.options || [];
        $.each(options, function(value, text) {
          var identifier = 'r-' + settings.id + '-' + page + '-' + value;
          var $radio = $('<input>', {
            'id': identifier,
            'type': 'radio',
            'value': value,
            'name': 'question-page-' + settings.id + '-' + page
          }).appendTo($radiogroup);
          $('<label>').attr('for', identifier).text(text).appendTo($radiogroup);
        });

        return $element;
      },
      /*
       * Create quiz navigation.
       *
       * @return {Object} DOM element.
       */
      createNavigation: function() {
        var $element = $('<div>').css('overflow', 'auto').addClass('quiz-navigation');
        var $nav = $('<div>').addClass('quiz-buttons').css('float', 'right').appendTo($element);
        $('<button>', {
          'type': 'button',
          'class': 'navigation-back'
        }).text('Back').click(quiz.onNavigationBackButton).appendTo($nav);
        $('<button>', {
          'type': 'button',
          'class': 'navigation-next'
        }).text('Next').click(quiz.onNavigationNextButton).appendTo($nav);

        return $element;
      },
      /*
       * Show a single survey page.
       *
       * @param {Number} Page number.
       */
      showPage: function(page) {
        var tabs = $('.tab', self);
        var current = $(tabs[page]);
        $(current).show();

        // Back button.
        if (page === 0) {
          $('button.navigation-back', self).hide();
        }
        else {
          $('button.navigation-back', self).show();
        }

        $('.error-msg', self).hide();
      },
      /**
       * Display error message.
       */
      displayErrorMessage: function() {
        $('.error-msg', self).show();
      },
      /**
       * Display end quiz message.
       */
      displayEndMessage: function() {
        $('.tab', self).hide();
        $('.quiz-buttons', self).hide();
        $('.error-msg', self).hide();
        $('.end-msg', self).show();
      },
      /*
       * onNavigationBackButton callback.
       *
       * @param {Event} e.
       */
      onNavigationBackButton: function(e) {
        e.preventDefault();

        // Hide the current page.
        var tabs = $('.tab', self);
        $(tabs[quiz.page]).hide();

        // Display the previous page.
        quiz.page--;
        quiz.showPage(quiz.page);
      },

      /*
       * onNavigationNextButton callback.
       *
       * @param {Event} e.
       */
      onNavigationNextButton: function(e) {
        e.preventDefault();

        // Exit if the current page is invalid.
        if (!quiz.validate(quiz.page)) {
          quiz.displayErrorMessage();
          return false;
        }
        // If we have reached the end of the quiz, display final message.
        else if (quiz.page === quiz.pages - 1) {
          quiz.displayEndMessage();
          return false;
        }

        // Hide the current page.
        var tabs = $('.tab', self);
        $(tabs[quiz.page]).hide();

        // Display the next page.
        quiz.page++;
        quiz.showPage(quiz.page);
      },
      /*
       * Validate a single quiz page.
       *
       * @param {Number} Page number.
       *
       * @return {Boolean} Valid or not.
       */
      validate: function(page) {

        var $tabs = $('.tab', self);
        var $current = $($tabs[page]);
        var correct = $('.quiz-radiogroup-wrapper', $current).data('option');
        var radio_name = 'question-page-' + settings.id + '-' + page;
        if ($('input[name='+ radio_name +']:checked', $current).val() == correct) {
          return true;
        }
        return false;

      }
    };

    quiz.init();
  };
  $.fn.quiz.defaults = {
    id: '',
    api_url: '/api/quiz'
  };

}( jQuery ));
