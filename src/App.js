import { hover } from '@testing-library/user-event/dist/hover';
import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import Prism highlighter
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import style for syntax highlighting

function App() {
  const [svgCode, setSvgCode] = useState(null);
  const [svgWidth, setSvgWidth] = useState(150); // Default width
  const [svgHeight, setSvgHeight] = useState(150); // Default height
  const [svgColor, setSvgColor] = useState('#000000'); // Default color
  const svgRef = useRef(null); // Ref for the SVG element
  const isFirstLoad = useRef(true); // Track if it's the first load of the SVG

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target.result;
        setSvgCode(svgContent); // Set the raw SVG code
        isFirstLoad.current = true; // Reset to true when a new SVG is uploaded
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid SVG file.");
    }
  };

  const copyToClipboard = () => {
    if (svgCode) {
      navigator.clipboard.writeText(svgCode);
      alert("SVG code copied to clipboard!");
    }
  };

  const downloadSvgCode = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'downloaded_image.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/svg+xml',
    onDrop: handleFileUpload,
  });

  // Function to remove all <g> elements from the SVG
  const removeAllGElements = (svgElement) => {
    const gElements = svgElement.querySelectorAll('g');
    gElements.forEach(g => {
      while (g.firstChild) {
        g.parentNode.insertBefore(g.firstChild, g); // Move child elements out of <g>
      }
      g.parentNode.removeChild(g); // Remove the <g> tag itself
    });
  };

  // Function to update the fill attribute with the selected color
  const updateSvgColor = (svgElement) => {
    // Apply the selected color to <svg> or <path> elements
    svgElement.setAttribute('fill', svgColor); // Set the fill attribute to the selected color

    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
      path.removeAttribute('fill'); // Set the fill color for each path element
    });
  };

  // Function to remove unnecessary whitespace from SVG string
  const removeWhitespace = (svgString) => {
    return svgString
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .replace(/[\n\r\t]+/g, ''); // Remove newlines, tabs, and carriage returns
  };

  // Check for existing fill color in the SVG and update the color picker
  const checkSvgFillColor = (svgElement) => {
    // Only check the fill color on first load
    if (isFirstLoad.current) {
      if (svgElement.hasAttribute('fill')) {
        setSvgColor(svgElement.getAttribute('fill')); // Set the color picker to the fill color
      } else {
        // Check if any <path> tags have a fill attribute
        const paths = svgElement.querySelectorAll('path');
        for (const path of paths) {
          if (path.hasAttribute('fill')) {
            setSvgColor(path.getAttribute('fill')); // Set the color picker to the first found fill
            break;
          }
        }
      }
      isFirstLoad.current = false; // Mark that the initial load is complete
    }
  };

  // Update the SVG whenever it's uploaded and set width/height/color based on input
  useEffect(() => {
    if (svgCode) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (svgElement) {
        checkSvgFillColor(svgElement); // Check and update the color picker based on SVG's fill
        removeAllGElements(svgElement); // Remove all <g> elements
        updateSvgColor(svgElement); // Update the SVG color
        svgElement.removeAttribute('width'); // Remove existing width
        svgElement.removeAttribute('height'); // Remove existing height
        svgElement.setAttribute('width', svgWidth); // Set user-defined width
        svgElement.setAttribute('height', svgHeight); // Set user-defined height

        let cleanedSvgCode = removeWhitespace(svgElement.outerHTML); // Remove whitespace
        setSvgCode(cleanedSvgCode); // Update the modified SVG code
      }
    }
  }, [svgCode, svgWidth, svgHeight, svgColor]); // Re-run effect when svgCode, width, height, or color changes

  return (
    <div className="App" style={styles.container}>
      <h2 style={styles.header}>SVG to Code</h2>

      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <button style={styles.uploadButton}>Upload SVG</button>
        <p style={styles.dropText}>Or drag and drop an SVG file here</p>
      </div>

      <div style={styles.inputContainer}>
        <label>
          Width:
          <input
            type="number"
            value={svgWidth}
            onChange={(e) => setSvgWidth(e.target.value)}
            style={styles.input}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={svgHeight}
            onChange={(e) => setSvgHeight(e.target.value)}
            style={styles.input}
          />
        </label>
        <label>
          Color:
          <input
            type="color"
            value={svgColor}
            onChange={(e) => setSvgColor(e.target.value)}
            style={styles.input}
          />
        </label>
      </div>

      <div style={styles.content}>
        {svgCode ? (
          <>
            <div style={styles.svgPreviewContainer}>
              <div
                style={styles.svgPreview}
                dangerouslySetInnerHTML={{ __html: svgCode }}
                ref={svgRef} // Assign the SVG element reference here
              />
            </div>
            <div style={styles.codeSection}>
              <h3>SVG Code</h3>
              <SyntaxHighlighter language="jsx"
               lineProps={{style: {wordBreak: "break-all", whiteSpace: "pre-wrap"}}}
               customStyle={{style: {maxHeight: "200px"}}}
               wrapLines={true} 

               style={materialDark}>
                {svgCode}
              </SyntaxHighlighter>
              <button style={styles.copyButton} onClick={copyToClipboard}>
                Copy Code
              </button>
              <button style={styles.downloadButton} onClick={downloadSvgCode}>
                Download SVG
              </button>
            </div>
          </>
        ) : (
          <p style={styles.placeholderText}>No SVG file uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  dropzone: {
    border: '2px solid #ececec',
    borderRadius: '10px',
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '20px',   
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  dropText: {
    marginTop: '10px',
    color: '#666',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  input: {
    width: '70px',
    marginLeft: '10px',
  },
  content: {
    width: '100%',
  },
  svgPreviewContainer: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  svgPreview: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeSection: {
    textAlign: 'center',
  },
  copyButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  downloadButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#888',
  },
};

export default App;
