import { Upload } from "lucide-react";

export function PdfUpload({ disabled, onFile }) {
  return (
    <label className={`upload-button ${disabled ? "disabled" : ""}`}>
      <Upload size={16} />
      Enviar PDF
      <input
        type="file"
        accept="application/pdf"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
    </label>
  );
}
