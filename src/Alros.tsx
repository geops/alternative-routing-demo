import Alro from "./Alro";
import useAlroContext from "./hooks/useAlroContext";
import { AnnotatedAlternativeRoutes } from "./types";

function Alros() {
  const { alros, selectedAlro } = useAlroContext();

  return (
    <div className="flex flex-col gap-4">
      {alros?.map((alro: AnnotatedAlternativeRoutes) => {
        return (
          <Alro
            alro={alro}
            className={
              "rounded border p-4 text-left " +
              " hover:border-blue-500 hover:border-2 cursor-pointer " +
              (alro === selectedAlro ? " bg-gray-200" : " bg-white")
            }
            key={JSON.stringify(alro)}
          ></Alro>
        );
      })}
    </div>
  );
}

export default Alros;
