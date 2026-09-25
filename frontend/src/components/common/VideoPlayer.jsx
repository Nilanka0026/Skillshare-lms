import { PlayCircle } from 'lucide-react';

export function VideoPlayer({ src }) {
  if (!src) {
    return (
      <div className="grid aspect-video place-items-center rounded-2xl bg-gray-950 text-white">
        <div className="text-center">
          <PlayCircle size={58} className="mx-auto" />
          <p className="mt-3 text-sm font-semibold">Select a lesson to start learning</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-black aspect-video flex justify-center items-center">
      <video 
        key={src} // re-render when src changes
        src={src} 
        controls 
        className="w-full h-full"
        autoPlay
      />
    </div>
  );
}
