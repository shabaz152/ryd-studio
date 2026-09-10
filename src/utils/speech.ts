// Voice input helper using Web Speech API with simulated fallback

// Extend window interface for SpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition?: unknown;
  SpeechRecognition?: unknown;
}

export class SpeechRecognizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const win = typeof window !== 'undefined' ? (window as IWindow) : null;
    if (win) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (win.SpeechRecognition || win.webkitSpeechRecognition) as any;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd: () => void,
    onError: (err: string) => void
  ) {
    if (!this.recognition) {
      // Run simulated speech transcription if Web Speech is unavailable
      this.isListening = true;
      this.simulateSpeech(onResult, onEnd);
      return;
    }

    try {
      this.isListening = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        onResult(currentText, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: { error: string }) => {
        this.isListening = false;
        onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch {
      // If native recognition threw, fallback to simulation
      this.simulateSpeech(onResult, onEnd);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }
    this.isListening = false;
  }

  private simulateSpeech(
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd: () => void
  ) {
    const samples = [
      'Heavy traffic on expressway, ETA 8 minutes.',
      'Subway delay near Downtown station, arriving shortly.',
      'Wrapping up parent inquiry, heading to hall now.',
      'Quick transit transfer delay, will be there in 5 mins.',
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    const words = picked.split(' ');
    let current = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length && this.isListening) {
        current += (index > 0 ? ' ' : '') + words[index];
        onResult(current, index === words.length - 1);
        index++;
      } else {
        clearInterval(interval);
        this.isListening = false;
        onEnd();
      }
    }, 280);
  }
}

export const speechRecognizer = new SpeechRecognizer();
