import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import './App.css'; // Import the external CSS

function App() {
  const [svgCode, setSvgCode] = useState(null);
  const [svgWidth, setSvgWidth] = useState(150); 
  const [svgHeight, setSvgHeight] = useState(150); 
  const [svgColor, setSvgColor] = useState('#000000'); 
  const svgRef = useRef(null); 
  const isFirstLoad = useRef(true); 

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target.result;
        setSvgCode(svgContent); 
        isFirstLoad.current = true; 
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

    URL.revokeObjectURL(url); 
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/svg+xml',
    onDrop: handleFileUpload,
  });

  const removeAllGElements = (svgElement) => {
    const gElements = svgElement.querySelectorAll('g');
    gElements.forEach(g => {
      while (g.firstChild) {
        g.parentNode.insertBefore(g.firstChild, g); 
      }
      g.parentNode.removeChild(g); 
    });
  };

  const updateSvgColor = (svgElement) => {
    svgElement.setAttribute('fill', svgColor); 

    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
      path.removeAttribute('fill'); 
    });
  };

  const removeWhitespace = (svgString) => {
    return svgString
      .replace(/>\s+</g, '><') 
      .replace(/\s{2,}/g, ' ') 
      .replace(/[\n\r\t]+/g, ''); 
  };

  const checkSvgFillColor = (svgElement) => {
    if (isFirstLoad.current) {
      if (svgElement.hasAttribute('fill')) {
        setSvgColor(svgElement.getAttribute('fill')); 
      } else {
        const paths = svgElement.querySelectorAll('path');
        for (const path of paths) {
          if (path.hasAttribute('fill')) {
            setSvgColor(path.getAttribute('fill')); 
            break;
          }
        }
      }
      isFirstLoad.current = false; 
    }
  };

  useEffect(() => {
    if (svgCode) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (svgElement) {
        checkSvgFillColor(svgElement); 
        removeAllGElements(svgElement); 
        updateSvgColor(svgElement); 
        svgElement.removeAttribute('width'); 
        svgElement.removeAttribute('height'); 
        svgElement.setAttribute('width', svgWidth); 
        svgElement.setAttribute('height', svgHeight); 

        let cleanedSvgCode = removeWhitespace(svgElement.outerHTML); 
        setSvgCode(cleanedSvgCode); 
      }
    }
  }, [svgCode, svgWidth, svgHeight, svgColor]); 

  return (
    <div className="app">
      <h2 className="header">SVG to Code</h2>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <button className="uploadButton">Upload SVG</button>
        <p className="dropText">Or drag and drop an SVG file here</p>
      </div>

      <div className="inputContainer">
        <label>
          Width:
          <input
            type="number"
            value={svgWidth}
            onChange={(e) => setSvgWidth(e.target.value)}
            className="input"
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={svgHeight}
            onChange={(e) => setSvgHeight(e.target.value)}
            className="input"
          />
        </label>
        <label>
          Color:
          <input
            type="color"
            value={svgColor}
            onChange={(e) => setSvgColor(e.target.value)}
            className="input"
          />
        </label>
      </div>

      <div className="content">
        {svgCode ? (
          <>
            <div className="svgPreviewContainer">
              <div
                className="svgPreview"
                dangerouslySetInnerHTML={{ __html: svgCode }}
                ref={svgRef} 
              />
            </div>
            <div className="codeSection">
              <h3>SVG Code</h3>
              <SyntaxHighlighter 
                language="jsx"
                lineProps={{style: {wordBreak: "break-all", whiteSpace: "pre-wrap"}}}
                customStyle={{maxHeight: "200px"}}
                wrapLines={true}
                style={materialDark}>
                {svgCode}
              </SyntaxHighlighter>
              <button className="copyButton" onClick={copyToClipboard}>
                Copy Code
              </button>
              <button className="downloadButton" onClick={downloadSvgCode}>
                Download SVG
              </button>
            </div>
          </>
        ) : (
          <p className="placeholderText">No SVG file uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
