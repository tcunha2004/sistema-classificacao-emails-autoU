import styled from "styled-components";

// Full-screen background with dark-to-light vertical gradient
export const BackgroundContainer = styled.div`
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;

  background: linear-gradient(180deg, #0a0a0a 0%, #000913ff 100%);
`;

// Centered card container
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 40px;
  padding: 40px 48px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);

  @media (max-width: 640px) {
    padding: 28px 20px;
    border-radius: 24px;
  }
`;

export default {} as const;
