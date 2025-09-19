import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="bg-white shadow-md py-2 px-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-between md:justify-start items-center gap-4 w-full">
          <div className="logo flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Championship</h1>
          </div>
          <div className="search">
            <NavBar />
          </div>
        </div>
      </div>
    </header>
  );
}
