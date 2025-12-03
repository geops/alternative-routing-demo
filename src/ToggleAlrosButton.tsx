import { Button, ButtonProps } from "./ui/button";

function ToggleAlrosButton({
  isToggle,
  ...props
}: {
  isToggle?: boolean;
} & Omit<ButtonProps, "children">) {
  return (
    <>
      {/* @ts-expect-error - no idea*/}
      <Button className="!h-4" plain {...props}>
        {!isToggle ? (
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Button>
    </>
  );
}

export default ToggleAlrosButton;
