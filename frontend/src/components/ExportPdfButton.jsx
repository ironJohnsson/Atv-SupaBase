// ====================================================================
// SUCELSO TECH - Botão de Exportação de Grade em PDF (Diferencial)
// ====================================================================

import React, { useState } from 'react';
import { FileDown, Check, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ExportPdfButton({ targetElementId = 'grade-container', filename = 'grade-horaria-sucelso-tech.pdf' }) {
  const [exporting, setExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const element = document.getElementById(targetElementId);
      if (!element) {
        window.print();
        setExporting(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, Math.min(pdfHeight, 185));
      pdf.save(filename);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Falha ao exportar PDF, utilizando print nativo:', err);
      window.print();
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition disabled:opacity-50"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      ) : downloaded ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <FileDown className="w-4 h-4 text-slate-600" />
      )}
      <span>{exporting ? 'Gerando PDF...' : downloaded ? 'PDF Baixado!' : 'Exportar PDF'}</span>
    </button>
  );
}

