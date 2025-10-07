import { Spinner } from "./Spinner";

export const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <p className="text-2xl sm:text-4xl p-8 flex justify-center items-center mb-2 font-semibold">Loading Your Content🙏🏽...</p>
      <Spinner className=""/>
    </div>
  );
};
