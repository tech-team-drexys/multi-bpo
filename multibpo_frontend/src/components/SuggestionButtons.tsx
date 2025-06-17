import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SuggestionButtonsProps {
  onSuggestionClick: (text: string) => void;
}

const SuggestionButtons = ({ onSuggestionClick }: SuggestionButtonsProps) => {
  const [visibleButtons, setVisibleButtons] = useState(0);

  const suggestions = [
    "Consultar Optante - SN",
    "Pesquisar CNPJ RFB",
    "Consultar I.E.",
    "Consultar CNAE",
    "Consultar Atividade",
    "Consultar CND Federal",
    "Consultar CND Estadual",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleButtons((prev) => {
        if (prev < suggestions.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [suggestions.length]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            variant="ghost"
            className={`
              backdrop-blur-md border border-white/20 
              bg-black/30 hover:bg-black/50 
              text-white hover:text-white
              px-4 py-2 h-auto min-h-[44px]
              rounded-2xl text-sm font-medium
              transition-all duration-300 ease-out
              hover:border-white/40
              hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
              transform-gpu
              ${
                index < visibleButtons
                  ? "opacity-100 translate-y-0 [transition-delay:0ms]"
                  : "opacity-0 translate-y-4"
              }
            `}
            style={
              index >= visibleButtons
                ? {
                    transitionDelay: `${index * 150}ms`,
                  }
                : undefined
            }
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionButtons;
