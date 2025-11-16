import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

// Placeholder for mood options
const MOODS = ['😊 Happy', '😌 Calm', '😔 Sad', '😰 Anxious', '😡 Angry', '🤔 Thoughtful'];

export default function JournalScreen() {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (text: string) => {
    setContent(text);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving!');
      return;
    }

    try {
      // TODO: Call API to save journal entry
      // const entry = await createJournalEntry({ content, mood: selectedMood });

      Alert.alert(
        'Success!',
        `Journal entry saved! You earned 30 XP 🎉\n\nWord count: ${wordCount}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save journal entry');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>How are you feeling?</Text>
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => (
            <Pressable
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && styles.moodButtonSelected,
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text
                style={[
                  styles.moodText,
                  selectedMood === mood && styles.moodTextSelected,
                ]}
              >
                {mood}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>What's on your mind?</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={10}
          placeholder="Start writing your thoughts..."
          value={content}
          onChangeText={handleContentChange}
          textAlignVertical="top"
        />
        <Text style={styles.wordCount}>{wordCount} words</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonSecondaryText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleSave}
        >
          <Text style={styles.buttonPrimaryText}>Save Entry (+30 XP)</Text>
        </Pressable>
      </View>

      <View style={styles.tip}>
        <Text style={styles.tipText}>
          💡 Tip: Regular journaling can improve mental clarity and emotional well-being
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  moodButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  moodText: {
    fontSize: 14,
    color: '#6b7280',
  },
  moodTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  wordCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#6366f1',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  tip: {
    margin: 16,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  tipText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});
