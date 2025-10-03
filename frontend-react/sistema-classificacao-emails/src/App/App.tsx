import { BiLogoGmail } from "react-icons/bi";
import EmailFormFrame from "../components/EmailFormFrame";
import { GlobalStyle } from "../styles/themes/global";
import { BackgroundContainer, ContentContainer } from "./styles";

function App() {
  return (
    <BackgroundContainer>
      <ContentContainer>
        <BiLogoGmail size={30} color="red" />
        <EmailFormFrame />
      </ContentContainer>
      <GlobalStyle />
    </BackgroundContainer>
  );
}

export default App;
