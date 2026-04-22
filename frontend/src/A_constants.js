export const roomTypes = [
  "LAB",
  "CLASSROOM",
  "AUDITORIUM",
  "MEETING_ROOM",
  "OFFICE",
  "OTHER",
];

export const roomStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

export const dashboardActions = [
  {
    id: "manage-buildings",
    title: "Buildings & Floors",
    subtitle: "Create buildings and add floors",
    accent: "terracotta",
    icon: "🏛️",
  },
  {
    id: "book-room",
    title: "Create Room",
    subtitle: "Add a new room to a floor",
    accent: "teal",
    icon: "🚪",
  },
  {
    id: "building-map",
    title: "Building Map",
    subtitle: "Browse campus floor layout",
    accent: "sky",
    icon: "🗺️",
  },
  {
    id: "rooms-status",
    title: "Rooms Status",
    subtitle: "View all room availability",
    accent: "leaf",
    icon: "📋",
  },
];

export const portalActions = [
  {
    id: "book",
    title: "Book a Room",
    subtitle: "Find and reserve available rooms",
    accent: "teal",
    icon: "🏢",
  },
  {
    id: "ticket",
    title: "Support Ticket",
    subtitle: "Report issues and track requests",
    accent: "sky",
    icon: "🎫",
  },
  {
    id: "admin",
    title: "Admin Panel",
    subtitle: "Manage buildings, floors & rooms",
    accent: "terracotta",
    icon: "⚙️",
  },
  {
    id: "login",
    title: "Staff Login",
    subtitle: "Sign in to your staff account",
    accent: "leaf",
    icon: "🔐",
  },
];
