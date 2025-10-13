import React from "react";
import { Gamepad2, MousePointerClick, Rocket } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { useNavigate } from "react-router-dom";

const games = [
  {
    title: "Bubble Wrap Pop",
    description: "Relieve stress by popping virtual bubbles.",
    icon: MousePointerClick,
    url: "http://localhost:3001/",
  },
  {
    title: "Tetris Classic",
    description: "Stack blocks to clear lines and refresh your mind.",
    icon: Rocket,
    url: "http://localhost:3000/",
  },
];

const Game: React.FC = () => {
  const navigate = useNavigate();

  const openGame = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Games & Relaxation
            </h1>
            <p className="text-xl text-gray-600">
              Unwind with some light games designed to ease stress and lift your
              mood.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <AnimatedSection delay={index * 100} key={game.title}>
              <div
                onClick={() => openGame(game.url)}
                className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <game.icon className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {game.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">{game.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
