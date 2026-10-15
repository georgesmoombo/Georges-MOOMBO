import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Invoice } from '../types/crm';
import { PORTFOLIO_INFO } from '../data/portfolioData';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Action Header (No Print) */}
        <div className="no-print bg-slate-100 dark:bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Facture Numérique Officielle • {invoice.number}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              invoice.status === 'Payée' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            }`}>
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="cv-printable-area" className="p-8 sm:p-12 overflow-y-auto space-y-8 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 dark:border-slate-700 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  GM
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Georges MOOMBO MODEAWI
                </h1>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                Services Numériques & Informatique de Gestion
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kinshasa, RDC • Tél : {PORTFOLIO_INFO.phoneDisplay}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email : {PORTFOLIO_INFO.email}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Facture Proforma / Définitive
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">
                {invoice.number}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-0.5">
                <div>Date d'émission : <strong>{invoice.date}</strong></div>
                <div>Date d'échéance : <strong>{invoice.dueDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Client Details Row */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Facturé à l'attention de :
            </span>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {invoice.clientName}
            </div>
            {invoice.projectTitle && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                Projet associé : {invoice.projectTitle}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[11px]">
                  <th className="py-3 font-bold">Désignation de la prestation</th>
                  <th className="py-3 font-bold text-center">Qté</th>
                  <th className="py-3 font-bold text-right">Prix Unitaire</th>
                  <th className="py-3 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 pr-2 font-medium text-slate-900 dark:text-white">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-600 dark:text-slate-300">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300">
                      {item.unitPrice} {invoice.currency}
                    </td>
                    <td className="py-3.5 pl-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {item.total} {invoice.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Modalités de règlement :</span>
              <div>• Mobile Money : M-Pesa / Airtel Money au {PORTFOLIO_INFO.phoneDisplay}</div>
              <div>• Virement bancaire disponible sur demande</div>
              <div>• Facture conforme aux normes de gestion d'entreprise</div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Sous-total :</span>
                <span className="font-mono">{invoice.subTotal} {invoice.currency}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise accordée :</span>
                  <span className="font-mono">-{invoice.discount} {invoice.currency}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base sm:text-lg border-t border-slate-200 dark:border-slate-700 pt-2 text-slate-900 dark:text-white">
                <span>Total Net :</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{invoice.total} {invoice.currency}</span>
              </div>
            </div>
          </div>

          {/* Payment Status Stamp */}
          {invoice.status === 'Payée' && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 flex items-center gap-3 text-green-700 dark:text-green-300 text-xs">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Facture acquittée et payée dans son intégralité. Merci pour votre confiance !</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
