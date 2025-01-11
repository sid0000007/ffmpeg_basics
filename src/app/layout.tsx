import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Video Converter - Picture & Audio to Video",
    template: "%s | Video Converter",
  },
  description:
    "Free online tool to merge pictures and audio into video files. Easy-to-use converter for creating videos from images and sound.",
  keywords: [
    "video converter",
    "picture to video",
    "audio merger",
    "image to video",
    "video creation",
    "online video tool",
    "media converter",
    "ffmpeg",
    "video maker",
    "picture slideshow",
    "audio video merger",
  ],
  authors: [{ name: "ffmpegmp3" }],
  creator: "ffmpegmp3",
  metadataBase: new URL("https://ffmpegmp3.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ffmpegmp3.vercel.app",
    siteName: "Picture to Video Converter",
    title: "Picture to Video Converter - Create Videos from Images & Audio",
    description:
      "Transform your pictures and audio into professional videos with our free online converter. Simple, fast, and no registration required.",
    images: [
      {
        url: "https://drive.google.com/file/d/1Cm5faFCSqUhQTyGp_bo8XEwjzTW-ygu0/view?usp=sharing", // You should host the image on your domain instead of Google Drive
        width: 1200,
        height: 630,
        alt: "Picture to Video Converter Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Picture to Video Converter - Free Online Tool",
    description:
      "Create videos from your pictures and audio files. Easy-to-use online converter with instant results.",
    creator: "@ffmpegmp3", // Replace with your actual Twitter handle if you have one
    images: [
      "https://drive.google.com/file/d/1Cm5faFCSqUhQTyGp_bo8XEwjzTW-ygu0/view?usp=sharing",
    ], // Same image as OG
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    nocache: false,
    notranslate: false,
  },
  alternates: {
    canonical: "https://ffmpegmp3.vercel.app",
  },
  category: "technology",
  verification: {
    google: "Add-your-google-search-console-verification-code",
    yandex: "Add-your-yandex-verification-code-if-needed",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Video Converter",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
