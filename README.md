<div align="center">
<img width="1200" height="475" alt="Ninja Hands Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ninja Hands

A webcam-based fruit slicing game powered by MediaPipe hand tracking and Gemini AI for witty post-game analysis.

## 🎮 Game Overview

Ninja Hands is an interactive browser game that transforms your hand gestures into virtual ninja weapons. Using your webcam, the game tracks your hand movements in real-time, allowing you to slice fruits that appear on screen with swift hand motions. After each gaming session, Gemini AI provides entertaining commentary and analysis of your performance.

## ✨ Features

- **Real-time Hand Tracking**: Utilizes MediaPipe's advanced computer vision to detect and track hand movements
- **Gesture-based Gameplay**: Slice fruits by moving your hands through the air - no controllers needed
- **AI-powered Commentary**: Gemini AI analyzes your gameplay and provides witty, personalized feedback
- **Responsive Design**: Works on various screen sizes and devices
- **Smooth Animations**: Fluid fruit physics and slicing effects
- **Score Tracking**: Keep track of your high scores and improve your ninja skills

## 🛠️ Technology Stack

- **Frontend**: React with TypeScript
- **Hand Tracking**: MediaPipe Tasks Vision
- **AI Analysis**: Google Gemini API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- A webcam for hand tracking
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sambitcreate/nina-hands.git
   cd nina-hands
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Allow Camera Access**: When prompted, grant permission for the game to access your webcam
2. **Position Your Hands**: Make sure your hands are visible to the camera
3. **Start Slicing**: Move your hands through the fruits as they appear on screen
4. **Score Points**: Each successful slice earns you points
5. **Get AI Feedback**: After the game, enjoy Gemini's analysis of your ninja skills

## 📁 Project Structure

```
ninja-hands/
├── components/
│   └── GameCanvas.tsx      # Main game component with canvas rendering
├── services/
│   ├── geminiService.ts    # Gemini AI integration for game analysis
│   └── visionService.ts    # MediaPipe hand tracking implementation
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
├── index.html              # HTML template
├── index.tsx               # Application entry point
├── metadata.json           # App metadata
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # This file
```

## 🔧 Configuration

### Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env.local` file as `GEMINI_API_KEY`

### Hand Tracking Settings

The hand tracking sensitivity and detection parameters can be adjusted in `services/visionService.ts`:

```typescript
// Example configuration
const handTrackerOptions = {
  baseOptions: {
    modelAssetPath: '/path/to/model.task',
    delegate: 'GPU'
  },
  runningMode: 'VIDEO',
  numHands: 2 // Track up to 2 hands
};
```

## 🎮 Game Controls

- **Hand Movement**: Move your hands to control the slicing motion
- **Start/Stop**: Use the on-screen buttons to control game state
- **Camera Toggle**: Enable/disable camera tracking
- **Reset Game**: Start a new game session

## 🤖 AI Integration

The game uses Google's Gemini AI to provide:

- Performance analysis based on your slicing accuracy
- Witty commentary about your ninja skills
- Personalized tips for improvement
- Entertaining game summaries

## 🐛 Troubleshooting

### Common Issues

1. **Camera Not Working**
   - Ensure you've granted camera permissions
   - Check if other applications are using the camera
   - Try refreshing the page

2. **Hand Tracking Not Responsive**
   - Ensure good lighting conditions
   - Make sure your hands are clearly visible to the camera
   - Check that your browser supports WebRTC

3. **AI Analysis Not Working**
   - Verify your Gemini API key is correctly set
   - Check your internet connection
   - Ensure the API key has sufficient quota

### Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari (may have limited camera support)
- Edge

## 🤝 Contributing

We welcome contributions to Ninja Hands! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add comments for complex logic
- Ensure your changes don't break existing functionality
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for the amazing hand tracking technology
- [Google Gemini](https://ai.google.dev/) for the AI analysis capabilities
- [React](https://reactjs.org/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/sambitcreate/nina-hands/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Become a fruit-slicing ninja with just your hands! 🥷🍉**
