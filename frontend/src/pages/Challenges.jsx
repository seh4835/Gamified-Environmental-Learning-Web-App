import { useState } from "react";
import Loader from "../components/ui/Loader";

export default function Challenges() {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [answers, setAnswers] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  //10 Modules × 2 Challenges
  const challenges = [
    {
      module: "Climate Change",
      quiz: [
        {
          q: "What causes global warming?",
          options: ["Oxygen", "CO2 emissions", "Nitrogen", "Hydrogen"],
          correct: "CO2 emissions"
        },
        {
          q: "Main greenhouse gas?",
          options: ["O2", "CO2", "H2", "N2"],
          correct: "CO2"
        },
        {
          q: "Effect of climate change?",
          options: ["Cooling", "No change", "Rising temps", "Less rain"],
          correct: "Rising temps"
        },
        {
          q: "Paris Agreement goal?",
          options: ["Increase temp", "Reduce emissions", "Stop rain", "More coal"],
          correct: "Reduce emissions"
        },
        {
          q: "Major contributor?",
          options: ["Transport", "Trees", "Oceans", "Wind"],
          correct: "Transport"
        }
      ],
      task: "Plant a tree and upload a picture"
    },

    {
      module: "Waste Management",
      quiz: [
        { q: "Best waste practice?", options: ["Burn", "Segregate", "Dump", "Ignore"], correct: "Segregate" },
        { q: "Recyclable?", options: ["Plastic", "Food waste", "Glass", "All"], correct: "All" },
        { q: "Composting uses?", options: ["Plastic", "Organic waste", "Metal", "Glass"], correct: "Organic waste" },
        { q: "Landfill gas?", options: ["Oxygen", "Methane", "Hydrogen", "Nitrogen"], correct: "Methane" },
        { q: "Reduce waste?", options: ["Reuse", "Throw", "Burn", "Ignore"], correct: "Reuse" }
      ],
      task: "Segregate waste at home for 3 days and upload proof"
    },

    // Repeat for all modules 
    {
      module: "Water Conservation",
      quiz: [
        { q: "Save water by?", options: ["Open taps", "Fix leaks", "Waste", "Ignore"], correct: "Fix leaks" },
        { q: "Harvesting means?", options: ["Storing rainwater", "Drinking", "Cleaning", "None"], correct: "Storing rainwater" },
        { q: "Water scarcity?", options: ["Too much water", "Less water", "Clean water", "None"], correct: "Less water" },
        { q: "Irrigation?", options: ["Drip", "Flood", "None", "All"], correct: "All" },
        { q: "Save water?", options: ["Reuse", "Waste", "Ignore", "None"], correct: "Reuse" }
      ],
      task: "Practice water saving for a week and upload evidence"
    },

    {
      module: "Renewable Energy",
      quiz: [
        { q: "Solar energy source?", options: ["Sun", "Wind", "Water", "Coal"], correct: "Sun" },
        { q: "Wind energy uses?", options: ["Turbines", "Cars", "Boilers", "Fans"], correct: "Turbines" },
        { q: "Hydro energy?", options: ["Water", "Fire", "Coal", "Gas"], correct: "Water" },
        { q: "Clean energy?", options: ["Solar", "Coal", "Oil", "Gas"], correct: "Solar" },
        { q: "Future energy?", options: ["Renewables", "Coal", "Oil", "Gas"], correct: "Renewables" }
      ],
      task: "Use minimal electricity for 2 days and upload proof"
    },

    {
      module: "Biodiversity",
      quiz: [
        { q: "Biodiversity means?", options: ["Variety of life", "Only animals", "Only plants", "None"], correct: "Variety of life" },
        { q: "Threat?", options: ["Deforestation", "Rain", "Wind", "Sun"], correct: "Deforestation" },
        { q: "Protect biodiversity?", options: ["Plant trees", "Cut trees", "Pollute", "Ignore"], correct: "Plant trees" },
        { q: "Extinction?", options: ["Species loss", "Growth", "Birth", "None"], correct: "Species loss" },
        { q: "Ecosystem?", options: ["Living system", "Machine", "Car", "None"], correct: "Living system" }
      ],
      task: "Plant or care for a plant and upload photo"
    },

    {
      module: "Sustainable Agriculture",
      quiz: [
        { q: "Organic farming?", options: ["No chemicals", "More chemicals", "None", "All"], correct: "No chemicals" },
        { q: "Soil conservation?", options: ["Protect soil", "Destroy", "Ignore", "None"], correct: "Protect soil" },
        { q: "Water saving?", options: ["Drip irrigation", "Flooding", "None", "All"], correct: "Drip irrigation" },
        { q: "Food waste?", options: ["Reduce", "Increase", "Ignore", "None"], correct: "Reduce" },
        { q: "Sustainability?", options: ["Long-term use", "Short use", "None", "All"], correct: "Long-term use" }
      ],
      task: "Reduce food waste and upload proof"
    },

    {
      module: "Urban Sustainability",
      quiz: [
        { q: "Smart city?", options: ["Efficient city", "Village", "Forest", "None"], correct: "Efficient city" },
        { q: "Green transport?", options: ["Public transport", "Cars", "None", "All"], correct: "Public transport" },
        { q: "Urban waste?", options: ["Recycle", "Dump", "Burn", "Ignore"], correct: "Recycle" },
        { q: "Green building?", options: ["Eco building", "Normal", "None", "All"], correct: "Eco building" },
        { q: "Future cities?", options: ["Sustainable", "Polluted", "None", "All"], correct: "Sustainable" }
      ],
      task: "Use public transport and upload proof"
    },

    {
      module: "Carbon Footprint",
      quiz: [
        { q: "Carbon footprint?", options: ["Emissions", "Water", "Soil", "None"], correct: "Emissions" },
        { q: "Reduce footprint?", options: ["Less travel", "More travel", "None", "All"], correct: "Less travel" },
        { q: "Major source?", options: ["Transport", "Trees", "None", "All"], correct: "Transport" },
        { q: "Energy saving?", options: ["Turn off lights", "Keep on", "None", "All"], correct: "Turn off lights" },
        { q: "Lifestyle?", options: ["Sustainable", "Wasteful", "None", "All"], correct: "Sustainable" }
      ],
      task: "Track your carbon habits and upload proof"
    },

    {
      module: "Environmental Policy",
      quiz: [
        { q: "SDGs count?", options: ["17", "10", "5", "20"], correct: "17" },
        { q: "Paris agreement?", options: ["Climate action", "War", "None", "All"], correct: "Climate action" },
        { q: "NEP 2020?", options: ["Education policy", "Law", "None", "All"], correct: "Education policy" },
        { q: "Policy aim?", options: ["Protection", "Damage", "None", "All"], correct: "Protection" },
        { q: "Global effort?", options: ["Cooperation", "Conflict", "None", "All"], correct: "Cooperation" }
      ],
      task: "Research SDGs and upload summary proof"
    },

    {
      module: "Community Action",
      quiz: [
        { q: "Community role?", options: ["Important", "Not needed", "None", "All"], correct: "Important" },
        { q: "Eco clubs?", options: ["Awareness", "None", "All", "Ignore"], correct: "Awareness" },
        { q: "Clean drives?", options: ["Helpful", "Harmful", "None", "All"], correct: "Helpful" },
        { q: "Local impact?", options: ["High", "Low", "None", "All"], correct: "High" },
        { q: "Participation?", options: ["Essential", "Optional", "None", "All"], correct: "Essential" }
      ],
      task: "Join or simulate a clean-up drive and upload proof"
    }
  ];

  const handleAnswer = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const submitQuiz = () => {
    let score = 0;
    activeChallenge.quiz.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    alert(`You scored ${score}/5`);
  };

  const handleUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const submitProof = () => {
    if (!uploadedFile) return alert("Upload a file first");
    alert("Proof submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-10">Eco Challenges</h1>

      {!activeChallenge ? (
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((c, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
              onClick={() => setActiveChallenge(c)}
            >
              <h2 className="font-semibold text-lg">{c.module}</h2>
              <p className="text-sm text-gray-600 mt-2">
                Complete quiz + real-world challenge
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-6">
            {activeChallenge.module} Challenge
          </h2>

          {/* Quiz */}
          <div className="mb-10">
            <h3 className="font-semibold mb-4">Quiz</h3>
            {activeChallenge.quiz.map((q, i) => (
              <div key={i} className="mb-4">
                <p>{q.q}</p>
                {q.options.map((opt) => (
                  <label key={opt} className="block">
                    <input
                      type="radio"
                      name={`q${i}`}
                      onChange={() => handleAnswer(i, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <button onClick={submitQuiz} className="bg-green-600 text-white px-4 py-2 rounded">
              Submit Quiz
            </button>
          </div>

          {/* Upload */}
          <div>
            <h3 className="font-semibold mb-2">Real-world Task</h3>
            <p className="mb-4">{activeChallenge.task}</p>
            <input type="file" onChange={handleUpload} />
            <button onClick={submitProof} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Submit Proof
            </button>
          </div>
        </div>
      )}
    </div>
  );
}