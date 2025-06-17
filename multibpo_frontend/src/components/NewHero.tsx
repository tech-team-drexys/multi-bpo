import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMicrophone,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import TypewriterEffect from "./TypewriterEffect";
import SuggestionButtons from "./SuggestionButtons";

const NewHero = () => {
  const [prompt, setPrompt] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadStart = () => console.log("Video: Load started");
      const handleCanPlay = () => console.log("Video: Can play");
      const handleError = (e: Event) => {
        console.error("Video error:", e);
        const target = e.target as HTMLVideoElement;
        console.error("Video error details:", {
          error: target.error,
          networkState: target.networkState,
          readyState: target.readyState,
          currentSrc: target.currentSrc,
        });
      };
      const handleLoadedData = () => console.log("Video: Data loaded");

      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("error", handleError);
      video.addEventListener("loadeddata", handleLoadedData);

      return () => {
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("error", handleError);
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prompt submitted:", prompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const placeholderSuggestions = [
    "O que pode me fazer cair na malha fina?",
    "O que eu preciso para abrir minha empresa?",
    "Qual a diferença de um regime tributário para o outro?",
    "Sou MEI, posso contratar funcionário?",
    "Tem como pagar menos impostos legalmente?",
    "Como funciona a declaração do Imposto de Renda?",
    "Como faço para regularizar minha situação fiscal?",
    "Qual o melhor CNAE para minha atividade?",
    "Preciso de contador sendo MEI?",
    "Como funciona o Simples Nacional?",
    "Quais os prazos para declarações fiscais?",
    "Como emitir nota fiscal eletrônica?",
    "Posso ter mais de uma empresa?",
    "Como fazer o planejamento tributário?",
  ];

  // Função para randomizar a ordem das sugestões
  const getRandomSuggestions = () => {
    const shuffled = [...placeholderSuggestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    return shuffled;
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Container - Truly Centralized */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Heading + typewriter */}
          <div className="space-y-10 my-12">
            <h1 className="text-3xl font-bold text-white leading-tight md:text-4xl mt-24">
              O seu Escritório de Contabilidade está preparado para{" "}
              <TypewriterEffect
                words={[
                  "o Futuro?",
                  "a Digitalização?",
                  "a Inovação?",
                  "a Automação?",
                  "a Inteligência Artificial?",
                ]}
                className="text-green-500"
                typingSpeed={85}
                deletingSpeed={65}
                pauseDuration={1500}
                showCursor={true}
              />
            </h1>

            {/* Glassmorphism Prompt Box */}
            <div className="max-w-5xl mx-auto mt-8">
              <div className="backdrop-blur-md border border-white/20 p-6 shadow-2xl px-[24px] rounded-3xl transition-all duration-300 group bg-black/40 hover:bg-black/60 py-[20px]">
                <form onSubmit={handleSubmit} className="space-y-1">
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder=""
                      className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/70 text-lg resize-none max-h-[150px] min-h-[80px] overflow-y-auto scrollbar-custom"
                      rows={2}
                      style={{
                        lineHeight: "1.5",
                        height: "auto",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 150) + "px";
                      }}
                    />
                    {!prompt && (
                      <div className="absolute top-0 left-0 text-white/60 text-lg pointer-events-none">
                        <TypewriterEffect
                          words={getRandomSuggestions()}
                          typingSpeed={25}
                          deletingSpeed={10}
                          pauseDuration={4200}
                          showCursor={false}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full text-white transition-all bg-transparent hover:bg-white/20 hover:text-white text-base"
                    >
                      <FontAwesomeIcon icon={faPlus} className="!w-6 !h-6" />
                    </Button>

                    <div className="flex gap-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full text-white transition-all bg-transparent hover:bg-white/20 hover:text-white"
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
                        className="w-10 h-10 rounded-full text-white transition-all bg-transparent hover:bg-white/20 hover:text-white"
                      >
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="!w-5 !h-5"
                        />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Suggestion Buttons */}
            <div>
              <SuggestionButtons onSuggestionClick={handleSuggestionClick} />
            </div>

            {/* Heading 2 */}
            <h2 className="text-xl md:text-2xl font-semibold text-white/90">
              Conte com as soluções da MULTI BPO
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
