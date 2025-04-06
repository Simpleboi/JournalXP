import { Link } from "react-router-dom";
import "../styles/footer.scss";

export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12 py-6 footer">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/meditation"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Meditation Room
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Rewards Shop
                </Link>
              </li>
              <li>
                  <Link
                    to="/about"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Resources</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Mental Health Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Meditation Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Journaling Prompts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 connect">
              Connect
            </h3>
            <div className="connect-sub">
              <a href="https://www.instagram.com/n8.jsx/" target="_blank">
                <i className="bx bxl-instagram"></i>
              </a>
              <a
                href="https://www.youtube.com/@N8DotJsx/videos"
                target="_blank"
              >
                <i className="bx bxl-youtube"></i>
              </a>
              <a href="https://github.com/Simpleboi/JournalXP" target="_blank">
                <i className="bx bx-code-alt"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p>JournalXP - Your Mental Health Companion</p>
          <p className="mt-2">
            Remember, taking care of your mental health is a journey, not a
            destination.
          </p>
          <p className="mt-2 text-xs">
            © {new Date().getFullYear()} JournalXP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
