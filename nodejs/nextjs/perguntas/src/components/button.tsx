import React, { MouseEventHandler } from "react";

const Button = ({
  children,
  background,
  backgroundHover,
  textColor = "text-white",
  onClick,
  roundedfull = false,
}: {
  children: React.ReactNode;
  background: string;
  backgroundHover: string;
  textColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  roundedfull?: boolean;
}) => (
  <button
    className={`${
      roundedfull ? "p-4 rounded-full" : "px-4 py-1.5 rounded"
    } ${background} ${textColor} font-medium text-lg hover:${backgroundHover}`}
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
);

const ButtonPrimary = ({
  children,
  onClick,
  roundedfull = false,
}: {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  roundedfull?: boolean;
}) => (
  <Button
    background="bg-neutral-800"
    backgroundHover="bg-neutral-700"
    onClick={onClick}
    roundedfull={roundedfull}
  >
    {children}
  </Button>
);

const ButtonTransparent = ({
  children,
  onClick,
  roundedfull = false,
}: {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  roundedfull?: boolean;
}) => (
  <Button
    background="bg-transparent"
    backgroundHover="bg-transparent"
    textColor="text-black hover:text-neutral-700"
    onClick={onClick}
    roundedfull={roundedfull}
  >
    {children}
  </Button>
);

export { ButtonPrimary, ButtonTransparent };
