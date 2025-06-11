import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Switch,
  List,
  Divider,
  useTheme,
  Text,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getApiKey, setApiKey, clearApiKey, hasApiKey } from '../services/storage';
import * as Clipboard from 'expo-clipboard';

export default function SettingsScreen() {
  const theme = useTheme();
  const [apiKey, setApiKeyState] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedApiKey = await getApiKey();
      const hasKey = await hasApiKey();
      
      if (savedApiKey) {
        setApiKeyState(savedApiKey);
      }
      setApiKeyConfigured(hasKey);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    if (!apiKey.startsWith('gsk_')) {
      Alert.alert('Error', 'Groq API keys should start with "gsk_"');
      return;
    }

    setLoading(true);
    try {
      await setApiKey(apiKey.trim());
      setApiKeyConfigured(true);
      Alert.alert('Success', 'API key saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleClearApiKey = () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure you want to remove your API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearApiKey();
              setApiKeyState('');
              setApiKeyConfigured(false);
              Alert.alert('Success', 'API key cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear API key');
            }
          },
        },
      ]
    );
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent) {
        setApiKeyState(clipboardContent);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to paste from clipboard');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    card: {
      marginBottom: 16,
    },
    cardContent: {
      padding: 16,
    },
    input: {
      marginBottom: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    button: {
      flex: 1,
      marginHorizontal: 4,
    },
    statusChip: {
      alignSelf: 'flex-start',
      marginBottom: 16,
    },
    listItem: {
      paddingVertical: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title>Groq API Configuration</Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Enter your Groq API key to enable chat functionality. You can get a free API key from console.groq.com.
            </Paragraph>
            
            <Chip
              icon={apiKeyConfigured ? 'check-circle' : 'alert-circle'}
              style={styles.statusChip}
              textStyle={{
                color: apiKeyConfigured ? '#059669' : '#dc2626',
              }}
            >
              {apiKeyConfigured ? 'API Key Configured' : 'API Key Required'}
            </Chip>

            <TextInput
              label="Groq API Key"
              value={apiKey}
              onChangeText={setApiKeyState}
              secureTextEntry={!isApiKeyVisible}
              right={
                <TextInput.Icon
                  icon={isApiKeyVisible ? 'eye-off' : 'eye'}
                  onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}
                />
              }
              style={styles.input}
              placeholder="gsk_..."
            />

            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handlePasteFromClipboard}
                style={styles.button}
                icon="content-paste"
              >
                Paste
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveApiKey}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="content-save"
              >
                Save
              </Button>
            </View>

            {apiKeyConfigured && (
              <Button
                mode="outlined"
                onPress={handleClearApiKey}
                buttonColor={theme.colors.errorContainer}
                textColor={theme.colors.error}
                icon="delete"
              >
                Clear API Key
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title>About Simple Chat Bots</Title>
            <Paragraph>
              Simple Chat Bots is powered by Groq's lightning-fast inference and the Qwen language model. 
              It offers multiple chat modes including general conversation, web search, creative writing, and code assistance.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title>Features</Title>
            <List.Item
              title="General Chat"
              description="Have natural conversations on any topic"
              left={props => <List.Icon {...props} icon="chat" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Web Search"
              description="Search the web and get AI-powered answers"
              left={props => <List.Icon {...props} icon="web" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Creative Writing"
              description="Get help with stories, poems, and creative content"
              left={props => <List.Icon {...props} icon="pencil" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Code Assistant"
              description="Programming help and code generation"
              left={props => <List.Icon {...props} icon="code-tags" />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}