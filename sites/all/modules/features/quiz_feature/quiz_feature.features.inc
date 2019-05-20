<?php

/**
 * @file
 * quiz_feature.features.inc
 */

/**
 * Implements hook_node_info().
 */
function quiz_feature_node_info() {
  $items = array(
    'quiz' => array(
      'name' => t('Quiz'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}

/**
 * Implements hook_paragraphs_info().
 */
function quiz_feature_paragraphs_info() {
  $items = array(
    'question' => array(
      'name' => 'Question',
      'bundle' => 'question',
      'locked' => '1',
    ),
  );
  return $items;
}
