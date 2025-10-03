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
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

interface FormProps {
  texto?: string;
  arquivo?: FileList;
}

export default function EmailFormFrame() {
  const { handleSubmit, register, watch } = useForm();

  const textoWatcher = watch("texto");
  const arquivoWatcher = watch("arquivo");
  const isTextoFilled = textoWatcher && textoWatcher.trim().length > 0;
  const isArquivoUploaded =
    arquivoWatcher && arquivoWatcher.length && arquivoWatcher[0];

  async function handleFormSubmit(data: FormProps) {
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
        return;
      }

      await api
        .post("/classificar-texto", {
          text: textContent,
        })
        .then((resp) => {
          console.log(resp.data);
        });
    } else if (data.texto) {
      await api
        .post("/classificar-texto", {
          text: data.texto,
        })
        .then((resp) => {
          console.log(resp.data);
        });
    }
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

        <SubmitButton
          type="submit"
          disabled={!isTextoFilled && !isArquivoUploaded}
        >
          Enviar
        </SubmitButton>
      </Form>
    </Frame>
  );
}
