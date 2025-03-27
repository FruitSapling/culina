import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#8BC34A",
  },
  chatList: { flex: 1 },
  chatContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  bubble: {
    marginBottom: 10,
    padding: 14,
    borderRadius: 20,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: { backgroundColor: "#8BC34A", alignSelf: "flex-end" },
  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  senderLabel: { fontWeight: "bold", marginBottom: 4, color: "#444" },
  typingContainer: { flexDirection: "row", alignItems: "center" },
  typingText: {
    fontSize: 16,
    color: "#8BC34A",
    marginLeft: 8,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    width:"100%",
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 16,
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#8BC34A",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: { borderWidth: 3, borderRadius: 12 },
  expandedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
    position: "absolute",
    top: 32,
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  minimizeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalScrollView: {
    flex: 1,
    marginTop: 44,
    padding: 16,
  },
});

// Export markdown-specific styles too:
export const markdownStyles = {
  body: {
    color: "#333",
    fontSize: 16,
    lineHeight: 22,
  },
  strong: {
    fontWeight: "bold",
  },
  // You can add additional markdown styling if needed.
};
