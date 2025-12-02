'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Clock, X } from 'lucide-react';
import Image from 'next/image';
import Logo from "@/images/Oktzy Test Logo 1.png";

interface LandingModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const LandingModal: React.FC<LandingModalProps> = ({ isOpen, onContinue }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger the fade in animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Hide the modal after animation completes
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onContinue(), 300);
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-gradient-to-br from-background via-background/95 to-purple-900/20 rounded-3xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-8">
            <Image
              src={Logo.src}
              alt="Oktzy Logo"
              width={300}
              height={120}
              className="h-24 md:h-32 w-auto"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Save Your Favorite
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Video Moments
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Add timestamps to any video and jump to the exact moments that matter. 
            Perfect for tutorials, lectures, or any content you want to revisit.
          </p>

          {/* Simple Feature List */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 text-gray-300">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-purple-400" />
              <span className="text-base">Paste any video URL</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-base">Add custom timestamps</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-purple-400" />
              <span className="text-base">Jump to saved moments</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleClose}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Simple Footer */}
          <p className="text-gray-500 text-sm mt-8">
            Free to use • No sign up required
          </p>
        </div>
      </div>
    </div>
  );
};