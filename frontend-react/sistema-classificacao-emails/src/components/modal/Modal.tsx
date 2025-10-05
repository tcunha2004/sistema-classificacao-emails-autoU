import { useState } from "react";
import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  Footer,
  Button,
  Body,
  Column,
  Category,
  SugestaoResposta,
  SuggestionText,
  Divider,
  CopyButton,
} from "./styles";
import { FaRegCopy } from "react-icons/fa";

interface Props {
  categoria: string;
  sugestao: string;
  onClose: () => void;
}

function Modal({ categoria, sugestao, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    onClose && onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sugestao);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error("failed to copy", err);
    }
  };

  return (
    <Overlay>
      <ModalContainer role="dialog" aria-modal="true">
        <Header>
          <Title>Classificação e Sugestão</Title>
        </Header>

        <Body>
          <Column>
            <div
              style={{
                padding: 20,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Category>{categoria}</Category>
            </div>
          </Column>

          <Divider />

          <Column>
            <div
              style={{
                padding: 20,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SugestaoResposta>
                <SuggestionText>{sugestao}</SuggestionText>
                <CopyButton
                  onClick={handleCopy}
                  aria-label="Copiar sugestão"
                  title="Copiar sugestão"
                >
                  {copied ? "✓" : <FaRegCopy />}
                </CopyButton>
              </SugestaoResposta>
            </div>
          </Column>
        </Body>

        <Footer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button variant="primary" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
}

export default Modal;
