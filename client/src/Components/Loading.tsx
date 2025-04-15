import "../styles/Loading.css";
import LoadingIcon from "../assets/loading.svg";
export default function Loading() {
  return (
    <>
      <div className="loadIcon">
        <img src={LoadingIcon} alt="" />
      </div>
    </>
  );
}
