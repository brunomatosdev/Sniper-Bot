import { fetchPancakeSwapPools, fetchUniswapPools } from "../utils/fetchPools";

export default async function handler(req, res) {
  try {
    const pancakePools = await fetchPancakeSwapPools();
    const uniswapPools = await fetchUniswapPools();

    res.status(200).json({
      pancakeSwapPools: pancakePools,
      uniswapPools: uniswapPools,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
