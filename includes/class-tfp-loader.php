<?php
/**
 * The core plugin loader class.
 */
class TFP_Loader {
    /**
     * The single instance of the class.
     */
    protected static $_instance = null;

    /**
     * Main Instance.
     */
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor.
     */
    public function __construct() {
        $this->init_hooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Initialize REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Add AJAX actions
        add_action('wp_ajax_tfp_save_template', array($this, 'save_template'));
        add_action('wp_ajax_tfp_get_template', array($this, 'get_template'));
        add_action('wp_ajax_tfp_delete_template', array($this, 'delete_template'));
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('templates-for-pinterest/v1', '/templates', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_templates'),
                'permission_callback' => array($this, 'check_permissions'),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'save_template'),
                'permission_callback' => array($this, 'check_permissions'),
            ),
        ));

        register_rest_route('templates-for-pinterest/v1', '/templates/(?P<id>\d+)', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_template'),
                'permission_callback' => array($this, 'check_permissions'),
            ),
            array(
                'methods' => 'DELETE',
                'callback' => array($this, 'delete_template'),
                'permission_callback' => array($this, 'check_permissions'),
            ),
        ));
    }

    /**
     * Check if user has required permissions
     */
    public function check_permissions() {
        return current_user_can('manage_options');
    }

    /**
     * Get all templates
     */
    public function get_templates($request) {
        $args = array(
            'post_type' => 'pinterest_template',
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        );

        $posts = get_posts($args);
        $templates = array();

        foreach ($posts as $post) {
            $template_data = get_post_meta($post->ID, '_template_data', true);
            $templates[] = array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'data' => $template_data,
                'date' => $post->post_date,
            );
        }

        return rest_ensure_response($templates);
    }

    /**
     * Save a template
     */
    public function save_template($request) {
        $params = $request->get_params();
        
        $post_data = array(
            'post_title' => sanitize_text_field($params['title']),
            'post_type' => 'pinterest_template',
            'post_status' => 'publish',
        );

        if (!empty($params['id'])) {
            $post_data['ID'] = $params['id'];
            $post_id = wp_update_post($post_data);
        } else {
            $post_id = wp_insert_post($post_data);
        }

        if (is_wp_error($post_id)) {
            return new WP_Error('save_failed', __('Failed to save template', 'templates-for-pinterest'));
        }

        // Save template data
        update_post_meta($post_id, '_template_data', $params['data']);

        return rest_ensure_response(array(
            'id' => $post_id,
            'message' => __('Template saved successfully', 'templates-for-pinterest'),
        ));
    }

    /**
     * Get a single template
     */
    public function get_template($request) {
        $template_id = $request['id'];
        $post = get_post($template_id);

        if (!$post || $post->post_type !== 'pinterest_template') {
            return new WP_Error('not_found', __('Template not found', 'templates-for-pinterest'), array('status' => 404));
        }

        $template_data = get_post_meta($post->ID, '_template_data', true);

        return rest_ensure_response(array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'data' => $template_data,
            'date' => $post->post_date,
        ));
    }

    /**
     * Delete a template
     */
    public function delete_template($request) {
        $template_id = $request['id'];
        $result = wp_delete_post($template_id, true);

        if (!$result) {
            return new WP_Error('delete_failed', __('Failed to delete template', 'templates-for-pinterest'));
        }

        return rest_ensure_response(array(
            'message' => __('Template deleted successfully', 'templates-for-pinterest'),
        ));
    }
}

// Initialize the loader
TFP_Loader::instance(); 