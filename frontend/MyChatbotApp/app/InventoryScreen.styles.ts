//InventoryScreen.styles.ts
import { StyleSheet } from "react-native";
import { theme } from "./theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.shadow.light,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    marginBottom: theme.spacing.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.overlay,
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.md,
  },
  categoryButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCategoryButton: {
    borderColor: theme.colors.primary,
    backgroundColor: "#E6F6F1",
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },
  
  
});

export default styles;
