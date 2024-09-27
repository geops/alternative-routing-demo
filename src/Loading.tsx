import { RotatingLines } from "react-loader-spinner";

function Loading() {
  return (
    <span className="flex w-full justify-center p-4">
      <RotatingLines
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        strokeColor="black"
        strokeWidth="5"
        visible={true}
        width="50"
      />
    </span>
  );
}
export default Loading;
