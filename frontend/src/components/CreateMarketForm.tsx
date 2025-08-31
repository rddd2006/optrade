// src/components/CreateMarketForm.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import opinionTradeABI from '../../../contracts/out/OpinionTrade.sol/OpinionTrade.json';

// Make sure this is your LATEST deployed contract address
const CONTRACT_ADDRESS = "0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519";

export const CreateMarketForm = () => {
  const [question, setQuestion] = useState('');
  const { data: hash, isPending, writeContract } = useWriteContract();

  const createMarket = () => {
    writeContract({
      address: `0x${CONTRACT_ADDRESS.substring(2)}`,
      abi: opinionTradeABI.abi,
      functionName: 'createMarket',
      args: [question],
      // This sends the required 0.001 ETH fee
      value: parseEther('0.001'), 
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-500/50 flex flex-col gap-4 max-w-2xl mx-auto">
      <h3 className="text-xl text-white font-bold text-center">Create a New Market</h3>
      <p className="text-center text-gray-400 text-sm">Fee: 0.001 ETH</p>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g., Will India win the next Cricket World Cup?"
        className="w-full bg-gray-900 text-white rounded-lg p-3 text-center border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
      />
      <button 
        onClick={createMarket} 
        disabled={!question || isPending} 
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        {isPending ? 'Check Wallet...' : 'Create Market'}
      </button>
      {isConfirming && <div className="text-center text-blue-400">Transaction pending...</div>}
      {isConfirmed && <div className="text-center text-green-400">Market created successfully!</div>}
    </div>
  );
};