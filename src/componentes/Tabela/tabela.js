import "./style.css";
import lixo from "../../assets/lixo.svg";
import editar from "../../assets/editar.svg";
import setaParaBaixo from "../../assets/setaPraBaixo.svg";
import setaParaCima from "../../assets/setaPraCima.svg";
import { useEffect, useState } from "react";
import MiniModal from "./ConfirmModal/confirmModal";

export default function Tabela({
  transictionsData,
  setTransictonsData,
  setModalVisible,
  setTransactionInEditing,
}) {
  const [miniModalVisible, setMiniModalVisible] = useState(false);
  const [crescente, setCrescente] = useState(true);
  const [idCrescente, setIdCrescente] = useState("date");

  function handleEditarTransacao(tr) {
    setTransactionInEditing(tr);
    setModalVisible(true);
  }

  function dateDMY(dataAtual){
    return dataAtual.substr(8, 2) + "-" + dataAtual.substr(5, 2) + "-" + dataAtual.substr(0, 4);
  }

  useEffect(() => {
    if (idCrescente === "date") {
      ordenarData();
      return;
    }

    if (idCrescente === "week-day") {
      ordenarDiaDaSemana();
      return;
    }

    if (idCrescente === "value") {
      ordenarValor();
      return;
    }
  }, [crescente]);

  function ordenarData() {
    setTransictonsData((estado) => {
      const arrayDoEstado = [...estado];
      const arrayDoEstadoOrdenado = arrayDoEstado.sort((a, b) => {
        if (crescente) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });

      return arrayDoEstadoOrdenado;
    });
  }

  function ordenarDiaDaSemana() {
    setTransictonsData((estado) => {
      const arrayDoEstado = [...estado];
      const arrayDoEstadoOrdenado = arrayDoEstado.sort((a, b) => {
        if (crescente) {
          return new Date(a.date).getDay() - new Date(b.date).getDay();
        } else {
          return new Date(b.date).getDay() - new Date(a.date).getDay();
        }
      });

      return arrayDoEstadoOrdenado;
    });
  }

  function ordenarValor() {
    setTransictonsData((estado) => {
      const arrayDoEstado = [...estado];
      const arrayDoEstadoOrdenado = arrayDoEstado.sort((a, b) => {
        let valorA = Number(a.value);
        let valorB = Number(b.value);
        if (a.type === "debit") {
          valorA = valorA * -1;
        }
        if (b.type === "debit") {
          valorB = valorB * -1;
        }

        if (crescente) {
          return valorA - valorB;
        } else {
          return valorB - valorA;
        }
      });

      return arrayDoEstadoOrdenado;
    });
  }

  return (
    <div className="table">
      <ul className="table-head">
        <li
          className="column-title"
          id="date"
          onClick={() => {
            setIdCrescente("date");
            setCrescente(!crescente);
          }}
        >
          Data{" "}
          {idCrescente === "date" && (
            <img src={crescente ? setaParaBaixo : setaParaCima} alt="seta" />
          )}
        </li>
        <li
          className="column-title"
          id="week-day"
          onClick={() => {
            setIdCrescente("week-day");
            setCrescente(!crescente);
          }}
        >
          Dia da Semana{" "}
          {idCrescente === "week-day" && (
            <img src={crescente ? setaParaBaixo : setaParaCima} alt="seta" />
          )}
        </li>
        <li>Descrição</li>
        <li>Categoria</li>
        <li
          className="column-title"
          id="value"
          onClick={() => {
            setIdCrescente("value");
            setCrescente(!crescente);
          }}
        >
          Valor{" "}
          {idCrescente === "value" && (
            <img src={crescente ? setaParaBaixo : setaParaCima} alt="seta" />
          )}
        </li>
        <li></li>
      </ul>
      <div className="table-body">
        {transictionsData.map((transictions) => {
          return (
            <ul key={transictions.id} className="table-line">
              <li className="column-title" id="date">
                {dateDMY(transictions.date)}
              </li>
              <li id="week-day">{transictions.week_day}</li>
              <li>{transictions.description}</li>
              <li>{transictions.category}</li>
              <li
                id="value"
                style={
                  transictions.type === "credit"
                    ? { color: "#7B61FF" }
                    : { color: "#FA8C10" }
                }
              >
                {transictions.type === "debit"
                  ? `-${(transictions.value / 100).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}`
                  : (transictions.value / 100).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </li>
              <li className="icons">
                <img
                  className="edit-icon"
                  src={editar}
                  alt="Editar"
                  onClick={() => handleEditarTransacao(transictions)}
                />
                <img
                  className="delet-icon"
                  src={lixo}
                  onClick={() => setMiniModalVisible(transictions.id)}
                  alt="lixeira"
                />
              </li>

              {miniModalVisible === transictions.id && (
                <MiniModal
                  setMiniModalVisible={setMiniModalVisible}
                  transictionsID={transictions.id}
                />
              )}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
