<?php
/**
 * Plugin Name: Templates for Pinterest
 * Plugin URI: 
 * Description: A modern, desktop-focused image template editor for creating Pinterest-optimized templates, inspired by Canva.
 * Version: 1.0.0
 * Author: 
 * Author URI: 
 * Text Domain: templates-for-pinterest
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('TFP_VERSION', '1.0.0');
define('TFP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TFP_PLUGIN_URL', plugin_dir_url(__FILE__));

// Activation Hook
register_activation_hook(__FILE__, 'tfp_activate');
function tfp_activate() {
    // Create necessary database tables and options
    add_option('tfp_version', TFP_VERSION);
}

// Deactivation Hook
register_deactivation_hook(__FILE__, 'tfp_deactivate');
function tfp_deactivate() {
    // Cleanup if necessary
}

// Initialize the plugin
add_action('plugins_loaded', 'tfp_init');
function tfp_init() {
    // Load text domain for internationalization
    load_plugin_textdomain('templates-for-pinterest', false, dirname(plugin_basename(__FILE__)) . '/languages');
    
    // Include required files
    require_once TFP_PLUGIN_DIR . 'includes/class-tfp-loader.php';
}

// Register admin menu
add_action('admin_menu', 'tfp_add_admin_menu');
function tfp_add_admin_menu() {
    add_menu_page(
        __('Pinterest Templates', 'templates-for-pinterest'),
        __('Pinterest Templates', 'templates-for-pinterest'),
        'manage_options',
        'templates-for-pinterest',
        'tfp_render_admin_page',
        'dashicons-layout',
        30
    );
}

// Admin page callback
function tfp_render_admin_page() {
    // This will be replaced with our React app
    echo '<div id="tfp-admin-app"></div>';
}

// Enqueue admin scripts and styles
add_action('admin_enqueue_scripts', 'tfp_enqueue_admin_assets');
function tfp_enqueue_admin_assets($hook) {
    if ('toplevel_page_templates-for-pinterest' !== $hook) {
        return;
    }

    // Enqueue React and other dependencies
    wp_enqueue_script('tfp-admin-app', TFP_PLUGIN_URL . 'build/index.js', array('wp-element'), TFP_VERSION, true);
    wp_enqueue_style('tfp-admin-styles', TFP_PLUGIN_URL . 'build/index.css', array(), TFP_VERSION);

    // Localize script with necessary data
    wp_localize_script('tfp-admin-app', 'tfpSettings', array(
        'apiUrl' => rest_url('templates-for-pinterest/v1'),
        'nonce' => wp_create_nonce('wp_rest'),
    ));
}

// Register custom post type for templates
add_action('init', 'tfp_register_post_types');
function tfp_register_post_types() {
    register_post_type('pinterest_template', array(
        'labels' => array(
            'name' => __('Pinterest Templates', 'templates-for-pinterest'),
            'singular_name' => __('Pinterest Template', 'templates-for-pinterest'),
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => false,
        'supports' => array('title', 'custom-fields'),
        'capability_type' => 'post',
    ));
} 