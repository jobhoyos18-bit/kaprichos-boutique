import { useEffect, useRef, useState } from 'react';
import mobileVideo from '../assets/kaprichos-background-mobile.mp4';
import desktopVideo from '../assets/kaprichos-background-desktop.mp4';
import mobilePoster from '../assets/kaprichos-background-mobile.webp';
import desktopPoster from '../assets/kaprichos-background-desktop.webp';

const DESKTOP_QUERY = '(min-width: 768px)';

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackTime = useRef(0);
  const finished = useRef(false);
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const screen = window.matchMedia(DESKTOP_QUERY);
    const handleResize = () => {
      // Preserve progress when rotating a device or resizing the window.
      playbackTime.current = videoRef.current?.currentTime ?? playbackTime.current;
      setDesktop(screen.matches);
    };
    screen.addEventListener('change', handleResize);
    return () => screen.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.loop = false;

    const showStillFrame = () => {
      video.pause();
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }
    };
    const handleMetadata = () => {
      if (motionPreference.matches || finished.current) {
        showStillFrame();
        return;
      }
      if (playbackTime.current > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(playbackTime.current, Math.max(0, video.duration - 0.05));
      }
      // Leave the poster visible if the browser blocks autoplay.
      void video.play().catch(() => {});
    };
    const handleMotionChange = () => {
      if (motionPreference.matches) showStillFrame();
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    motionPreference.addEventListener('change', handleMotionChange);
    if (video.readyState >= 1) handleMetadata();

    return () => {
      video.pause();
      video.removeEventListener('loadedmetadata', handleMetadata);
      motionPreference.removeEventListener('change', handleMotionChange);
    };
  }, [desktop]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#ecdad0]"
    >
      <video
        ref={videoRef}
        src={desktop ? desktopVideo : mobileVideo}
        poster={desktop ? desktopPoster : mobilePoster}
        muted
        playsInline
        loop={false}
        controls={false}
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        width={desktop ? 1280 : 720}
        height={desktop ? 720 : 1280}
        className="h-full w-full object-cover object-center"
        onEnded={(event) => {
          finished.current = true;
          playbackTime.current = event.currentTarget.currentTime;
          event.currentTarget.pause();
        }}
      />
    </div>
  );
}
