import { fetchPancakeSwapPools, fetchUniswapPools } from "../utils/fetchPools";

// Função que busca a taxa de câmbio ETH/USD em uma API (exemplo)
async function fetchEthToUsdExchangeRate() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();
    return data.ethereum.usd; // Corrigido: usar "usd" ao invés de "eth_to_usd"
  } catch (error) {
    console.error("Erro ao buscar a taxa de câmbio ETH/USD:", error);
    throw error;
  }
}

// Função principal para analisar oportunidades de arbitragem
export async function analyzeArbitrageOpportunities() {
  try {
    const ethToUsdExchangeRate = await fetchEthToUsdExchangeRate();
    const pancakeSwapPools = await fetchPancakeSwapPools();
    const uniswapPools = await fetchUniswapPools();

    // Percorra as pools de PancakeSwap e Uniswap para comparar os preços dos tokens
    for (const pancakePool of pancakeSwapPools) {
      for (const uniswapPool of uniswapPools) {
        // Converta o valor em ETH para USD usando a taxa de câmbio atual
        const uniswapToken0USD =
          uniswapPool.token0DerivedETH * ethToUsdExchangeRate;

        // Compare os preços dos tokens entre as exchanges
        if (pancakePool.token0DerivedUSD > uniswapToken0USD) {
          // Calcula o possível lucro com a arbitragem
          const spread = pancakePool.token0DerivedUSD - uniswapToken0USD;
          const gasFee = calculateGasFee(); // Calcula os gas fees estimados
          const profit = spread - gasFee;

          // Verifica se a oportunidade de arbitragem é viável
          if (profit > 0) {
            // Exibe os detalhes da oportunidade de arbitragem no frontend
            displayArbitrageOpportunity(
              pancakePool,
              uniswapPool,
              profit,
              gasFee
            );
            return; // Retorna após encontrar a primeira oportunidade viável
          }
        }
      }
    }

    // Se nenhuma oportunidade de arbitragem for encontrada, exibe uma mensagem
    displayNoArbitrageOpportunity();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Função para calcular os gas fees estimados
function calculateGasFee() {
  const gasPrice = 2; // Preço médio do gas em Gwei
  const gasLimit = 200000; // Limite de gas para a transação
  const gasFee = gasPrice * gasLimit;

  return gasFee;
}

// Função para exibir os detalhes da oportunidade de arbitragem no frontend
function displayArbitrageOpportunity(pancakePool, uniswapPool, profit, gasFee) {
  // Exemplo: Atualize o estado para exibir as informações relevantes no frontend
  setArbitrageDetails({
    pancakePool,
    uniswapPool,
    profit,
    gasFee,
  });

  // Ou exiba um modal com as informações relevantes
  openArbitrageModal();
}

// Função para exibir uma mensagem de nenhuma oportunidade de arbitragem no frontend
function displayNoArbitrageOpportunity() {
  // Exemplo: Atualize o estado para exibir a mensagem no frontend
  setArbitrageMessage("Nenhuma oportunidade de arbitragem encontrada");

  // Ou exiba um modal com a mensagem apropriada
  openNoArbitrageModal();
}
