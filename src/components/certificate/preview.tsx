"use client";

import { useEffect, useState, useRef } from "react";
import { createCertificateHTML } from "@/utils/certificateTemplate";
import { extractStyleAndBody } from "@/utils/function";

interface InCertificatePreviewProps {
  name: string
  onHandleLogout: () => void;
}


const CertificatePreview: React.FC<InCertificatePreviewProps> = ({ name, onHandleLogout }) => {

  const [htmlContent, setHtmlContent] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const fullHTML = createCertificateHTML(name);
    const styledContent = extractStyleAndBody(fullHTML);
    setHtmlContent(styledContent);
  }, []);

  const handleDownload = async () => {

    if (!certificateRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;
    const filename = `certificado_${name}_${Date.now()}.pdf`
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(certificateRef.current).save();
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen w-screen flex flex-col justify-center items-center">

      <div className="w-full overflow-hidden">

        <div
          ref={certificateRef}
          className="bg-white shadow rounded overflow-x-auto mb-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>


      <span className="h-4" />
      <div className="w-full flex flex-col gap-2 lg:flex-row lg:justify-between lg:w-1/2">

        <button
          onClick={handleDownload}
          className="w-full lg:w-sm mt-4 flex items-center justify-center min-h-14  px-4 py-4 text-white font-semibold rounded-lg  space-x-2 bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Descargar Certificado</span>
        </button>

        <button
          onClick={onHandleLogout}
          className="w-sm mt-4 flex items-center justify-center min-h-14  px-4 py-4 text-white font-semibold rounded-lg  space-x-2 bg-gray-600 hover:bg-gray-700 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>

          <span>Salir</span>
        </button>
      </div>

    </div>

  );
}

export default CertificatePreview