# Simple Chat Bots

A modern mobile chat application powered by Groq API and Qwen language model, built with React Native and Expo.

## Features

- **Multiple Chat Modes**:
  - General Chat: Natural conversations on any topic
  - Web Search: AI-powered web search with comprehensive answers
  - Creative Writing: Assistance with stories, poems, and creative content
  - Code Assistant: Programming help and code generation

- **Modern UI**: Clean, intuitive interface with dark/light theme support
- **Secure Storage**: API keys stored securely using Expo SecureStore
- **Real-time Chat**: Smooth chat experience with typing indicators
- **Cross-platform**: Works on iOS, Android, and web

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Groq API key (get one free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd simple-chat-bots
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on your device**:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

### Configuration

1. Open the app and go to Settings
2. Enter your Groq API key (starts with `gsk_`)
3. Save the configuration
4. Start chatting!

## Project Structure

```
├── app/                    # App screens and navigation
│   ├── _layout.tsx        # Root layout with theme provider
│   ├── index.tsx          # Home screen with chat modes
│   ├── chat.tsx           # Chat interface
│   └── settings.tsx       # Settings and API key configuration
├── services/              # Core services
│   ├── groq.ts           # Groq API integration
│   ├── webSearch.ts      # Web search functionality
│   └── storage.ts        # Secure storage utilities
├── assets/               # App icons and images
└── package.json          # Dependencies and scripts
```

## API Integration

The app uses Groq's API with the Qwen 2.5 72B Instruct model for:
- Natural language conversations
- Code assistance and generation
- Creative writing help
- Web search result processing

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Native Paper**: Material Design components
- **Gifted Chat**: Chat UI components
- **Expo SecureStore**: Secure API key storage
- **TypeScript**: Type safety and better development experience

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
1. Check the GitHub Issues page
2. Create a new issue with detailed information
3. Include your device/platform information and error messages

## Acknowledgments

- [Groq](https://groq.com/) for lightning-fast AI inference
- [Qwen](https://qwenlm.github.io/) for the powerful language model
- [Expo](https://expo.dev/) for the excellent development platform
- [React Native Paper](https://reactnativepaper.com/) for beautiful UI components