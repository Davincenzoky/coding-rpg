import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getProfile } from '../services/leaderboardService';

const sessionGuestId = 'Guest_' + Math.random().toString(36).substr(2, 9);

export default function ChatWidget({ userEmail, isGuest, inlineTrigger = false }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [username, setUsername] = useState('Guest');
  const flatListRef = useRef(null);

  const currentUserId = userEmail || sessionGuestId;

  useEffect(() => {
    if (isGuest || !userEmail) {
      setUsername('Guest');
      return;
    }

    let isMounted = true;
    (async () => {
      const p = await getProfile(userEmail);
      if (isMounted) {
        if (p?.username) {
          setUsername(p.username);
        } else {
          setUsername(userEmail.split('@')[0]);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userEmail, isGuest]);

  useEffect(() => {
    const messagesRef = collection(db, 'chat_messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(),
      }));
      setMessages(newMessages.reverse());
    }, (error) => {
      console.error('Error fetching chat messages:', error);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      await addDoc(collection(db, 'chat_messages'), {
        text: inputText.trim(),
        timestamp: serverTimestamp(),
        user: username,
        userId: currentUserId,
      });
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === currentUserId;
    
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        {!isCurrentUser && <Text style={styles.messageUser}>{item.user}</Text>}
        <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>{item.text}</Text>
        <Text style={[styles.messageTime, isCurrentUser ? styles.currentUserTime : styles.otherUserTime]}>{formatTime(item.timestamp)}</Text>
      </View>
    );
  };

  if (isMinimized) {
    if (inlineTrigger) {
      return (
        <TouchableOpacity style={styles.inlineTriggerButton} onPress={() => setIsMinimized(false)}>
          <Text style={styles.inlineTriggerText}>💬 Chat ({messages.length})</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.minimizedContainer} onPress={() => setIsMinimized(false)}>
        <Text style={styles.minimizedText}>💬 {messages.length > 0 ? messages.length : 0} Messages</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🔊 Global Chat</Text>
        <TouchableOpacity onPress={() => setIsMinimized(true)}>
          <Text style={styles.closeBtn}>−</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        style={styles.chatList}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 320,
    height: 450,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 1000,
  },
  minimizedContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 8,
    zIndex: 1000,
  },
  minimizedText: {
    color: colors.text,
    fontSize: font.sizeSm,
    fontWeight: 'bold',
  },
  inlineTriggerButton: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  inlineTriggerText: {
    color: colors.text,
    fontSize: font.sizeXs,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgCard2,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  headerText: {
    color: colors.primary,
    fontSize: font.sizeMd,
    fontWeight: 'bold',
  },
  closeBtn: {
    color: colors.textDim,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 4,
  },
  chatList: {
    flex: 1,
    padding: spacing.sm,
  },
  messageContainer: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    maxWidth: '80%',
  },
  currentUserMessage: {
    backgroundColor: colors.primaryGlow,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: colors.bgCard2,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: font.sizeSm,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: colors.text,
  },
  messageUser: {
    color: colors.primary,
    fontSize: font.sizeXs,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: font.sizeXs,
    marginTop: 4,
  },
  currentUserTime: {
    color: colors.textMuted,
    textAlign: 'right',
  },
  otherUserTime: {
    color: colors.textDim,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgCard2,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    maxHeight: 100,
    textAlignVertical: 'top',
    color: colors.text,
    fontSize: font.sizeSm,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: font.sizeSm,
    fontWeight: 'bold',
  },
});