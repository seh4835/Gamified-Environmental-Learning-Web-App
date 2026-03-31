import { Link } from "react-router-dom";
import heroIllustration from "../assets/hero-illustration.svg";
import leafIcon from "../assets/icons/leaf.svg";
import recycleIcon from "../assets/icons/recycle.svg";
import trophyIcon from "../assets/icons/trophy.svg";

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Transform Environmental Education
              <span className="text-green-600"> Through Action</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              EcoLearn is a gamified sustainability platform that empowers
              students to learn environmental concepts, take real-world eco
              actions, and earn recognition through eco-points and badges.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/modules"
                className="px-6 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                Start Learning
              </Link>

              <Link
                to="/challenges"
                className="px-6 py-3 rounded-md border border-green-600 text-green-700 font-medium hover:bg-green-50 transition"
              >
                Take Eco Challenges
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Aligned with India’s SDG goals and NEP 2020 experiential learning vision.
            </p>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center">
            <img
              src={heroIllustration}
              alt="EcoLearn Sustainability Illustration"
              className="w-full max-w-md object-contain"
            />
          </div>

        </div>
      </section>

      {/* LEARN → ACT → EARN SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Learn → Act → Earn
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            EcoLearn bridges the gap between textbook knowledge and real-world sustainability practices.
          </p>

          <div className="mt-14 grid md:grid-cols-3 gap-10">

            {/* Learn */}
            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <img src={leafIcon} alt="Learn" className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Learn</h3>
              <p className="mt-3 text-sm text-gray-600">
                Interactive modules on climate change, waste management,
                renewable energy, and water conservation.
              </p>
            </div>

            {/* Act */}
            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <img src={recycleIcon} alt="Act" className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Act</h3>
              <p className="mt-3 text-sm text-gray-600">
                Complete real-world eco challenges like tree planting,
                waste segregation, and water-saving initiatives.
              </p>
            </div>

            {/* Earn */}
            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <img src={trophyIcon} alt="Earn" className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Earn</h3>
              <p className="mt-3 text-sm text-gray-600">
                Gain eco-points, unlock badges, and compete in school-level
                leaderboards.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* AR INNOVATION SECTION */}
      <section className="py-20 bg-green-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Scan & Learn with AR
          </h2>

          <p className="mt-4 text-gray-600">
            Use augmented reality to interact with everyday objects and discover
            sustainable practices in real time.
          </p>

          <a
            href="/ar/scan.html"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block px-6 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Open AR Experience
          </a>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to Make an Impact?
        </h2>

        <p className="mt-4 text-gray-600">
          Join EcoLearn today and start building sustainable habits that last a lifetime.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-block px-8 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}