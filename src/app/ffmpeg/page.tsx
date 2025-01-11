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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Video,
  Image as ImageIcon,
  Music,
  Loader2,
} from "lucide-react";

type FileState = File | null;

export default function VideoCreatorPage() {
  const [image, setImage] = useState<FileState>(null);
  const [audio, setAudio] = useState<FileState>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const error = "";

  // Initialize FFmpeg only on client side
  useEffect(() => {
    ffmpegRef.current = new FFmpeg();
    return () => {
      if (ffmpegRef.current) {
        ffmpegRef.current = null;
      }
    };
  }, []);

  // Load FFmpeg
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

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  // Handle audio upload
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setAudio(files[0]);
    }
  };

  // Create video from image and audio
  const createVideo = async () => {
    if (!image || !audio || !ffmpegRef.current) return;

    try {
      setLoading(true);
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const imageName = "input.jpg";
      const audioName = "input.mp3";

      // Write files to FFmpeg virtual filesystem
      await ffmpeg.writeFile(imageName, await fetchFile(image));
      await ffmpeg.writeFile(audioName, await fetchFile(audio));

      // Create video from image
      await ffmpeg.exec([
        "-loop",
        "1",
        "-i",
        imageName,
        "-i",
        audioName,
        "-c:v",
        "libx264",
        "-tune",
        "stillimage",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-pix_fmt",
        "yuv420p",
        "-shortest",
        "output.mp4",
      ]);

      // Read the output video
      const data = await ffmpeg.readFile("output.mp4");
      const videoBlob = new Blob([data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setOutputVideo(videoUrl);

      // Clean up
      await ffmpeg.deleteFile(imageName);
      await ffmpeg.deleteFile(audioName);
      await ffmpeg.deleteFile("output.mp4");
    } catch (error) {
      console.error("Error creating video:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle video download
  const handleDownload = () => {
    if (!outputVideo) return;
    const a = document.createElement("a");
    a.href = outputVideo;
    a.download = "output.mp4";
    a.click();
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Image to Video Converter
          </h1>
          <p className="text-muted-foreground">
            Create videos from your images with custom audio tracks
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create Your Video
            </CardTitle>
            <CardDescription>
              Upload an image and audio file to generate your video
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* File Upload Section */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Image Upload */}
              <Card className="p-4 border border-dashed hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Image</h3>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("image-input")?.click()
                    }
                    variant="secondary"
                    className="w-full"
                  >
                    {image ? "Change Image" : "Select Image"}
                  </Button>
                  {image && (
                    <p className="text-sm text-muted-foreground text-center truncate">
                      {image.name}
                    </p>
                  )}
                </div>
              </Card>

              {/* Audio Upload */}
              <Card className="p-4 border border-dashed hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <Music className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Audio</h3>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                    id="audio-input"
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("audio-input")?.click()
                    }
                    variant="secondary"
                    className="w-full"
                  >
                    {audio ? "Change Audio" : "Select Audio"}
                  </Button>
                  {audio && (
                    <p className="text-sm text-muted-foreground text-center truncate">
                      {audio.name}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            <Separator />

            {/* Create Video Button */}
            <div className="space-y-4">
              <Button
                onClick={createVideo}
                disabled={!image || !audio || loading}
                className="w-full h-12 text-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Video...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Create Video</span>
                  </div>
                )}
              </Button>

              {loading && <Progress value={33} className="h-2" />}
            </div>

            {/* Output Video Section */}
            {outputVideo && (
              <div className="space-y-4 rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                <h3 className="font-medium text-center">Generated Video</h3>
                <video controls className="w-full rounded-lg border shadow-sm">
                  <source src={outputVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              </div>
            )}

            {/* Error Alert */}
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
