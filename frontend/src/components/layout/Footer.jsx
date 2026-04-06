import { Link } from "react-router-dom";
export default function Footer() {
    return (
        <footer className= "bg-gray-900 text-gray-200 mt-16">
            <div className= "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div>
                    <h3 className= "text-lg font-semibold text-white">EcoLearn</h3>
                    <p className= "mt-3 text-sm text-gray-400">
                        A gamified environmental learning platform that empowers students to 
                        learn sustainability concepts, take real-world eco actions, and earn 
                        recognition through eco-points and badges.   
                    </p>
                    <p className= "mt-3 text-xs text-gray-500">
                        Learn → Act → Earn
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Platform
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <Link to="/modules" className="hover:text-green-400 transition">
                            Learning Modules
                            </Link>
                        </li>
                        <li>
                            <Link to="/challenges" className="hover:text-green-400 transition">
                            Eco Challenges
                            </Link>
                        </li>
                        <li>
                            <Link to="/leaderboard" className="hover:text-green-400 transition">
                            Leaderboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="hover:text-green-400 transition">
                            Dashboard
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className= "text-sm font-semibold uppercase tracking-wider text-white">
                        Resources
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <a
                            href="https://sdgs.un.org/goals"
                            target= "_blank"
                            rel= "noopener noreferrer"
                            className= "hover:text-green-400 transition"
                            >
                                UN Sustainable Development Goals
                            </a>
                        </li>
                        <li>
                            <a
                            href="https://www.education.gov.in/nep2020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400 transition"
                            >
                                NEP 2020 (India)
                            </a>
                        </li>
                        <li>
                            <a
                            href="/ar/scan.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400 transition"
                            >
                                AR Scan and Learn
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contacts/Credits */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                        About
                    </h4>
                    <p className="mt-4 text-sm text-gray-400">
                        Built as an educational technology project to promote environmental 
                        awareness and sustainable habits among students through experiential 
                        learning.
                    </p>
                    <p className="mt-4 text-xs text-gray-500">
                        © {new Date().getFullYear()} EcoLearn. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className= "border-t border-gray-800 py-4 text-center text-xs text-gray-500">
               Made with purpose for sustainability education • Designed for students 
               and educators 
            </div>
        </footer>
    );
}