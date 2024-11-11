import { X } from 'lucide-react';
import { useModalStore } from '../store/modalStore';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export function AboutModal() {
  const { aboutVisible, setAboutVisible } = useModalStore((state) => ({
    aboutVisible: state.aboutVisible,
    setAboutVisible: state.setAboutVisible
  }));
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (aboutVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [aboutVisible]);

  if (!aboutVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full ${
                isMobile ? 'max-w-full' : 'max-w-2xl'
              } bg-white/10 backdrop-blur-md rounded-xl shadow-xl my-8`}
            >
              <div className="sticky top-0 p-6 border-b border-white/10 bg-white/10 backdrop-blur-md z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">About UN World Unity</h2>
                  <button
                    onClick={() => setAboutVisible(false)}
                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Our Mission</h3>
                  <p className="text-white/80 leading-relaxed">
                    UN World Unity's mission is to empower individuals by providing insights 
                    into how they are influenced and giving them the tools to influence 
                    themselves.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-2">Business Growth</h4>
                    <p className="text-white/70">
                      Build and grow your business with our supportive global community.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-2">Creative Expression</h4>
                    <p className="text-white/70">
                      Share your art and life journey with an engaged worldwide audience.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-2">Community Impact</h4>
                    <p className="text-white/70">
                      Participate in meaningful projects that make a difference globally.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Our Vision</h3>
                  <p className="text-white/80 leading-relaxed">
                    We strive to foster a collaborative environment where creativity, 
                    entrepreneurship, and personal growth are celebrated, inspiring 
                    connections and shared experiences from around the world.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Global Impact</h3>
                  <p className="text-white/80 leading-relaxed">
                    Through our platform, we aim to break down geographical barriers and create 
                    meaningful connections between individuals from diverse backgrounds. Our 
                    users collaborate on projects that address global challenges while 
                    fostering mutual understanding and respect.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Innovation & Growth</h3>
                  <p className="text-white/80 leading-relaxed">
                    We provide cutting-edge tools and resources that enable our community 
                    members to explore new possibilities, develop their skills, and achieve 
                    their full potential. Our platform serves as a catalyst for personal and 
                    professional development.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Community Values</h3>
                  <p className="text-white/80 leading-relaxed">
                    Our community is built on the principles of respect, collaboration, and 
                    mutual support. We celebrate diversity and encourage open dialogue that 
                    leads to greater understanding and shared success.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}