import { InfinitySpin } from "react-loader-spinner";

function Loading() {
  return (
    <span>
      <InfinitySpin color="#4fa94d" visible={true} width="50" />
    </span>
  );
}
export default Loading;
