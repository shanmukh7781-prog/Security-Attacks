import React from 'react';
import { attacks } from './data/attacks';
import { AttackCard } from './components/AttackCard';
import { DomainScanner } from './components/DomainScanner';
import { Container } from './components/ui/Container';
import { Header } from './components/ui/Header';
import './styles/theme.css';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Container className="py-12">
        <Header />

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#00fff2] neon-text mb-6">Domain Scanner</h2>
          <DomainScanner />
        </div>

        <h2 className="text-2xl font-bold text-[#00fff2] neon-text mb-6">Common Attack Vectors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attacks.map((attack, index) => (
            <AttackCard key={attack.name} attack={attack} index={index} />
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>⚠️ For educational purposes only. Use responsibly and legally.</p>
        </footer>
      </Container>
    </div>
  );
}

export default App;