<?php
/**
 * @file
 * Callbacks for Quiz API module.
 */

/**
 * Callback for api/quiz.
 */
function quiz_api_data() {
  $query = drupal_get_query_parameters();
  $data = [];
  if (!empty($query['quiz'])) {
    $data = quiz_api_build_quiz_data($query['quiz']);
  }
  drupal_json_output($data);
}

/**
 * Build quiz data.
 *
 * @param int $id
 *   The quiz node id.
 * @return array
 */
function quiz_api_build_quiz_data($id = NULL) {
  $data = [];
  if (!empty($id) && filter_var($id, FILTER_VALIDATE_INT) !== FALSE) {
    $quiz = entity_metadata_wrapper('node', $id);
    if (!empty($quiz) && $quiz->__isset('field_questions')) {
      $data['title'] = $quiz->label();
      $data['questions'] = [];
      foreach ($quiz->field_questions->getIterator() as $question_wrapper) {
        $question = ['question' => $question_wrapper->field_question->value()];
        $question['options'] = $question_wrapper->field_options->value();
        $question['correct_option'] = $question_wrapper->field_correct_option->value() - 1;
        $data['questions'][] = $question;
      }
    }
  }
  return $data;
}
