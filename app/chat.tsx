import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage, Send, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { useTheme, IconButton, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import uuid from 'react-native-uuid';
import { GroqService } from '../services/groq';
import { WebSearchService } from '../services/webSearch';

export default function ChatScreen() {
  const theme = useTheme();
  const { mode = 'general' } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  const groqService = new GroqService();
  const webSearchService = new WebSearchService();

  useEffect(() => {
    // Set initial welcome message based on mode
    const welcomeMessage = getWelcomeMessage(mode as string);
    setMessages([
      {
        _id: uuid.v4() as string,
        text: welcomeMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Simple Chat Bot',
          avatar: '🤖',
        },
      },
    ]);

    // Enable search mode for search chat type
    if (mode === 'search') {
      setSearchMode(true);
    }
  }, [mode]);

  const getWelcomeMessage = (chatMode: string): string => {
    switch (chatMode) {
      case 'search':
        return "Hi! I'm your AI search assistant. I can search the web and provide you with comprehensive answers. What would you like to know?";
      case 'creative':
        return "Hello! I'm here to help with your creative writing. Whether it's stories, poems, or brainstorming ideas, let's create something amazing together!";
      case 'code':
        return "Hey there! I'm your coding assistant. I can help with programming questions, code reviews, debugging, and more. What are you working on?";
      default:
        return "Hello! I'm Simple Chat Bot powered by Groq and Qwen. How can I help you today?";
    }
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const userMessage = newMessages[0];
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    setIsTyping(true);

    try {
      let response: string;

      if (searchMode && mode === 'search') {
        // Use web search for search mode
        response = await webSearchService.searchAndAnswer(userMessage.text);
      } else {
        // Use regular chat for other modes
        const systemPrompt = getSystemPrompt(mode as string);
        response = await groqService.chat(userMessage.text, systemPrompt);
      }

      const botMessage: IMessage = {
        _id: uuid.v4() as string,
        text: response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Simple Chat Bot',
          avatar: '🤖',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to get response. Please check your API key and try again.');
    } finally {
      setIsTyping(false);
    }
  }, [mode, searchMode]);

  const getSystemPrompt = (chatMode: string): string => {
    switch (chatMode) {
      case 'creative':
        return "You are a creative writing assistant. Help users with storytelling, character development, plot ideas, and creative writing techniques. Be imaginative and inspiring.";
      case 'code':
        return "You are a programming assistant. Help users with coding questions, provide code examples, explain programming concepts, and assist with debugging. Be precise and helpful.";
      default:
        return "You are a helpful AI assistant. Provide accurate, helpful, and friendly responses to user questions.";
    }
  };

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: theme.colors.primary,
        },
        left: {
          backgroundColor: theme.colors.surface,
        },
      }}
      textStyle={{
        right: {
          color: theme.colors.onPrimary,
        },
        left: {
          color: theme.colors.onSurface,
        },
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <IconButton
          icon="send"
          size={24}
          iconColor={theme.colors.primary}
        />
      </View>
    </Send>
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.outline,
        paddingHorizontal: 8,
      }}
      primaryStyle={{
        alignItems: 'center',
      }}
    />
  );

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      marginBottom: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {mode === 'search' && (
          <View style={styles.header}>
            <Chip
              icon={searchMode ? 'web' : 'chat'}
              onPress={toggleSearchMode}
              selected={searchMode}
            >
              {searchMode ? 'Web Search Mode' : 'Chat Mode'}
            </Chip>
          </View>
        )}
        
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          isTyping={isTyping}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          placeholder="Type a message..."
          alwaysShowSend
          scrollToBottom
          keyboardShouldPersistTaps="never"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}