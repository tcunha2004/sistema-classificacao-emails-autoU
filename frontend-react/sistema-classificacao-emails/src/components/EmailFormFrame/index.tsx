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
export default function EmailFormFrame() {
  return (
    <Frame>
      <Title>
        Envie seu <AccentRed>e-mail</AccentRed>
      </Title>
      <Subtitle>
        Classifique seu <AccentRed>e-mail</AccentRed> e receba sugestões
        <br /> de resposta <AccentBlue>agora mesmo!</AccentBlue>
      </Subtitle>

      <Form>
        <SectionLabel>Mensagem</SectionLabel>
        <TextArea placeholder="Digite Algo..." rows={6} />

        <SectionLabel>Anexar Documento</SectionLabel>
        <UploadArea>
          <UploadIcon>
            <GoUpload />
          </UploadIcon>
          <UploadInstruction>Arraste seu arquivo ou clique</UploadInstruction>
        </UploadArea>

        <SubmitButton type="submit">Enviar</SubmitButton>
      </Form>
    </Frame>
  );
}
