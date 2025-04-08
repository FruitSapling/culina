// theme.ts
export const theme = {
    colors: {
      primary: "#00C47C",         // vibrant green (user bubbles)
      accent: "#FFD600",          // optional yellow accent
      background: "#FFFFFF",
      surface: "#F8F9FA",         // off-white for subtle surfaces
      text: "#202124",            // deep neutral
      muted: "#7A7A7A",
      border: "#E0E0E0",
      overlay: "rgba(0,0,0,0.5)", 
      shadow: "rgba(0,0,0,0.05)",  // subtle card/bubble shadows
      recipeLabelBg: "#333333",    // dark overlay for time badges
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    radius: {
      sm: 6,
      md: 12,
      full: 9999,
    },
    typography: {
      title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
      },
      body: {
        fontSize: 16,
        color: '#1A1A1A',
      },
      label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
      },
    },
    shadow: {
      light: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      },
      medium: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      },
    },
  };