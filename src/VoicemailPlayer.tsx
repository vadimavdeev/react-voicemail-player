import React, { useState } from "react";
import useAudioPlayback from "./hooks/useAudioPlayback";
import AudioPeaksBar from "./components/AudioPeaksBar";
import { PlayIcon, PauseIcon } from "./components/icons";
import { AudioPlaybackStatus } from "./audio-playback";

/**
 * `VoicemailPlayer` component props
 * @public
 * */
export interface VoicemailPlayerProps {
  /**
   * A function that renders <audio> element
   *
   * @param ref - A callback to be set as `ref` on the <audio> element
   * @returns React element
   * @example
   * ```ts
   * <VoicemailPlayer>{(ref) => <audio ref={ref} />}</VoicemailPlayer>
   * ```
   *
   * @public
   */
  children: (ref: React.RefCallback<HTMLAudioElement>) => React.ReactElement;

  /**
   * Optional CSS class to add to the player's root element
   */
  className?: string;
}

/**
 * Given a function that renders an <audio> element as `children`, renders a
 * React element that displays the audio's amplitude peaks, current time / duration,
 * and allows to control the audio playback (currently Play / Pause, and Seek)
 *
 * @param props - {@link VoicemailPlayerProps}
 * @returns React element
 * @example
 * ```ts
 * <VoicemailPlayer>{(ref) => <audio ref={ref} />}</VoicemailPlayer>
 * ```
 *
 * @public
 */
export default function VoicemailPlayer({
  children,
  className,
}: VoicemailPlayerProps) {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [playback, commands] = useAudioPlayback(audioElement);

  const onProgressChange = (relativeX: number) => {
    if (playback.isDurationUnknown) {
      return;
    }
    commands.seek(relativeX * playback.duration);
  };

  const renderAudio = children;

  const renderStatus = () => {
    if (playback.status === "error") {
      return <span title={playback.error?.message}>Error</span>;
    }

    return (
      <>
        <span role="timer" aria-label="Current Time">
          {formatTime(playback.currentTime)}
        </span>
        {!playback.isDurationUnknown && (
          <>
            &nbsp;/&nbsp;
            <span aria-label="Duration">{formatTime(playback.duration)}</span>
          </>
        )}
      </>
    );
  };

  return (
    <div className={rootClassName(playback.status, className)}>
      {playback.status === "playing" ? (
        <button
          aria-label="Pause"
          className={prefixClassName("playButton")}
          onClick={commands.pause}
        >
          <PauseIcon className={prefixClassName("playButton-icon")} />
        </button>
      ) : (
        <button
          aria-label="Play"
          className={prefixClassName("playButton")}
          onClick={commands.play}
          disabled={playback.status !== "ready"}
        >
          <PlayIcon className={prefixClassName("playButton-icon")} />
        </button>
      )}
      <div className={prefixClassName("content")}>
        <AudioPeaksBar
          audioData={playback.data}
          progress={playback.progress}
          onProgressChange={onProgressChange}
        />
        <div>{renderStatus()}</div>
      </div>
      {renderAudio(setAudioElement)}
    </div>
  );
}

function rootClassName(status: AudioPlaybackStatus, userClassName?: string) {
  return [
    prefixClassName("root"),
    prefixClassName("root--" + status),
    userClassName,
  ]
    .filter(Boolean)
    .join(" ");
}

function prefixClassName(name: string) {
  return `VoicemailPlayer-${name}`;
}

function formatTime(timeInSeconds: number) {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = Math.round(timeInSeconds % 60);

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
