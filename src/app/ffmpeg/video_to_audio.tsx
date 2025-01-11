"use client";

import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, Video, Music, Loader2 } from "lucide-react";

type FileState = File | null;

export default function AudioConverterPage() {
  const [video, setVideo] = useState<FileState>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [outputAudio, setOutputAudio] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const error = "";

  useEffect(() => {
    ffmpegRef.current = new FFmpeg();
    return () => {
      if (ffmpegRef.current) {
        ffmpegRef.current = null;
      }
    };
  }, []);

  const loadFFmpeg = async () => {
    if (loaded || !ffmpegRef.current) return;

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";
      await ffmpegRef.current.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setLoaded(true);
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setVideo(files[0]);
    }
  };

  const convertToAudio = async () => {
    if (!video || !ffmpegRef.current) return;

    try {
      setLoading(true);
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const videoName = "input.mp4";

      await ffmpeg.writeFile(videoName, await fetchFile(video));

      await ffmpeg.exec([
        "-i",
        videoName,
        "-vn",
        "-acodec",
        "libmp3lame",
        "-ab",
        "192k",
        "-ar",
        "44100",
        "output.mp3",
      ]);

      const data = await ffmpeg.readFile("output.mp3");
      const audioBlob = new Blob([data], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setOutputAudio(audioUrl);

      await ffmpeg.deleteFile(videoName);
      await ffmpeg.deleteFile("output.mp3");
    } catch (error) {
      console.error("Error converting video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputAudio) return;
    const a = document.createElement("a");
    a.href = outputAudio;
    a.download = "output.mp3";
    a.click();
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Video to Audio Converter
          </h1>
          <p className="text-muted-foreground">
            Extract audio from your videos in MP3 format
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Convert Video to Audio
            </CardTitle>
            <CardDescription>
              Upload a video file to extract the audio
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Card className="p-4 border border-dashed hover:border-primary/50 transition-colors">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">Video</h3>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-input"
                />
                <Button
                  onClick={() =>
                    document.getElementById("video-input")?.click()
                  }
                  variant="secondary"
                  className="w-full"
                >
                  {video ? "Change Video" : "Select Video"}
                </Button>
                {video && (
                  <p className="text-sm text-muted-foreground text-center truncate">
                    {video.name}
                  </p>
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={convertToAudio}
                disabled={!video || loading}
                className="w-full h-12 text-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Converting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Music className="h-5 w-5" />
                    <span>Convert to Audio</span>
                  </div>
                )}
              </Button>

              {loading && <Progress value={33} className="h-2" />}
            </div>

            {outputAudio && (
              <div className="space-y-4 rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                <h3 className="font-medium text-center">Generated Audio</h3>
                <audio controls className="w-full">
                  <source src={outputAudio} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Download Audio
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
