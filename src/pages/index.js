import { useEffect, useState } from "react";
import { fetchPancakeSwapPools, fetchUniswapPools } from "../utils/fetchPools";
import styles from "../styles/Home.module.css";

export default function HomePage() {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [pancakeSwapPools, setPancakeSwapPools] = useState([]);
  const [uniswapPools, setUniswapPools] = useState([]);

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

  return (
    <div>
      <button className={styles.button} onClick={() => setButtonClicked(true)}>
        Buscar Pools
      </button>
      <h1 className={styles.title}>PancakeSwap Pools:</h1>
      {pancakeSwapPools.map((pool, index) => (
        <div className={styles.pool} key={`pancake-pool-${index}`}>
          <h2 className={styles.poolTitle}>PANCAKESWAP POOL</h2>
          <p className={styles.poolInfo}>Token 0 ID: {pool.token0Id}</p>
          <p className={styles.poolInfo}>Token 0 Symbol: {pool.token0Symbol}</p>
          <p className={styles.poolInfo}>Token 0 Name: {pool.token0Name}</p>
          <p className={styles.poolInfo}>
            Token 0 Price USD: {pool.token0DerivedUSD}
          </p>
          <p className={styles.poolInfo}>Token 1 ID: {pool.token1Id}</p>
          <p className={styles.poolInfo}>Token 1 Symbol: {pool.token1Symbol}</p>
          <p className={styles.poolInfo}>Token 1 Name: {pool.token1Name}</p>
          <p className={styles.poolInfo}>
            Token 1 Price USD: {pool.token1DerivedUSD}
          </p>
          <br />
        </div>
      ))}

      <h1 className={styles.title}>Uniswap V3 Pools:</h1>
      {uniswapPools.map((pool, index) => (
        <div className={styles.pool} key={`uniswap-pool-${index}`}>
          <h2 className={styles.poolTitle}>UNISWAP POOL</h2>
          <p className={styles.poolInfo}>Token 0 ID: {pool.token0Id}</p>
          <p className={styles.poolInfo}>Token 0 Symbol: {pool.token0Symbol}</p>
          <p className={styles.poolInfo}>Token 0 Name: {pool.token0Name}</p>
          <p className={styles.poolInfo}>
            Token 0 Price ETH: {pool.token0DerivedETH}
          </p>
          <p className={styles.poolInfo}>Token 1 ID: {pool.token1Id}</p>
          <p className={styles.poolInfo}>Token 1 Symbol: {pool.token1Symbol}</p>
          <p className={styles.poolInfo}>Token 1 Name: {pool.token1Name}</p>
          <p className={styles.poolInfo}>
            Token 1 Price ETH: {pool.token1DerivedETH}
          </p>
          <br />
        </div>
      ))}

      <p className={styles.totalPools}>
        Total PancakeSwap V3 pools listed: {pancakeSwapPools.length}
      </p>
      <p className={styles.totalPools}>
        Total Uniswap V3 pools listed: {uniswapPools.length}
      </p>
    </div>
  );
}
