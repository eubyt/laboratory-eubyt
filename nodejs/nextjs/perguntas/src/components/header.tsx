import { ButtonPrimary, ButtonTransparent } from "./button";
import { signIn, signOut } from "../firebase";
import { AuthContext } from "../context/auth";
import React from "react";

const HeaderComponent = ({ setSearch }: { setSearch: (e: any) => void }) => {
  const auth = React.useContext(AuthContext);
  return (
    <>
      <header className="flex m-3">
        <div className="max-w-4xl w-full mx-auto flex justify-between">
          <div id="log" className="self-center">
            <div className="text-2xl font-light">Pergunta</div>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="px-6 py-3 rounded text-xl font-medium bg-slate-50"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="self-center">
            {auth.checkAuth === false && (
              <ButtonPrimary
                onClick={(e) => {
                  e.preventDefault();
                  signIn().then(() => auth.connected());
                }}
              >
                Entrar (GitHub)
              </ButtonPrimary>
            )}
            {auth.checkAuth && (
              <ButtonTransparent onClick={() => signOut()}>
                {auth.displayName} (Sair)
              </ButtonTransparent>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderComponent;
