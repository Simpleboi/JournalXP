import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Welcome to JournalXP</Text>
        <Text style={styles.subtitle}>
          Your gamified mental health companion
        </Text>
      </View>

      <View style={styles.grid}>
        <Link href="/journal" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardTitle}>Journal</Text>
            <Text style={styles.cardDescription}>
              Write and reflect on your day
            </Text>
          </Pressable>
        </Link>

        <Pressable style={styles.card} disabled>
          <Text style={styles.cardIcon}>🎯</Text>
          <Text style={styles.cardTitle}>Tasks</Text>
          <Text style={styles.cardDescription}>
            Track your daily goals
            </Text>
        </Pressable>

        <Pressable style={styles.card} disabled>
          <Text style={styles.cardIcon}>💪</Text>
          <Text style={styles.cardTitle}>Habits</Text>
          <Text style={styles.cardDescription}>
            Build healthy routines
          </Text>
        </Pressable>

        <Pressable style={styles.card} disabled>
          <Text style={styles.cardIcon}>☀️</Text>
          <Text style={styles.cardTitle}>Sunday AI</Text>
          <Text style={styles.cardDescription}>
            Chat with your wellness companion
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          More features coming soon!
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
  header: {
    padding: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
