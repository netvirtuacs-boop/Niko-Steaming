import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/defaultData';

const STEPS = [
  {
    number: '01.',
    title: 'Escolha seu plano ou peça um teste',
    description:
      'Selecione entre os planos de assinatura para sua casa ou um pacote de créditos para revenda. Se preferir, solicite um teste grátis antes.',
  },
  {
    number: '02.',
    title: 'Receba seus dados de acesso em minutos',
    description:
      'Após a solicitação ou pagamento via PIX, nossa equipe envia seu usuário, senha e link de servidor diretamente no seu WhatsApp ou e-mail.',
  },
  {
    number: '03.',
    title: 'Conecte no seu aparelho e comece a assistir',
    description:
      'Abra um aplicativo compatível como Max Player, IPTV Smarters ou TiviMate na sua Smart TV, TV Box ou celular e aproveite toda a grade.',
  },
];

export function HowItWorksAndFaq() {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <>
      {/* Seção Como Funciona */}
      <section className="border-b border-white/15 bg-transparent py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#FCA5A5]">Ativação Descomplicada</p>
            <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)] sm:text-4xl">
              Como começar a assistir em três passos simples
            </h2>
          </div>

          <div className="card-luminous mt-10 grid grid-cols-1 divide-y divide-white/15 rounded-2xl lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {STEPS.map((step) => (
              <div key={step.number} className="p-8">
                <div className="font-mono text-2xl font-bold tabular-nums text-[#FCA5A5]">
                  {step.number}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Dúvidas Frequentes */}
      <section id="duvidas" className="border-b border-white/15 bg-transparent py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold text-[#FCA5A5]">Perguntas Frequentes</p>
              <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)]">
                Tire suas dúvidas antes de assinar
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                Confira as respostas sobre instalação, telas simultâneas, compatibilidade e ativação imediata.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="card-luminous divide-y divide-white/15 rounded-2xl px-6 sm:px-8">
                {FAQ_ITEMS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-semibold text-white transition-colors hover:text-[#FCA5A5] cursor-pointer sm:text-lg"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-300 transition-transform duration-150 ${
                            isOpen ? 'rotate-180 text-[#FCA5A5]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="pb-6 pr-8 text-sm leading-relaxed text-slate-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
