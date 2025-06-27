import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Loader, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { useVideoAvatar } from '../../hooks/useVideoAvatar';

interface VideoAvatarDisplayProps {
  text?: string;
  emotion?: string;
  autoPlay?: boolean;
  onVideoEnd?: () => void;
  className?: string;
}

const VideoAvatarDisplay: React.FC<VideoAvatarDisplayProps> = ({
  text,
  emotion = 'calm',
  autoPlay = true,
  onVideoEnd,
  className = ''
}) => {
  const { isGenerating, currentVideoUrl, error, generateVideoResponse, clearVideo, isConfigured } = useVideoAvatar();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (text && text.trim().length > 0 && isConfigured) {
      console.log('Generating video for text:', text);
      generateVideoResponse(text, emotion);
    }
  }, [text, emotion, generateVideoResponse, isConfigured]);

  React.useEffect(() => {
    if (currentVideoUrl && autoPlay && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.error('Auto-play failed:', error);
        }
      };
      playVideo();
    }
  }, [currentVideoUrl, autoPlay]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVideoEvents = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      video.onplay = () => setIsPlaying(true);
      video.onpause = () => setIsPlaying(false);
      video.onended = () => {
        setIsPlaying(false);
        onVideoEnd?.();
      };
      video.onloadstart = () => console.log('Video loading started');
      video.oncanplay = () => console.log('Video can start playing');
      video.onerror = (e) => console.error('Video error:', e);
    }
  };

  const handleRetry = () => {
    if (text) {
      clearVideo();
      generateVideoResponse(text, emotion);
    }
  };

  if (!isConfigured) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center ${className}`}>
        <div className="max-w-sm mx-auto">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Video Avatar Setup Required</h3>
          <p className="text-gray-600 text-sm mb-4">
            To enable AI video avatar, configure your Tavus API credentials in your .env file:
          </p>
          <div className="text-left bg-white p-4 rounded-lg text-sm text-gray-700 border">
            <p className="font-medium mb-2 text-gray-900">Required Environment Variables:</p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>VITE_TAVUS_API_KEY</span>
                <span className="text-red-500">Missing</span>
              </div>
              <div className="flex justify-between">
                <span>VITE_TAVUS_REPLICA_ID</span>
                <span className="text-red-500">Missing</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 Get your API keys from <a href="https://tavus.io" target="_blank" rel="noopener noreferrer" className="underline">tavus.io</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-gray-900 rounded-2xl overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 z-10"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader className="h-8 w-8 mx-auto" />
              </motion.div>
              <p className="text-lg font-medium mb-2">Generating AI Avatar Video...</p>
              <p className="text-sm opacity-75">This may take 30-60 seconds</p>
              <div className="mt-4 w-48 bg-gray-700 rounded-full h-1 mx-auto">
                <motion.div
                  className="bg-primary-500 h-1 rounded-full"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 45, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-900 z-10"
          >
            <div className="text-center text-white p-6 max-w-sm">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Generation Failed</h3>
              <p className="text-sm opacity-75 mb-4">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={handleRetry}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Generation
                </button>
                <p className="text-xs opacity-60">
                  Check your Tavus API configuration
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {currentVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <video
              ref={videoRef}
              src={currentVideoUrl}
              className="w-full h-full object-cover"
              playsInline
              muted={isMuted}
              onLoadedMetadata={handleVideoEvents}
              crossOrigin="anonymous"
            />

            {/* Video Controls */}
            <AnimatePresence>
              {(showControls || !isPlaying) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/70 backdrop-blur-sm rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-4 w-4 text-white" />
                      )}
                    </button>

                    <button
                      onClick={handleMuteToggle}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-white" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-white text-sm font-medium">
                      AI Avatar
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Indicator */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">Live</span>
              </div>
            </div>
          </motion.div>
        )}

        {!currentVideoUrl && !isGenerating && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl">🤖</span>
              </motion.div>
              <p className="text-lg font-medium mb-2">AI Avatar Ready</p>
              <p className="text-sm opacity-75">Send a message to generate video response</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoAvatarDisplay;