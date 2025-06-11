import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Chip,
  useTheme,
  Text,
  Surface,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getApiKey, hasApiKey } from '../services/storage';

const { width } = Dimensions.get('window');

const chatModes = [
  {
    id: 'general',
    title: 'General Chat',
    description: 'Have a conversation about anything',
    icon: 'chat',
    color: '#6366f1',
  },
  {
    id: 'search',
    title: 'Web Search',
    description: 'Search the web and get AI-powered answers',
    icon: 'web',
    color: '#059669',
  },
  {
    id: 'creative',
    title: 'Creative Writing',
    description: 'Get help with creative writing and storytelling',
    icon: 'pencil',
    color: '#dc2626',
  },
  {
    id: 'code',
    title: 'Code Assistant',
    description: 'Programming help and code generation',
    icon: 'code-tags',
    color: '#7c3aed',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const hasKey = await hasApiKey();
    setApiKeyConfigured(hasKey);
  };

  const handleChatMode = (mode: string) => {
    if (!apiKeyConfigured) {
      Alert.alert(
        'API Key Required',
        'Please configure your Groq API key in settings first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => router.push('/settings') },
        ]
      );
      return;
    }

    router.push({
      pathname: '/chat',
      params: { mode }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 24,
      paddingTop: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 16,
    },
    statusChip: {
      alignSelf: 'flex-start',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    modeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    modeCard: {
      width: (width - 48) / 2,
      marginBottom: 16,
      elevation: 2,
    },
    modeCardContent: {
      padding: 16,
      alignItems: 'center',
      minHeight: 120,
    },
    modeIcon: {
      marginBottom: 8,
    },
    modeTitle: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 4,
    },
    modeDescription: {
      fontSize: 12,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
    },
    settingsButton: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => router.push('/settings')}
          style={styles.settingsButton}
        />
        <Text style={styles.title}>Simple Chat Bots</Text>
        <Text style={styles.subtitle}>
          AI-powered conversations with Groq & Qwen
        </Text>
        <Chip
          icon={apiKeyConfigured ? 'check-circle' : 'alert-circle'}
          style={styles.statusChip}
          textStyle={{
            color: apiKeyConfigured ? '#059669' : '#dc2626',
          }}
        >
          {apiKeyConfigured ? 'API Key Configured' : 'API Key Required'}
        </Chip>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.modeGrid}>
          {chatModes.map((mode) => (
            <Card
              key={mode.id}
              style={styles.modeCard}
              onPress={() => handleChatMode(mode.id)}
            >
              <Card.Content style={styles.modeCardContent}>
                <IconButton
                  icon={mode.icon}
                  size={32}
                  iconColor={mode.color}
                  style={styles.modeIcon}
                />
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeDescription}>
                  {mode.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}