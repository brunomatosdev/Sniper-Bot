import fetch from "isomorphic-unfetch";

// Subgraph endpoint da PancakeSwap
const pancakeSwapSubgraphEndpoint =
  "https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc";

// Subgraph endpoint do Uniswap V3
const uniswapV3SubgraphEndpoint =
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

// Função para buscar todas as pools disponíveis na PancakeSwap
async function fetchPancakeSwapPools() {
  const query = `
    {
      pools(
        first: 50
        where: {
          token0_: {derivedUSD_gt: "0"}
          token1_: {derivedUSD_gt: "0"}
        },
        orderDirection: desc
      ) {
        token0 {
          id
          name
          symbol
          derivedUSD
        }
        token1 {
          id
          name
          symbol
          derivedUSD
        }
      }
    }
  `;

  const response = await fetch(pancakeSwapSubgraphEndpoint, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: { "Content-Type": "application/json" },
  });

  const { data } = await response.json();

  if (data.pools.length === 0) {
    throw new Error("No PancakeSwap pools found");
  }

  const pools = data.pools.map((pool) => ({
    token0Id: pool.token0.id,
    token0Symbol: pool.token0.symbol,
    token0Name: pool.token0.name,
    token0DerivedUSD: Number(pool.token0.derivedUSD),
    token1Symbol: pool.token1.symbol,
    token1Name: pool.token1.name,
    token1DerivedUSD: Number(pool.token1.derivedUSD),
  }));

  return pools;
}

// Função para buscar todas as pools disponíveis no Uniswap V3
async function fetchUniswapPools() {
  const query = `
    {
      pools(
        first: 50
        where: {
           token0_: {derivedETH_gt: "0"}
           token1_: {derivedETH_gt: "0"}
        },
        orderDirection: desc
      ) {
        token0 {
          id
          name
          symbol
          derivedETH
        }
        token1 {
          id
          name
          symbol
          derivedETH
        }
      }
    }
  `;

  const response = await fetch(uniswapV3SubgraphEndpoint, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: { "Content-Type": "application/json" },
  });

  const { data } = await response.json();

  if (data.pools.length === 0) {
    throw new Error("No Uniswap V3 pools found");
  }

  const pools = data.pools.map((pool) => ({
    token0Id: pool.token0.id,
    token0Symbol: pool.token0.symbol,
    token0Name: pool.token0.name,
    token0DerivedETH: Number(pool.token0.derivedETH),
    token1Id: pool.token1.id,
    token1Symbol: pool.token1.symbol,
    token1Name: pool.token1.name,
    token1DerivedETH: Number(pool.token1.derivedETH),
  }));

  return pools;
}

export { fetchPancakeSwapPools, fetchUniswapPools };
