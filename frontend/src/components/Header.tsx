// components/Header.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center border-b border-purple-500/20">
      <h1 className="text-2xl font-bold text-white tracking-wider">OpTrade</h1>
      <ConnectButton />
    </header>
  );
};