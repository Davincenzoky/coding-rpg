import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getProfile } from '../services/leaderboardService';

const sessionGuestId = 'Guest_' + Math.random().toString(36).substr(2, 9);

export default function ChatWidget({ userEmail, isGuest, inlineTrigger = false, isMinimized: propIsMinimized, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(propIsMinimized !== undefined ? propIsMinimized : true);
  const [username, setUsername] = useState('Guest');
  const [chatError, setChatError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (propIsMinimized !== undefined) {
      setIsMinimized(propIsMinimized);
    }
  }, [propIsMinimized]);

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

    return () => { isMounted = false; };
  }, [userEmail, isGuest]);

  useEffect(() => {
    const messagesRef = collection(db, 'chat_messages');
    const q = query(messagesRef, limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChatError(null);
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().clientTimestamp || 0),
      }));
      newMessages.sort((a, b) => b.timestamp - a.timestamp);
      setMessages(newMessages);
    }, (error) => {
      console.error('Chat error:', error.code, error.message);
      const msg = error.message || '';
      if (msg.includes('index') && msg.includes('https://')) {
        const url = msg.match(/https:\/\/[^\s]+/)?.[0];
        setChatError(url ? `Need index: ${url}` : 'Database index required. Check console.');
      } else if (msg.includes('permission') || msg.includes('denied') || msg.includes('PERMISSION_DENIED') || error.code === 'permission-denied') {
        setChatError(
          '⚠️ Click to fix permissions: ' +
          'https://console.firebase.google.com/project/code-defense-a32fd/firestore/rules'
        );
      } else {
        setChatError('Chat unavailable (' + (error.code || 'unknown') + ')');
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (editingMessage) {
      try {
        const msgRef = doc(db, 'chat_messages', editingMessage.id);
        await updateDoc(msgRef, {
          text: inputText.trim(),
          edited: true,
          editedAt: serverTimestamp(),
        });
        setInputText('');
        setEditingMessage(null);
        setChatError(null);
      } catch (error) {
        console.error('Error updating message:', error);
        setChatError('Edit failed: ' + (error.message || error.code || 'unknown'));
      }
      return;
    }

    try {
      const msgData = {
        text: inputText.trim(),
        timestamp: serverTimestamp(),
        clientTimestamp: Date.now(),
        user: username,
        userId: currentUserId,
      };
      if (replyTo) {
        msgData.replyTo = { text: replyTo.text, user: replyTo.user, id: replyTo.id };
      }
      await addDoc(collection(db, 'chat_messages'), msgData);
      setInputText('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReply = useCallback((msg) => {
    setReplyTo({ id: msg.id, text: msg.text, user: msg.user });
    setEditingMessage(null);
    inputRef.current?.focus();
  }, []);

  const handleEdit = useCallback((msg) => {
    setEditingMessage(msg);
    setInputText(msg.text);
    setReplyTo(null);
    inputRef.current?.focus();
  }, []);

  const handleDelete = useCallback((msg) => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (!window.confirm('Delete this message?')) return;
    }
    const msgRef = doc(db, 'chat_messages', msg.id);
    deleteDoc(msgRef).then(() => {
      setChatError(null);
    }).catch(err => {
      console.error('Error deleting message:', err);
      setChatError('Delete failed: ' + (err.message || err.code || 'unknown'));
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingMessage(null);
    setInputText('');
  }, []);

  const cancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

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
        {item.replyTo && (
          <View style={styles.repliedTo}>
            <Text style={styles.repliedToUser}>{item.replyTo.user}</Text>
            <Text style={styles.repliedToText} numberOfLines={1}>{item.replyTo.text}</Text>
          </View>
        )}
        <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>{item.text}</Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, isCurrentUser ? styles.currentUserTime : styles.otherUserTime]}>
            {formatTime(item.timestamp)}{item.edited ? ' (edited)' : ''}
          </Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => handleReply(item)} style={styles.actionBtn}>
              <Text style={styles.actionText}>↩</Text>
            </TouchableOpacity>
            {isCurrentUser && (
              <>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                  <Text style={styles.actionTextDanger}>✕</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
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
        <TouchableOpacity onPress={() => { setIsMinimized(true); if (onClose) onClose(); }}>
          <Text style={styles.closeBtn}>−</Text>
        </TouchableOpacity>
      </View>

      {chatError ? (
        <TouchableOpacity style={styles.errorBanner} onPress={() => {
          const url = chatError.match(/https:\/\/[^\s]+/)?.[0];
          if (url) window.open(url, '_blank');
        }}>
          <Text style={styles.errorText}>{chatError}</Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        style={styles.chatList}
      />

      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarContent}>
            <Text style={styles.replyLabel}>Replying to <Text style={styles.replyUser}>{replyTo.user}</Text></Text>
            <Text style={styles.replyPreview} numberOfLines={1}>{replyTo.text}</Text>
          </View>
          <TouchableOpacity onPress={cancelReply} style={styles.replyCancel}>
            <Text style={styles.replyCancelText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {editingMessage && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarContent}>
            <Text style={styles.replyLabel}>Editing message</Text>
          </View>
          <TouchableOpacity onPress={cancelEdit} style={styles.replyCancel}>
            <Text style={styles.replyCancelText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={editingMessage ? 'Edit message...' : 'Type a message...'}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendBtnText}>{editingMessage ? 'Update' : 'Send'}</Text>
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
  errorBanner: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    padding: spacing.sm,
    marginHorizontal: spacing.sm,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
  },
  errorText: {
    color: colors.danger,
    fontSize: font.sizeXs,
    fontWeight: 'bold',
    textAlign: 'center',
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
  repliedTo: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingLeft: 6,
  },
  repliedToUser: {
    color: colors.primary,
    fontSize: font.sizeXs,
    fontWeight: 'bold',
  },
  repliedToText: {
    color: colors.textDim,
    fontSize: font.sizeXs,
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
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: font.sizeXs,
  },
  currentUserTime: {
    color: colors.textMuted,
    textAlign: 'right',
  },
  otherUserTime: {
    color: colors.textDim,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 2,
  },
  actionBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actionText: {
    color: colors.textDim,
    fontSize: 12,
  },
  actionTextDanger: {
    color: colors.danger,
    fontSize: 12,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  replyBarContent: {
    flex: 1,
  },
  replyLabel: {
    color: colors.textDim,
    fontSize: font.sizeXs,
  },
  replyUser: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  replyPreview: {
    color: colors.textMuted,
    fontSize: font.sizeXs,
  },
  replyCancel: {
    padding: 4,
    marginLeft: spacing.sm,
  },
  replyCancelText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: 'bold',
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
