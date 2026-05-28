import { PlayCircle } from 'lucide-react';

export function VideoPlayer() {
  return (
    <div className="grid aspect-video place-items-center rounded-2xl bg-gray-950 text-white">
      <div className="text-center">
        <PlayCircle size={58} className="mx-auto" />
        <p className="mt-3 text-sm font-semibold">Frontend video player placeholder</p>
      </div>
    </div>
  );
}
