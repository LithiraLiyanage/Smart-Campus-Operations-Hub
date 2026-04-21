import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Server, Wrench } from 'lucide-react';

const features = [
  {
    title: 'Resource Management',
    description: 'Track and allocate rooms, labs, and equipment instantly with precision and global visibility.',
    icon: Server,
    glow: 'from-blue-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400'
  },
  {
    title: 'Booking System',
    description: 'A seamless calendar-driven approach to reserving facilities with real-time conflict detection.',
    icon: CalendarCheck,
    glow: 'from-purple-500/20 to-fuchsia-500/5',
    iconColor: 'text-fuchsia-400'
  },
  {
    title: 'Maintenance Tracking',
    description: 'Submit, track, and resolve maintenance tickets for university assets dynamically.',
    icon: Wrench,
    glow: 'from-orange-500/20 to-amber-500/5',
    iconColor: 'text-orange-400'
  }
];

const LandingFeatures: React.FC = () => {
  return (
    <div id="features" className="py-32 bg-campus-dark relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-campus-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-campus-electric/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Empowering Your Campus Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-campus-lavender font-light"
          >
            A cohesive ecosystem engineered to optimize university logistics.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className={`relative bg-campus-navy/40 backdrop-blur-lg border border-white/5 p-10 rounded-3xl overflow-hidden group`}
            >
               {/* Card top intrinsic glow */}
              <div className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${feat.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                  <feat.icon className={`h-8 w-8 ${feat.iconColor}`} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">{feat.title}</h3>
                <p className="text-campus-lavender opacity-80 leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingFeatures;
