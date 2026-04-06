import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import QuizCard from "../../components/features/quiz/QuizCard";
import api from "../../services/api";

export default function ModuleDetail() {
  const { id } = useParams();
  const moduleId = Number(id);

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/modules/${id}`);
        setModule(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  if (loading) return <Loader fullScreen text="Loading module..." />;
  if (!module) return <p>Module not found</p>;

  // 🌍 FULL CONTENT FOR ALL 10 MODULES
  const moduleContent = {

    1: [
      { title: "Understanding Climate Change",
        content: "Climate change refers to long-term alterations in temperature and weather patterns, primarily driven by human activities such as burning fossil fuels." },
      { title: "Greenhouse Effect",
        content: "Greenhouse gases trap heat in the atmosphere. Excess emissions amplify this effect, leading to global warming." },
      { title: "Major Causes",
        content: "Industrialization, deforestation, transportation emissions, and energy consumption are key contributors." },
      { title: "Global Impacts",
        content: "Rising sea levels, extreme weather events, melting glaciers, and ecosystem disruption." },
      { title: "Mitigation Strategies",
        content: "Reducing emissions, switching to renewable energy, and reforestation are key solutions." },
      { title: "Role of Individuals",
        content: "Energy conservation, sustainable transport, and conscious consumption reduce carbon footprint." }
    ],

    2: [
      { title: "Waste Management Basics",
        content: "Waste management involves collection, processing, and disposal of waste to reduce environmental harm." },
      { title: "Types of Waste",
        content: "Organic, recyclable, hazardous, and electronic waste require different handling." },
      { title: "Circular Economy",
        content: "A system where resources are reused, reducing waste and environmental impact." },
      { title: "Plastic Pollution",
        content: "Plastic waste persists for centuries, harming ecosystems and marine life." },
      { title: "Recycling & Composting",
        content: "Recycling conserves resources, while composting reduces organic waste." },
      { title: "Daily Actions",
        content: "Segregate waste, avoid single-use plastics, and promote reuse." }
    ],

    3: [
      { title: "Water Scarcity",
        content: "Freshwater resources are limited and unevenly distributed across the globe." },
      { title: "Groundwater Depletion",
        content: "Excessive extraction leads to falling water tables and long-term shortages." },
      { title: "Rainwater Harvesting",
        content: "Capturing rainwater helps recharge groundwater and reduce dependency." },
      { title: "Efficient Usage",
        content: "Drip irrigation and low-flow systems conserve water." },
      { title: "Impact on Society",
        content: "Water shortages affect agriculture, health, and economic stability." },
      { title: "Individual Role",
        content: "Fix leaks, reduce wastage, and reuse water wherever possible." }
    ],

    4: [
      { title: "Renewable Energy Overview",
        content: "Renewable energy comes from natural sources like sunlight and wind." },
      { title: "Solar Energy",
        content: "Solar panels convert sunlight into electricity efficiently." },
      { title: "Wind & Hydro",
        content: "Wind turbines and hydroelectric dams generate large-scale clean energy." },
      { title: "Advantages",
        content: "Reduces emissions and dependence on fossil fuels." },
      { title: "Challenges",
        content: "Initial cost and infrastructure requirements." },
      { title: "Future Scope",
        content: "Rapid adoption globally with technological advancements." }
    ],

    5: [
      { title: "Biodiversity Importance",
        content: "Biodiversity ensures ecosystem stability and supports life." },
      { title: "Ecosystem Balance",
        content: "Each species plays a role in maintaining ecological equilibrium." },
      { title: "Threats",
        content: "Deforestation, pollution, climate change, and habitat loss." },
      { title: "Conservation Methods",
        content: "Protected areas, wildlife laws, and sustainable practices." },
      { title: "Impact of Loss",
        content: "Disrupted food chains and ecological imbalance." },
      { title: "Individual Actions",
        content: "Plant trees and reduce pollution." }
    ],

    6: [
      { title: "Sustainable Agriculture",
        content: "Farming methods that preserve resources and environment." },
      { title: "Organic Farming",
        content: "Avoids synthetic chemicals and promotes soil health." },
      { title: "Soil Conservation",
        content: "Prevents erosion and maintains fertility." },
      { title: "Efficient Irrigation",
        content: "Drip irrigation reduces water usage." },
      { title: "Food Sustainability",
        content: "Reducing food waste ensures better resource utilization." },
      { title: "Future Practices",
        content: "Agroecology and precision farming are emerging trends." }
    ],

    7: [
      { title: "Urban Sustainability",
        content: "Cities must balance development with environmental protection." },
      { title: "Smart Cities",
        content: "Use technology for efficient energy and resource management." },
      { title: "Green Infrastructure",
        content: "Parks, green roofs, and eco-friendly buildings." },
      { title: "Transport Systems",
        content: "Public transport and EVs reduce emissions." },
      { title: "Waste Management",
        content: "Urban recycling systems improve sustainability." },
      { title: "Future Cities",
        content: "Sustainable urban planning is key to future living." }
    ],

    8: [
      { title: "Carbon Footprint",
        content: "Measure of total greenhouse gases produced by activities." },
      { title: "Major Sources",
        content: "Transport, electricity, food, and lifestyle choices." },
      { title: "Impact",
        content: "Higher footprint accelerates climate change." },
      { title: "Reduction Methods",
        content: "Energy efficiency, sustainable transport, and reduced waste." },
      { title: "Lifestyle Changes",
        content: "Minimalism and conscious consumption." },
      { title: "Tracking",
        content: "Carbon calculators help measure impact." }
    ],

    9: [
      { title: "Environmental Policies",
        content: "Governments create policies to regulate environmental impact." },
      { title: "Global Agreements",
        content: "Paris Agreement and UN climate frameworks." },
      { title: "SDGs",
        content: "17 Sustainable Development Goals guide global sustainability." },
      { title: "NEP 2020",
        content: "Promotes experiential environmental learning in India." },
      { title: "Implementation",
        content: "Policies require active participation from citizens." },
      { title: "Future Direction",
        content: "Stronger enforcement and global cooperation." }
    ],

    10: [
      { title: "Community Action",
        content: "Local communities play a crucial role in sustainability." },
      { title: "Eco-Clubs",
        content: "Schools and colleges drive awareness initiatives." },
      { title: "Clean-Up Drives",
        content: "Community participation improves local environments." },
      { title: "Grassroots Impact",
        content: "Small actions collectively create large impact." },
      { title: "Collaboration",
        content: "NGOs and governments support initiatives." },
      { title: "Your Role",
        content: "Participate actively in local sustainability efforts." }
    ]
  };

  const slides = moduleContent[moduleId] || [];

  const nextSlide = () =>
    currentSlide < slides.length - 1 && setCurrentSlide(currentSlide + 1);

  const prevSlide = () =>
    currentSlide > 0 && setCurrentSlide(currentSlide - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">{module.title}</h1>

        {/* Slides */}
        <div className="bg-white p-8 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {slides[currentSlide]?.title}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {slides[currentSlide]?.content}
          </p>

          <div className="flex justify-between mt-6">
            <button onClick={prevSlide} disabled={currentSlide === 0}>
              Previous
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Quiz */}
        {module.quizzes?.map((q, i) => (
          <QuizCard key={q.id} quiz={q} index={i} />
        ))}

      </div>
    </div>
  );
}