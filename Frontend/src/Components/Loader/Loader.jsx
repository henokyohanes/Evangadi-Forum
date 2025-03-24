import React from 'react'
import { GridLoader } from "react-spinners";
import style from "./Loader.module.css"

const Loader = () => {
  return (
    <div className={style.loader}>
      <GridLoader color="#e5670a" size={20}/>
    </div>
  );
}

export default Loader;