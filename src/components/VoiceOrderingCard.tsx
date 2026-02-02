"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mic, MicOff, Sparkles } from "lucide-react";

type RecognitionType = (typeof window)["SpeechRecognition"] | (typeof window)["webkitSpeechRecognition"];

const VoiceOrderingCard: React.FC = () => {
  const recognitionRef = useRef<SpeechRecognition>();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("Hungry for truffle mushroom pizza with extra cheese.");

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition: SpeechRecognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        toast.success("Voice order captured!");
        setIsListening(false);
      };
      recognition.onerror = () => {
        toast.error("Unable to capture audio input.");
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggle = () => {
    if (!recognitionRef.current) {
      toast.info("Voice ordering will use your typed instructions for now.");
      setIsListening(!isListening);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Voice Ordering
          </CardTitle>
          <CardDescription>Hands-free ordering powered by our assistant.</CardDescription>
        </div>
        <Badge variant={isListening ? "default" : "secondary"} className="rounded-full px-3 py-1">
          {isListening ? "Listening..." : "Tap to speak"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground min-h-[88px]">
          {transcript}
        </div>
        <Button size="lg" className="w-full rounded-full" onClick={handleToggle}>
          {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          {isListening ? "Stop Listening" : "Start Voice Order"}
        </Button>
        <p className="text-xs text-muted-foreground">
          We’ll convert your voice command into a smart cart suggestion. Real ordering integrations coming soon.
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceOrderingCard;

