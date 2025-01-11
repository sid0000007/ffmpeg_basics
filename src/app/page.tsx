"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Music } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Media Converter</h1>
          <p className="text-xl text-muted-foreground">
            Choose a conversion service to get started
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/redirects/videoTOaudio")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Video className="h-8 w-8 mr-2" />
                Image to Video
              </CardTitle>
              <CardDescription className="text-center">
                Create videos from images with custom audio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/redirects/audioTOvideo")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Music className="h-8 w-8 mr-2" />
                Video to Audio
              </CardTitle>
              <CardDescription className="text-center">
                Extract audio from your videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
