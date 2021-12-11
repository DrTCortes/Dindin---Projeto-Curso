import "./style.css";
import { useRef, useEffect, useState } from "react";

export default function Resumo({ setModalVisible, transictionsData }) {
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const entradaRef = useRef([]);
  const saidaRef = useRef([]);

  useEffect(() => {
    async function trazerDados() {
      let somaDasEntradas = 0;
      let somaDasSaidas = 0;
      transictionsData.map((transaction) => {
        if (transaction.type === "credit") {
          entradaRef.current = transaction.value;
          somaDasEntradas = somaDasEntradas + entradaRef.current;
        } else {
          saidaRef.current = transaction.value;
          somaDasSaidas = somaDasSaidas + saidaRef.current;
        }
      });
      setEntradas(somaDasEntradas);
      setSaidas(somaDasSaidas);
      setSaldo(somaDasEntradas - somaDasSaidas);
    }
    trazerDados();
  }, [transictionsData]);

  return (
    <div className="resume">
      <div className="container-resume">
        <h2>Resumo</h2>
        <div className="resume--entrada">
          <span>Entrada</span>
          <span className="in">
            {(entradas / 100).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
        <div className="resume--saida">
          <span>Saída</span>
          <span className="out">
            {(saidas / 100).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
        <div className="resume--saldo">
          <span>Saldo</span>
          <span className="balance">
            {(saldo / 100).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>
      <button onClick={() => setModalVisible(true)} className="btn-add">
        Adicionar Registro
      </button>
    </div>
  );
}
