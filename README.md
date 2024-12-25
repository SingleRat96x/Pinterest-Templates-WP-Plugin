# Templates for Pinterest

A modern, desktop-focused image template editor WordPress plugin inspired by Canva. Create, edit, and manage Pinterest-optimized templates with a sleek, intuitive, and professional user interface.

## Features

- Modern, Canva-inspired interface
- Create and edit Pinterest-optimized templates (1000x1500 px)
- Rich text editing with Google Fonts support
- Shape library with customization options
- Image upload and manipulation
- Background color and image management
- Template management system
- Responsive design for desktop use

## Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Download the plugin zip file
2. Go to WordPress admin panel > Plugins > Add New
3. Click "Upload Plugin" and choose the downloaded zip file
4. Click "Install Now"
5. After installation, click "Activate"

## Development Setup

1. Clone the repository into your WordPress plugins directory:
   ```bash
   cd wp-content/plugins
   git clone [repository-url] templates-for-pinterest
   ```

2. Install dependencies:
   ```bash
   cd templates-for-pinterest
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. After activation, you'll find "Pinterest Templates" in your WordPress admin menu
2. Click "Create New Template" to start designing
3. Use the right sidebar to add and customize elements:
   - Text: Add and style text elements
   - Shapes: Add basic shapes and customize them
   - Images: Upload and add images to your template
   - Background: Change background color or add background image

4. Save your template when finished
5. Access your saved templates from the main dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## Credits

- Built with React and Fabric.js
- UI components from Material-UI
- Color picker from react-color
- Image handling with react-dropzone 