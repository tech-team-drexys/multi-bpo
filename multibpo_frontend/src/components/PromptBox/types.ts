export interface Attachment {
  id: string;
  type: "image" | "pdf";
  file: File;
  preview: string;
  name: string;
}

export interface PromptBoxProps {
  onSubmit?: (data: { message: string; attachments: Attachment[] }) => void;
  className?: string;
}
