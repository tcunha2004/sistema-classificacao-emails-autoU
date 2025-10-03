import styled from "styled-components";

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #2c2c2c;
`;

export const Subtitle = styled.p`
  margin: 0 0 8px 0;
  text-align: center;
  color: #6b7280;
  line-height: 1.4;
  font-size: 16px;
`;

export const AccentRed = styled.span`
  color: red;
`;

export const AccentBlue = styled.span`
  color: #2563eb;
`;

export const SectionLabel = styled.label`
  margin-top: 12px;
  color: #6b7280;
  font-weight: 600;
  font-size: 16px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  border-radius: 12px;
  border: 2px solid #cfcfcf;
  padding: 14px 16px;
  resize: vertical;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #a8a8a8;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }
`;

export const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 88px;
  border-radius: 12px;
  border: 2px dashed #cfcfcf;
  background: #ffffff;
  cursor: pointer;
  user-select: none;
`;

export const UploadIcon = styled.div`
  font-size: 20px;
  color: #111827;
`;

export const UploadInstruction = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const SubmitButton = styled.button`
  margin-top: 20px;
  align-self: flex-end;
  padding: 12px 22px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
