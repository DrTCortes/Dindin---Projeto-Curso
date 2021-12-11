import "./styleResumoModal.css";
import btnClose from "../../assets/fechar.svg";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";

function refreshPage() {
  window.location.reload();
}

function dateDMY(dataAtual){
  return dataAtual.substr(8, 2) + "-" + dataAtual.substr(5, 2) + "-" + dataAtual.substr(0, 4);
}

function dateMDY(dataAtual){
  return dataAtual.substr(3, 2) + "-" + dataAtual.substr(0, 2) + "-" + dataAtual.substr(6, 4);
}

function dateYMD(dataAtual){
  return dataAtual.substr(6, 4) + "-" + dataAtual.substr(3, 2) + "-" + dataAtual.substr(0, 2);
}


export default function Modal({
  setModalVisible,
  entradaOuSaida,
  setEntradaOuSaida,
  transactionInEditing,
}) {
  function handleBotaoCloseModal() {
    setModalVisible(false);
    refreshPage();
  }

  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [descricao, setDescricao] = useState("");

  const tipoDaTransação = entradaOuSaida === "saida" ? "debit" : "credit";
  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  async function handleRegisterTransiction() {
    if (!valor || !categoria || !dataInput || !descricao) {
      return alert("Todos os campos são obrigatórios!");
    }

    try {
      const curretDate = dateYMD(dataInput)

      const numeroDoDiaDaSemana = new Date(dateMDY(dataInput)).getDay();
      const diaDaSemana = diasDaSemana[numeroDoDiaDaSemana];
      const valorFormatado = valor * 100;
      const categoriaCorrigida = categoria.toLowerCase();

      const body = {
        date: curretDate,
        week_day: diaDaSemana,
        description: descricao,
        value: valorFormatado,
        category: categoriaCorrigida,
        type: tipoDaTransação,
      };

      await fetch("http://localhost:3333/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      setValor("");
      setCategoria("");
      setDataInput("");
      setDescricao("");
      setModalVisible(false);
      refreshPage();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (transactionInEditing) {
      setValor(transactionInEditing.value / 100);
      setCategoria(transactionInEditing.category);
      setDataInput(dateDMY(transactionInEditing.date));
      setDescricao(transactionInEditing.description);

      transactionInEditing.type === "debit"
        ? setEntradaOuSaida("saida")
        : setEntradaOuSaida("entrada");
    }
  }, [transactionInEditing]);

  async function handleEditTransaction() {
    if (!valor || !categoria || !dataInput || !descricao) {
      return alert("Todos os campos são obrigatórios!");
    }

    try {
      const curretDate = dateYMD(dataInput);

      const numeroDoDiaDaSemana = new Date(dateMDY(dataInput)).getDay();
      const diaDaSemana = diasDaSemana[numeroDoDiaDaSemana];
      const valorFormatado = valor * 100;

      const data = {
        date: curretDate,
        week_day: diaDaSemana,
        description: descricao,
        value: valorFormatado,
        category: categoria,
        type: tipoDaTransação,
      };

      await fetch(
        `http://localhost:3333/transactions/${transactionInEditing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      setValor("");
      setCategoria("");
      setDataInput("");
      setDescricao("");
      setModalVisible(false);
      refreshPage();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="background--modal">
      <div className="modal-container">
        <div className="title">
          <h1>{transactionInEditing ? "Editar" : "Adicionar"} Registro</h1>
          <img
            onClick={() => handleBotaoCloseModal()}
            src={btnClose}
            alt="Botão Colose"
            className="close-icon"
          />
        </div>
        <div className="botoes--registro">
          <button
            id="credit-button"
            onClick={() => setEntradaOuSaida("entrada")}
            style={
              entradaOuSaida === "saida"
                ? { background: "#B9B9B9" }
                : {
                    background:
                      "linear-gradient(91.26deg, #05EDE3 0%, #3A9FF1 97.77%)",
                  }
            }
          >
            Entrada
          </button>
          <button
            id="debit-button"
            onClick={() => setEntradaOuSaida("saida")}
            style={
              entradaOuSaida === "saida"
                ? {
                    background:
                      "linear-gradient(91.66deg, #FA8C10 0%, #FF576B 90.32%)",
                  }
                : { background: "#B9B9B9" }
            }
          >
            Saida
          </button>
        </div>
        <div className="modal--inputs">
          <label>Valor</label>
          <input
            type="number"
            name="value"
            onChange={(e) => setValor(e.target.value)}
            value={valor}
          />
          <label>Categoria</label>
          <input
            type="text"
            name="category"
            onChange={(e) => setCategoria(e.target.value)}
            value={categoria}
          />
          <label>Data</label>
          <InputMask
            id="date"
            name="date"
            type="text"
            mask="99/99/9999"
            onChange={(e) => setDataInput(e.target.value)}
            value={dataInput}
          />
          <label>Descrição</label>
          <input
            type="text"
            onChange={(e) => setDescricao(e.target.value)}
            value={descricao}
          />
        </div>
        <button
          className="btn-insert"
          onClick={() =>
            transactionInEditing
              ? handleEditTransaction()
              : handleRegisterTransiction()
          }
        >
          Confrimar
        </button>
      </div>
    </div>
  );
}
