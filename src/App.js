import React, { useState, useEffect } from 'react';
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import pdf from './cat-br_compressed.pdf';
import pageturn from './pageturn.mp3'; // Importa el archivo de sonido

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <p>{props.children}</p>
      <p>Page number: {props.number}</p>
    </div>
  );
});

function App(props) {
  const [numPages, setNumPages] = useState(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [preloadedPages, setPreloadedPages] = useState(5); // Number of pages to preload

  // Función para reproducir el sonido del flip
  const playFlipSound = () => {
    const audio = new Audio(pageturn);
    audio.play();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const loadPdf = async () => {
      try {
        await pdfjs.getDocument(pdf).promise;
        setPdfLoaded(true);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, []);

  const onPageClick = (e) => {
    setCurrentPage(e.data);
  };

  const preloadNextPages = () => {
    const nextPageToLoad = Math.min(currentPage + preloadedPages, numPages);
    setPreloadedPages(nextPageToLoad);
  };

  return (
    <div>
       <div className="header">
      {/* Logo centrado */}
      <img className="logo" src="/logo.png" alt="Logo de la empresa" />
    </div>
      <div className="background bg-gray-900 h-screen flex flex-col justify-end items-center md:justify-center scroll-mx-2 overflow-hidden">
        {pdfLoaded && (
          <HTMLFlipBook
            width={350}
            height={500}
            showCover={true}
            onPageClick={onPageClick}
            onFlip={() => { preloadNextPages(); playFlipSound(); }}
            flippingTime={300}
            onChangeOrientation={() => setCurrentPage(1)}
            className="custom-book"
            imageSmoothingEnabled={true}
          >
            {[...Array(preloadedPages).keys()].map((n) => (
              <div key={n}>
                <Pages number={`${currentPage + n}`}>
                  <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={currentPage + n} renderAnnotationLayer={false} renderTextLayer={false} width={350} className='border-3 border-black' />
                  </Document>
                </Pages>
              </div>
            ))}
          </HTMLFlipBook>
        )}
        <div style={{background:"#000", color:"#fff", width:"100%", textAlign:"center"}}>
          <p style={{fontWeight:"bold"}}>
            Derechos reservados <a href='http://www.isasoft.com.mx'>isaSoft</a> 2024.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
