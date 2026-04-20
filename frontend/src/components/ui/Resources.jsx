import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const resources = [
  {
    title: "Innovation Labs",
    description: "Collaborative spaces • 40 seats",
    image:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
    span: "col-span-1",
  },
  {
    title: "Lecture Halls",
    description: "Capacities from 50 to 500",
    image:
      "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80",
    span: "col-span-1",
  },
  {
    title: "Meeting Rooms",
    description: "Equipped with smart screens",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    span: "col-span-1",
  },
  {
    title: "Library Spaces",
    description: "Quiet zones • Group pods",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    span: "col-span-1",
  },
];

const ResourceCard = ({ resource, index, isInView }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.65, delay: index * 0.1, ease: "easeOut" }}
    className={`relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer ${resource.span}`}
  >
    {/* Image with zoom on hover */}
    <img
      src={resource.image}
      alt={resource.title}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

    {/* Text content */}
    <div className="absolute bottom-0 left-0 right-0 p-5">
      <h3 className="font-headline font-bold text-white text-base leading-tight">
        {resource.title}
      </h3>
      <p className="text-white/70 text-xs mt-1">{resource.description}</p>
    </div>

    {/* Hover action chip */}
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
      <span className="glass-panel text-white text-xs font-semibold px-3 py-1.5 rounded-full">
        Book Now
      </span>
    </div>
  </motion.div>
);

const Resources = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="resources" className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">
              Explore{" "}
              <span className="editorial-text gradient-text">Campus</span>{" "}
              Resources
            </h2>
            <p className="text-sm text-on-surface/50 mt-2">
              Curated spaces of our most requested academic environments.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200 shrink-0"
          >
            View All Resources
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {resources.map((resource, i) => (
            <ResourceCard
              key={resource.title}
              resource={resource}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
