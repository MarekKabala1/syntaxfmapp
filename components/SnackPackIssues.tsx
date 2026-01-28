import type { SnackPackIssue } from '@/types/snackpack';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  issues?: SnackPackIssue[];
  isLoading: boolean;
  error: Error | null;
  onIssuePress?: (issue: SnackPackIssue) => void;
};

export default function SnackPackIssues({ issues, isLoading, error, onIssuePress }: Props) {
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const formatIssueNumber = (issueNumber?: string): string | null => {
    if (!issueNumber) return null;
    const trimmed = issueNumber.trim();
    if (!trimmed) return null;
    return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  };

  const handlePress = (issue: SnackPackIssue) => {
    onIssuePress?.(issue);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color='#FABF47' />
        <Text style={styles.loadingText}>Loading Snack Pack issues...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={issues ?? []}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.loadingText}>No issues found</Text>
        </View>
      }
      renderItem={({ item }) => {
        const issueNumberLabel = formatIssueNumber(item.issueNumber);
        return (
          <Pressable style={styles.issue} onPress={() => handlePress(item)}>
            <View style={styles.metaRow}>
              {issueNumberLabel ? <Text style={styles.issueNumber}>{issueNumberLabel} ×</Text> : null}
              <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.openText}>Open issue</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
  },
  listContent: {
    width: '100%',
    paddingBottom: 8,
    gap: 12,
  },
  issue: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(241, 243, 244,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  issueNumber: {
    fontSize: 14,
    fontWeight: '400',
    color: '#F1F3F4',
  },
  date: {
    fontSize: 14,
    fontWeight: '400',
    color: '#F1F3F4',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 24,
  },
  openText: {
    color: '#FABF47',
    fontSize: 14,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontSize: 16,
  },
});
