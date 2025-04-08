// ChatScreen.styles.ts — refined for iOS-style chat visuals and Culina theme
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatList: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  bubble: {
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    maxWidth: '85%',
    marginBottom: theme.spacing.sm,
  },  
  userBubble: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    ...theme.shadow.light,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6E6E6', // subtle iOS-style outline
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android
  },

  senderLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.text,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderWidth: 3,
    borderRadius: theme.radius.md,
  },
  expandedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
  },
  modalContainer: {
    position: 'absolute',
    top: 32,
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  minimizeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalScrollView: {
    flex: 1,
    marginTop: 44,
    padding: theme.spacing.md,
  },
});

export const markdownStyles = {
  body: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  strong: {
    fontWeight: 'bold',
  },
};
