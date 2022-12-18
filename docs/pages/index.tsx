import NavigationBar from "./navigationbar";

export default function Home() {
  return (
    <div className="flex flex-auto flex-row">
      <NavigationBar />
      <div className="flex flex-auto flex-col justify-center">

        <h1 className="text-3xl text-zinc-400">Patchy API</h1>

        <p className="text-white text-xl"> Minecraft Bedrock Scripting Wrapper with object<br />based builder which make the development experience easier!</p>
      </div>
    </div>
  );
};
