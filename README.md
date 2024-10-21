
# SVG to Code app

This is a React-based web application that allows users to upload SVG files, adjust their size and color, get the svg code directly, and download or copy the SVG code.

## Features

- **SVG Upload**: Upload SVG files by dragging and dropping or using a file upload button.
- **SVG Preview**: Display the uploaded SVG with options to adjust its width, height, and color dynamically.
- **Live Code Preview**: View the SVG code with syntax highlighting using React Syntax Highlighter.
- **Copy SVG Code**: Easily copy the SVG code to the clipboard with a single button click.
- **Download SVG**: Download the modified SVG file directly as an `.svg` file.

## Demo

You can try a live demo of the project [here](#).


## Usage

1. Upload an SVG file by either dragging it into the designated area or using the **Upload SVG** button.
2. Adjust the SVG's width, height, and color using the input fields.
3. The SVG will update in real-time as you modify its properties.
4. The **SVG Code** section will display the updated SVG code with syntax highlighting.
5. Use the **Copy Code** button to copy the SVG code to your clipboard.
6. Click **Download SVG** to save the modified SVG as a `.svg` file.

## Future Work
- Creating Browser Extension to see directly svg codes
- Changing styling to tailwindcss

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **React Dropzone**: Used for file upload and drag-and-drop functionality.
- **React Syntax Highlighter**: For rendering syntax-highlighted SVG code.
- **Prism Syntax Highlighting**: A lightweight, customizable code syntax highlighter.



## Dependencies

- **React**: ^18.0.0
- **React Dropzone**: ^11.3.4
- **React Syntax Highlighter**: ^15.4.3

You can view all project dependencies in the `package.json` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
