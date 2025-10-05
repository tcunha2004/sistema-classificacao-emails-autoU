import {
  Frame,
  Title,
  Subtitle,
  AccentRed,
  AccentBlue,
  SectionLabel,
  TextArea,
  UploadArea,
  UploadIcon,
  UploadInstruction,
  Form,
  SubmitButton,
} from "./styles.ts";
import { GoUpload } from "react-icons/go";
import { useForm } from "react-hook-form";
import { api } from "../../lib/axios.ts";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useState } from "react";
import Modal from "../modal/Modal.tsx";
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

interface FormProps {
  texto?: string;
  arquivo?: FileList;
}

export default function EmailFormFrame() {
  const { handleSubmit, register, watch, reset } = useForm();

  const textoWatcher = watch("texto");
  const arquivoWatcher = watch("arquivo");
  const isTextoFilled = textoWatcher && textoWatcher.trim().length > 0;
  const isArquivoUploaded =
    arquivoWatcher && arquivoWatcher.length && arquivoWatcher[0];

  const [showModal, setShowModal] = useState<{
    classificacao: string;
    sugestao: string;
  }>({
    classificacao: "",
    sugestao: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleFormSubmit(data: FormProps) {
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    if (data.arquivo?.length) {
      const file = data.arquivo[0];
      let textContent = "";

      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const pageTexts: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const itemsText = content.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .filter(Boolean)
            .join(" ");
          pageTexts.push(itemsText);
        }
        textContent = pageTexts.join("\n\n").trim();
      } else {
        textContent = await file.text();
      }

      if (!textContent) {
        console.warn("Não foi possível extrair texto do arquivo enviado.");
        setErrorMsg("Não foi possível extrair texto do arquivo enviado.");
      } else {
        try {
          const resp = await api.post("/classificar-texto", {
            text: textContent,
          });
          setShowModal({
            classificacao: resp.data.classificacao,
            sugestao: resp.data.resposta,
          });
          reset();
        } catch (err: any) {
          const apiError =
            err?.response?.data?.error ||
            err?.message ||
            "Falha ao classificar texto";
          setErrorMsg(apiError);
        }
      }
    } else if (data.texto) {
      try {
        const resp = await api.post("/classificar-texto", { text: data.texto });
        setShowModal({
          classificacao: resp.data.classificacao,
          sugestao: resp.data.resposta,
        });
        reset();
      } catch (err: any) {
        const apiError =
          err?.response?.data?.error ||
          err?.message ||
          "Falha ao classificar texto";
        setErrorMsg(apiError);
      }
    }
    setSubmitting(false);
  }

  return (
    <Frame>
      <Title>
        Envie seu <AccentRed>e-mail</AccentRed>
      </Title>
      <Subtitle>
        Classifique seu <AccentRed>e-mail</AccentRed> e receba sugestões
        <br /> de resposta <AccentBlue>agora mesmo!</AccentBlue>
      </Subtitle>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <SectionLabel>Mensagem</SectionLabel>
        <TextArea
          placeholder="Digite Algo..."
          rows={6}
          {...register("texto")}
          disabled={!!isArquivoUploaded}
        />

        <SectionLabel>Anexar Documento</SectionLabel>
        <UploadArea as="label" role="button">
          <UploadIcon>
            <GoUpload />
          </UploadIcon>
          <UploadInstruction>Arraste seu arquivo ou clique</UploadInstruction>
          {/* Input de arquivo escondido */}
          <input
            type="file"
            accept=".txt,.pdf,application/pdf"
            style={{ display: "none" }}
            {...register("arquivo")}
            disabled={!!isTextoFilled}
          />
        </UploadArea>

        {!!isArquivoUploaded && (
          <div
            aria-live="polite"
            style={{ marginTop: 8, fontSize: "0.875rem", color: "#6b7280" }}
          >
            Arquivo selecionado: <strong>{arquivoWatcher?.[0]?.name}</strong>
            {typeof arquivoWatcher?.[0]?.size === "number" && (
              <span>
                {" "}
                (
                {Math.max(
                  1,
                  Math.round((arquivoWatcher![0]!.size || 0) / 1024)
                )}
                KB)
              </span>
            )}
          </div>
        )}

        {errorMsg && (
          <div role="alert" style={{ color: "#b91c1c", fontSize: 14 }}>
            {errorMsg}
          </div>
        )}
        <SubmitButton
          type="submit"
          disabled={(!isTextoFilled && !isArquivoUploaded) || submitting}
        >
          {submitting ? "Enviando..." : "Enviar"}
        </SubmitButton>
      </Form>
      {(showModal.classificacao || showModal.sugestao) && (
        <Modal
          categoria={showModal.classificacao}
          sugestao={showModal.sugestao}
          onClose={() =>
            setShowModal({
              classificacao: "",
              sugestao: "",
            })
          }
        />
      )}
    </Frame>
  );
}
