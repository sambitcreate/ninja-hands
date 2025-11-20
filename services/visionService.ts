import { FilesetResolver, HandLandmark, HandLandmarker } from "@mediapipe/tasks-vision";

let handLandmarker: HandLandmarker | null = null;

export const initializeHandLandmarker = async (): Promise<void> => {
  if (handLandmarker) return;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
  } catch (error) {
    console.error("Error initializing hand landmarker:", error);
    throw error;
  }
};

export const detectHands = (video: HTMLVideoElement) => {
  if (!handLandmarker) return null;
  const startTimeMs = performance.now();
  const result = handLandmarker.detectForVideo(video, startTimeMs);
  return result;
};