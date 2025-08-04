import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faArrowUp,
  faMicrophone,
  faUser,
  faShareAlt,
  faEllipsisV,
  faFilePdf,
  faImage,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const mockMessages = [
  { from: "user", text: "How does consciousness emerge from matter?" },
  {
    from: "ia",
    text: `The emergence of consciousness from matter is one of the most profound unsolved problems in science and philosophy, often referred to as the "hard problem of consciousness." No definitive answer exists, but several perspectives and theories attempt to explain it. Here's a concise overview:\n\n1. **Physicalist Theories**:\n   - **Neuroscience Perspective:** Consciousness arises from complex computations in the brain. Neural networks, particularly in regions like the cortex, process information, leading to subjective experience.`,
  },
  { from: "user", text: "em portugues" },
  {
    from: "ia",
    text: `A emergência da consciência a partir da matéria é um dos problemas mais profundos e não resolvidos da ciência e da filosofia, frequentemente chamado de "problema difícil da consciência". Não há uma resposta definitiva, mas várias perspectivas e teorias tentam explicá-lo. Aqui está uma visão geral concisa:\n\n1. **Teorias Fisicalistas:**\n   - **Perspectiva Neurocientífica:** A consciência surge de computações complexas no cérebro. Redes neurais, especialmente em regiões como o córtex, processam informações, levando à experiência subjetiva.`,
  },
  {
    from: "ia",
    text: `A emergência da consciência a partir da matéria é um dos problemas mais profundos e não resolvidos da ciência e da filosofia, frequentemente chamado de "problema difícil da consciência". Não há uma resposta definitiva, mas várias perspectivas e teorias tentam explicá-lo. Aqui está uma visão geral concisa:\n\n1. **Teorias Fisicalistas:**\n   - **Perspectiva Neurocientífica:** A consciência surge de computações complexas no cérebro. Redes neurais, especialmente em regiões como o córtex, processam informações, levando à experiência subjetiva.`,
  },
];

const AppMVP = () => {
  const [prompt, setPrompt] = useState("");
  const [showDropup, setShowDropup] = useState(false);
  const paperclipRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrompt("");
  };

  // Fecha o dropup ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        paperclipRef.current &&
        !paperclipRef.current.contains(event.target as Node)
      ) {
        setShowDropup(false);
      }
    }
    if (showDropup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropup]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] px-4">
      {/* Header fixo no topo */}
      <header className="fixed top-0 left-0 w-full flex justify-end items-center gap-2 px-8 py-6 bg-[#faf9f7] z-50">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faShareAlt} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </Button>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-base ml-2">
          a
        </div>
      </header>

      {/* Espaço para header */}
      <div className="h-[72px]" />

      {/* Container de mensagens */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pt-8 pb-72">
          {mockMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-5 py-3 text-base whitespace-pre-line shadow-sm max-w-[90%] ${
                  msg.from === "user"
                    ? "bg-white text-gray-900 border border-gray-200"
                    : "bg-gray-50 text-gray-800 border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Caixa de prompt fixa no rodapé */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center pb-8 z-50 bg-[#faf9f7]">
        <div className="w-full max-w-4xl mx-auto">
          <div className="border border-gray-200 bg-white shadow-md rounded-3xl p-6 md:p-8 transition-all duration-300 group">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Como posso te ajudar hoje?"
                  className="w-full bg-transparent border-none outline-none text-[#222] placeholder:text-gray-600 text-lg resize-none max-h-[120px] min-h-[56px] overflow-y-auto"
                  rows={2}
                  style={{ lineHeight: "1.5", height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height =
                      Math.min(target.scrollHeight, 120) + "px";
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  ref={paperclipRef}
                  className="w-10 h-10 rounded-full text-gray-600 transition-all bg-transparent hover:bg-gray-100 hover:text-gray-600 text-base flex items-center justify-center relative"
                  tabIndex={-1}
                  onClick={() => setShowDropup((v) => !v)}
                >
                  <FontAwesomeIcon icon={faPaperclip} className="!w-5 !h-5" />
                  {/* Dropup */}
                  {showDropup && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 mb-2 w-56 bg-white border border-gray-300 rounded-xl shadow-xl z-50 flex flex-col p-1.5 animate-fade-in-up">
                      <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition rounded-lg text-left">
                        <FontAwesomeIcon
                          icon={faImage}
                          className="w-4 h-4 text-gray-600"
                        />
                        Adicionar imagem
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100  transition rounded-lg text-left">
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="w-4 h-4 text-gray-600"
                        />
                        Adicionar documento
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100  transition rounded-lg text-left">
                        <FontAwesomeIcon
                          icon={faFileExcel}
                          className="w-4 h-4 text-gray-600"
                        />
                        Adicionar documento
                      </button>
                    </div>
                  )}
                </button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full text-gray-500 transition-all bg-transparent hover:bg-gray-100 hover:text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      className="!w-5 !h-5"
                    />
                  </Button>

                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full text-gray-700 transition-all bg-gray-100 hover:bg-gray-200 hover:text-gray-800"
                  >
                    <FontAwesomeIcon icon={faArrowUp} className="!w-5 !h-5" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMVP;
