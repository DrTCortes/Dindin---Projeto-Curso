import "./style.css";
import indicador from "../../../assets/indicador.svg";

function refreshPage() {
  window.location.reload();
}

export default function MiniModal({ setMiniModalVisible, transictionsID }) {
  async function handleDeleteTransiction(transictionID) {
    await fetch(`http://localhost:3333/transactions/${transictionID}`, {
      method: "DELETE",
    });

    setMiniModalVisible(false);
    refreshPage();
  }

  return (
    <div className="container-confirm-delete">
      <img src={indicador} alt="Indicador" />
      <p>Apagar Item?</p>
      <div classeName="buttons">
        <span
          className="btn-actions-confirm-delete btn-sim"
          onClick={() => handleDeleteTransiction(transictionsID)}
        >
          Sim
        </span>
        <span
          className="btn-actions-confirm-delete btn-nao"
          onClick={() => setMiniModalVisible(false)}
        >
          Não
        </span>
      </div>
    </div>
  );
}
