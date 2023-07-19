import { useEffect, useState } from "react";
import { fetchPancakeSwapPools, fetchUniswapPools } from "../utils/fetchPools";
import styles from "../styles/Home.module.css";
import { analyzeArbitrageOpportunities } from "../utils/arbitrage";
import { LinearProgress } from "@mui/material";

export default function HomePage() {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [pancakeSwapPools, setPancakeSwapPools] = useState([]);
  const [uniswapPools, setUniswapPools] = useState([]);
  const [arbitrageResults, setArbitrageResults] = useState([]);
  const [arbitrageDetails, setArbitrageDetails] = useState({});
  const [arbitrageMessage, setArbitrageMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const progressBarStyles = {
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#f1f1f1",
    width: "500px", // Largura personalizada
  };

  const progressBarColorStyles = {
    backgroundColor: "#007bff",
  };

  useEffect(() => {
    async function fetchData() {
      if (buttonClicked) {
        try {
          const pancakePools = await fetchPancakeSwapPools();
          setPancakeSwapPools(pancakePools);

          const uniswapPools = await fetchUniswapPools();
          setUniswapPools(uniswapPools);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchData();
  }, [buttonClicked]);

  const handleArbitrageButtonClick = async () => {
    setProgress(25); // Atualiza o progresso para 25%

    const pancakePools = await fetchPancakeSwapPools();
    setProgress(50); // Atualiza o progresso para 50%

    const uniswapPools = await fetchUniswapPools();
    setProgress(75); // Atualiza o progresso para 75%

    const results = await analyzeArbitrageOpportunities(); // Chama a função de análise
    setArbitrageResults(results || []); // Armazena os resultados na variável de estado ou uma lista vazia se for null
    setProgress(100); // Atualiza o progresso para 100% ao final da execução
  };

  const hasArbitrageResults = arbitrageResults?.length > 0;

  return (
    <div>
      <button className={styles.button} onClick={() => setButtonClicked(true)}>
        Scan Pools
      </button>
      <div className={styles.container}>
        <h1 className={styles.title}>PancakeSwap Pools:</h1>
        <div className={styles.scrollContainer}>
          {pancakeSwapPools.map((pool, index) => (
            <div className={styles.pool} key={`pancake-pool-${index}`}>
              <h2 className={styles.poolTitle}>PANCAKESWAP POOL</h2>
              <p className={styles.poolInfo}>Token 0 ID: {pool.token0Id}</p>
              <p className={styles.poolInfo}>
                Token 0 Symbol: {pool.token0Symbol}
              </p>
              <p className={styles.poolInfo}>Token 0 Name: {pool.token0Name}</p>
              <p className={styles.poolInfo}>
                Token 0 Price USD: {pool.token0DerivedUSD}
              </p>
              <p className={styles.poolInfo}>Token 1 ID: {pool.token1Id}</p>
              <p className={styles.poolInfo}>
                Token 1 Symbol: {pool.token1Symbol}
              </p>
              <p className={styles.poolInfo}>Token 1 Name: {pool.token1Name}</p>
              <br />
            </div>
          ))}
        </div>

        <h1 className={styles.title}>Uniswap V3 Pools:</h1>
        <div className={styles.scrollContainer}>
          {uniswapPools.map((pool, index) => (
            <div className={styles.pool} key={`uniswap-pool-${index}`}>
              <h2 className={styles.poolTitle}>UNISWAP POOL</h2>
              <p className={styles.poolInfo}>Token 0 ID: {pool.token0Id}</p>
              <p className={styles.poolInfo}>
                Token 0 Symbol: {pool.token0Symbol}
              </p>
              <p className={styles.poolInfo}>Token 0 Name: {pool.token0Name}</p>
              <p className={styles.poolInfo}>
                Token 0 Price ETH: {pool.token0DerivedETH}
              </p>
              <p className={styles.poolInfo}>Token 1 ID: {pool.token1Id}</p>
              <p className={styles.poolInfo}>
                Token 1 Symbol: {pool.token1Symbol}
              </p>
              <p className={styles.poolInfo}>Token 1 Name: {pool.token1Name}</p>
              <br />
            </div>
          ))}
        </div>

        {buttonClicked && !arbitrageMessage && !hasArbitrageResults && (
          <p>Não foram encontradas oportunidades de arbitragem.</p>
        )}

        {arbitrageMessage && (
          <div>
            <p>{arbitrageMessage}</p>
            {/* Exiba outras informações ou mensagens relevantes */}
          </div>
        )}

        {hasArbitrageResults && arbitrageResults.length > 0 ? (
          <div>
            <h2>Oportunidades de Arbitragem:</h2>
            {arbitrageResults.map((result, index) => (
              <div key={`arbitrage-result-${index}`}>
                <p>Pancake Pool: {result.pancakePool}</p>
                <p>Uniswap Pool: {result.uniswapPool}</p>
                <p>Profit: {result.profit}</p>
                <p>Gas Fee: {result.gasFee}</p>
                {/* Renderize outras informações relevantes */}
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}

        <p className={styles.totalPools}>
          Total PancakeSwap V3 pools listed: {pancakeSwapPools.length}
        </p>
        <p className={styles.totalPools}>
          Total Uniswap V3 pools listed: {uniswapPools.length}
        </p>

        <button className={styles.button} onClick={handleArbitrageButtonClick}>
          Executar Análise de Arbitragem
        </button>

        <div style={{ display: "flex", alignItems: "center" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            style={progressBarStyles}
            classes={{
              bar: progressBarColorStyles,
            }}
          />
          <span style={{ marginLeft: "10px" }}>{`${progress}%`}</span>
        </div>
      </div>
    </div>
  );
}
