import React, { useState, useEffect } from 'react';
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import pdf from './cat-br_compressed.pdf';

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

  const onPageTurn = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <>
      <div className="bg-gray-900 h-screen flex flex-col justify-end items-center md:justify-center scroll-mx-2 overflow-hidden">
        <div className="text-4xl font-bold md:font-extrabold text-white" style={{ margin: "1.5rem" }}>
          Catálogo BR Agro
        </div>
        {pdfLoaded && (
          <HTMLFlipBook
            width={350}
            height={500}
            showCover={true}
            onFlip={onPageTurn}
            flippingTime={300}
            onChangeOrientation={() => setCurrentPage(1)}
            className="custom-book"
          >
            {[...Array(numPages).keys()].map((n) => (
              <div key={n}>
                <Pages number={`${n + 1}`}>
                  {currentPage === n + 1 && (
                    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={n + 1} renderAnnotationLayer={false} renderTextLayer={false} width={350} className='border-3 border-black' />
                    </Document>
                  )}
                </Pages>
              </div>
            ))}
          </HTMLFlipBook>
        )}
      </div>
    </>
  );
}

export default App;
