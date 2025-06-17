import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faImage,
  faFilePdf,
  faXmark,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Attachment, PromptBoxProps } from "./types";
import { cn } from "@/lib/utils";

const PromptBox = ({ onSubmit, className }: PromptBoxProps) => {
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const promptBoxRef = useRef<HTMLDivElement>(null);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        event.target instanceof Element &&
        !event.target.closest("button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Capturar eventos de colagem (Ctrl+V)
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (!promptBoxRef.current?.contains(event.target as Node)) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await addAttachment(file, "image");
          }
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleAttachmentClick = (type: "image" | "pdf") => {
    const inputRef = type === "image" ? fileInputRef : pdfInputRef;
    if (inputRef.current) {
      inputRef.current.click();
    }
    setIsMenuOpen(false);
  };

  const addAttachment = (file: File, type: "image" | "pdf"): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            type,
            file,
            preview,
            name: file.name,
          },
        ]);
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "pdf"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await addAttachment(file, type);
    e.target.value = ""; // Reset input
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const handleSubmit = () => {
    if (!message.trim() && attachments.length === 0) return;

    // Chamar callback de envio se existir
    onSubmit?.({ message, attachments });

    // Limpar formulário
    setMessage("");
    setAttachments([]);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={promptBoxRef}
        className="backdrop-blur-md border border-white/20 p-6 shadow-2xl px-[24px] rounded-3xl transition-all duration-300 group bg-black/40 hover:bg-black/60 py-[20px]"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Área de anexos */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="relative group">
                  {attachment.type === "image" ? (
                    <div className="relative w-20 h-20">
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-2">
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="w-8 h-8 text-white/70"
                      />
                      <span className="text-xs truncate w-full text-center mt-1 text-white/70">
                        {attachment.name}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    title="Remover anexo"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Área de texto */}
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/70 text-lg resize-none max-h-[100px] min-h-[50px] overflow-y-auto scrollbar-custom"
              rows={2}
              style={{
                lineHeight: "1.5",
                height: "auto",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 100) + "px";
              }}
            />
          </div>

          {/* Barra de ações */}
          <div className="flex justify-between items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full text-white transition-all bg-transparent hover:bg-white/20 hover:text-white text-base p-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute bottom-full left-0 mb-2 backdrop-blur-md bg-black/90 rounded-xl shadow-lg border border-white/20 overflow-hidden min-w-[200px] transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => handleAttachmentClick("image")}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
                    <span>Adicionar fotos e arquivos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttachmentClick("pdf")}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4" />
                    <span>Anexar PDF</span>
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
            />

            <input
              type="file"
              ref={pdfInputRef}
              className="hidden"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "pdf")}
            />

            <button
              type="submit"
              disabled={!message.trim() && attachments.length === 0}
              className="w-10 h-10 rounded-full text-white transition-all bg-transparent hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent p-2"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { PromptBox };
