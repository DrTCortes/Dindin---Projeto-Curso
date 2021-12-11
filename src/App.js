import "./App.css";
import btnFiltrar from "./assets/filtro.svg";
import logoDindin from "./assets/logo.svg";
import Filtros from "./componentes/Filtros/filtros";
import Tabela from "./componentes/Tabela/tabela";
import Resumo from "./componentes/Resumo/resumo";
import Modal from "./componentes/Resumo/modal";
import { useEffect, useState } from "react";

function refreshPage() {
  window.location.reload();
}

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [filtrar, setFiltrar] = useState(false);
  const [transictionsData, setTransictonsData] = useState([]);
  const [entradaOuSaida, setEntradaOuSaida] = useState("saida");
  const [transactionInEditing, setTransactionInEditing] = useState(false);

  useEffect(() => {
    async function LoadTransactions() {
      try {
        const response = await fetch("http://localhost:3333/transactions", {
          method: "GET",
        });

        const data = await response.json();

        setTransictonsData(data);
      } catch (error) {
        console.log(error);
      }
    }

    LoadTransactions();
  }, []);

  return (
    <div className="App">
      <header className="container-header">
        <img src={logoDindin} alt="logo" />
      <span>Dindin</span>
    </header>
      <div className="main">
        <button
          className="open-filters-button"
          onClick={() => (!filtrar ? setFiltrar(true) : refreshPage())}
        >
          <img src={btnFiltrar} alt="Filtro" />
          Filtrar
        </button>
        <div className="main--body">
          <div className="main--body--left">
            {filtrar ? (
              <Filtros
                transactionsData={transictionsData}
                setTransactionsData={setTransictonsData}
              />
            ) : null}
            <Tabela
              transictionsData={transictionsData}
              setTransictonsData={setTransictonsData}
              setModalVisible={setModalVisible}
              setTransactionInEditing={setTransactionInEditing}
            />
          </div>
          <div className="main--body--right">
            <Resumo
              setModalVisible={setModalVisible}
              transictionsData={transictionsData}
            />
          </div>
        </div>
      </div>
      {modalVisible ? (
        <Modal
          setModalVisible={setModalVisible}
          entradaOuSaida={entradaOuSaida}
          setEntradaOuSaida={setEntradaOuSaida}
          transactionInEditing={transactionInEditing}
        />
      ) : null}
    </div>
  );
}

export default App;
