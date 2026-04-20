import { Link } from "react-router-dom";

const DashboardFooter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface border-t border-surface-container-highest mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-on-surface/40">
            © {year} CampusFlow Operations Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Campus Map", "Support"].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-xs text-on-surface/40 hover:text-primary transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
