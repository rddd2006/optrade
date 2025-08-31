// components/MarketCard.tsx

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem'; // Use viem's utility
import opinionTradeABI from '../../../contracts/out/OpinionTrade.sol/OpinionTrade.json';

// Make sure this is your deployed contract address
const CONTRACT_ADDRESS = "0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519"; 

type MarketProps = {
    id: number;
    question: string;
    yes_pool: string;
    no_pool: string;
};

export const MarketCard = ({ market }: { market: MarketProps }) => {
  const [betAmount, setBetAmount] = useState('');
  const [betChoice, setBetChoice] = useState<boolean | null>(null);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleBet = (isYes: boolean) => {
    writeContract({
        address: `0x${CONTRACT_ADDRESS.substring(2)}`,
        abi: opinionTradeABI.abi,
        functionName: 'placeBet',
        args: [market.id, isYes],
        value: parseEther(betAmount || '0'),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-500/50 flex flex-col gap-4"
      whileHover={{ scale: 1.02, y: -5 }}
      layout
    >
      <h3 className="text-xl text-white font-bold">{market.question}</h3>
      
      <div className="flex justify-between items-center text-center">
        <div><p className="text-green-400 text-2xl font-mono">{parseFloat(market.yes_pool).toFixed(3)} ETH</p></div>
        <div><p className="text-red-400 text-2xl font-mono">{parseFloat(market.no_pool).toFixed(3)} ETH</p></div>
      </div>
      
      <input 
          type="text" 
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="0.01 ETH"
          className="w-full bg-gray-900 text-white rounded-lg p-2 text-center border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
       />

      <div className="flex gap-4">
          <button onClick={() => handleBet(true)} disabled={!betAmount || isPending} className="w-full bg-green-500/80 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Bet YES</button>
          <button onClick={() => handleBet(false)} disabled={!betAmount || isPending} className="w-full bg-red-500/80 hover:bg-red-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Bet NO</button>
      </div>

      {isPending && <div className="text-center text-blue-400">Check your wallet...</div>}
      {isConfirming && <div className="text-center text-blue-400">Transaction pending...</div>}
      {isConfirmed && <div className="text-center text-green-400">Bet placed successfully!</div>}
    </motion.div>
  );
};