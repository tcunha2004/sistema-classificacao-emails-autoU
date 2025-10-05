import styled from "styled-components";

const colors = {
	primary: "#2563eb",
	primaryDark: "#1d4ed8",
	text: "#111827",
	muted: "#6b7280",
	bg: "#ffffff",
	overlay: "rgba(2,6,23,0.6)",
};

export const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: ${colors.overlay};
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	z-index: 1000;
`;

export const ModalContainer = styled.div`
	width: min(1000px, 96%);
	max-height: 90vh;
	background: ${colors.bg};
	border-radius: 12px;
	box-shadow: 0 10px 30px rgba(2,6,23,0.5);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(16,24,40,0.06);
`;

export const Header = styled.div`
  position: relative;
  padding: 28px 20px 8px;
  border-bottom: 1px solid #f3f4f6;
  background: transparent;
`;

export const Title = styled.h3`
	margin: 0;
	font-size: 2.25rem;
	color: ${colors.muted};
	font-weight: 700;
	text-align: center;
	letter-spacing: 0.4px;
`;

export const CloseButton = styled.button`
	position: absolute;
	right: 16px;
	top: 16px;
	background: ${colors.primary};
	color: #fff;
	border: none;
	padding: 10px 16px;
	border-radius: 28px;
	font-weight: 700;
	cursor: pointer;
	box-shadow: 0 6px 18px rgba(37,99,235,0.12);
	transition: transform 0.12s ease;

	&:hover {
		transform: translateY(-2px);
	}
`;

export const Body = styled.div`
	display: grid;
	grid-template-columns: 1fr 1px 1fr;
	gap: 18px;
	padding: 28px 32px;
	overflow: auto;
	align-items: center;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

export const Divider = styled.div`
	width: 1px;
	background: #d1d5db;
	height: 60%;
	margin: 0 auto;
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	justify-content: center;
	align-items: center;
`;

export const Classificao = styled.div`
	background: transparent;
	border: none;
	border-radius: 8px;
	padding: 0;
	color: ${colors.text};
	min-height: 40px;
`;

export const SugestaoResposta = styled.div`
	background: #fff;
	border: 2px solid #d8d8d8;
	border-radius: 16px;
	padding: 2.5rem;
	color: ${colors.text};
	min-height: 120px;
	position: relative;
`;

export const Footer = styled.div`
	display: flex;
	gap: 10px;
	padding: 24px 28px;
	border-top: none;
	justify-content: flex-end;
	background: transparent;
`;

export const Button = styled.button<{ variant?: "primary" | "ghost" }>`
	padding: 12px 22px;
	border-radius: 28px;
	border: none;
	cursor: pointer;
	font-weight: 600;
	font-size: 0.95rem;
	display: inline-flex;
	align-items: center;
	gap: 8px;

	${({ variant }) =>
		variant === "primary"
			? `background: ${colors.primary}; color: #fff; box-shadow: 0 4px 10px rgba(37,99,235,0.12);` 
			: `background: transparent; color: ${colors.muted}; border: 1px solid #e6eefb;`}

	&:hover {
		transform: translateY(-1px);
		filter: brightness(0.98);
	}
`;

// Small helper for placeholder list items inside classificacao
export const Item = styled.div`
	padding: 10px 12px;
	border-radius: 6px;
	background: #fff;
	border: 1px solid #f1f5f9;
	color: ${colors.text};
	font-size: 0.95rem;
`;

export const Category = styled.span`
	display: inline-block;
	padding: 12px 22px;
	border-radius: 999px;
	background: #cfe1f5;
	color: ${colors.primaryDark};
	font-weight: 700;
	font-size: 1rem;
`;

export const SuggestionText = styled.div`
	color: ${colors.text};
	font-size: 0.98rem;
	line-height: 1.45;
	white-space: pre-wrap;
`;

export const CopyButton = styled.button`
	position: absolute;
	right: 12px;
	bottom: 12px;
	width: 34px;
	height: 34px;
	border-radius: 8px;
	border: 1px solid #e6e6e6;
	background: transparent;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`;

